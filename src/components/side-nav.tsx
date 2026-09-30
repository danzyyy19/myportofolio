"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";

const navItems = [
  { id: "hero", label: "Beranda" },
  { id: "summary", label: "Tentang" },
  { id: "skills", label: "Keahlian" },
  { id: "experience", label: "Karir" },
  { id: "projects", label: "Proyek" },
  { id: "education", label: "Edu" },
  { id: "contact", label: "Kontak" },
];

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Vertical Dot Navigation (Desktop Only) */}
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-48 flex-col py-12 z-50 pointer-events-none"
      >
        {/* The Base Line */}
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-border/40 -z-10" />

        {/* Camera-like top and bottom bounds */}
        <div className="absolute left-6 top-12 w-4 h-[1px] bg-border/60" />
        <div className="absolute left-6 bottom-12 w-4 h-[1px] bg-border/60" />

        {/* Strips / Ticks Container */}
        <div className="flex-1 flex flex-col justify-center items-start gap-7 w-full pl-8 pointer-events-auto">
          {navItems.map((item, index) => {
            const activeIndex = navItems.findIndex(i => i.id === activeSection);
            const currentActive = activeIndex !== -1 ? activeIndex : 0;
            const distance = Math.abs(index - currentActive);
            const isActive = activeSection === item.id;

            // Width of the strip determines the curve
            const getStripWidth = () => {
              if (distance === 0) return "w-10 bg-accent";
              if (distance === 1) return "w-7 bg-foreground/60";
              if (distance === 2) return "w-4 bg-foreground/40";
              return "w-2 bg-foreground/20";
            };

            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="relative group flex items-center justify-start w-full"
                aria-label={item.label}
              >
                <div className="flex items-center">
                  <span
                    className={`block h-[2px] rounded-r-full transition-all duration-500 ease-out group-hover:bg-accent/80 ${getStripWidth()}`}
                  />
                </div>

                {/* Text Label */}
                <span className={`ml-4 text-[9px] font-mono tracking-widest uppercase transition-all duration-500 ${
                  isActive ? "text-accent opacity-100 translate-x-1" : "text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-1"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions Container (Pinned to bottom of sidebar) */}
        <div className="flex flex-col items-start gap-6 mt-auto relative pl-[1.6rem] pb-4 pointer-events-auto">
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group relative flex items-center gap-4 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted && (
              theme === "dark" ? (
                <Sun className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-12" strokeWidth={1.5} />
              )
            )}
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Admin Panel */}
          <Link
            href="/admin"
            className="group relative flex items-center gap-4 text-muted-foreground hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-90">
              <rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Admin
            </span>
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/80 backdrop-blur-md p-3 rounded-full border border-border shadow-sm text-foreground hover:text-accent transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 flex justify-end"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-[80%] max-w-sm h-full bg-background border-l border-border shadow-2xl flex flex-col pt-24 px-6 pb-8"
            >
              {/* Navigation Links */}
              <div className="flex-1 flex flex-col gap-6">
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-2">Navigasi</span>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`text-left text-2xl font-serif tracking-wide transition-colors ${
                      activeSection === item.id ? "text-accent" : "text-foreground hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-8 border-t border-border mt-auto flex flex-col gap-6">
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Pengaturan</span>
                
                {/* Theme Toggle Mobile */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-4 text-muted-foreground hover:text-accent transition-colors relative z-10 w-full text-left"
                >
                  {mounted && (
                    theme === "dark" ? (
                      <Sun className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Moon className="w-5 h-5" strokeWidth={1.5} />
                    )
                  )}
                  <span className="text-sm font-medium">
                    {mounted && theme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
                  </span>
                </button>
                
                {/* Admin Panel Mobile */}
                <Link
                  href="/admin"
                  className="flex items-center gap-4 text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="8.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="1" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  <span className="text-sm font-medium">Masuk Admin Panel</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
