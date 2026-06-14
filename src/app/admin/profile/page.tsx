'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { BiUser, BiCamera, BiSave, BiLoaderAlt, BiTrash } from 'react-icons/bi';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        image: session.user.image || '',
      });
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update next-auth session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: formData.image,
        },
      });

      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-zinc-500 font-medium tracking-wide">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Avatar & Role */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  <BiUser size={64} className="text-zinc-600" />
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="absolute -bottom-2 -right-2 flex gap-1">
                {formData.image && (
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <BiTrash size={18} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-yellow-500 text-black p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <BiCamera size={18} />
                </button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{session.user.name}</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
               {session.user.role}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
             <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Account Security</h4>
             <p className="text-xs text-zinc-400 mb-4">Your account is secured with role-based access control.</p>
             <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                   <span className="text-zinc-500 font-medium">Email:</span>
                   <span className="text-zinc-300 truncate ml-2">{session.user.email}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Account Email</label>
                <input
                  type="email"
                  disabled
                  value={session.user.email || ''}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-500 cursor-not-allowed focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 italic ml-1">Email cannot be changed (managed by Admin).</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <p className="text-[10px] text-zinc-500 italic">* Some information is managed by Super Admins.</p>
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50"
              >
                {loading ? <BiLoaderAlt className="animate-spin" size={18} /> : <BiSave size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
