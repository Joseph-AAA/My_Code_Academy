
import { useEffect, useState,  useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, LoaderCircle } from "lucide-react";
import "./VerifyEmail.css";
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
    const hasVerified = useRef(false);
 useEffect(() => {
  if (hasVerified.current) return;

  hasVerified.current = true;

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Verification failed.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      localStorage.setItem("signupEmailVerified", "true");
    } catch (error) {
      console.error("Email verification error:", error);
      setStatus("error");
      setMessage("Unable to connect to the server. Please try again.");
    }
  };

  verifyEmail();
}, [token]);
  return (
    <div className="verify-email-page">
      <div className="verify-email-card">
        {status === "loading" && <LoaderCircle className="animate-spin" size={42} />}
        {status === "success" && <CheckCircle size={42} color="#22c55e" />}
        {status === "error" && <XCircle size={42} color="#ef4444" />}

        <h1>
          {status === "loading"
            ? "Verifying Email"
            : status === "success"
            ? "Email Verified!"
            : "Verification Failed"}
        </h1>

        <p>{message}</p>

        {status === "success" && (
            <button onClick={() => window.close()}>
                Return to Sign In
            </button>
            )}

        {status === "error" && (
          <button onClick={() => navigate("/signin", { replace: true })}>
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
