
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
    const settings = await db.select().from(schema.siteSettings).limit(1);
    if (settings.length > 0) {
      const [updated] = await db.update(schema.siteSettings).set({ ...body, updatedAt: new Date() }).where(eq(schema.siteSettings.id, settings[0].id)).returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(schema.siteSettings).values(body).returning();
      return NextResponse.json(created);
    }
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

