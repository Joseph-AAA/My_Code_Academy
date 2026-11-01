
import {
  adminSidebarLinks,
  studentSidebarLinks,
} from "../../data/data.js";
import { GraduationCap, X } from "lucide-react";
import { NavLink,Link, useNavigate } from "react-router-dom";
function Sidebar({sidebarOpen,setSidebarOpen}) {

// ************************************* Read the logged-in user from either storage ********************************
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    const sidebarLinks =
      user?.role === "ADMIN"
        ? adminSidebarLinks
        : studentSidebarLinks;


        const navigate = useNavigate();

      const handleNavigation = () => {
  if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
};
  return <div className="flex flex-col w-[89%] min-h-80  gap-1">

                     <div className="flex h-20 items-center justify-between lg:justify-center">
                          <Link to="/dashboard" className="flex items-center gap-5">
                            <GraduationCap className="size-16" />

                            <div>
                              <h2 className="text-sm font-bold">MyCode Academy</h2>
                              <p>Student Portal</p>
                            </div>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                            className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-gray-500 transition hover:bg-red-400 lg:hidden"
                          >
                            <X />
                        </button>
                      </div>

                      {sidebarLinks.map((link) => (
                          <NavLink
                              onClick={handleNavigation}
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                              isActive
                                ? "flex h-12 items-center gap-3 rounded-md bg-blue-600 pl-3 text-white"
                                : "flex h-12 items-center gap-3 rounded-md pl-3 hover:bg-white/10"
                            }
                          >
                            <link.icon className="size-5" />
                            <span className="text-sm font-medium">{link.label}</span>
                          </NavLink>
                                              
                        ))}
            </div>
}
export default Sidebar;