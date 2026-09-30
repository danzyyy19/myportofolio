
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const companies = await db.query.companies.findMany({
    with: {
      experiences: {
        with: { bullets: { orderBy: [asc(schema.experienceBullets.sortOrder)] } },
        orderBy: [asc(schema.experiences.sortOrder)],
      }
    },
    orderBy: [asc(schema.companies.sortOrder)],
  });
  return NextResponse.json(companies);
}
