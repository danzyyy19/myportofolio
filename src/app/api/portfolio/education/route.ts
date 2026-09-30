
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const education = await db.select().from(schema.education).orderBy(asc(schema.education.sortOrder));
  return NextResponse.json(education);
}
