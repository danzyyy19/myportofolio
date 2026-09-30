
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } , and } from 'drizzle-orm';

import { auth } from '@/auth';
import { headers } from 'next/headers';
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const id = parseInt((await params).id, 10);
    const [updated] = await db.update(schema.contactMessages).set({ isRead: true }).where(and(eq(schema.contactMessages.id, id), eq(schema.contactMessages.id.replace(".id", ".userId"), session.user.id))).returning();
    return NextResponse.json(updated);
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
