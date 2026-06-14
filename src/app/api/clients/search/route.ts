import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { PipelineStage } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { clientName: { $regex: query, $options: 'i' } },
            { clientPhone: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $sort: { eventDate: -1 }
      },
      {
        $group: {
          _id: "$clientPhone",
          clientName: { $first: "$clientName" },
          clientPhone: { $first: "$clientPhone" },
          clientEmail: { $first: "$clientEmail" },
          clientAltPhone: { $first: "$clientAltPhone" },
          clientInstagram: { $first: "$clientInstagram" },
          companyName: { $first: "$companyName" },
          billingName: { $first: "$billingName" },
          city: { $first: "$city" },
          fullAddress: { $first: "$fullAddress" },
          visitCount: { $sum: 1 }
        }
      },
      {
        $limit: 10
      }
    ];

    const results = await Booking.aggregate(pipeline);
    return NextResponse.json(results);

  } catch (error) {
    console.error('Client search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
