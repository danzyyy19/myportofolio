
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


export async function PUT(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const summary = await db.select().from(schema.professionalSummary).limit(1);
    if (summary.length > 0) {
      const [updated] = await db.update(schema.professionalSummary).set({ content: body.content, updatedAt: new Date() }).where(eq(schema.professionalSummary.id, summary[0].id)).returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(schema.professionalSummary).values(body).returning();
      return NextResponse.json(created);
    }
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

