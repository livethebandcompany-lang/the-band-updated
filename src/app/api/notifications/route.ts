import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

// GET /api/notifications — fetch latest 30 notifications for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing in session' }, { status: 400 });
    }

    await connectDB();
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('[Notifications GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/notifications — mark all as read for the current user
export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing in session' }, { status: 400 });
    }

    await connectDB();
    await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });

    return NextResponse.json({ message: 'All marked as read' });
  } catch (error) {
    console.error('[Notifications PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/notifications?id=xxx — delete one notification for current user
// DELETE /api/notifications?all=true — clear all for current user
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing in session' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    await connectDB();

    if (all === 'true') {
      await Notification.deleteMany({ recipientId: userId });
      return NextResponse.json({ message: 'All notifications cleared' });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Ensure user owns the notification before deleting
    await Notification.findOneAndDelete({ _id: id, recipientId: userId });
    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('[Notifications DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
