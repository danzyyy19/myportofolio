import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { headers } from 'next/headers';

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userProfile = await db.query.user.findFirst({
      where: eq(schema.user.id, session.user.id),
      columns: { id: true, name: true, email: true, username: true }
    });
    return NextResponse.json(userProfile);
  } catch (e) { 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    
    // Validasi username
    if (body.username) {
        // Cek jika username sudah ada dan bukan milik user ini
        const existing = await db.query.user.findFirst({
            where: eq(schema.user.username, body.username)
        });
        if (existing && existing.id !== session.user.id) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }
    }

    const [updated] = await db.update(schema.user)
      .set({ 
          username: body.username,
          name: body.name 
      })
      .where(eq(schema.user.id, session.user.id))
      .returning();
      
    return NextResponse.json(updated);
  } catch (e) { 
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 }); 
  }
}
