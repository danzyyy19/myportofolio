
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
    
    // In NestJS, AdminService.createExperience handles company, experience, and bullets.
    // Assuming the body has companyName, companyLocation, jobTitle, period, description, bullets.
    // Let's implement this logic:
    let companyId = body.companyId;
    if (body.companyName) {
      const [company] = await db.insert(schema.companies).values({
        name: body.companyName,
        location: body.companyLocation,
      }).returning();
      companyId = company.id;
    }
    
    const [exp] = await db.insert(schema.experiences).values({
      companyId: companyId,
      jobTitle: body.jobTitle,
      period: body.period,
      description: body.description,
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
  } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

