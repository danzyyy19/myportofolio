
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

import { auth } from '@/auth';
import { headers } from 'next/headers';
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
}


export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const [created] = await db.insert(schema.education).values(body).returning();
    return NextResponse.json(created);
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

