import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Database, Pathology } from '@/types';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

async function getDb(): Promise<Database> {
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(fileContent);
}

async function saveDb(db: Database) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export async function GET({ params }: { params: { id: string } }) {
    const db = await getDb();
    const pathology = db.pathologies.find(p => p.id === params.id);
    if (!pathology) return NextResponse.json({ message: 'Non trouvé' }, { status: 404 });
    return NextResponse.json(pathology);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedData: Partial<Pathology> = await request.json();
  const db = await getDb();
  const index = db.pathologies.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ message: 'Non trouvé' }, { status: 404 });
  db.pathologies[index] = { ...db.pathologies[index], ...updatedData } as Pathology;
  await saveDb(db);
  return NextResponse.json(db.pathologies[index]);
}

export async function DELETE({ params }: { params: { id: string } }) {
  const db = await getDb();
  const initialLength = db.pathologies.length;
  db.pathologies = db.pathologies.filter(p => p.id !== params.id);
  if (db.pathologies.length === initialLength) {
    return NextResponse.json({ message: 'Non trouvé' }, { status: 404 });
  }
  await saveDb(db);
  return new NextResponse(null, { status: 204 });
}
