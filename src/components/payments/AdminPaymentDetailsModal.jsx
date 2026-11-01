
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
    return "bg-green-500/10 text-green-600";
  }

  if (status === "PENDING") {
    return "bg-amber-500/10 text-amber-600";
  }

  if (status === "REFUNDED") {
    return "bg-purple-500/10 text-purple-600";
  }

  if (status === "FAILED" || status === "CANCELLED") {
    return "bg-red-500/10 text-red-600";
  }

  return "bg-(--surface-secondary) text-(--text-secondary)";
}

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-(--text-secondary)">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-(--text-primary)">
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
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-details-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--surface) text-(--text-primary) shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-(--border) px-5 py-4 sm:px-6">
          <div>
            <h2
              id="payment-details-title"
              className="text-lg font-bold text-(--text-primary)"
            >
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Transaction and enrollment information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition hover:bg-(--surface-secondary) hover:text-(--text-primary)"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-(--text-secondary)">
              Loading payment details...
            </p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">
              {error}
            </p>
          ) : payment ? (
            <div className="space-y-7">
              <section className="rounded-xl border border-(--border) bg-(--surface-secondary) p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-(--text-secondary)">
                      Payment Amount
                    </p>

                    <p className="mt-1 text-3xl font-bold text-(--text-primary)">
                      {formatMoney(payment.amount, payment.currency)}
                    </p>

                    <p className="mt-2 break-all text-xs text-(--text-secondary)">
                      Transaction ID: {payment.id}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <StatusBadge status={payment.status} />

                    <span className="text-xs text-(--text-secondary)">
                      Provider: {payment.provider || "—"}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-(--text-primary)">
                    Student
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-(--border) bg-(--surface) p-4 sm:grid-cols-2">
                  <DetailItem label="Name" value={student?.name} />
                  <DetailItem label="Email" value={student?.email} />
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-(--text-primary)">
                    Course & Enrollment
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-(--border) bg-(--surface) p-4 sm:grid-cols-2">
                  <DetailItem label="Course" value={course?.title} />
                  <DetailItem label="Category" value={course?.category} />

                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-(--text-secondary)">
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
                  <h3 className="font-semibold text-(--text-primary)">
                    Payment Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-xl border border-(--border) bg-(--surface) p-4 sm:grid-cols-2">
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

              <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-(--primary-soft) p-3 text-sm text-(--text-primary)">
                <CalendarDays size={18} className="mt-0.5 shrink-0" />
                <p>
                  These are the records currently stored in your
                  application database. Stripe Dashboard remains the
                  place to investigate provider-side payment events.
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-(--border) bg-(--surface-secondary) p-3 text-xs text-(--text-secondary)">
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

        <footer className="flex justify-end border-t border-(--border) px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--text-primary) transition hover:bg-(--surface-secondary)"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
