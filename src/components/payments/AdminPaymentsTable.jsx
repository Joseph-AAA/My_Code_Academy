
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ReceiptText,ChevronDown,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  switch (status) {
    case "SUCCEEDED":
      return "bg-green-500/10 text-green-600 dark:text-green-400";

    case "PENDING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "FAILED":
    case "CANCELLED":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    case "REFUNDED":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

    default:
      return "bg-(--surface-secondary) text-(--text-secondary)";
  }
}

export default function AdminPaymentsTable({
  payments,
  loading,
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  pagination,
  onPageChange,
  onViewDetails,
  error,
  onRetry,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--surface) text-(--text-primary) shadow-sm">
      <div className="space-y-4 border-b border-(--border) p-5">
        <div>
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Review student payments and transaction statuses.
          </p>
        </div>

       <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
  {/* Search */}
  <div className="relative">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
    />

    <input
      type="search"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search student, email, course or reference..."
      aria-label="Search payments"
      className="w-full rounded-lg border border-(--border) bg-(--surface) py-2.5 pl-10 pr-4 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    />
  </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            aria-label="Filter payments by status"
            className="w-full appearance-none rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 pr-10 text-sm text-(--text-primary) outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All statuses</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
        </div>

       {/* Date Range Filter */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value)}
            aria-label="Filter payments by date"
            className="w-full appearance-none rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 pr-10 text-sm text-(--text-primary) outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="month">This month</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
        </div>
      </div>
      </div>

      {error ? (
        <div className="p-10 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-(--surface-secondary)">
                <tr className="text-xs uppercase tracking-wide text-(--text-secondary)">
                  <th className="px-5 py-4 font-medium">Student</th>
                  <th className="px-5 py-4 font-medium">Course</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-(--border)">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-(--text-secondary)"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <ReceiptText
                        size={32}
                        className="mx-auto text-(--text-muted)"
                      />

                      <p className="mt-3 font-medium text-(--text-primary)">
                        No payments found
                      </p>

                      <p className="mt-1 text-sm text-(--text-secondary)">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const user = payment.enrollment?.user;
                    const course = payment.enrollment?.course;
                    const name = user?.name || "Unknown student";

                    const initials = name
                      .trim()
                      .split(/\s+/)
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-(--surface-secondary)"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {user?.profileImageUrl ? (
                                <img
                                  src={user.profileImageUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                initials
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-(--text-primary)">
                                {name}
                              </p>

                              <p className="mt-1 max-w-48 truncate text-xs text-(--text-secondary)">
                                {user?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-52 truncate text-sm font-medium text-(--text-primary)">
                            {course?.title || "Unknown course"}
                          </p>

                          <p className="mt-1 text-xs text-(--text-secondary)">
                            {course?.category || "—"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-(--text-secondary)">
                          {formatDate(
                            payment.paidAt || payment.createdAt
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-(--text-primary)">
                          {formatMoney(
                            payment.amount,
                            payment.currency
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(payment.status)}`}
                          >
                            {payment.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => onViewDetails(payment.id)}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--primary) transition hover:border-blue-300 hover:bg-(--primary-soft)"
                          >
                            <Eye size={16} />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-(--border) px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-(--text-secondary)">
              {loading
                ? "Loading records..."
                : `${pagination.totalRecords} transaction(s) found · ${pagination.limit} per page`}
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                disabled={
                  loading || pagination.currentPage <= 1
                }
                onClick={() =>
                  onPageChange(pagination.currentPage - 1)
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-primary) transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="whitespace-nowrap text-sm text-(--text-secondary)">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  pagination.currentPage >= pagination.totalPages
                }
                onClick={() =>
                  onPageChange(pagination.currentPage + 1)
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-primary) transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
