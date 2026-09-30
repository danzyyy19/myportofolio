
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
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

  return NextResponse.json({
    settings: settings || null,
    summary: summary || null,
    skillCategories,
    companies,
    education,
    projects,
  });
}
