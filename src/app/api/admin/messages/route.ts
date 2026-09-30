
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

import { auth } from '@/auth';
import { headers } from 'next/headers';
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
}


export async function GET() {
  try {
    await requireAuth();
    const msgs = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt));
    return NextResponse.json(msgs);
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

