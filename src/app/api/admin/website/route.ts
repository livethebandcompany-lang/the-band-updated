import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import HappyFace from '@/models/HappyFace';
import TrendingMoment from '@/models/TrendingMoment';
import LineupItem from '@/models/LineupItem';
import Destination from '@/models/Destination';
import BlogPost from '@/models/BlogPost';
import { seedIfEmpty } from '@/lib/dbSeed';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access. Super Admin required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    await connectDB();
    await seedIfEmpty();

    switch (type) {
      case 'team':
        const team = await TeamMember.find().sort({ order: 1 });
        return NextResponse.json(team);
      case 'happy-faces':
        const happyFaces = await HappyFace.find().sort({ order: 1 });
        return NextResponse.json(happyFaces);
      case 'trending-moments':
        const trendingMoments = await TrendingMoment.find().sort({ order: 1 });
        return NextResponse.json(trendingMoments);
      case 'lineups':
        const lineups = await LineupItem.find().sort({ order: 1 });
        return NextResponse.json(lineups);
      case 'destinations':
        const destinations = await Destination.find().sort({ order: 1 });
        return NextResponse.json(destinations);
      case 'blogs':
        const blogs = await BlogPost.find().sort({ id: -1 });
        return NextResponse.json(blogs);
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Failed in website GET API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access. Super Admin required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const body = await request.json();

    console.log(`[POST] creating item of type: ${type}`, body);

    await connectDB();

    let newItem;
    switch (type) {
      case 'team': {
        const order = (await TeamMember.countDocuments()) + 1;
        newItem = await TeamMember.create({ ...body, order });
        break;
      }
      case 'happy-faces': {
        const order = (await HappyFace.countDocuments()) + 1;
        newItem = await HappyFace.create({ ...body, order });
        break;
      }
      case 'trending-moments': {
        const count = await TrendingMoment.countDocuments();
        if (count >= 5) {
          return NextResponse.json({ error: 'Limit reached: Maximum of 5 Instagram posts allowed.' }, { status: 400 });
        }
        const order = count + 1;
        newItem = await TrendingMoment.create({ ...body, order });
        break;
      }
      case 'lineups': {
        const order = (await LineupItem.countDocuments()) + 1;
        newItem = await LineupItem.create({ ...body, order });
        break;
      }
      case 'destinations': {
        const order = (await Destination.countDocuments()) + 1;
        newItem = await Destination.create({ ...body, order });
        break;
      }
      case 'blogs': {
        // Generate a numeric id for compatibility
        const lastBlog = await BlogPost.findOne().sort({ id: -1 });
        const id = lastBlog ? lastBlog.id + 1 : 1;
        newItem = await BlogPost.create({ ...body, id });
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/blog');

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Failed in website POST API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access. Super Admin required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const { _id, ...updateData } = await request.json();

    console.log(`[PUT] updating item of type: ${type} with id: ${_id}`, updateData);

    if (!_id) {
      return NextResponse.json({ error: 'Missing ID (_id) in request body' }, { status: 400 });
    }

    await connectDB();

    let updatedItem;
    switch (type) {
      case 'team':
        updatedItem = await TeamMember.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      case 'happy-faces':
        updatedItem = await HappyFace.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      case 'trending-moments':
        updatedItem = await TrendingMoment.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      case 'lineups':
        updatedItem = await LineupItem.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      case 'destinations':
        updatedItem = await Destination.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      case 'blogs':
        updatedItem = await BlogPost.findByIdAndUpdate(_id, updateData, { new: true });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/blog');

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Failed in website PUT API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access. Super Admin required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    console.log(`[DELETE] deleting item of type: ${type} with id: ${id}`);

    if (!id) {
      return NextResponse.json({ error: 'Missing ID (id) parameter in query string' }, { status: 400 });
    }

    await connectDB();

    let deletedItem;
    switch (type) {
      case 'team':
        deletedItem = await TeamMember.findByIdAndDelete(id);
        break;
      case 'happy-faces':
        deletedItem = await HappyFace.findByIdAndDelete(id);
        break;
      case 'trending-moments':
        deletedItem = await TrendingMoment.findByIdAndDelete(id);
        break;
      case 'lineups':
        deletedItem = await LineupItem.findByIdAndDelete(id);
        break;
      case 'destinations':
        deletedItem = await Destination.findByIdAndDelete(id);
        break;
      case 'blogs':
        deletedItem = await BlogPost.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/blog');

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Failed in website DELETE API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
