import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // 1. Monthly Revenue Growth (Last 12 Months)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { 
          status: { $in: ['confirmed', 'completed'] }, 
          archived: false,
          eventDate: { $gte: oneYearAgo }
      } },
      { $group: {
          _id: { year: { $year: '$eventDate' }, month: { $month: '$eventDate' } },
          revenue: { $sum: '$totalAmount' }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format for chart: [ { month: 'Jan', revenue: 500000 }, ... ]
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue
    }));

    // Best Conversion Month
    const bestMonth = formattedMonthlyRevenue.reduce((max, current) => 
      (current.revenue > max.revenue ? current : max), { month: 'N/A', revenue: 0 });

    // 2. Top Lead Source
    const topSources = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] }, archived: false } },
      { $group: { _id: '$source', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 3. Most Profitable Event Type
    const topEventTypes = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] }, archived: false } },
      { $group: { _id: '$eventType', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 4. Highest ROI Ads (Group by Meta/Google source)
    const adSources = await Booking.aggregate([
      { $match: { source: { $in: ['meta_ad', 'google_ad'] }, status: { $in: ['confirmed', 'completed'] }, archived: false } },
      { $group: { _id: '$source', revenueGenerated: { $sum: '$totalAmount' }, leadsConverted: { $sum: 1 } } }
    ]);

    // 5. Repeat Customer %
    const totalBookingsCount = await Booking.countDocuments({ status: { $in: ['confirmed', 'completed'] }, archived: false });
    const repeatBookingsCount = await Booking.countDocuments({ source: 'repeat_client', status: { $in: ['confirmed', 'completed'] }, archived: false });
    const repeatCustomerPercentage = totalBookingsCount > 0 ? ((repeatBookingsCount / totalBookingsCount) * 100).toFixed(1) : 0;

    // 6. Artist Profitability
    const artistProfitability = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] }, archived: false, artistId: { $exists: true, $ne: null } } },
      { $lookup: { from: 'users', localField: 'artistId', foreignField: '_id', as: 'artist' } },
      { $unwind: { path: '$artist', preserveNullAndEmptyArrays: true } },
      { $group: { 
          _id: '$artistId', 
          artistName: { $first: '$artist.name' },
          baseFee: { $first: '$artist.baseFee' },
          revenueGenerated: { $sum: '$totalAmount' },
          performances: { $sum: 1 }
      } },
      { $project: {
          artistName: 1,
          revenueGenerated: 1,
          performances: 1,
          estimatedProfit: { 
            $subtract: [
              '$revenueGenerated', 
              { $multiply: [{ $ifNull: ['$baseFee', 0] }, '$performances'] }
            ] 
          },
          _id: 0
      }},
      { $sort: { estimatedProfit: -1 } }
    ]);

    return NextResponse.json({
      monthlyRevenue: formattedMonthlyRevenue,
      bestMonth,
      topSources: topSources.map(s => ({ source: s._id, revenue: s.revenue, count: s.count })),
      topEventTypes: topEventTypes.map(e => ({ type: e._id, revenue: e.revenue, count: e.count })),
      adSources: adSources.map(a => ({ adPlatform: a._id, revenue: a.revenueGenerated, leads: a.leadsConverted })),
      repeatCustomerPercentage,
      artistProfitability
    });
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
  }
}
