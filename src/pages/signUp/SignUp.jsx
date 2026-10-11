import CodeBackground from "../../components/Background/CodeBackground";
import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";




const SignUp = () => {

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
      
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // ********************************************setup useState for input***********************

      const [input, setInput] = useState({
          name : "",
          email : "",
          password : "",
          confirmPassword : ""
      });



    

// ********************************************Password Validation*********************************

      const isStrongPassword = (password) =>
          password.length >= 6 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[^A-Za-z0-9]/.test(password);

        const validateField = (name, value, values = input) => {
          switch (name) {
            case "name":
              return value.trim() ? "" : "This field is required";

            case "email":
              if (!value.trim()) return "This field is required";

              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                return "Email is not valid";
              }

              return "";

            case "password":
              if (!value) return "This field is required";

              return isStrongPassword(value) ? "" : "Password is weak";

            case "confirmPassword":
              if (!value) return "This field is required";

              return value === values.password
                ? ""
                : "Passwords do not match";

            default:
              return "";
          }
        };  

// ********************************************To receive input values***********************

      const handleChange = (e) => {
          const { name, value } = e.target;

          const updatedInput = {
            ...input,
            [name]: value,
          };

          setInput(updatedInput);
          setFormError("");

          // Revalidate the field after it has been touched
          if (touched[name]) {
            setErrors((prev) => ({
              ...prev,
              [name]: validateField(name, value, updatedInput),
            }));
          }

          // If the password changes, recheck Confirm Password too
          if (name === "password" && touched.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: validateField(
                "confirmPassword",
                updatedInput.confirmPassword,
                updatedInput
              ),
            }));
          }
        };

        const handleBlur = (e) => {
          const { name, value } = e.target;

          setTouched((prev) => ({
            ...prev,
            [name]: true,
          }));

          setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
          }));
        };


// ***************************************Checking Form Validation***********************      const handleSubmit = (e) => {
          const handleSubmit = async (e) => {
                e.preventDefault();

                const fieldNames = [
                  "name",
                  "email",
                  "password",
                  "confirmPassword",
                ];

                // Show errors for every field when submitting
                setTouched({
                  name: true,
                  email: true,
                  password: true,
                  confirmPassword: true,
                });

                const nextErrors = {};

                fieldNames.forEach((name) => {
                  nextErrors[name] = validateField(name, input[name]);
                });

                setErrors(nextErrors);

                // Stop if any field is invalid
                if (fieldNames.some((name) => nextErrors[name])) {
                  return;
                }

                setFormError("");
                setIsSubmitting(true);

                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/signup`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: input.name.trim(),
                        email: input.email.trim(),
                        password: input.password,
                      }),
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    setFormError(
                      data.message || "Signup failed. Please try again."
                    );
                    return;
                  }

                  navigate("/signin");
                } catch (error) {
                  console.error("Signup error:", error);
                  setFormError(
                    "Unable to connect to the server. Please try again."
                  );
                } finally {
                  setIsSubmitting(false);
                }
              };


  return (
    <div className="signup-page">

      {/* Background */}
      <CodeBackground />

      {/* Form */}
      <div className="signup-wrapper">
        <div className="neon-card">

          <div className="signup-card">
{/*********************************************Signup Header**********************************/}
            <div className="signup-header">
                  <span className="signup-badge">
                        MYCODE ACADEMY
                  </span>

                  <h1>Create Account</h1>

                  <p>Start your journey as a developer</p>
            </div>

{/*********************************************Signup Form ************************************/}
            <form className="signup-form" onSubmit={handleSubmit}>


{/************************************************Full Name ************************************/}
             <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="signup-name">Full Name</label>

                    {touched.name && errors.name && (
                      <span className="field-error">{errors.name}</span>
                    )}
                  </div>

                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your name"
                    aria-invalid={Boolean(touched.name && errors.name)}
                  />
              </div>


{/****************************************************Email**************************************/}
              <div className="input-group">
                      <div className="input-label-row">
                          <label htmlFor="signup-email">Email</label>

                          {touched.email && errors.email && (
                            <span className="field-error">{errors.email}</span>
                          )}
                      </div>

                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        aria-invalid={Boolean(touched.email && errors.email)}
                      />
                </div>
{/*************************************************Password*************************************/}
              <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="signup-password">
                      Password
                      <span className="password-hint"> (e.g. Code@123)</span>
                    </label>

                    {touched.password && (
                      <span
                        className={`field-feedback ${
                          errors.password ? "field-error" : "field-success"
                        }`}
                      >
                        {errors.password || "Password is strong"}
                      </span>
                    )}
                  </div>

                  <div className="password-input-wrapper">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={input.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(touched.password && errors.password)}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
              </div>

{/**********************************************Confirm Passwork**********************************/}
              <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="signup-confirm-password">
                      Confirm Password
                    </label>

                    {touched.confirmPassword && errors.confirmPassword && (
                      <span className="field-error">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div className="password-input-wrapper">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={input.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

{/*********************************************Submit Button*************************************/}
                  
              {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
              )}

            <button
                type="submit"
                className="signup-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
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