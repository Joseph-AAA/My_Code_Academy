
import {
  X,
  CreditCard,
  UserRound,
  BookOpen,
  CalendarDays,
  Hash,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(date));
}

function formatMoney(amount, currency = "MYR") {
  try {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency,
    }).format(Number(amount) || 0);
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}

function getStatusStyle(status) {
  if (status === "SUCCEEDED" || status === "ACTIVE") {
    return "bg-green-50 text-green-700";
  }

  if (status === "PENDING") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "REFUNDED") {
    return "bg-purple-50 text-purple-700";
  }

  if (
    status === "FAILED" ||
    status === "CANCELLED"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-gray-100 text-gray-600";
}

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(status)}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

export default function AdminPaymentDetailsModal({
  isOpen,
  payment,
  loading,
  error,
  onClose,
}) {
  if (!isOpen) return null;

  const student = payment?.enrollment?.user;
  const course = payment?.enrollment?.course;
  const enrollment = payment?.enrollment;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-details-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="payment-details-title"
              className="text-lg font-bold text-gray-800"
            >
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Transaction and enrollment information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Loading payment details...
            </p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">
              {error}
            </p>
          ) : payment ? (
            <div className="space-y-7">
              <section className="rounded-xl bg-gray-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Amount
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {formatMoney(payment.amount, payment.currency)}
                    </p>

                    <p className="mt-2 break-all text-xs text-gray-500">
                      Transaction ID: {payment.id}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <StatusBadge status={payment.status} />

                    <span className="text-xs text-gray-500">
                      Provider: {payment.provider || "—"}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-800">
                    Student
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
                  <DetailItem label="Name" value={student?.name} />
                  <DetailItem label="Email" value={student?.email} />
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-800">
                    Course & Enrollment
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
                  <DetailItem label="Course" value={course?.title} />
                  <DetailItem label="Category" value={course?.category} />

                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Enrollment Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={enrollment?.status} />
                      </div>
                    </div>
                  </div>

                  <DetailItem
                    label="Activated At"
                    value={
                      enrollment?.activatedAt
                        ? formatDate(enrollment.activatedAt)
                        : "Not activated"
                    }
                  />
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-800">
                    Payment Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
                  <DetailItem
                    label="Payment Method"
                    value={payment.paymentMethod}
                  />

                  <DetailItem
                    label="Created At"
                    value={formatDate(payment.createdAt)}
                  />

                  <DetailItem
                    label="Paid At"
                    value={formatDate(payment.paidAt)}
                  />

                  <DetailItem
                    label="Payment Intent ID"
                    value={payment.providerPaymentIntentId}
                  />

                  <DetailItem
                    label="Checkout Session ID"
                    value={payment.providerCheckoutSessionId}
                  />

                  <DetailItem
                    label="Failure Reason"
                    value={payment.failureReason}
                  />

                  <DetailItem
                    label="Enrollment Record ID"
                    value={enrollment?.id}
                  />
                </div>
              </section>

              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <CalendarDays size={18} className="mt-0.5 shrink-0" />
                <p>
                  These are the records currently stored in your
                  application database. Stripe Dashboard remains the
                  place to investigate provider-side payment events.
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                <Hash size={16} className="mt-0.5 shrink-0" />
                <p>
                  Payment references are shown for identification.
                  They are not secret keys and should not be used as
                  authentication credentials.
                </p>
              </div>
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
