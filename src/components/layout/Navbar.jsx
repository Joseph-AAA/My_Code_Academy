
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

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

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const navigate = useNavigate();

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
      className="page-container flex w-[95%] h-full items-center justify-between gap-4 lg:justify-end"
      onSubmit={(event) => event.preventDefault()}
    >
      <button
        className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 hover:bg-gray-200 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
      >
        <Menu />
      </button>

      <div className="flex h-full w-auto items-center gap-4">
        {/* <Bell className="size-5 cursor-pointer text-gray-500" /> */}

        <div className="relative flex h-full items-center justify-end">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-600">
                  {initials || (
                    <UserRound className="size-5" />
                  )}
                </span>
              )}
            </div>

            <span className="text-sm font-semibold text-gray-700">
              {user?.name || "User"}
            </span>

            <ChevronDown className="size-5 text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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





// import { useNavigate } from "react-router-dom";
// import { Bell, ChevronDown, Menu, LogOut , UserRound} from "lucide-react";
// import { useEffect, useState } from "react";
// function Navbar({ sidebarOpen, setSidebarOpen }) {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const navigate = useNavigate();

  
    
// const [user, setUser] = useState(() => {
//   try {
//     const storedUser =
//       localStorage.getItem("user") ||
//       sessionStorage.getItem("user");

//     return storedUser ? JSON.parse(storedUser) : null;
//   } catch {
//     return null;
//   }
// });

// useEffect(() => {
//   // Check which storage contains the login token
//   const storage = localStorage.getItem("token")
//     ? localStorage
//     : sessionStorage;

//   const token = storage.getItem("token");

//   if (!token) {
//     setUser(null);
//     return;
//   }

//   let cancelled = false;

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/auth/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         sessionStorage.removeItem("token");
//         sessionStorage.removeItem("user");

//         if (!cancelled) {
//           setUser(null);
//           navigate("/signin", { replace: true });
//         }

//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Failed to fetch profile");
//       }

//       const data = await response.json();

//       if (!cancelled) {
//         setUser(data.user);
//         storage.setItem("user", JSON.stringify(data.user));
//       }
//     } catch (error) {
//       if (!cancelled) {
//         console.error("Profile error:", error);
//       }
//     }
//   };

//   fetchProfile();

//   return () => {
//     cancelled = true;
//   };
// }, [navigate]);



//  const handleLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");

//   sessionStorage.removeItem("token");
//   sessionStorage.removeItem("user");

//   setUser(null);
//   navigate("/", { replace: true });
// };


  
//   return (
//     <form
//       className="page-container flex justify-between lg:justify-end items-center gap-4 w-[95%] h-full"
//       onSubmit={(e) => e.preventDefault()}
//     >
//       <button
//         className="flex justify-center items-center lg:hidden w-10 h-10 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         type="button"
//       >
//         <Menu />
//       </button>

//       <div className="w-auto flex items-center gap-4 h-full">
//         <Bell className="size-5 text-gray-500 cursor-pointer" />

//         <div className="relative flex h-full items-center justify-end">
//           <button
//             type="button"
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             {/* <img
//               src="https://i.pravatar.cc/100?img=12"
//               alt="Profile"
//               className="size-10 rounded-full object-cover"
//             /> */}
//             <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
//                 <UserRound className="size-5 text-gray-600" />
//             </div>  

//             <span className="text-sm font-semibold text-gray-700">
//               {user?.name || "Admin User"}
//             </span>

//             <ChevronDown className="size-5 text-gray-500" />
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 <LogOut className="size-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </form>
//   );
// }

// export default Navbar;


