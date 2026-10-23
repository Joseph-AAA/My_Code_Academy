
import { Link, NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-24 w-full max-w-[1920px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          to="/public/courses"
          className="flex items-center gap-2"
        >
          <GraduationCap className="size-8 text-blue-600" />

          <span className="text-lg font-bold text-gray-900">
            MyCode Academy
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <NavLink
            to="/public/courses"
            className={({ isActive }) =>
              `font-medium ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:cursor-pointer"
              }`
            }
          >
            Courses
          </NavLink>

          <Link
            to="/signin"
            className="hover:cursor-pointer font-medium text-gray-700 hover:text-blue-600"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="hover:cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default PublicNavbar;

