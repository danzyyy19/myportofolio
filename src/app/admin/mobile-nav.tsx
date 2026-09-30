"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { LayoutDashboard, Settings, UserCircle, Briefcase, GraduationCap, LayoutTemplate, Inbox } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Summary", href: "/admin/summary", icon: UserCircle },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Projects", href: "/admin/projects", icon: LayoutTemplate },
  { name: "Inbox", href: "/admin/inbox", icon: Inbox },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Bottom bar: 4 most important + menu button
  const bottomItems = navItems.slice(0, 4);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-1 py-1.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[9px] font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Menu toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] ${
              isOpen ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[9px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-[68px] left-0 right-0 bg-background border-t border-border rounded-t-2xl p-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {/* All nav items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "text-accent bg-accent/5"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  {item.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-border my-2" />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Moon className="w-5 h-5" strokeWidth={1.5} />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              Sign Out
            </button>

            {/* Back to site */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-all"
            >
              ← Kembali ke Website
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
