"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl] = useSiteConfig("logoUrl", "/cruz_logo.png");

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("main-header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/showroom", label: "Showroom" },
    { href: "/outerwear", label: "Outerwear" },
    { href: "/women", label: "Women" },
    { href: "/men", label: "Men" },
    { href: "/rtw", label: "Ready-to-Wear" },
    { href: "/knitwear", label: "Knitwear" },
    { href: "/denim", label: "Denim" },
  ];

  return (
    <header
      className="w-full bg-cruzBg/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-500 border-b border-cruzBorder/30"
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
        {/* Empty left placeholder for desktop centering */}
        <div className="w-16 lg:flex hidden"></div>

        {/* Brand Logo - Centered on desktop, left/center on mobile */}
        <Link href="/" className="flex flex-col items-center justify-center group z-50">
          <img
            src={logoUrl}
            alt="Cruz Logo"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Minimalist Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex lg:hidden flex-col justify-center items-center w-8 h-8 z-50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-5 h-[1px] bg-cruzBlack transition-all duration-300 ease-out ${
              mobileMenuOpen ? "transform rotate-45 translate-y-[2px]" : "-translate-y-1"
            }`}
          />
          <span
            className={`w-5 h-[1px] bg-cruzBlack transition-all duration-300 ease-out ${
              mobileMenuOpen ? "transform -rotate-45 -translate-y-[1px]" : "translate-y-1"
            }`}
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex gap-10 text-[9px] tracking-[0.25em] uppercase text-cruzBlack">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`pb-2 border-b transition-all duration-300 ${
                      isActive
                        ? "border-cruzBlack opacity-100 font-medium"
                        : "border-transparent hover:border-cruzBlack/60 hover:opacity-75"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Fullscreen Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-cruzBg/98 backdrop-blur-lg flex flex-col justify-center transition-all duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="w-full text-center py-20 px-8">
          <ul className="flex flex-col gap-8 text-xs tracking-[0.3em] uppercase text-cruzBlack">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.label}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
                    transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                    opacity: mobileMenuOpen ? 1 : 0,
                  }}
                  className="transition-all duration-500"
                >
                  <Link
                    href={link.href}
                    className={`inline-block py-2 ${
                      isActive ? "border-b border-cruzBlack" : "text-gray-500 hover:text-cruzBlack"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
