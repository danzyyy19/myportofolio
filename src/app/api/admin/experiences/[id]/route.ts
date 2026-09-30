
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


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const id = parseInt((await params).id, 10);
    const body = await req.json();
    
    // Update experience
    const [updated] = await db.update(schema.experiences).set({
      jobTitle: body.jobTitle,
      period: body.period,
      description: body.description,
      companyId: body.companyId,
    }).where(eq(schema.experiences.id, id)).returning();
    
    if (body.bullets) {
      await db.delete(schema.experienceBullets).where(eq(schema.experienceBullets.experienceId, id));
      if (body.bullets.length > 0) {
        await db.insert(schema.experienceBullets).values(
          body.bullets.map((b: any, i: number) => ({
            experienceId: id,
            content: b.content || b,
            sortOrder: i,
          }))
        );
      }
    }
    
    return NextResponse.json(updated);
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const id = parseInt((await params).id, 10);
    await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}
