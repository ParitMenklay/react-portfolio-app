import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, User, KeyRound, Bell, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import logo from "../assets/images/logo.png";

// Mock user avatar - replace with actual user avatar
const userAvatar = "https://placehold.co/40x40/D2691E/white?text=MD";

export function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบสถานะการ login จาก localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 h-12 w-full bg-brown-100 border-b border-brown-300 sm:px-32 sm:py-4 sm:h-20 sticky top-0 z-50 font-poppins">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="logo" className="h-6 sm:h-11 cursor-pointer" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-2">
        {user ? (
          // แสดงเมื่อ login แล้ว (Desktop)
          <div className="hidden sm:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white border border-brown-200 cursor-pointer active:scale-95 h-12 w-12 shadow-sm"
            >
              <Bell className="w-6 h-6 text-brown-500" />
            </Button>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity p-1">
                  <img
                    src={userAvatar}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-brown-300"
                  />
                  <span className="font-semibold text-brown-600 body-1">
                    {user.name || "Moodeng ja"}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-brown-200 shadow-xl rounded-2xl p-2 mt-2 z-50"
              >
                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer focus:bg-brown-50 rounded-xl">
                  <User className="w-5 h-5 text-brown-400" />
                  <span className="body-2 text-brown-600 font-medium">
                    Profile
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer focus:bg-brown-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-brown-400" />
                  <span className="body-2 text-brown-600 font-medium">
                    Reset password
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-brown-100 my-2" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 cursor-pointer focus:bg-red/5 text-red rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="body-2 font-bold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // แสดงเมื่อยังไม่ login (Desktop)
          <>
            <Link to="/login">
              <Button
                variant="secondary"
                className="bg-white h-12 w-32 rounded-full border border-brown-400 text-brown-600 hover:bg-brown-50 body-2 font-semibold active:scale-95 cursor-pointer"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="default"
                className="h-12 w-32 rounded-full border border-brown-600 bg-brown-600 hover:opacity-90 text-white body-2 font-semibold shadow-sm active:scale-95 cursor-pointer"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent focus-visible:ring-0"
            >
              <Menu className="text-brown-400 w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-screen bg-brown-100 border-x-0 border-t-0 border-b border-brown-300 p-6 shadow-xl sm:hidden rounded-none z-50 animate-in fade-in zoom-in-95 origin-top duration-200"
            align="start"
            sideOffset={0}
          >
            {user ? (
              // แสดงเมื่อ login แล้ว (Mobile)
              <div className="flex flex-col gap-4">
                {/* User Info */}
                <div className="flex justify-between items-center gap-3 px-4 pb-4 border-b border-brown-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={userAvatar}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="body-1 font-semibold text-brown-600">
                      {user.name}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white border border-brown-200 cursor-pointer active:scale-95 h-12 w-12 shadow-sm"
                  >
                    <Bell className="w-6 h-6 text-brown-500" />
                  </Button>
                </div>

                {/* Menu Items */}
                <DropdownMenuItem asChild className="focus:bg-transparent p-0">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brown-50"
                  >
                    <User className="w-5 h-5 text-brown-500" />
                    <span className="body-2 text-brown-600">Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="focus:bg-transparent p-0">
                  <Link
                    to="/reset-password"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brown-50"
                  >
                    <KeyRound className="w-5 h-5 text-brown-500" />
                    <span className="body-2 text-brown-600">
                      Reset password
                    </span>
                  </Link>
                </DropdownMenuItem>

                <div className="border-t border-brown-300 my-2"></div>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="focus:bg-transparent p-0 cursor-pointer"
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brown-50 w-full">
                    <LogOut className="w-5 h-5 text-brown-500" />
                    <span className="body-2 text-red font-bold">Log out</span>
                  </div>
                </DropdownMenuItem>
              </div>
            ) : (
              // แสดงเมื่อยังไม่ login (Mobile)
              <div className="flex flex-col gap-4 px-4 py-2">
                <DropdownMenuItem className="focus:bg-transparent p-0">
                  <Link to="/login" className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-white h-12 rounded-full border border-brown-400 text-brown-600 font-semibold body-2 active:scale-95 cursor-pointer"
                    >
                      Log in
                    </Button>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-transparent p-0">
                  <Link to="/signup" className="w-full">
                    <Button
                      variant="default"
                      className="w-full h-12 rounded-full border border-brown-600 bg-brown-600 text-white font-semibold body-2 active:scale-95 cursor-pointer"
                    >
                      Sign up
                    </Button>
                  </Link>
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-brown-200 border-t border-brown-300 flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-auto px-4 md:px-32 py-10 md:py-16 gap-6 font-poppins">
      <div className="flex flex-row items-center gap-6">
        <span className="body-2 text-brown-500">Get in touch</span>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-brown-600 hover:text-brown-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-brown-600 hover:text-brown-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-brown-600 hover:text-brown-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
            </svg>
          </a>
        </div>
      </div>

      <Button variant="link" asChild className="p-0 h-auto">
        <Link
          to="/"
          onClick={scrollToTop}
          className="body-2 text-brown-600 hover:text-brown-400 transition-colors underline-offset-4 hover:underline font-semibold"
        >
          Home Page
        </Link>
      </Button>
    </footer>
  );
}
