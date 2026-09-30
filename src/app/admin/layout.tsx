import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutDashboard, Settings, UserCircle, Briefcase, GraduationCap, LayoutTemplate, Inbox } from "lucide-react";
import { AdminSignOut } from "./sign-out-button";
import { AdminMobileNav } from "./mobile-nav";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Summary", href: "/admin/summary", icon: UserCircle },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Projects", href: "/admin/projects", icon: LayoutTemplate },
  { name: "Inbox", href: "/admin/inbox", icon: Inbox },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err: any) {
    console.error("SESSION ERROR:", err);
    console.error("CAUSE:", err.cause);
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-background flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-serif text-2xl text-foreground hover:text-accent transition-colors">
            DANI<span className="text-accent">.DEV</span>
            <span className="block font-mono text-[10px] text-muted-foreground tracking-widest mt-1 uppercase">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
          <AdminSignOut />
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-40">
        <Link href="/admin" className="font-serif text-xl text-foreground">
          DANI<span className="text-accent">.DEV</span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-accent transition-colors bg-muted/50 px-3 py-1.5 rounded-full border border-border"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Ke Web
        </Link>
      </div>

      {/* Mobile Bottom Navigation */}
      <AdminMobileNav />

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
