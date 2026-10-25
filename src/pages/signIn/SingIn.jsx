
import CodeBackground from "../../components/Background/CodeBackground";
import "./SignIn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
      const navigate = useNavigate();
      const [rememberMe, setRememberMe] = useState(false);
      const [loading, setLoading] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

      const [input, setInput] = useState({
        email: "",
        password: "",
      });

      const [touched, setTouched] = useState({});
      const [errors, setErrors] = useState({});
      const [authError, setAuthError] = useState("");

  // Handle input changes
      const handleChange = (e) => {
        const { name, value } = e.target;

        setInput((prev) => ({
          ...prev,
          [name]: value,
        }));

        // Clear the previous login error when the user edits a field
        setAuthError("");

        // Revalidate a field if the user has already touched it
        if (touched[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: value.trim() ? "" : "This field is required",
          }));
        }
      };

  // Validate a field when the user leaves it
      const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
          ...prev,
          [name]: true,
        }));

        setErrors((prev) => ({
          ...prev,
          [name]: value.trim() ? "" : "This field is required",
        }));
      };

  // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const nextErrors = {
          email: input.email.trim()
            ? ""
            : "This field is required",
          password: input.password.trim()
            ? ""
            : "This field is required",
        };

    // Show validation messages for both fields
        setTouched({
          email: true,
          password: true,
        });

        setErrors(nextErrors);
        setAuthError("");

    // Do not call the backend if a required field is empty
    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setLoading(true);

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: input.email.trim(),
                password: input.password,
                rememberMe,
              }),
            }
          );
      const data = await response.json();

      // Handle incorrect credentials or other login errors
      if (!response.ok) {
        setAuthError("Invalid email or password");
        return;
      }

      // Login successful
     if (rememberMe) {
  // Remove old credentials from the other storage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Remove old persistent credentials
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.user.role === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else if (data.user.role === "STUDENT") {
        navigate("/courses", { replace: true });
      } else {
        setAuthError("Your account role is not recognized.");
      }

     
    } catch (error) {
      console.error("Login error:", error);

      setAuthError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* Animated programming background */}
      <CodeBackground />

      {/* Sign In Card */}
      <div className="signin-wrapper">
        <div className="signin-neon-card">
          <div className="signin-card">
            {/* Header */}
            <div className="signin-header">
              <span className="signin-badge">
                MYCODE ACADEMY
              </span>

              <h1>Welcome Back</h1>

              <p>
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Form */}
            <form
              className="signin-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Email */}
              <div className="signin-input-group">
                <div className="signin-label-row">
                  <label htmlFor="signin-email">
                    Email
                  </label>

                  {touched.email && errors.email && (
                    <span className="signin-field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <input
                  id="signin-email"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>

              {/* Password */}
              <div className="signin-input-group">
                <div className="signin-label-row">
                  <label htmlFor="signin-password">
                    Password
                  </label>

                  {(touched.password && errors.password) ||
                  authError ? (
                    <span
                      className="signin-field-error"
                      role="alert"
                    >
                      {errors.password || authError}
                    </span>
                  ) : null}
                </div>

                <div className="password-input-wrapper">
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(
                      errors.password || authError
                    )}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="signin-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="signup-text">
              Don't have an account?{" "}
              <a href="/signup">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
