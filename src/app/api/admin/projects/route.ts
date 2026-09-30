import { eq } from 'drizzle-orm';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

import { auth } from '@/auth';
import { headers } from 'next/headers';
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}


export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    body.userId = session.user.id;
    const [created] = await db.insert(schema.projects).values(body).returning();
    return NextResponse.json(created);
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

