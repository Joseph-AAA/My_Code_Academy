
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
        const ForgotPassword = () => {
        const [email, setEmail] = useState("");
        const [message, setMessage] = useState("");
        const [loading, setLoading] = useState(false);
        const [isLinkSent, setIsLinkSent] = useState(false);
  
    const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage("");
            setLoading(true);

        try {
            const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
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
              throw new Error(data.message || "Something went wrong");
              
            }

            setIsLinkSent(true);
            setMessage(data.message);
        } catch (error) {
            console.error("Forgot password error:", error);
            setMessage("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
        };


 
return (
  <div className="forgot-page">
    <div className="forgot-card">
      <span className="forgot-badge">MYCODE ACADEMY</span>

      <div className="forgot-icon">🔐</div>

      <h1>Forgot Password?</h1>

      <p className="forgot-description">
        No worries! Enter your email address and
        we'll help you reset your password.
      </p>

      <form onSubmit={handleSubmit} className="forgot-form">
        <label htmlFor="forgot-email">Email Address</label>

        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsLinkSent(false);
          }}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />

        {message && (
          <p className="forgot-message" role="status">
            {message}
          </p>
        )}

        <button type="submit" disabled={loading}>
            {loading ? "Sending..." : isLinkSent ? "Resend Link" : "Reset Password"}
        </button>
      </form>

      <Link to="/signin" className="back-signin">
        ← Back to Sign In
      </Link>
    </div>
  </div>
);

};

export default ForgotPassword;
