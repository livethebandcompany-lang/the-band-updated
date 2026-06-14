import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { redirect } from 'next/navigation';
import TeamMember from '@/models/TeamMember';
import HappyFace from '@/models/HappyFace';
import TrendingMoment from '@/models/TrendingMoment';
import LineupItem from '@/models/LineupItem';
import Destination from '@/models/Destination';
import BlogPost from '@/models/BlogPost';
import { seedIfEmpty } from '@/lib/dbSeed';
import ManageWebsiteClient from '@/components/admin/ManageWebsiteClient';

export default async function ManageWebsitePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/admin');

  await connectDB();
  await seedIfEmpty();

  const [team, happyFaces, trendingMoments, lineups, destinations, blogs] = await Promise.all([
    TeamMember.find().sort({ order: 1 }),
    HappyFace.find().sort({ order: 1 }),
    TrendingMoment.find().sort({ order: 1 }),
    LineupItem.find().sort({ order: 1 }),
    Destination.find().sort({ order: 1 }),
    BlogPost.find().sort({ id: -1 })
  ]);

  const plainTeam = team.map(doc => ({
    _id: doc._id.toString(),
    name: doc.name,
    role: doc.role,
    image: doc.image,
    type: doc.type,
    order: doc.order
  }));

  const plainHappyFaces = happyFaces.map(doc => ({
    _id: doc._id.toString(),
    src: doc.src,
    title: doc.title,
    desc: doc.desc,
    order: doc.order
  }));

  const plainTrendingMoments = trendingMoments.map(doc => ({
    _id: doc._id.toString(),
    instagramUrl: doc.instagramUrl || '',
    imageUrl: doc.imageUrl,
    order: doc.order
  }));

  const plainLineups = lineups.map(doc => ({
    _id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    description: doc.description,
    order: doc.order
  }));

  const plainDestinations = destinations.map(doc => ({
    _id: doc._id.toString(),
    name: doc.name,
    icon: doc.icon,
    slug: doc.slug,
    order: doc.order
  }));

  const plainBlogs = blogs.map(doc => ({
    _id: doc._id.toString(),
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    date: doc.date,
    readTime: doc.readTime,
    author: doc.author,
    icon: doc.icon,
    imageUrl: doc.imageUrl,
    content: doc.content
  }));

  return (
    <ManageWebsiteClient
      initialTeam={plainTeam}
      initialHappyFaces={plainHappyFaces}
      initialTrendingMoments={plainTrendingMoments}
      initialLineups={plainLineups}
      initialDestinations={plainDestinations}
      initialBlogs={plainBlogs}
    />
  );
}
