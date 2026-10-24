
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  let user;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  if (!user?.role) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/dashboard" : "/courses"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
