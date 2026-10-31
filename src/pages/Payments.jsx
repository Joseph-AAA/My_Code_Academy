
import { useEffect, useState } from "react";

import AdminPaymentStatsCards from "../components/payments/AdminPaymentStatsCards";
import AdminPaymentsTable from "../components/payments/AdminPaymentsTable";
import AdminPaymentDetailsModal from "../components/payments/AdminPaymentDetailsModal";

const API_URL = import.meta.env.VITE_API_URL;

const initialPagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "The request could not be completed."
    );
  }

  return data;
}

export default function Payments() {
  const [payments, setPayments] = useState([]);

  const [stats, setStats] = useState({
    successfulRevenue: 0,
    currency: "MYR",
    successfulPayments: 0,
    pendingPayments: 0,
    failedOrCancelledPayments: 0,
    refundedPayments: 0,
  });

  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Fetch paginated payment history and summary cards.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const params = new URLSearchParams({
          page: String(pagination.currentPage),
          limit: String(pagination.limit),
          search: search.trim(),
          status,
          dateRange,
        });

        const response = await fetch(
          `${API_URL}/api/payments/admin?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await readResponse(response);

        setPayments(data.payments || []);
        setStats(data.stats || {});
        setPagination(data.pagination || initialPagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load payments.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    search,
    status,
    dateRange,
    pagination.currentPage,
    pagination.limit,
    retryCount,
  ]);

  // Fetch full details for the selected transaction.
  useEffect(() => {
    if (!selectedPaymentId) return;

    const controller = new AbortController();

    async function loadPaymentDetails() {
      setDetailLoading(true);
      setDetailError("");
      setSelectedPayment(null);

      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(
          `${API_URL}/api/payments/admin/${encodeURIComponent(selectedPaymentId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await readResponse(response);

        setSelectedPayment(data.payment);
      } catch (err) {
        if (err.name !== "AbortError") {
          setDetailError(
            err.message || "Failed to load payment details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailLoading(false);
        }
      }
    }

    loadPaymentDetails();

    return () => controller.abort();
  }, [selectedPaymentId]);

  function handleSearchChange(value) {
    setSearch(value);
    setPagination((current) => ({
      ...current,
      currentPage: 1,
    }));
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPagination((current) => ({
      ...current,
      currentPage: 1,
    }));
  }

  function handleDateRangeChange(value) {
    setDateRange(value);
    setPagination((current) => ({
      ...current,
      currentPage: 1,
    }));
  }

  function handlePageChange(nextPage) {
    setPagination((current) => ({
      ...current,
      currentPage: nextPage,
    }));
  }

  function handleCloseDetails() {
    setSelectedPaymentId(null);
    setSelectedPayment(null);
    setDetailError("");
  }

  return (
    <div className="mx-auto w-full max-w-8xl space-y-7 p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold text-(--text-primary) sm:text-3xl">
          Payments
        </h1>

        <p className="mt-2 text-sm text-(--text-secondary) sm:text-base">
          Monitor transactions, track revenue, and review course payments.
        </p>
      </header>

      <AdminPaymentStatsCards stats={stats} loading={loading} />

      <AdminPaymentsTable
        payments={payments}
        loading={loading}
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        pagination={pagination}
        onPageChange={handlePageChange}
        onViewDetails={(paymentId) => {
          setDetailError("");
          setSelectedPaymentId(paymentId);
        }}
        error={error}
        onRetry={() => setRetryCount((count) => count + 1)}
      />

      <AdminPaymentDetailsModal
        isOpen={Boolean(selectedPaymentId)}
        payment={selectedPayment}
        loading={detailLoading}
        error={detailError}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
