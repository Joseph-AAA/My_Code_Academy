import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourseCard from "../components/courses/CourseCard";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyEnrollments() {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detect whether Stripe redirected the student back after checkout.
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const sessionId = searchParams.get("session_id");

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  
  // PURPOSE: After Stripe redirects the student back,
// check whether the webhook has activated the enrollment.
  useEffect(() => {
    // Only poll after a successful checkout redirect.
    if (!checkoutSuccess || !sessionId) return;

    let cancelled = false;

    // Support both Remember me and regular login sessions.
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setCheckoutMessage("Please sign in to check your enrollment.");
      return;
    }

    const pollCheckoutStatus = async () => {
      // Tell the student why the course may not appear immediately.
      setCheckoutMessage(
        "Payment successful! We're activating your enrollment..."
      );

      // Stop polling after 90 seconds.
      const deadline = Date.now() + 90_000;

      while (!cancelled && Date.now() < deadline) {
        // Ask the backend for the payment and enrollment statuses.
        const response = await fetch(
          `${API_URL}/api/payments/checkout-status?session_id=${encodeURIComponent(sessionId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statusData = await response.json();

        if (!response.ok) {
          throw new Error(
            statusData.message || "Unable to check payment status."
          );
        }

        // Only refresh the course list when both statuses are correct.
        if (
          statusData.paymentStatus === "SUCCEEDED" &&
          statusData.enrollmentStatus === "ACTIVE"
        ) {
          const enrollmentsResponse = await fetch(
            `${API_URL}/api/enrollments/my`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const enrollmentsData = await enrollmentsResponse.json();

          if (!enrollmentsResponse.ok) {
            throw new Error(
              enrollmentsData.message || "Unable to refresh enrollments."
            );
          }

          if (!cancelled) {
            // Replace the course list with the latest active enrollments.
            setEnrollments(enrollmentsData.enrollments || []);

            setCheckoutMessage(
              "Your payment is confirmed! Your course is ready."
            );
          }

          return;
        }

        // Wait three seconds before checking again.
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (!cancelled) {
        setCheckoutMessage(
          "Enrollment activation is taking longer than expected. Please try again shortly."
        );
      }
    };

    pollCheckoutStatus().catch((err) => {
      if (!cancelled) {
        setCheckoutMessage(
          err.message || "Unable to verify your enrollment."
        );
      }
    });

    // Prevent state updates if the page is unmounted.
    return () => {
      cancelled = true;
    };
  }, [checkoutSuccess, sessionId]);



  useEffect(() => {
    let cancelled = false;

    const fetchEnrollments = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        setError("Please sign in to view your enrolled courses.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/enrollments/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load enrolled courses."
          );
        }

        if (!cancelled) {
          setEnrollments(data.enrollments || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEnrollments();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading your enrolled courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Enrollments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and continue learning from your enrolled courses.
        </p>
      </div>
      
      {/* PURPOSE: Show the student the current checkout or activation status. */}
      {checkoutMessage && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
        >
          {checkoutMessage}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            No enrolled courses yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your purchased courses will appear here once your
            enrollment is activated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;

            if (!course) {
              return null;
            }

            const courseCardData = {
              ...course,
              category: course.category || "Course",
              title: course.title || "Untitled course",
              level: course.level || "All levels",
              duration: course.duration || "Self-paced",
              students: course.students ?? 0,
            };

            return (
              <div key={enrollment.id} className="relative">
                <span className="absolute right-3 top-3 z-20 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Enrolled
                </span>

                <CourseCard
                  coursesData={courseCardData}
                  isAdmin={false}
                  actionLabel="View Course"
                  onAction={(selectedCourse) => {
                    navigate(
                      `/my-enrollments/${selectedCourse.id}`
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyEnrollments;
