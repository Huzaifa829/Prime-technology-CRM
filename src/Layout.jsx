import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import SidebarNav from "./components/SideBar";
import { Home, Inbox, Calendar, Search, Settings,Briefcase } from "lucide-react";


function Layout() {
    const pages = [
        { title: "Admin", path: "/dashboard/admin", icon: Home },
        { title: "Brand Management", path: "/dashboard/BrandManagement", icon: Briefcase },
        { title: "Calendar", path: "/dashboard/calendar", icon: Calendar },
        {
            title: "Settings",
            icon: Settings,
          subPages: [
            { title: "Inbox", path: "/dashboard/inbox" },
            { title: "profile", path: "/dashboard/profile" },
          ],
        },
      ];
      
  return (
    <>
    <SidebarProvider>
      <div className="flex w-full">
        <SidebarNav sidebarName="main menu" pages={pages}/>
        <div className="flex-1 p-4">
        <SidebarTrigger />
          <Outlet />
        </div>
      </div>
      </SidebarProvider>
    </>
  );
}

export default Layout;
