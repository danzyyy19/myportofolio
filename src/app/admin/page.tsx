import { headers } from "next/headers";
import { toast } from "sonner";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, UserCircle, Briefcase, GraduationCap, LayoutTemplate, ArrowRight } from "lucide-react";

function AdminSection({ title, description, href, icon: Icon }: { title: string, description: string, href: string, icon: any }) {
  return (
    <Link href={href} className="block group">
      <div className="glass-card !p-8 h-full flex flex-col hover:border-accent/40 transition-colors duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors group-hover:translate-x-0.5" />
          </div>
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-4">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono-ui text-[10px] text-accent font-medium uppercase tracking-wider">
            System Online
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-3 text-foreground">
          Welcome back, <span className="text-accent">{session.user?.name || "Admin"}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your portfolio content, update your experience, and adjust site settings from this control center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminSection 
          title="General Settings" 
          description="Manage your main profile details, hero section text, contact information, and CV document." 
          href="/admin/settings"
          icon={Settings} 
        />
        <AdminSection 
          title="Professional Summary" 
          description="Update the professional summary paragraph and key metrics shown on the homepage." 
          href="/admin/summary"
          icon={UserCircle} 
        />
        <AdminSection 
          title="Experience" 
          description="Manage your work history, company roles, active periods, and bullet points." 
          href="/admin/experience"
          icon={Briefcase} 
        />
        <AdminSection 
          title="Education" 
          description="Modify your educational background, licenses, certifications, and technical skills." 
          href="/admin/education"
          icon={GraduationCap} 
        />
        <AdminSection 
          title="Projects" 
          description="Update the list of featured projects, descriptions, tech stacks, and live links." 
          href="/admin/projects"
          icon={LayoutTemplate} 
        />
      </div>
    </div>
  );
}
