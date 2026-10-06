
import CodeBackground from "../../components/Background/CodeBackground";
import "./SignIn.css";

const SignIn = () => {
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
            <form className="signin-form">

              {/* Email */}
              <div className="signin-input-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="signin-input-group">
                <label>Password</label>

                <input
                  type="password"
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