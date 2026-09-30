
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  const projects = await db.select().from(schema.projects).where(eq(schema.projects.featured, true)).orderBy(asc(schema.projects.sortOrder));
  return NextResponse.json(projects);
}
