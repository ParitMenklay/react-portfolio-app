import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";

function Navbar() {
  const [open, setOpen] = useState(false);

  // ปิด popup เมื่อ resize เป็น desktop (>= sm)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleChange = (e) => {
      if (e.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {/* ================= Navbar ================= */}
      <nav className="flex items-center justify-between px-6 py-3 h-12 w-full bg-brown-100 border-b border-brown-300 sm:px-32 sm:py-4 sm:h-20">
        {/* Logo */}
        <img src={logo} alt="logo" className="h-6 sm:h-11" />

        {/* ================= Desktop (>= sm) ================= */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="Secondary"
            className="bg-white h-12 w-32 rounded-full border border-brown-400"
          >
            Log in
          </Button>
          <Button
            variant="default"
            className="h-12 w-32 rounded-full border border-brown-600"
          >
            Sign up
          </Button>
        </div>

        {/* ================= Mobile (< sm) ================= */}
        <div className="sm:hidden">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-0 [&>svg:last-child]:hidden"
                >
                  <Menu className="text-brown-400" />
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* ================= Mobile Popup (< sm) ================= */}
      {open && (
        <div
          className="
            fixed
            top-12
            left-0
            z-40
            w-full
            h-[200px]
            bg-brown-100
            flex
            items-center
            justify-center
            shadow-[2px_2px_16px_0px_rgba(0,0,0,0.1)]
            sm:hidden
          "
        >
          <div className="w-full px-10 flex flex-col gap-6">
            <Button
              variant="Secondary"
              className="bg-white h-12 rounded-full border border-brown-400"
              onClick={() => setOpen(false)}
            >
              Log in
            </Button>
            <Button
              variant="default"
              className="h-12 rounded-full border border-brown-600"
              onClick={() => setOpen(false)}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
