
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  const [email, setEmail] = useState(
    () => localStorage.getItem("pendingVerificationEmail") || ""
  );

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const hasVerified = useRef(false);

  // Verify email
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

        localStorage.setItem(
          "signupEmailVerified",
          Date.now().toString()
        );

      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  // Resend verification email
  const resendVerification = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setResendMessage("Please enter your email address.");
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResendMessage(
          data.message || "Unable to resend verification email."
        );
        return;
      }

      localStorage.setItem(
        "pendingVerificationEmail",
        email.trim().toLowerCase()
      );

      setResendMessage(data.message);

    } catch (error) {
      console.error("Resend verification error:", error);
      setResendMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">

        {status === "loading" && (
          <LoaderCircle className="animate-spin" size={42} />
        )}

        {status === "success" && (
          <CheckCircle size={42} color="#22c55e" />
        )}

        {status === "error" && (
          <XCircle size={42} color="#ef4444" />
        )}

        <h1>
          {status === "loading"
            ? "Verifying Email"
            : status === "success"
            ? "Email Verified!"
            : "Verification Failed"}
        </h1>

        <p>{message}</p>

        {status === "success" && (
          <button
            onClick={() =>
              navigate("/signin", { replace: true })
            }
          >
            Return to Sign In
          </button>
        )}

        {status === "error" && (
          <>
            <form onSubmit={resendVerification}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={resendLoading}
              >
                {resendLoading
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>
            </form>

            {resendMessage && (
              <p>{resendMessage}</p>
            )}

         
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
