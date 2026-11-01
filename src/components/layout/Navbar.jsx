
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  UserRound,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getAuthStorage() {
  return localStorage.getItem("token")
    ? localStorage
    : sessionStorage;
}

function getStoredUser() {
  try {
    const storage = getAuthStorage();
    const storedUser = storage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function Navbar({  sidebarOpen, setSidebarOpen, theme, setTheme  }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const storage = getAuthStorage();
    const token = storage.getItem("token");
    let cancelled = false;

    const handleProfileUpdated = (event) => {
      const updatedUser = event.detail;

      if (!updatedUser) return;

      setUser(updatedUser);

      const savedUser = JSON.stringify(updatedUser);

      if (localStorage.getItem("token")) {
        localStorage.setItem("user", savedUser);
      }

      if (sessionStorage.getItem("token")) {
        sessionStorage.setItem("user", savedUser);
      }
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdated
    );

    if (!token) {
      setUser(null);

      return () => {
        cancelled = true;
        window.removeEventListener(
          "profileUpdated",
          handleProfileUpdated
        );
      };
    }

    async function fetchProfile() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");

          if (!cancelled) {
            setUser(null);
            navigate("/signin", { replace: true });
          }

          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data.user);
          storage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Profile error:", error);
        }
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdated
      );
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  const initials = (user?.name || "User")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <form
      className="page-container  flex w-[95%] h-full items-center justify-between gap-4 lg:justify-end"
      onSubmit={(event) => event.preventDefault()}
    >
      <button
        className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-(--border) text-(--text-primary) transition hover:bg-(--surface-secondary) lg:hidden"
        onClick={() => setSidebarOpen((prev) => !prev)}
        type="button"
      >
        <Menu />
      </button>

      <div className="flex h-full w-auto items-center gap-4">
        {/* <Bell className="size-5 cursor-pointer text-gray-500" /> */}
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

        <div
            ref={profileRef}
            className="relative flex h-full items-center justify-end"
          >
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--surface-secondary)">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-(--text-primary)">
                  {initials || (
                    <UserRound className="size-5" />
                  )}
                </span>
              )}
            </div>

            <span className="text-sm font-semibold text-(--text-primary)">
              {user?.name || "User"}
            </span>

            <ChevronDown className="size-5 text-gray-500" />
          </button>

          {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-(--border) bg-(--surface) py-2 shadow-xl">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-(--text-primary) transition hover:bg-(--surface-secondary)"
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


