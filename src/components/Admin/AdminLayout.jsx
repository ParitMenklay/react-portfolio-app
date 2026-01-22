import React, { useState } from "react"; // เพิ่ม useState
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  FolderOpen,
  User,
  Bell,
  Key,
  ExternalLink,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner"; // นำเข้า Spinner

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigatingHome, setIsNavigatingHome] = useState(false); // State สำหรับปุ่ม Home

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // ฟังก์ชันสำหรับกลับหน้า Home พร้อม Spinner
  const handleGoHome = async (e) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    // จำลองการโหลด 800ms ให้ความรู้สึกลื่นไหลเหมือน Navbar หลัก
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate("/");
    setIsNavigatingHome(false);
  };

  const navItems = [
    { title: "Article management", url: "/admin", icon: FileText },
    { title: "Category management", url: "/admin/category", icon: FolderOpen },
    { title: "Profile", url: "/admin/profile", icon: User },
    { title: "Notification", url: "/admin/notification", icon: Bell },
    { title: "Reset password", url: "/admin/reset-password", icon: Key },
  ];

  return (
    <SidebarProvider>
      {/* Overlay Spinner เมื่อกำลังกลับหน้า Home */}
      {isNavigatingHome && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300 font-poppins">
          <Spinner className="h-12 w-12 text-brown-600" />
          <p className="text-brown-600 font-bold animate-pulse text-sm">
            Returning to Website...
          </p>
        </div>
      )}

      <div className="flex min-h-screen w-full font-poppins">
        {/* --- Sidebar Component --- */}
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="border-r border-gray-200 bg-[#EEEFEF]"
        >
          <SidebarHeader className="p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">
                hh<span className="text-green-500 text-brown-600">.</span>
              </h1>
              <p className="text-orange-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                Admin panel
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="h-11 cursor-pointer transition-all active:scale-95 hover:bg-white/50 data-[active=true]:bg-gray-200 data-[active=true]:text-black"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-gray-200">
            <SidebarMenu>
              <SidebarMenuItem>
                {/* เปลี่ยนเป็นปุ่มที่เรียกใช้ handleGoHome */}
                <SidebarMenuButton
                  onClick={handleGoHome}
                  className="cursor-pointer text-gray-500 hover:text-black transition-all active:scale-95"
                >
                  <ExternalLink className="size-5" />
                  <span className="text-sm">hh. website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors transition-all active:scale-95"
                >
                  <LogOut className="size-5" />
                  <span className="text-sm">Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* --- Main Content Wrap --- */}
        <SidebarInset className="bg-[#F9F9F9]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 md:hidden">
            <SidebarTrigger className="cursor-pointer" />
          </header>

          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
