import logo from "../assets/images/logo.png";
import { Menu, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

// Import Dropdown Menu จาก Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 h-12 w-full bg-brown-100 border-b border-brown-300 sm:px-32 sm:py-4 sm:h-20 sticky top-0 z-50">
      {/* Logo */}
      <img src={logo} alt="logo" className="h-6 sm:h-11" />

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-2">
        <Button
          variant="secondary"
          className="bg-white h-12 w-32 rounded-full border border-brown-400 text-brown-600 hover:bg-brown-50"
        >
          Log in
        </Button>
        <Button
          variant="default"
          className="h-12 w-32 rounded-full border border-brown-600 bg-brown-600 hover:bg-brown-700 text-white"
        >
          Sign up
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <DropdownMenu modal={false}>
          {" "}
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
            <div className="flex flex-col gap-4 px-4 py-2">
              <DropdownMenuItem className="focus:bg-transparent p-0">
                <Button
                  variant="secondary"
                  className="w-full bg-white h-12 rounded-full border border-brown-400 text-brown-600 font-semibold"
                >
                  Log in
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem className="focus:bg-transparent p-0">
                <Button
                  variant="default"
                  className="w-full h-12 rounded-full border border-brown-600 bg-brown-600 text-white font-semibold"
                >
                  Sign up
                </Button>
              </DropdownMenuItem>
            </div>
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
      behavior: "smooth", // "smooth" สำหรับการเลื่อนแบบนุ่มนวล หรือ "instant" เพื่อให้ไปทันที
    });
  };
  return (
    <footer className="bg-brown-200 border-t border-brown-300 flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-auto px-4 md:px-32 py-10 md:py-16 gap-6">
      {/* Social Icons Section */}
      <div className="flex flex-row items-center gap-6">
        <span className="text-sm font-medium text-brown-500">Get in touch</span>
        <div className="flex gap-4 text-brown-600">
          <a href="#" className="hover:text-brown-800 transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-brown-800 transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-brown-800 transition-colors">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Home Page Link */}
      <Button variant="link" asChild className="p-0 h-auto">
        <Link
          to="/"
          onClick={scrollToTop}
          className="text-sm font-semibold text-brown-600 hover:text-brown-800 transition-colors underline-offset-4 hover:underline"
        >
          Home Page
        </Link>
      </Button>
    </footer>
  );
}
