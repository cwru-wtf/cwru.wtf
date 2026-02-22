"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { title: "About", href: "#about" },
  { title: "Projects", href: "#projects" },
  { title: "Join", href: "#join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`font-mono fixed z-50 w-full transition-all duration-300 ${
        scrolled ? "pt-2 px-2 lg:px-4" : "pt-4 px-4 lg:px-6"
      }`}
    >
      <div className="mx-auto max-w-[1200px] relative">
        <div
          className={`relative flex items-center justify-between gap-6 px-4 py-3 lg:px-6 lg:gap-0 transition-all duration-500 z-50 ${
            scrolled || mobileOpen
              ? "rounded-md border border-white/10 bg-black/80 shadow-lg shadow-black/30 backdrop-blur-xl"
              : "rounded-md border border-transparent bg-transparent"
          }`}
        >
          {/* Brand */}
          <div className="flex w-full justify-between lg:w-auto">
            <Link href="/" className="font-mono text-sm font-bold">
              <span className="text-green-400">cwru</span>
              <span className="text-pink-400">.wtf</span>
            </Link>

            {/* Mobile toggle */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative p-2 lg:hidden"
            >
              <Menu
                className={`h-5 w-5 text-white/80 absolute inset-0 m-auto transition-all duration-200 ${
                  mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`h-5 w-5 text-white/80 transition-all duration-200 ${
                  mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>
          </div>

          {/* Center: Desktop links */}
          <div className="absolute inset-0 m-auto hidden size-fit lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="#join"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-2 text-sm text-white/80 transition-all hover:bg-white/15 hover:text-white"
            >
              Join .wtf
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 mt-2 w-full origin-top rounded-md border border-white/10 bg-black/90 backdrop-blur-xl px-5 py-4 shadow-xl lg:hidden transition-all duration-300 ease-in-out ${
            mobileOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center py-3 text-sm text-white/60 border-b border-white/[0.06] transition-colors hover:text-white"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="#join"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-all hover:bg-white/15"
            >
              Join .wtf
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
