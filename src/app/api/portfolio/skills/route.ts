
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const categories = await db.query.skillCategories.findMany({
    with: { skills: { orderBy: [asc(schema.skills.sortOrder)] } },
    orderBy: [asc(schema.skillCategories.sortOrder)],
  });
  return NextResponse.json(categories);
}
