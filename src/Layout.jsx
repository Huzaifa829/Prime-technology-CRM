import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import SidebarNav from "./components/SideBar";
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";


function Layout() {
    const pages = [
        { title: "Admin", path: "/admin", icon: Home },
        { title: "Inbox", path: "/inbox", icon: Inbox },
        { title: "Calendar", path: "/calendar", icon: Calendar },
        {
            title: "Settings",
            icon: Settings,
          subPages: [
            { title: "Inbox", path: "/inbox" },
            { title: "profile", path: "/profile" },
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
