
import prisma from "../lib/prisma.js";

const MONTHS_TO_SHOW = 6;

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthLabel(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
  });
}

function getLastSixMonths() {
  const now = new Date();

  return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (MONTHS_TO_SHOW - 1 - index),
      1
    );

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthLabel: getMonthLabel(date),
    };
  });
}

export const getDashboardData = async (req, res) => {
  try {
    const now = new Date();

    const currentMonthStart = getMonthStart(now);

    const sixMonthsStart = new Date(
      now.getFullYear(),
      now.getMonth() - (MONTHS_TO_SHOW - 1),
      1
    );

    // =========================================
    // 1. Dashboard Statistics
    // =========================================

    const [
      totalStudents,
      totalCourses,
      publishedCourses,
      newEnrollments,
      totalActiveEnrollments,
      successfulRevenue,
      refundedRevenue,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: "STUDENT" },
      }),

      prisma.course.count(),

      prisma.course.count({
        where: { status: "Published" },
      }),

      prisma.enrollment.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),

      prisma.enrollment.count({
        where: { status: "ACTIVE" },
      }),

      prisma.payment.aggregate({
        where: {
          status: "SUCCEEDED",
          currency: "MYR",
        },
        _sum: { amount: true },
      }),

      prisma.payment.aggregate({
        where: {
          status: "REFUNDED",
          currency: "MYR",
        },
        _sum: { amount: true },
      }),
    ]);

    const grossRevenue = Number(
      successfulRevenue._sum.amount ?? 0
    );

    const refundedAmount = Number(
      refundedRevenue._sum.amount ?? 0
    );

    const totalRevenue = grossRevenue - refundedAmount;

    // =========================================
    // 2. Payment Status
    // =========================================

    const [
      paidPayments,
      pendingPayments,
      failedPayments,
    ] = await Promise.all([
      prisma.payment.count({
        where: { status: "SUCCEEDED" },
      }),

      prisma.payment.count({
        where: { status: "PENDING" },
      }),

      prisma.payment.count({
        where: { status: "FAILED" },
      }),
    ]);

    // =========================================
    // 3. Enrollment Overview
    // Last 6 months
    // =========================================

    const enrollments = await prisma.enrollment.findMany({
      where: {
        createdAt: { gte: sixMonthsStart },
      },
      select: {
        createdAt: true,
      },
    });

    const months = getLastSixMonths();

    const enrollmentOverview = months.map((month) => {
      const count = enrollments.filter((enrollment) => {
        const date = new Date(enrollment.createdAt);

        return (
          date.getFullYear() === month.year &&
          date.getMonth() === month.month
        );
      }).length;

      return {
        month: month.monthLabel,
        students: count,
      };
    });

    // =========================================
    // 4. Revenue Overview
    // Last 6 months
    // =========================================

    const [monthlyPayments, monthlyRefunds] = await Promise.all([
      prisma.payment.findMany({
        where: {
          status: "SUCCEEDED",
          currency: "MYR",
          paidAt: { gte: sixMonthsStart },
        },
        select: {
          amount: true,
          paidAt: true,
        },
      }),

      prisma.payment.findMany({
        where: {
          status: "REFUNDED",
          currency: "MYR",
          updatedAt: { gte: sixMonthsStart },
        },
        select: {
          amount: true,
          updatedAt: true,
        },
      }),
    ]);

    const revenueOverview = months.map((month) => {
      const gross = monthlyPayments
        .filter((payment) => {
          if (!payment.paidAt) return false;

          const date = new Date(payment.paidAt);

          return (
            date.getFullYear() === month.year &&
            date.getMonth() === month.month
          );
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      const refunds = monthlyRefunds
        .filter((payment) => {
          const date = new Date(payment.updatedAt);

          return (
            date.getFullYear() === month.year &&
            date.getMonth() === month.month
          );
        })
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      return {
        month: month.monthLabel,
        revenue: Math.max(0, gross - refunds),
      };
    });

    // =========================================
    // 5. Top Courses
    // Based on ACTIVE enrollments
    // =========================================

    const topCourseGroups = await prisma.enrollment.groupBy({
      by: ["courseId"],
      where: {
        status: "ACTIVE",
      },
      _count: {
        courseId: true,
      },
      orderBy: {
        _count: {
          courseId: "desc",
        },
      },
    
    });

    const topCourseIds = topCourseGroups.map(
      (item) => item.courseId
    );

    const topCourseRecords = await prisma.course.findMany({
      where: {
        id: { in: topCourseIds },
      },
      select: {
        id: true,
        title: true,
        level: true,
        icon: true,
        color: true,
         imageUrl: true, // addded
      },
    });

    const courseMap = new Map(
      topCourseRecords.map((course) => [course.id, course])
    );

    const topCourses = topCourseGroups
      .map((item) => {
        const course = courseMap.get(item.courseId);

        if (!course) return null;

        return {
          ...course,
          students: item._count.courseId,
        };
      })
      .filter(Boolean);

    // =========================================
    // 6. Recent Activities
    // =========================================

    const [recentStudents, recentEnrollments, recentPayments] =
      await Promise.all([
        prisma.user.findMany({
          where: { role: "STUDENT" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),

        prisma.enrollment.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            createdAt: true,
            user: {
              select: { name: true },
            },
            course: {
              select: { title: true },
            },
          },
        }),

        prisma.payment.findMany({
          where: {
            status: "SUCCEEDED",
          },
          orderBy: { paidAt: "desc" },
          take: 5,
          select: {
            id: true,
            amount: true,
            currency: true,
            paidAt: true,
            enrollment: {
              select: {
                user: {
                  select: { name: true },
                },
                course: {
                  select: { title: true },
                },
              },
            },
          },
        }),
      ]);

    const recentActivities = [
      ...recentStudents.map((student) => ({
        id: student.id,
        type: "student",
        message: `${student.name} registered as a new student`,
        createdAt: student.createdAt,
      })),

      ...recentEnrollments.map((enrollment) => ({
        id: enrollment.id,
        type: "enrollment",
        message: `${enrollment.user.name} enrolled in ${enrollment.course.title}`,
        status: enrollment.status,
        createdAt: enrollment.createdAt,
      })),

      ...recentPayments
        .filter((payment) => payment.paidAt)
        .map((payment) => ({
          id: payment.id,
          type: "payment",
          message: `${payment.enrollment.user.name} paid RM ${Number(
            payment.amount
          ).toFixed(2)} for ${payment.enrollment.course.title}`,
          createdAt: payment.paidAt,
        })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 10);

    // =========================================
    // 7. Send Dashboard Response
    // =========================================

    return res.status(200).json({
      statistics: {
        totalStudents,
        totalCourses,
        publishedCourses,
        newEnrollments,
        totalActiveEnrollments,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        currency: "MYR",
      },

      paymentStatus: {
        paid: paidPayments,
        pending: pendingPayments,
        failed: failedPayments,
      },

      enrollmentOverview,

      revenueOverview,

      topCourses,

      recentActivities,
    });
  } catch (error) {
    console.error("Fetch dashboard data error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard data.",
    });
  }
};
