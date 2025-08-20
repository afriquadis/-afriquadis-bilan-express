import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

function getUserId(session: any): string | null {
  return (session?.user?.email as string | undefined) || null;
}

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const messages = await prisma.message.findMany({ where: { userId }, orderBy: { timestamp: 'asc' } });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { content: string } | null;
  if (!body?.content) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const msg = await prisma.message.create({ data: { userId, from: 'patient', content: body.content, timestamp: new Date() } });
  return NextResponse.json(msg, { status: 201 });
}


