
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { auth } from '@/auth';
import { headers } from 'next/headers';
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const id = parseInt((await params).id, 10);
    await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
