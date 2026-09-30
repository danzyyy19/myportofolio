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
    const userId = session.user.id;
    
    // In NestJS, AdminService.createExperience handles company, experience, and bullets.
    // Assuming the body has companyName, companyLocation, jobTitle, period, description, bullets.
    // Let's implement this logic:
    let companyId = body.companyId;
    if (body.companyName) {
      const [company] = await db.insert(schema.companies).values({
        userId,
        name: body.companyName,
        location: body.companyLocation,
      }).returning();
      companyId = company.id;
    }
    
    const [exp] = await db.insert(schema.experiences).values({
      userId,
      companyId: companyId,
      jobTitle: body.jobTitle,
      period: body.period,
      description: body.description,
      sortOrder: body.sortOrder || 0,
    }).returning();
    
    if (body.bullets && body.bullets.length > 0) {
      await db.insert(schema.experienceBullets).values(
        body.bullets.map((b: any, i: number) => ({
          experienceId: exp.id,
          content: b.content || b,
          sortOrder: i,
        }))
      );
    }
    return NextResponse.json(exp);
  } catch (e: any) { 
    console.error("Error creating experience:", e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 }); 
  }
}

