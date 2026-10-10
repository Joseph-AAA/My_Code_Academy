
import CodeBackground from "../../components/Background/CodeBackground";
import "./SignIn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SignIn = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
      });
    const navigate = useNavigate();

      const [message, setMessage] = useState({
        text: "",
        type: "",
      });

      const handleChange = (e) => {
        const { name, value } = e.target;

        setInput((prev) => ({
          ...prev,
          [name]: value,
        }));
      };


      const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear the previous message
  setMessage({ text: "", type: "" });

  // Validate required fields
  if (!input.email.trim() || !input.password) {
    setMessage({
      text: "Please enter your email and password.",
      type: "error",
    });
    return;
  }

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
        }),
      }
    );

    const data = await response.json();

    // Handle login errors
    if (!response.ok) {
      setMessage({
        text: data.message || "Login failed.",
        type: "error",
      });
      return;
    }

    // Login successful
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    navigate("/");


  } catch (error) {
    console.error("Login error:", error);

    setMessage({
      text: "Unable to connect to the server. Please try again.",
      type: "error",
    });
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
            <form className="signin-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="signin-input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="signin-input-group">
                <label>Password</label>

                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
              </div>

              {/* Forgot password */}
              <div className="signin-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>


              {message.text && (
                <p
                  className={`signup-message ${message.type}`}
                  role="alert"
                >
                  {message.text}
                </p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="signin-button"
              >
                Sign In
              </button>

            </form>

            {/* Sign Up */}
            <p className="signup-text">
              Don't have an account?{" "}
              <a href="/signup">
                Create Account
              </a>
            </p>

          </div>

        </div>
      </div>

    </div>
  );
};

export default SignIn;