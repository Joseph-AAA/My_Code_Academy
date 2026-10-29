
import {
  X,
  Mail,
  CalendarDays,
  BookOpen,
  CreditCard,
  UserRound,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(date));
}

function formatMoney(amount, currency = "MYR") {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);
}

function statusStyle(status) {
  switch (status) {
    case "ACTIVE":
    case "SUCCEEDED":
      return "bg-green-50 text-green-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "FAILED":
    case "CANCELLED":
      return "bg-red-50 text-red-700";

    case "REFUNDED":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function StudentDetailsModal({
  isOpen,
  student,
  loading,
  error,
  onClose,
}) {
  if (!isOpen) return null;

  const enrollments = student?.enrollments || [];

  const payments = enrollments
    .flatMap((enrollment) =>
      (enrollment.payments || []).map((payment) => ({
        ...payment,
        courseTitle: enrollment.course?.title || "Unknown course",
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  const initials = (student?.name || "Student")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeCount = enrollments.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-details-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="student-details-title"
              className="text-lg font-bold text-gray-800"
            >
              Student Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Account, enrollments and payment history
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close student details"
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Loading student details...
            </p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">
              {error}
            </p>
          ) : student ? (
            <div className="space-y-7">
                <section className="flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                    {student.profileImageUrl ? (
                        <img
                        src={student.profileImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                    </div>

                    <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-gray-800">
                        {student.name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-gray-500">
                        {student.email}
                    </p>
                    </div>
                </section>

                <section>
                    <h3 className="mb-4 font-semibold text-gray-800">
                    Account Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <Mail size={18} className="mt-0.5 text-gray-400" />
                        <div className="min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="mt-1 break-all text-sm text-gray-700">
                            {student.email}
                        </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarDays
                        size={18}
                        className="mt-0.5 text-gray-400"
                        />
                        <div>
                        <p className="text-xs text-gray-500">
                            Registered
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                            {formatDate(student.createdAt)}
                        </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <UserRound
                        size={18}
                        className="mt-0.5 text-gray-400"
                        />
                        <div>
                        <p className="text-xs text-gray-500">
                            Enrollments
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                            {enrollments.length} total · {activeCount} active
                        </p>
                        </div>
                    </div>
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex items-center gap-2">
                    <BookOpen size={19} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                        Enrollments
                    </h3>
                    </div>

                    {enrollments.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        This student has no enrollments yet.
                    </p>
                    ) : (
                    <div className="space-y-3">
                        {enrollments.map((enrollment) => (
                        <div
                            key={enrollment.id}
                            className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                            {enrollment.course?.imageUrl ? (
                                <img
                                src={enrollment.course.imageUrl}
                                alt=""
                                className="size-12 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <BookOpen size={21} />
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="font-medium text-gray-800">
                                {enrollment.course?.title || "Unknown course"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                {enrollment.course?.category || "Course"} ·{" "}
                                {formatDate(
                                    enrollment.activatedAt ||
                                    enrollment.createdAt
                                )}
                                </p>
                            </div>
                            </div>

                            <span
                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(enrollment.status)}`}
                            >
                            {enrollment.status}
                            </span>
                        </div>
                        ))}
                    </div>
                    )}
                </section>

                <section>
                    <div className="mb-4 flex items-center gap-2">
                    <CreditCard size={19} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                        Payment History
                    </h3>
                    </div>

                    {payments.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        No payment records found.
                    </p>
                    ) : (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                            <p className="font-medium text-gray-800">
                                {payment.courseTitle}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {formatDate(
                                payment.paidAt || payment.createdAt
                                )}
                            </p>

                            <p className="mt-1 break-all text-xs text-gray-400">
                                Reference:{" "}
                                {payment.providerPaymentIntentId ||
                                payment.id}
                            </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                            <span className="font-semibold text-gray-800">
                                {formatMoney(
                                payment.amount,
                                payment.currency
                                )}
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(payment.status)}`}
                            >
                                {payment.status}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </section>
            </div>
          ) : null}
        </div>

            <footer className="flex justify-end border-t border-gray-200 px-5 py-4 sm:px-6">
            <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Close
            </button>
            </footer>
      </section>
    </div>
  );
}
