import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { seedIfEmpty } from '@/lib/dbSeed';

export async function GET() {
  try {
    await connectDB();
    await seedIfEmpty();

    const team = await TeamMember.find().sort({ order: 1 });
    return NextResponse.json({ team }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch public team:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
