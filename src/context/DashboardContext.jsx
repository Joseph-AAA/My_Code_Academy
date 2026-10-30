
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const DashboardContext = createContext(null);

function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Support both localStorage and sessionStorage.
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        clearAuthData();
        navigate("/signin", { replace: true });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Handle expired or invalid JWT.
      if (response.status === 401) {
        clearAuthData();
        setDashboardData(null);
        navigate("/signin", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch dashboard data."
        );
      }

      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        error,
        refreshDashboard: fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
}
