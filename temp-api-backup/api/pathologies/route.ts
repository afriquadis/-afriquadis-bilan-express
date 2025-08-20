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

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.pathologies);
}

export async function POST(request: Request) {
  const newPathology: Omit<Pathology, 'id'> = await request.json();
  const db = await getDb();
  const newId = `P${String(Date.now()).slice(-4)}`; // ID plus robuste
  const pathologyToAdd: Pathology = { id: newId, ...newPathology };
  db.pathologies.push(pathologyToAdd);
  await saveDb(db);
  return NextResponse.json(pathologyToAdd, { status: 201 });
}
