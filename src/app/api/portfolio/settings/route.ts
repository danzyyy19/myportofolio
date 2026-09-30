
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function GET() {
  const [settings] = await db.select().from(schema.siteSettings).limit(1);
  return NextResponse.json(settings || null);
}
