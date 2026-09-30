import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutDashboard, Settings, UserCircle, Briefcase, GraduationCap, LayoutTemplate, Inbox, Link as LinkIcon, ExternalLink } from "lucide-react";
import { AdminSignOut } from "./sign-out-button";
import { AdminMobileNav } from "./mobile-nav";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile & Link", href: "/admin/profile", icon: LinkIcon },
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

  const userProfile = await db.query.user.findFirst({
      where: eq(schema.user.id, session.user.id),
      columns: { name: true, username: true }
  });

  const displayName = userProfile?.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-background flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-serif text-2xl text-foreground hover:text-accent transition-colors">
            {displayName.toUpperCase()}
            <span className="block font-mono text-[10px] text-muted-foreground tracking-widest mt-1 uppercase">Admin Panel</span>
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
          {userProfile?.username && (
            <div className="px-2 mb-2">
              <Link href={`/${userProfile.username}`} target="_blank" className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm font-medium transition-colors">
                <ExternalLink className="w-4 h-4" /> Preview Online
              </Link>
            </div>
          )}
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
          {displayName.toUpperCase()}
        </Link>
        {userProfile?.username && (
            <Link 
            href={`/${userProfile.username}`}
            target="_blank"
            className="flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20"
            >
            <ExternalLink className="w-3 h-3" />
            Preview
            </Link>
        )}
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
