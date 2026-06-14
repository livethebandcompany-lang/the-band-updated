import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Booking from '@/models/Booking';
import { Users, UserPlus, Shield, Star, Phone, Mail, MoreHorizontal, ExternalLink } from 'lucide-react';
import Link from 'next/link';

async function getArtistsData() {
  await connectDB();
  const artists = await User.find({ role: 'artist' }).sort({ createdAt: -1 }).lean();
  
  // Get booking counts for each artist
  const bookings = await Booking.aggregate([
    { $match: { artistId: { $exists: true } } },
    { $group: { _id: '$artistId', count: { $sum: 1 } } }
  ]);

  const bookingMap = Object.fromEntries(bookings.map(b => [b._id.toString(), b.count]));

  return artists.map(a => ({
    ...a,
    _id: a._id.toString(),
    totalBookings: bookingMap[a._id.toString()] || 0
  }));
}

export default async function ArtistManagementPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const artists = await getArtistsData();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            Artist Registry
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Managing talent assets and performance rosters
          </p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-yellow-500 rounded-3xl text-[10px] font-black uppercase tracking-widest text-black hover:scale-105 transition-all shadow-xl shadow-yellow-500/10">
          <UserPlus size={18} />
          Onboard New Talent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {artists.map((artist: any) => (
          <div key={artist._id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 group hover:border-zinc-700/50 transition-all relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full transition-all group-hover:opacity-20 ${artist.isActive ? 'bg-yellow-500' : 'bg-zinc-500'}`} />
            
            <div className="flex items-start justify-between mb-8 relative">
               <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-zinc-800 p-1 group-hover:bg-yellow-500/50 transition-colors">
                     <div className="w-full h-full rounded-[1.2rem] bg-zinc-950 flex items-center justify-center overflow-hidden">
                        {artist.image ? (
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-black text-zinc-700 group-hover:text-yellow-500 transition-colors">{artist.name.charAt(0)}</span>
                        )}
                     </div>
                  </div>
                  {artist.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-[#09090b]" />
                  )}
               </div>
               <button className="p-2.5 bg-zinc-800/50 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
               </button>
            </div>

            <div className="mb-8 relative">
               <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tight">{artist.name}</h3>
               <div className="flex items-center gap-2 mt-1.5">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Master Artist</span>
                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-800 mx-1" />
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{artist.totalBookings} Shows</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 group-hover:border-zinc-700 transition-all">
                  <Phone size={14} className="text-zinc-500 mb-2" />
                  <p className="text-[10px] font-black text-white truncate">Connect</p>
               </div>
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 group-hover:border-zinc-700 transition-all">
                  <Mail size={14} className="text-zinc-500 mb-2" />
                  <p className="text-[10px] font-black text-white truncate">Message</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
               <div className="flex items-center gap-2">
                  <Shield size={14} className={artist.isActive ? 'text-green-500' : 'text-zinc-600'} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${artist.isActive ? 'text-green-500' : 'text-zinc-600'}`}>
                     {artist.isActive ? 'Operational' : 'Inactive'}
                  </span>
               </div>
               <Link href={`/admin/artists/${artist._id}`} className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-yellow-500 transition-colors">
                  System Profile <ExternalLink size={12} />
               </Link>
            </div>
          </div>
        ))}

        {/* Empty State / Add Talent Placeholder */}
        <div className="bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-all cursor-pointer group">
           <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserPlus className="text-zinc-500 group-hover:text-yellow-500 transition-colors" />
           </div>
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Onboard Talent</p>
        </div>
      </div>
    </div>
  );
}
