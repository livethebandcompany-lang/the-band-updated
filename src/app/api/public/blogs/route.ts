import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { seedIfEmpty } from '@/lib/dbSeed';

export async function GET() {
  try {
    await connectDB();
    await seedIfEmpty();

    const blogs = await BlogPost.find().sort({ id: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch public blogs:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
