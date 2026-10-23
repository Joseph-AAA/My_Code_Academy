import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-(--background)">
      <PublicNavbar />
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;