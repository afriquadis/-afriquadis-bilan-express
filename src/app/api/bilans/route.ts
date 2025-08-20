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
  const data = await prisma.bilan.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as any;
  if (!body) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const created = await prisma.bilan.create({
    data: {
      userId,
      diagnosticSessionId: body.diagnosticSessionId || `session-${Date.now()}`,
      pathologyId: body.pathologyId || 'unknown',
      productKitId: body.productKitId ?? null,
      followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      completed: typeof body.completed === 'boolean' ? body.completed : true,
      notes: body.notes ?? null,
    }
  });
  return NextResponse.json(created, { status: 201 });
}


