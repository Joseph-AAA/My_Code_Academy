
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

// Read the expiration time (exp) from the JWT payload.
// The backend remains responsible for verifying the JWT signature.
function getTokenExpiry(token) {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) return null;

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) =>
      char.charCodeAt(0)
    );

    const payload = JSON.parse(
      new TextDecoder().decode(bytes)
    );

    return typeof payload.exp === "number"
      ? payload.exp * 1000
      : null;
  } catch {
    return null;
  }
}

function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

function ProtectedRoute({ children, allowedRoles }) {
  const navigate = useNavigate();

  // Read the token and user from the same storage location.
  const storage = localStorage.getItem("token")
    ? localStorage
    : sessionStorage.getItem("token")
      ? sessionStorage
      : null;

  const token = storage?.getItem("token") || null;
  const storedUser = storage?.getItem("user") || null;

  const expiresAt = token ? getTokenExpiry(token) : null;

  const tokenExpired = Boolean(
    token && (!expiresAt || expiresAt <= Date.now())
  );

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!token) {
      // Remove any leftover user data when no token exists.
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return;
    }

    let loggedOut = false;

    const logout = () => {
      if (loggedOut) return;

      loggedOut = true;
      clearAuthData();
      navigate("/signin", { replace: true });
    };

    // Handle an already-expired token or one without a valid exp claim.
    if (!expiresAt || expiresAt <= Date.now()) {
      logout();
      return;
    }

    // Automatically log out when the token expires.
    const timeoutId = window.setTimeout(
      logout,
      expiresAt - Date.now()
    );

    // Also check expiry when the user returns to the browser tab.
    const checkExpiry = () => {
      if (Date.now() >= expiresAt) {
        logout();
      }
    };

    window.addEventListener("focus", checkExpiry);
    document.addEventListener("visibilitychange", checkExpiry);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("focus", checkExpiry);
      document.removeEventListener(
        "visibilitychange",
        checkExpiry
      );
    };
  }, [token, expiresAt, navigate]);

  // Redirect when unauthenticated or the JWT has expired.
  if (!token || tokenExpired || !user?.role) {
    return <Navigate to="/signin" replace />;
  }

  // Keep the existing role-based access control.
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
