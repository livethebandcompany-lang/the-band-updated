'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Image as ImageIcon, 
  Instagram, 
  MapPin, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Compass, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  type: string;
  order: number;
}

interface HappyFace {
  _id: string;
  src: string;
  title: string;
  desc: string;
  order: number;
}

interface TrendingMoment {
  _id: string;
  instagramUrl: string;
  imageUrl: string;
  order: number;
}

interface LineupItem {
  _id: string;
  name: string;
  image: string;
  description: string;
  order: number;
}

interface Destination {
  _id: string;
  name: string;
  icon: string;
  slug: string;
  order: number;
}

interface BlogPost {
  _id: string;
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  icon: string;
  imageUrl: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
      list?: string[];
    }[];
    conclusion: string;
  };
}

interface ManageWebsiteClientProps {
  initialTeam: TeamMember[];
  initialHappyFaces: HappyFace[];
  initialTrendingMoments: TrendingMoment[];
  initialLineups: LineupItem[];
  initialDestinations: Destination[];
  initialBlogs: BlogPost[];
}

export default function ManageWebsiteClient({
  initialTeam,
  initialHappyFaces,
  initialTrendingMoments,
  initialLineups,
  initialDestinations,
  initialBlogs,
}: ManageWebsiteClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'team' | 'happy-faces' | 'trending-moments' | 'lineups' | 'destinations' | 'blogs'>('team');

  // Lists State
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [happyFaces, setHappyFaces] = useState<HappyFace[]>(initialHappyFaces);
  const [trendingMoments, setTrendingMoments] = useState<TrendingMoment[]>(initialTrendingMoments);
  const [lineups, setLineups] = useState<LineupItem[]>(initialLineups);
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal / Form States
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form Fields State
  const [teamForm, setTeamForm] = useState({ name: '', role: '', image: '', type: 'performer' });
  const [happyFaceForm, setHappyFaceForm] = useState({ src: '', title: '', desc: '' });
  const [trendingMomentForm, setTrendingMomentForm] = useState({ instagramUrl: '', imageUrl: '' });
  const [lineupForm, setLineupForm] = useState({ name: '', image: '', description: '' });
  
  const [destinationForm, setDestinationForm] = useState({ name: '', icon: 'MapPin', slug: '' });
  const [selectedSlugs, setSelectedSlugs] = useState<Record<string, string>>({});
  const [blogForm, setBlogForm] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    category: 'Wedding Music',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '5 min',
    author: 'The Band Company',
    icon: 'sparkles',
    imageUrl: '',
    content: {
      intro: '',
      sections: [{ heading: '', content: '', listInput: '' }],
      conclusion: ''
    }
  });

  const resetForms = () => {
    setTeamForm({ name: '', role: '', image: '', type: 'performer' });
    setHappyFaceForm({ src: '', title: '', desc: '' });
    setTrendingMomentForm({ instagramUrl: '', imageUrl: '' });
    setLineupForm({ name: '', image: '', description: '' });
    setDestinationForm({ name: '', icon: 'MapPin', slug: '' });
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      category: 'Wedding Music',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min',
      author: 'The Band Company',
      icon: 'sparkles',
      imageUrl: '',
      content: {
        intro: '',
        sections: [{ heading: '', content: '', listInput: '' }],
        conclusion: ''
      }
    });
    setEditingItem(null);
    setActiveModal(null);
  };

  // CRUD Operation Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let body: any = {};

    if (activeTab === 'team') body = teamForm;
    else if (activeTab === 'happy-faces') body = happyFaceForm;
    else if (activeTab === 'trending-moments') {
      if (trendingMoments.length >= 5) {
        toast.error('Limit reached: Maximum of 5 Instagram posts allowed.');
        setIsSubmitting(false);
        return;
      }
      body = trendingMomentForm;
    }
    else if (activeTab === 'lineups') body = lineupForm;
    else if (activeTab === 'destinations') body = destinationForm;
    else if (activeTab === 'blogs') {
      // Process section lists from comma strings to arrays
      const processedSections = blogForm.content.sections.map((sec: any) => ({
        heading: sec.heading,
        content: sec.content,
        list: sec.listInput ? sec.listInput.split('\n').filter((l: string) => l.trim() !== '') : []
      }));
      body = {
        ...blogForm,
        content: {
          ...blogForm.content,
          sections: processedSections
        }
      };
    }

    try {
      const res = await fetch(`/api/admin/website?type=${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create item');

      toast.success('Added successfully!');
      
      // Update local state
      if (activeTab === 'team') setTeam([...team, data]);
      else if (activeTab === 'happy-faces') setHappyFaces([...happyFaces, data]);
      else if (activeTab === 'trending-moments') setTrendingMoments([...trendingMoments, data]);
      else if (activeTab === 'lineups') setLineups([...lineups, data]);
      else if (activeTab === 'destinations') setDestinations([...destinations, data]);
      else if (activeTab === 'blogs') setBlogs([data, ...blogs]);

      resetForms();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    let body: any = { _id: editingItem._id };

    if (activeTab === 'team') body = { ...body, ...teamForm };
    else if (activeTab === 'happy-faces') body = { ...body, ...happyFaceForm };
    else if (activeTab === 'trending-moments') body = { ...body, ...trendingMomentForm };
    else if (activeTab === 'lineups') body = { ...body, ...lineupForm };
    else if (activeTab === 'destinations') body = { ...body, ...destinationForm };
    else if (activeTab === 'blogs') {
      const processedSections = blogForm.content.sections.map((sec: any) => ({
        heading: sec.heading,
        content: sec.content,
        list: sec.listInput ? sec.listInput.split('\n').filter((l: string) => l.trim() !== '') : []
      }));
      body = {
        ...body,
        ...blogForm,
        content: {
          ...blogForm.content,
          sections: processedSections
        }
      };
    }

    try {
      const res = await fetch(`/api/admin/website?type=${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update item');

      toast.success('Updated successfully!');

      // Update local state
      if (activeTab === 'team') setTeam(team.map(t => t._id === data._id ? data : t));
      else if (activeTab === 'happy-faces') setHappyFaces(happyFaces.map(h => h._id === data._id ? data : h));
      else if (activeTab === 'trending-moments') setTrendingMoments(trendingMoments.map(t => t._id === data._id ? data : t));
      else if (activeTab === 'lineups') setLineups(lineups.map(l => l._id === data._id ? data : l));
      else if (activeTab === 'destinations') setDestinations(destinations.map(d => d._id === data._id ? data : d));
      else if (activeTab === 'blogs') setBlogs(blogs.map(b => b._id === data._id ? data : b));

      resetForms();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item? This action is permanent.')) return;
    
    try {
      const res = await fetch(`/api/admin/website?type=${activeTab}&id=${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');

      toast.success('Deleted successfully!');

      // Update local state
      if (activeTab === 'team') setTeam(team.filter(t => t._id !== id));
      else if (activeTab === 'happy-faces') setHappyFaces(happyFaces.filter(h => h._id !== id));
      else if (activeTab === 'trending-moments') setTrendingMoments(trendingMoments.filter(t => t._id !== id));
      else if (activeTab === 'lineups') setLineups(lineups.filter(l => l._id !== id));
      else if (activeTab === 'destinations') setDestinations(destinations.filter(d => d._id !== id));
      else if (activeTab === 'blogs') setBlogs(blogs.filter(b => b._id !== id));

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  // Open Edit Modals
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setActiveModal('edit');

    if (activeTab === 'team') {
      setTeamForm({ name: item.name, role: item.role, image: item.image, type: item.type || 'performer' });
    } else if (activeTab === 'happy-faces') {
      setHappyFaceForm({ src: item.src, title: item.title, desc: item.desc });
    } else if (activeTab === 'trending-moments') {
      setTrendingMomentForm({ instagramUrl: item.instagramUrl || '', imageUrl: item.imageUrl });
    } else if (activeTab === 'lineups') {
      setLineupForm({ name: item.name, image: item.image, description: item.description });
    } else if (activeTab === 'destinations') {
      setDestinationForm({ name: item.name, icon: item.icon, slug: item.slug || '' });
    } else if (activeTab === 'blogs') {
      // Re-map list array back to carriage-returned string for form input
      const mappedSections = item.content.sections.map((sec: any) => ({
        heading: sec.heading,
        content: sec.content,
        listInput: sec.list ? sec.list.join('\n') : ''
      }));
      setBlogForm({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        category: item.category,
        date: item.date,
        readTime: item.readTime,
        author: item.author,
        icon: item.icon,
        imageUrl: item.imageUrl,
        content: {
          intro: item.content.intro,
          sections: mappedSections,
          conclusion: item.content.conclusion
        }
      });
    }
  };

  // Manage Blog Sections Dynamic Fields
  const addBlogSection = () => {
    setBlogForm({
      ...blogForm,
      content: {
        ...blogForm.content,
        sections: [...blogForm.content.sections, { heading: '', content: '', listInput: '' }]
      }
    });
  };

  const removeBlogSection = (index: number) => {
    if (blogForm.content.sections.length <= 1) {
      toast.error('A blog post must have at least one section');
      return;
    }
    const filtered = blogForm.content.sections.filter((_: any, i: number) => i !== index);
    setBlogForm({
      ...blogForm,
      content: { ...blogForm.content, sections: filtered }
    });
  };

  const updateBlogSectionField = (index: number, field: string, value: string) => {
    const updatedSections = blogForm.content.sections.map((sec: any, i: number) => {
      if (i === index) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    setBlogForm({
      ...blogForm,
      content: { ...blogForm.content, sections: updatedSections }
    });
  };

  // Auto connect destinations to blog slugs
  const updateDestinationSlug = (destId: string, slug: string) => {
    const dest = destinations.find(d => d._id === destId);
    if (!dest) return;
    
    // Send PUT request to connect
    fetch(`/api/admin/website?type=destinations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: destId, name: dest.name, icon: dest.icon, slug })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        toast.success(`Destination linked to blog: ${slug}`);
        setDestinations(destinations.map(d => d._id === destId ? data : d));
        setSelectedSlugs(prev => {
          const next = { ...prev };
          delete next[destId];
          return next;
        });
        router.refresh();
      })
      .catch(err => {
        toast.error(err.message || 'Linking failed');
      });
  };

  // Tabs layout mappings
  const tabs = [
    { id: 'team', label: 'Our Team', icon: Users },
    { id: 'happy-faces', label: 'Happy Faces', icon: ImageIcon },
    { id: 'trending-moments', label: 'Trending Moments', icon: Instagram },
    { id: 'lineups', label: 'Line-ups', icon: Sparkles },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'blogs', label: 'Blogs Manager', icon: BookOpen },
  ] as const;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Manage Website</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Super Admin Central CMS Settings</p>
        </div>
        
        {activeTab !== 'destinations' && (
          <button 
            onClick={() => {
              resetForms();
              setActiveModal('add');
            }}
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] self-start sm:self-auto"
          >
            <Plus size={16} />
            Add New Item
          </button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-zinc-800 overflow-x-auto no-scrollbar gap-1 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                resetForms();
              }}
              className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT TABS */}
      <div className="bg-[#09090b] border border-zinc-850 rounded-2xl p-6 md:p-8">
        
        {/* TAB 1: OUR TEAM */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Team Roster (Our Team Section)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member._id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-800 transition-all flex gap-4">
                  <div className="w-20 h-24 relative rounded-lg overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-white text-base truncate">{member.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium mt-1 truncate">{member.role}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        {member.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-900">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {team.length === 0 && (
                <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-xl italic">
                  No team members added.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HAPPY FACES */}
        {activeTab === 'happy-faces' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Happy Faces Gallery Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {happyFaces.map((img) => (
                <div key={img._id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden group hover:border-zinc-800 transition-all flex flex-col h-[320px]">
                  <div className="h-44 relative bg-zinc-900 overflow-hidden border-b border-zinc-900">
                    <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base truncate">{img.title}</h4>
                      <p className="text-xs text-zinc-400 font-normal mt-1.5 line-clamp-2 leading-relaxed">{img.desc}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-900">
                      <button 
                        onClick={() => openEditModal(img)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(img._id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {happyFaces.length === 0 && (
                <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-xl italic">
                  No images added in gallery.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TRENDING MOMENTS */}
        {activeTab === 'trending-moments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Trending Moments (Instagram Slider)</h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                  Post slots filled: <span className="text-yellow-500 font-bold">{trendingMoments.length}/5 slots</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMoments.map((moment) => (
                <div key={moment._id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden group hover:border-zinc-800 transition-all flex flex-col h-[320px]">
                  <div className="h-48 relative bg-zinc-900 overflow-hidden border-b border-zinc-900">
                    <img src={moment.imageUrl} alt="Instagram Post" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase text-yellow-500 tracking-wider">
                      <Instagram size={12} /> Live Reel
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Instagram URL</p>
                      <a href={moment.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 font-medium hover:underline truncate block mt-1">
                        {moment.instagramUrl || 'No Link Added'}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-900">
                      <button 
                        onClick={() => openEditModal(moment)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(moment._id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {trendingMoments.length === 0 && (
                <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-xl italic">
                  No Instagram moments added. Safe fallback message will be displayed on the website.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: LINE-UPS */}
        {activeTab === 'lineups' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Our Line-ups Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lineups.map((lineup) => (
                <div key={lineup._id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden group hover:border-zinc-800 transition-all flex flex-col h-[300px]">
                  <div className="h-40 relative bg-zinc-900 overflow-hidden border-b border-zinc-900 flex justify-center items-center">
                    <img src={lineup.image} alt={lineup.name} className="w-32 h-32 rounded-full border-2 border-zinc-800 object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base truncate">{lineup.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium mt-1 truncate">{lineup.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-900">
                      <button 
                        onClick={() => openEditModal(lineup)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(lineup._id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {lineups.length === 0 && (
                <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-xl italic">
                  No lineup bands added.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Destinations Connections</h3>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Select a blog post to connect/link to each destination card</p>
            </div>
            
            <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                    <th className="p-4">Destination</th>
                    <th className="p-4">Icon Type</th>
                    <th className="p-4">Linked Blog Slug</th>
                    <th className="p-4">Connect / Update Connection</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-sm">
                      <td className="p-4 font-bold text-white">{dest.name}</td>
                      <td className="p-4 text-zinc-400 font-mono text-xs">{dest.icon}</td>
                      <td className="p-4">
                        {dest.slug ? (
                          <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold">
                            {dest.slug}
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-xs italic">Unlinked</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedSlugs[dest._id] !== undefined ? selectedSlugs[dest._id] : (dest.slug || '')}
                            onChange={(e) => setSelectedSlugs({ ...selectedSlugs, [dest._id]: e.target.value })}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-white px-3 py-2 outline-none focus:border-yellow-500 transition-all max-w-[200px]"
                          >
                            <option value="">-- Select Blog Post --</option>
                            {blogs.map((blog) => (
                              <option key={blog._id} value={blog.slug}>
                                {blog.title}
                              </option>
                            ))}
                          </select>

                          {(selectedSlugs[dest._id] !== undefined && selectedSlugs[dest._id] !== (dest.slug || '')) && (
                            <button
                              onClick={() => updateDestinationSlug(dest._id, selectedSlugs[dest._id])}
                              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-md shrink-0 cursor-pointer"
                            >
                              <Save size={12} /> Save
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: BLOGS MANAGER */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Blog Posts Archives</h3>
            <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-500 font-black text-[10px] uppercase tracking-widest">
                    <th className="p-4">Blog Info</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-sm">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={blog.imageUrl} alt={blog.title} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-zinc-900" />
                          <div>
                            <p className="font-bold text-white max-w-sm truncate">{blog.title}</p>
                            <p className="text-xs text-zinc-500 mt-1">{blog.date} • {blog.readTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-zinc-400">{blog.slug}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(blog)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white p-2 rounded-lg transition-colors border border-zinc-800"
                            title="Edit Blog"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors border border-red-500/20"
                            title="Delete Blog"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {blogs.length === 0 && (
                <div className="py-16 text-center text-zinc-500 italic">
                  No blogs created yet.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CRUD MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl w-full max-w-2xl overflow-hidden my-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase">
                  {activeModal === 'add' ? 'Add New' : 'Edit'} {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Please fill in details below</p>
              </div>
              <button 
                onClick={resetForms}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={activeModal === 'add' ? handleCreate : handleUpdate} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* TEAM FIELDS */}
              {activeTab === 'team' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                      <input 
                        type="text" required
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="Samad"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                      <input 
                        type="text" required
                        value={teamForm.role}
                        onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="Founder & Vocalist"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="text" required
                      value={teamForm.image}
                      onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type Category</label>
                    <input 
                      type="text" required
                      value={teamForm.type}
                      onChange={(e) => setTeamForm({ ...teamForm, type: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="e.g. founder, performer, core"
                    />
                  </div>
                </div>
              )}

              {/* HAPPY FACE FIELDS */}
              {activeTab === 'happy-faces' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="text" required
                      value={happyFaceForm.src}
                      onChange={(e) => setHappyFaceForm({ ...happyFaceForm, src: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                    <input 
                      type="text" required
                      value={happyFaceForm.title}
                      onChange={(e) => setHappyFaceForm({ ...happyFaceForm, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="Joyful Rhythms"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                    <textarea 
                      required rows={3}
                      value={happyFaceForm.desc}
                      onChange={(e) => setHappyFaceForm({ ...happyFaceForm, desc: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="Capturing the beat of the night..."
                    />
                  </div>
                </div>
              )}

              {/* TRENDING MOMENT FIELDS */}
              {activeTab === 'trending-moments' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Image URL (Representing the Reel)</label>
                    <input 
                      type="text" required
                      value={trendingMomentForm.imageUrl}
                      onChange={(e) => setTrendingMomentForm({ ...trendingMomentForm, imageUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Instagram URL (Link to Reel)</label>
                    <input 
                      type="text" required
                      value={trendingMomentForm.instagramUrl}
                      onChange={(e) => setTrendingMomentForm({ ...trendingMomentForm, instagramUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://www.instagram.com/reel/..."
                    />
                  </div>
                </div>
              )}

              {/* LINEUPS FIELDS */}
              {activeTab === 'lineups' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Line-up Name</label>
                    <input 
                      type="text" required
                      value={lineupForm.name}
                      onChange={(e) => setLineupForm({ ...lineupForm, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="3-Piece Band"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="text" required
                      value={lineupForm.image}
                      onChange={(e) => setLineupForm({ ...lineupForm, image: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Band Description</label>
                    <input 
                      type="text" required
                      value={lineupForm.description}
                      onChange={(e) => setLineupForm({ ...lineupForm, description: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="Vocal with Guitar + Clapbox + Keyboard"
                    />
                  </div>
                </div>
              )}

              {/* BLOG FORM - DYNAMIC AND DETAILED */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blog Title</label>
                      <input 
                        type="text" required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="Live Music Guide Lonavala"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blog Slug (URL-friendly)</label>
                      <input 
                        type="text" required
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono"
                        placeholder="live-music-lonavala-guide"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                      <input 
                        type="text" required
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="Wedding Music"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Read Time</label>
                      <input 
                        type="text" required
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="5 min"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lucide Icon</label>
                      <input 
                        type="text" required
                        value={blogForm.icon}
                        onChange={(e) => setBlogForm({ ...blogForm, icon: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                        placeholder="sparkles"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Featured Image URL</label>
                    <input 
                      type="text" required
                      value={blogForm.imageUrl}
                      onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all font-mono text-xs"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blog Excerpt (Snippet)</label>
                    <textarea 
                      required rows={2}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                      placeholder="Discover the best musical ideas..."
                    />
                  </div>

                  {/* Dynamic Content Sections */}
                  <div className="space-y-4 border-t border-zinc-900 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Blog Content Sections</h4>
                      <button
                        type="button"
                        onClick={addBlogSection}
                        className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-yellow-500/20 transition-all"
                      >
                        <Plus size={10} /> Add Section
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Intro Content</label>
                        <textarea 
                          required rows={3}
                          value={blogForm.content.intro}
                          onChange={(e) => setBlogForm({ ...blogForm, content: { ...blogForm.content, intro: e.target.value } })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                          placeholder="A Sangeet night is the heartbeat..."
                        />
                      </div>

                      {blogForm.content.sections.map((sec: any, idx: number) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeBlogSection(idx)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Section #{idx + 1}</p>
                          
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Section Heading</label>
                            <input 
                              type="text" required
                              value={sec.heading}
                              onChange={(e) => updateBlogSectionField(idx, 'heading', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-yellow-500 transition-all"
                              placeholder="1. Grand Musical Opening"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Section Content</label>
                            <textarea 
                              required rows={3}
                              value={sec.content}
                              onChange={(e) => updateBlogSectionField(idx, 'content', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-yellow-500 transition-all"
                              placeholder="The opening sets the tone..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Bullets (Optional, separate with newlines)</label>
                            <textarea 
                              rows={2}
                              value={sec.listInput}
                              onChange={(e) => updateBlogSectionField(idx, 'listInput', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-yellow-500 transition-all font-mono"
                              placeholder="Interactive segment&#10;Emotional highlight"
                            />
                          </div>
                        </div>
                      ))}

                      <div className="space-y-2 border-t border-zinc-900 pt-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Conclusion Content</label>
                        <textarea 
                          required rows={3}
                          value={blogForm.content.conclusion}
                          onChange={(e) => setBlogForm({ ...blogForm, content: { ...blogForm.content, conclusion: e.target.value } })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500 transition-all"
                          placeholder="A celebration without live music feels..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="border-t border-zinc-850 pt-6 flex items-center justify-end gap-3 bg-zinc-950">
                <button 
                  type="button" 
                  onClick={resetForms}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
