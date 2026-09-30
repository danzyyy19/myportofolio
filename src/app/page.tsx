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
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

async function getPortfolio() {
  try {
    const [settings] = await db.select().from(schema.siteSettings).limit(1);
    const [summary] = await db.select().from(schema.professionalSummary).limit(1);
    const skillCategories = await db.query.skillCategories.findMany({
      with: { skills: { orderBy: [asc(schema.skills.sortOrder)] } },
      orderBy: [asc(schema.skillCategories.sortOrder)],
    });
    const companies = await db.query.companies.findMany({
      with: {
        experiences: {
          with: { bullets: { orderBy: [asc(schema.experienceBullets.sortOrder)] } },
          orderBy: [asc(schema.experiences.sortOrder)],
        }
      },
      orderBy: [asc(schema.companies.sortOrder)],
    });
    const education = await db.select().from(schema.education).orderBy(asc(schema.education.sortOrder));
    const projects = await db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder));

    return {
      settings: settings || null,
      summary: summary || null,
      skillCategories,
      companies,
      education,
      projects,
    };
  } catch (error) {
    console.error("Failed to fetch portfolio data directly from DB:", error);
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
