import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";

function SidebarNav({ sidebarName, pages }) {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  // Toggle function for submenus
  const toggleSubMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{sidebarName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((page) => (
                <div key={page.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <div
                        className="flex items-center justify-between w-full cursor-pointer"
                        onClick={() =>
                          page.path
                            ? navigate(page.path)
                            : page.subPages && toggleSubMenu(page.title)
                        }
                      >
                        {page.path ? (
                          <Link to={page.path} className="flex items-center">
                            <page.icon className="mr-2" />
                            <span>{page.title}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center">
                            <page.icon className="mr-2" />
                            <span>{page.title}</span>
                          </div>
                        )}

                        {page.subPages &&
                          (openMenus[page.title] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          ))}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Sub-menu (collapsible dropdown) */}
                  {page.subPages && openMenus[page.title] && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {page.subPages.map((subPage) => (
                        <li key={subPage.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              to={subPage.path}
                              className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                            >
                              <span className="ml-4">{subPage.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default SidebarNav;
