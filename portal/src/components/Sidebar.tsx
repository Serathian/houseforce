"use client";

import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { LogOut, Home, Settings, Hammer, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userName?: string | null;
}

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projects", icon: Hammer },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Shared nav link list used by both the drawer and the static sidebar. */
function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
              isActive
                ? "bg-blue-950 text-white shadow-sm hover:bg-blue-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-blue-300" : "text-slate-400"}`} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function Sidebar({ userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          DESKTOP — static sidebar, hidden on mobile
      ════════════════════════════════════════════════════════ */}
      <aside
        aria-label="Navigation"
        className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0"
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
          <span className="text-2xl font-extrabold text-blue-900 tracking-tight">
            House<span className="text-teal-600">Force</span>
            <span className="text-amber-500">.</span>
          </span>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
            Customer Portal
          </p>
          <p className="text-sm font-semibold text-slate-700 truncate">
            {userName || "Customer"}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MOBILE — pill FAB + slide-in drawer, hidden on desktop
      ════════════════════════════════════════════════════════ */}

      {/* Pill button — only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:shadow-lg transition-all duration-200 active:scale-95"
      >
        <Menu className="w-5 h-5" />
        <span className="text-sm font-bold text-blue-900 tracking-tight hidden sm:inline">
          House<span className="text-teal-600">Force</span><span className="text-amber-500">.</span>
        </span>
      </button>

      {/* Backdrop overlay */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in drawer */}
      <aside
        aria-label="Navigation"
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
          className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
          <span className="text-2xl font-extrabold text-blue-900 tracking-tight">
            House<span className="text-teal-600">Force</span>
            <span className="text-amber-500">.</span>
          </span>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
            Customer Portal
          </p>
          <p className="text-sm font-semibold text-slate-700 truncate">
            {userName || "Customer"}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

