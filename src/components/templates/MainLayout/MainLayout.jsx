import { Navbar, Footer } from "@/components/organisms";
import { FloatingNav } from "@/components/organisms/Navbar/floating-navbar";
import { Outlet } from "react-router-dom";
// import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

export default function MainLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      
      {/* Remove top padding to let first section sit flush; keep horizontal padding */}
      <main className="flex-1 w-full h-full mx-auto overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
