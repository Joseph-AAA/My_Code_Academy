
import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Sun, Moon } from "lucide-react";

function PublicNavbar({ theme, setTheme }) {
  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--surface)">
      <nav className="mx-auto flex h-24 w-full max-w-[1920px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          to="/public/courses"
          className="flex items-center gap-2"
        >
          <GraduationCap className="size-8 text-(--primary)" />

          <span className="hidden sm:block text-lg font-bold text-(--text-primary)">
            MyCode Academy
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <NavLink
            to="/public/courses"
            className={({ isActive }) =>
              `hidden font-medium sm:flex ${
                isActive
                  ? "text-(--primary)"
                  : "text-(--text-secondary) hover:text-(--primary)"
              }`
            }
          >
            Courses
          </NavLink>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition hover:bg-(--surface-secondary)"
          >
            {theme === "light" ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </button>

          <Link
            to="/signin"
            className="font-medium text-(--text-secondary) transition hover:text-(--primary)"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-(--primary) px-4 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default PublicNavbar;
