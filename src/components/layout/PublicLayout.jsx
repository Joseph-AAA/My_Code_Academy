import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

function PublicLayout({ theme, setTheme }) {
  return (
    <div className="min-h-screen bg-(--background)">
      <PublicNavbar    
        theme={theme}
        setTheme={setTheme}/>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;