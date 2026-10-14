
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import "./ResetPassword.css";
import { Link, useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =useState(false);
  const [message, setMessage] = useState("");

  const isStrongPassword = (password) =>
        password.length >= 6 && /[A-Z]/.test(password) &&
                                /[a-z]/.test(password) &&
                                /[0-9]/.test(password) &&
                                /[^A-Za-z0-9]/.test(password);


const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!isStrongPassword(password)) {
            setMessage(
            "Password must contain at least 6 characters, including uppercase, lowercase, a number, and a special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

  try {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            password,
            confirmPassword,
            }),
        }
        );

    const data = await response.json();

   if (!response.ok) {
        setMessage(data.message || "Unable to reset password.");
        return;
        }

    navigate("/signin", {
      replace: true,
      state: { message: data.message },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    setMessage("Unable to connect to the server. Please try again.");
  }
};

  return (
    <div className="reset-page">
      <div className="reset-card">
        <span className="reset-badge">
          MYCODE ACADEMY
        </span>

        <div className="reset-icon">
          <LockKeyhole size={34} />
        </div>

        <h1>Reset Password</h1>
        <span className="password-hint">
         (e.g. Code@123)
        </span>

        <p className="reset-description">
          Create a new password for your account.
          Make sure it is secure and easy for you to remember.
        </p>

        <form
          className="reset-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="new-password">
            New Password
          </label>

          <div className="reset-input-wrapper">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              required
              minLength={6}
            />

            <button
              type="button"
              className="reset-eye-button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          <label htmlFor="confirm-password">
            Confirm New Password
          </label>

          <div className="reset-input-wrapper">
            <input
              id="confirm-password"
              type={
                showConfirmPassword ? "text" : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
              minLength={8}
            />

            <button
              type="button"
              className="reset-eye-button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {message && (
            <p className="reset-message" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="reset-submit-button"
          >
            Reset Password
          </button>
        </form>

        <Link to="/signin" className="reset-back-link">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
