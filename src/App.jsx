import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import MainDashboard from "./pages/MainDashboard";
import Courses from "./pages/Courses";
import Students from "./pages/Students";
import Payments from "./pages/Payments";
import Setting from "./pages/Setting";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useState } from "react";
import SignIn from "./pages/signIn/SingIn"
import SignUp from "./pages/signUp/SignUp"
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/signIn/ForgotPassword";
import ResetPassword from "./pages/signIn/ResetPassword";
import PublicLayout from "./components/layout/PublicLayout";
import PublicCourses from "./components/courses/PublicCourses";
import StudentCourses from "./components/courses/StudentCourses";

function RoleBasedCourses() {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    console.log("RoleBasedCourses is running");
    console.log("Stored user:", user);
    console.log("Current role:", user?.role);

    if (user?.role === "ADMIN") {
      console.log("Rendering Admin Courses");
      return <Courses />;
    }

    if (user?.role === "STUDENT") {
      console.log("Rendering Student Courses");
      return <StudentCourses />;
    }

    console.log("No recognized role");
    return null;
}



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  return (
      
   <Routes>

      {/* Sign Up - full screen */}
      <Route path="/signup" element={<SignUp />} />

      {/* Sign In - full screen */}
      <Route path="/signin" element={<SignIn />} />

      {/* forget password - full screen */}
      <Route path="/forgot-password"element={<ForgotPassword />}/>

      <Route path="/reset-password/:token" element={<ResetPassword />}/>

      {/* Public website */}
      <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicCourses />} />
          <Route
            path="/public/courses"
            element={<PublicCourses />}
          />
      </Route>


      {/* Dashboard routes */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <div className="grid min-h-screen min-w-0 w-full grid-cols-1 lg:grid-cols-[240px_1fr]">

              {/* Sidebar */}
              <div className="contents lg:block">
                <aside
                  className={`
                    fixed inset-y-0 left-0 z-60
                    flex h-screen w-full flex-col items-center
                    bg-(--sidebar) text-white
                    md:w-1/2
                    lg:w-60
                    transition-transform duration-300 ease-in-out
                    lg:transition-none
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                  `}
                >
                  <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                </aside>

                {sidebarOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
              </div>

              {/* Content */}
              <div className="grid grid-rows-[76px_minmax(0,1fr)_56px] gap-0 bg-(--background) h-full w-full">

                <nav className="sticky top-0 z-50 w-full bg-(--navbar) shadow-md">
                  <Navbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                </nav>

                <main className="main-container min-w-0 w-full flex">
                  <Routes>
                    {/* Admin-only pages */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                          <MainDashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/students"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                          <Students />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/courses"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
                          <RoleBasedCourses />
                        </ProtectedRoute>
                      }
                    />

                    {/* Shared pages */}
                    <Route
                      path="/payments"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
                          <Payments />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/setting"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
                          <Setting />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/about"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
                          <About />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/contact"
                      element={
                        <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
                          <Contact />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>

                <div className="bg-(--footer) w-full">
                  <Footer />
                </div>

              </div>
            </div>
          </ProtectedRoute>
        }
      />

    </Routes>
      
  );
}

export default App;