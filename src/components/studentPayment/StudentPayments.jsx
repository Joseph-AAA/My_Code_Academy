
import { useEffect, useState } from "react";
import {
  Wallet,
  CircleCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const PAYMENTS_PER_PAGE = 10;

const formatCurrency = (amount, currency = "MYR") =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "medium",
    timeStyle: "short",
  });

const statusStyles = {
  SUCCEEDED: "bg-green-500/10 text-green-600 dark:text-green-400",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  FAILED: "bg-red-500/10 text-red-600 dark:text-red-400",
  CANCELLED: "bg-gray-500/10 text-(--text-secondary)",
  REFUNDED: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    successfulPayments: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalPayments: 0,
    limit: PAYMENTS_PER_PAGE,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPayments = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        setError("Please sign in to view your payments.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAYMENTS_PER_PAGE),
        });

        const response = await fetch(
          `${API_URL}/api/payments/my?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load payment history."
          );
        }

        if (!cancelled) {
          setPayments(data.payments || []);
          setSummary(
            data.summary || {
              totalSpent: 0,
              successfulPayments: 0,
            }
          );
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load payment history."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const pageNumbers = [...Array(pagination.totalPages).keys()]
    .map((number) => number + 1);

  const firstRecord =
    pagination.totalPayments === 0
      ? 0
      : (currentPage - 1) * pagination.limit + 1;

  const lastRecord = Math.min(
    currentPage * pagination.limit,
    pagination.totalPayments
  );

  return (
    <div className="w-full min-w-0 p-6">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-primary)">
          My Payments
        </h1>

        <p className="mt-2 text-sm text-(--text-secondary)">
          Review your course purchases and payment history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-(--primary-soft)">
              <Wallet className="text-(--primary)" size={23} />
            </div>

            <p className="text-sm font-medium text-(--text-secondary)">
              Total Spent
            </p>
          </div>

          <p className="text-2xl font-bold text-(--text-primary)">
            {formatCurrency(summary.totalSpent)}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            Successful payments only
          </p>
        </div>

        <div className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10">
              <CircleCheck className="text-green-600 dark:text-green-400" size={23} />
            </div>

            <p className="text-sm font-medium text-(--text-secondary)">
              Successful Payments
            </p>
          </div>

          <p className="text-2xl font-bold text-(--text-primary)">
            {summary.successfulPayments}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            Completed transactions
          </p>
        </div>
      </div>

      {/* Payment history heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-(--text-primary)">
          Payment History
        </h2>

        <p className="mt-1 text-sm text-(--text-secondary)">
          Your transactions, newest first.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center text-(--text-secondary)">
          Loading payment history...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border border-(--border) bg-(--surface) p-10 text-center">
          <ReceiptText
            className="mx-auto mb-3 text-(--text-muted)"
            size={38}
          />

          <h3 className="font-semibold text-(--text-primary)">
            No payments yet
          </h3>

          <p className="mt-2 text-sm text-(--text-secondary)">
            Your course purchases will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Transaction cards */}
          <div className="space-y-4">
            {payments.map((payment) => {
              const course = payment.course;
              const status = payment.status || "PENDING";

              return (
                <article
                  key={payment.id}
                  className="rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm transition hover:border-(--primary) hover:shadow-md sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Course logo */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-(--surface-secondary)">
                      {course?.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={`${course.title || "Course"} logo`}
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <BookOpen
                          size={28}
                          className="text-(--primary)"
                        />
                      )}
                    </div>

                    {/* Course and transaction information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-(--text-primary)">
                        {course?.title || "Course unavailable"}
                      </h3>

                      <p className="mt-1 text-sm text-(--text-secondary)">
                        {course?.category || "Course purchase"}
                      </p>

                      <p className="mt-3 text-sm text-(--text-secondary)">
                        {payment.paidAt
                          ? "Paid on"
                          : "Created on"}:{" "}
                        {formatDate(
                          payment.paidAt || payment.createdAt
                        )}
                      </p>

                      <p className="mt-1 break-all text-xs text-(--text-muted)">
                        Payment reference:{" "}
                        {payment.providerPaymentIntentId ||
                          payment.id}
                      </p>
                    </div>

                    {/* Amount and status */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="text-base font-bold text-(--text-primary) sm:text-lg">
                        {formatCurrency(
                          payment.amount,
                          payment.currency
                        )}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[status] ||
                          "bg-(--surface-secondary) text-(--text-secondary)"
                        }`}
                      >
                        {status.charAt(0) +
                          status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <p className="mb-4 text-center text-sm text-(--text-secondary)">
                Showing {firstRecord}–{lastRecord} of{" "}
                {pagination.totalPayments} payments
              </p>

              <nav
                aria-label="Payment pagination"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  disabled={currentPage === 1 || loading}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-(--border) px-3 py-2 text-sm text-(--text-secondary) transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${
                      currentPage === page
                        ? "border-(--primary) bg-(--primary) text-white"
                        : "border-(--border) text-(--text-secondary) hover:bg-(--surface-secondary)"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  disabled={
                    currentPage === pagination.totalPages ||
                    loading
                  }
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-(--border) px-3 py-2 text-sm text-(--text-secondary) transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          )}

          {pagination.totalPayments > 0 &&
            pagination.totalPages <= 1 && (
              <p className="mt-5 text-center text-sm text-(--text-secondary)">
                Showing {firstRecord}–{lastRecord} of{" "}
                {pagination.totalPayments} payments
              </p>
            )}
        </>
      )}
    </div>
  );
}

export default StudentPayments;
