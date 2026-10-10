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
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  return (
      
   <Routes>

      {/* Sign Up - full screen */}
      <Route path="/signup" element={<SignUp />} />

      {/* Sign In - full screen */}
      <Route path="/signin" element={<SignIn />} />

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
                    <Route path="/" element={<MainDashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
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