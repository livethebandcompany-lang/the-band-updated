'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Music, DollarSign, Calendar as CalendarIcon, Star, Edit, Save, X } from 'lucide-react';

export default function ArtistsDatabasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user && !['admin', 'subadmin'].includes(session.user.role)) {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchArtists();
    }
  }, [status, session]);

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/admin/artists/database');
      const data = await res.json();
      setArtists(data);
    } catch (error) {
      console.error('Failed to fetch artists', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artist: any) => {
    setEditingId(artist._id);
    setEditForm({
      genreStrengths: artist.genreStrengths ? artist.genreStrengths.join(', ') : '',
      baseFee: artist.baseFee || '',
      availabilityStatus: artist.availabilityStatus || 'available',
      performanceRating: artist.performanceRating || '',
      adharCardNumber: artist.adharCardNumber || '',
      jobType: artist.jobType || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const genresArray = editForm.genreStrengths
        ? editForm.genreStrengths.split(',').map((g: string) => g.trim()).filter((g: string) => g)
        : [];
        
      const payload = {
        id,
        genreStrengths: genresArray,
        baseFee: editForm.baseFee ? Number(editForm.baseFee) : null,
        availabilityStatus: editForm.availabilityStatus,
        performanceRating: editForm.performanceRating ? Number(editForm.performanceRating) : null,
        adharCardNumber: editForm.adharCardNumber,
        jobType: editForm.jobType
      };

      const res = await fetch('/api/admin/artists/database', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchArtists();
        setEditingId(null);
      } else {
        alert('Failed to update artist');
      }
    } catch (error) {
      console.error('Error saving artist:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Artist Database</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage artist genres, fees, availability, and performance ratings.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Artist Info</th>
                <th className="px-6 py-4">Job & Genres</th>
                <th className="px-6 py-4">Base Fee (₹)</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Rating & Events</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {artists.map((artist) => (
                <tr key={artist._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        {artist.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{artist.name}</p>
                        <p className="text-xs text-zinc-500">{artist.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {editingId === artist._id ? (
                    <>
                      <td className="px-6 py-4 space-y-2">
                        <input 
                          type="text" 
                          value={editForm.jobType} 
                          onChange={(e) => setEditForm({...editForm, jobType: e.target.value})}
                          placeholder="Job Type"
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-2 text-xs"
                        />
                        <input 
                          type="text" 
                          value={editForm.genreStrengths} 
                          onChange={(e) => setEditForm({...editForm, genreStrengths: e.target.value})}
                          placeholder="Pop, Rock, Jazz..."
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={editForm.baseFee} 
                          onChange={(e) => setEditForm({...editForm, baseFee: e.target.value})}
                          placeholder="e.g. 50000"
                          className="w-32 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={editForm.availabilityStatus} 
                          onChange={(e) => setEditForm({...editForm, availabilityStatus: e.target.value})}
                          className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="on_tour">On Tour</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        <input 
                          type="number" 
                          min="1" max="5" step="0.1"
                          value={editForm.performanceRating} 
                          onChange={(e) => setEditForm({...editForm, performanceRating: e.target.value})}
                          placeholder="1-5 Rating"
                          className="w-24 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                        />
                        <input 
                          type="text" 
                          value={editForm.adharCardNumber} 
                          onChange={(e) => setEditForm({...editForm, adharCardNumber: e.target.value})}
                          placeholder="Aadhaar No."
                          className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleSave(artist._id)} 
                            disabled={saving}
                            className="p-1.5 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded hover:bg-emerald-200 transition-colors"
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            onClick={handleCancel}
                            className="p-1.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 rounded hover:bg-zinc-200 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {artist.jobType && <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">{artist.jobType}</p>}
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {artist.genreStrengths && artist.genreStrengths.length > 0 ? (
                              artist.genreStrengths.map((g: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs rounded-md border border-zinc-200 dark:border-zinc-700">
                                  {g}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-400 italic text-xs">No genres set</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-300">
                        {artist.baseFee ? `₹${artist.baseFee.toLocaleString()}` : <span className="text-zinc-400 italic font-normal text-xs">Not set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          artist.availabilityStatus === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          artist.availabilityStatus === 'on_tour' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {artist.availabilityStatus?.replace('_', ' ') || 'available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className={artist.performanceRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'} />
                          <span className="font-semibold text-zinc-900 dark:text-zinc-300">
                            {artist.performanceRating || '-'}
                          </span>
                        </div>
                        {artist.adharCardNumber && (
                          <div className="text-[10px] text-zinc-500 font-mono">
                            ID: ****{artist.adharCardNumber.slice(-4)}
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-400 font-medium">
                          {artist.assignedEvents?.length || 0} Events
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEdit(artist)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {artists.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No artists found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
