import { useEffect, useState } from "react";
import StudentStatsCard from "../components/students/StudentStatsCard";
import StudentsTable from "../components/students/StudentsTable";
import StudentDetailsModal from "../components/students/StudentDetailsModal";


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

export default function Students() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeLearners: 0,
    newThisMonth: 0,
  });

  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Fetch student list and summary statistics.
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
        });

        const response = await fetch(
          `${API_URL}/api/students?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await readResponse(response);

        setStudents(data.students || []);
        setStats(
          data.stats || {
            totalStudents: 0,
            activeLearners: 0,
            newThisMonth: 0,
          }
        );
        setPagination(data.pagination || initialPagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load students.");
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
  }, [search, pagination.currentPage, pagination.limit, retryCount]);

  // Fetch the full details when the admin opens a student.
  useEffect(() => {
    if (!selectedStudentId) return;

    const controller = new AbortController();

    async function loadStudentDetails() {
      setDetailLoading(true);
      setDetailError("");
      setSelectedStudent(null);

      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(
          `${API_URL}/api/students/${encodeURIComponent(selectedStudentId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await readResponse(response);
        setSelectedStudent(data.student);
      } catch (err) {
        if (err.name !== "AbortError") {
          setDetailError(
            err.message || "Failed to load student details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailLoading(false);
        }
      }
    }

    loadStudentDetails();

    return () => controller.abort();
  }, [selectedStudentId]);

  function handleSearchChange(value) {
    setSearch(value);

    // Reset to the first page for a new search.
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
    setSelectedStudentId(null);
    setSelectedStudent(null);
    setDetailError("");
  }

  return (
    <div className="mx-auto w-full max-w-8xl space-y-7 p-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-bold text-(--text-primary) sm:text-3xl">
            Students
          </h1>

          <p className="mt-2 text-sm text-(--text-secondary) sm:text-base">
            Manage student accounts and review their learning activity.
          </p>
        </header>

        <StudentStatsCard stats={stats} loading={loading} />

        <StudentsTable
          students={students}
          loading={loading}
          search={search}
          onSearchChange={handleSearchChange}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={(studentId) => {
            setDetailError("");
            setSelectedStudentId(studentId);
          }}
          error={error}
          onRetry={() => setRetryCount((count) => count + 1)}
        />

        <StudentDetailsModal
          isOpen={Boolean(selectedStudentId)}
          student={selectedStudent}
          loading={detailLoading}
          error={detailError}
          onClose={handleCloseDetails}
        />
    </div>
  );
}
