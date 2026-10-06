import CodeBackground from "../../components/Background/CodeBackground";
import "./SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-page">

      {/* Background */}
      <CodeBackground />

      {/* Form */}
      <div className="signup-wrapper">
        <div className="neon-card">

          <div className="signup-card">

            <div className="signup-header">
              <span className="signup-badge">
                MYCODE ACADEMY
              </span>

              <h1>Create Account</h1>

              <p>Start your journey as a developer</p>
            </div>

            <form className="signup-form">

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>

              <button type="submit" className="signup-button">
                Create Account
              </button>

            </form>

            <p className="signin-text">
              Already have an account?{" "}
              <a href="/signin">Sign In</a>
            </p>

          </div>

        </div>
      </div>

    </div>
  );
};

export default SignUp;