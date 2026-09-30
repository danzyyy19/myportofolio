import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/hero';
import { SummarySection } from '@/components/sections/summary';
import { SkillsSection } from '@/components/sections/skills';
import { ExperienceSection } from '@/components/sections/experience';
import { EducationSection } from '@/components/sections/education';
import { ProjectsSection } from '@/components/sections/projects';
import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/footer';
import { SideNav } from '@/components/side-nav';
import { ReadingTimer } from '@/components/reading-timer';
import { ParticlesBackground } from '@/components/particles';

async function getPortfolio() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const apiUrl = `${baseUrl}/api`;
  try {
    const res = await fetch(`${apiUrl}/portfolio`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return await res.json();
  } catch (error) {
    console.warn("Failed to fetch portfolio data (backend might be offline during build):", error);
    return {
      settings: null,
      summary: null,
      skillCategories: [],
      companies: [],
      projects: [],
      education: []
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getPortfolio();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ParticlesBackground />
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-warm/5 blur-[100px] animate-pulse-slow delay-500" />
      </div>

      <div className="relative z-10">
        <ReadingTimer />
        <SideNav />

        <main className="pl-0 lg:pl-24">
        <HeroSection data={data.settings} />
        <SummarySection 
          data={data.summary} 
          stats={{
            experience: data.settings?.heroStat1Value || "3+",
            categoriesCount: data.skillCategories?.length || 0,
            projectsCount: data.projects?.filter((p: any) => p.featured)?.length || 0
          }} 
        />
        <SkillsSection data={data.skillCategories} />
        <ExperienceSection data={data.companies} />
        <ProjectsSection data={data.projects} />
        <EducationSection data={data.education} />
        <ContactSection data={data.settings} />
      </main>

      <Footer data={data.settings} />
      </div>
    </div>
  );
}
