import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { OrderItem } from '@/types';

function getUserId(session: any): string | null {
  const email = session?.user?.id || session?.user?.email;
  return (email as string) || null;
}

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { items: OrderItem[]; total?: number; status?: string; trackingCode?: string } | null;
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const created = await prisma.order.create({
    data: {
      userId,
      total: body.total ?? null,
      status: body.status || 'pending',
      trackingCode: body.trackingCode ?? `AFQ-${Math.floor(100000 + Math.random()*900000)}`,
      items: { create: body.items.map(it => ({ productId: it.productId, name: it.name, quantity: it.quantity, price: it.price ?? null })) }
    },
    include: { items: true }
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = getUserId(session as any);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { id: string; status?: string } | null;
  if (!body?.id) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const found = await prisma.order.findFirst({ where: { id: body.id, userId } });
  if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = await prisma.order.update({ where: { id: body.id }, data: { status: body.status || found.status } });
  return NextResponse.json(updated);
}


