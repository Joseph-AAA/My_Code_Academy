

import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, LogOut , UserRound} from "lucide-react";
import { useEffect, useState } from "react";
function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  
    
const [user, setUser] = useState(() => {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
});

useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (!token) return;

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/signin", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setUser(data.user);
      sessionStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Profile error:", error);
    }
  };

  fetchProfile();
}, [navigate]);




  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/signin", { replace: true });
  };


  
  return (
    <form
      className="page-container flex justify-between lg:justify-end items-center gap-4 w-[95%] h-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <button
        className="flex justify-center items-center lg:hidden w-10 h-10 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
      >
        <Menu />
      </button>

      <div className="w-auto flex items-center gap-4 h-full">
        <Bell className="size-5 text-gray-500 cursor-pointer" />

        <div className="relative flex h-full items-center justify-end">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Profile"
              className="size-10 rounded-full object-cover"
            /> */}
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                <UserRound className="size-5 text-gray-600" />
            </div>  

            <span className="text-sm font-semibold text-gray-700">
              {user?.name || "Admin User"}
            </span>

            <ChevronDown className="size-5 text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default Navbar;
