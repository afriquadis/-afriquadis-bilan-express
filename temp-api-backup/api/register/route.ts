import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { email?: string; password?: string; name?: string; phone?: string } | null;
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

  const created = await prisma.user.create({
    data: {
      email,
      name: body.name || email.split('@')[0],
      phone: body.phone || null,
      passwordHash: hashPassword(body.password),
    }
  });
  return NextResponse.json({ id: created.id, email: created.email }, { status: 201 });
}


