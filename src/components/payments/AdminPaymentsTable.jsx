
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ReceiptText,
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
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="space-y-4 border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review student payments and transaction statuses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search student, email, course or reference..."
              aria-label="Search payments"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            aria-label="Filter payments by status"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            value={dateRange}
            onChange={(event) =>
              onDateRangeChange(event.target.value)
            }
            aria-label="Filter payments by date"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="month">This month</option>
          </select>
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
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
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

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <ReceiptText
                        size={32}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 font-medium text-gray-700">
                        No payments found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
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
                        className="transition hover:bg-gray-50"
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
                              <p className="font-medium text-gray-800">
                                {name}
                              </p>

                              <p className="mt-1 max-w-48 truncate text-xs text-gray-500">
                                {user?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-52 truncate text-sm font-medium text-gray-800">
                            {course?.title || "Unknown course"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {course?.category || "—"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            payment.paidAt || payment.createdAt
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800">
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
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
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

          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
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
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="whitespace-nowrap text-sm text-gray-600">
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
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
