import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SmartphoneIcon, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/compare", label: "Compare" },
    { href: "/best-upgrades", label: "Best Upgrades" },
    { href: "/feature-guides", label: "Guides" },
    { href: "/sell-your-phone", label: "Sell" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center mr-3">
              <SmartphoneIcon className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-[#1428A0]">GalaxyAdvisor</span>
          </Link>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={`py-2 ${
                        isActive(link.href)
                          ? "font-medium text-[#1428A0]"
                          : "text-gray-700 hover:text-[#1428A0]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/#advisor-tool" onClick={() => setIsSheetOpen(false)}>
                    <Button className="w-full bg-[#1428A0] hover:bg-[#1428A0]/90">Get Started</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "font-medium text-[#1428A0]"
                    : "font-medium text-gray-700 hover:text-[#1428A0] transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#advisor-tool">
              <Button className="bg-[#1428A0] hover:bg-[#1428A0]/90">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
