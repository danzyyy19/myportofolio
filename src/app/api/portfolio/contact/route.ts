
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [msg] = await db.insert(schema.contactMessages).values({
      name: body.name,
      email: body.email,
      message: body.message,
    }).returning();
    return NextResponse.json(msg);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
