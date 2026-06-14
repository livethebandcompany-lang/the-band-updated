import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import HappyFace from '@/models/HappyFace';
import TrendingMoment from '@/models/TrendingMoment';
import LineupItem from '@/models/LineupItem';
import Destination from '@/models/Destination';
import BlogPost from '@/models/BlogPost';

import { defaultTeam, defaultHappyFaces, defaultTrendingMoments, defaultLineups, defaultDestinations } from '@/data/seedData';
import { blogPosts } from '@/data/blogData';

let isSeededChecked = false;

export async function seedIfEmpty() {
  if (isSeededChecked) return;

  await connectDB();

  // Run all counts in parallel to minimize roundtrips
  const [
    teamCount,
    happyCount,
    trendingCount,
    lineupsCount,
    destCount,
    blogCount
  ] = await Promise.all([
    TeamMember.countDocuments(),
    HappyFace.countDocuments(),
    TrendingMoment.countDocuments(),
    LineupItem.countDocuments(),
    Destination.countDocuments(),
    BlogPost.countDocuments()
  ]);

  const seedPromises = [];

  // 1. Team
  if (teamCount === 0) {
    console.log('Seeding team members...');
    seedPromises.push(TeamMember.insertMany(defaultTeam));
  }

  // 2. Happy Faces
  if (happyCount === 0) {
    console.log('Seeding happy faces...');
    seedPromises.push(HappyFace.insertMany(defaultHappyFaces));
  }

  // 3. Trending Moments
  if (trendingCount === 0) {
    console.log('Seeding trending moments...');
    seedPromises.push(TrendingMoment.insertMany(defaultTrendingMoments));
  }

  // 4. Lineups
  if (lineupsCount === 0) {
    console.log('Seeding lineups...');
    seedPromises.push(LineupItem.insertMany(defaultLineups));
  }

  // 5. Destinations
  if (destCount === 0) {
    console.log('Seeding destinations...');
    seedPromises.push(Destination.insertMany(defaultDestinations));
  }

  // 6. Blogs
  if (blogCount === 0) {
    console.log('Seeding blog posts...');
    seedPromises.push(BlogPost.insertMany(blogPosts));
  }

  if (seedPromises.length > 0) {
    await Promise.all(seedPromises);
  }

  isSeededChecked = true;
}
