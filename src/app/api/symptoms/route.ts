import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

async function getDb() {
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(fileContent);
}

// GET: Récupérer tous les symptômes
export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json(db.symptoms);
  } catch (error) {
    return NextResponse.json({ message: 'Erreur' }, { status: 500 });
  }
}
