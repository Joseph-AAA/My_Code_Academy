import CodeBackground from "../../components/Background/CodeBackground";
import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
  // ********************************************setup useState for input***********************

      const [input, setInput] = useState({
          name : "",
          email : "",
          password : "",
          confirmPassword : ""
      });



      const [message, setMessage] = useState({
          text: "",
          type: "",
        });

// ********************************************To receive input values***********************

      const handleChange = (e)=>{
          const {name , value} = e.target;
          setInput((prev)=>({...prev, [name] : value}))
      }


// ***************************************Checking Form Validation***********************      const handleSubmit = (e) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "Account created successfully", type: "success" })
  
          if (
            !input.name.trim() ||
            !input.email.trim() ||
            !input.password ||
            !input.confirmPassword
          ) {  
              // 1. Validate required fields
              setMessage({
                text: "Please fill in all fields.",
                type: "error",
              });
              return;
          }
             // 2. Check whether passwords match
            if (input.password !== input.confirmPassword) {
                setMessage({
                    text: "Passwords do not match.",
                    type: "error",
                  });
              return;
          }

              // 3. Send signup data to the backend
            try {
              setIsSubmitting(true);

                const response = await fetch(
                "http://localhost:5000/api/auth/signup",
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

              // 4. Handle the backend response
              if (!response.ok) {
                  setMessage({
                      text: data.message || "Signup failed.",
                      type: "error",
                });
                return;
              }

             setMessage({
              text: data.message || "Account created successfully!",
              type: "success",
            });

            navigate("/signin");
            
              console.log("Created user:", data.user);
            } catch (error) {
              console.error("Signup error:", error);
              setMessage({
                  text: "Unable to connect to the server. Please try again.",
                  type: "error",
              });
            }finally {
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
                  <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
              </div>


{/****************************************************Email**************************************/}
              <div className="input-group">
                  <label>Email</label>
                  <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                  />
              </div>


{/*************************************************Password*************************************/}
              <div className="input-group">
                <label>Password</label>
                <input
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                />
              </div>


{/**********************************************Confirm Passwork**********************************/}
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                      type="password"
                      name="confirmPassword"
                      value={input.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                />
              </div>
                

                {message.text && (
                    <p
                      className={`signup-message ${message.type}`}
                      role="alert"
                    >
                      {message.text}
                    </p>
                  )}

{/*********************************************Submit Button*************************************/}
                  
              <button type="submit" className="signup-button" disabled={isSubmitting}>
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