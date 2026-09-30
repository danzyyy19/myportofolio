
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function GET() {
  const [summary] = await db.select().from(schema.professionalSummary).limit(1);
  return NextResponse.json(summary || null);
}
