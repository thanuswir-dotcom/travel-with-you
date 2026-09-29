import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, MapPin, Calendar, Heart, Trash2, Image, BookOpen, X, Sparkles, User, Tag } from 'lucide-react';
import type { UserProfile } from '../types';
import { createMemoryBackend, fetchMemoriesBackend } from '../utils/api';

export interface Memory {
  id: string;
  title: string;
  place: string;
  date: string;
  note: string;
  imageUrl: string;
  liked: boolean;
  tags: string[];
  userName?: string;
  userId?: string;
}

interface MemoriesPageProps {
  user?: UserProfile | null;
}

const PAN_INDIA_MEMORIES: Memory[] = [
  {
    id: 'm1',
    title: 'Lepakshi Monolith & Hanging Pillar 🛕',
    place: 'Lepakshi, Sri Sathya Sai District, AP',
    date: '2026-09-24',
    note: 'College weekend expedition from campus! Stood beneath the colossal monolithic Nandi and tested passing cloth under the hanging pillar. Outstanding Vijayanagara stone carvings and zero ticket cost for students.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    liked: true,
    tags: ['heritage', 'lepakshi', 'squadtrip', 'rayalaseema'],
    userName: 'Campus Explorer'
  },
  {
    id: 'm2',
    title: 'Sunrise Ridge Trek at Penukonda Fort 🏔️',
    place: 'Penukonda Fort, Anantapur District',
    date: '2026-09-19',
    note: 'Began the ascent at 5:00 AM with hostel friends. The rolling misty horizon of Rayalaseema from the watchtower was sensational. Hot ginger tea and mirchi bajjis at the foothill cost only ₹35!',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    liked: true,
    tags: ['trek', 'sunrise', 'penukonda', 'budgetwin'],
    userName: 'Hostel Squad'
  },
  {
    id: 'm3',
    title: 'Vistadome Glass Train to Araku Valley 🚂',
    place: 'Araku Valley, Visakhapatnam',
    date: '2026-09-12',
    note: 'Rode through 58 mountain tunnels and cascading waterfalls in the Eastern Ghats. The fresh local bamboo chicken and organic coffee aroma in the hills was unforgettable.',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    liked: true,
    tags: ['train', 'araku', 'nature', 'coffee'],
    userName: 'Student Backpacker'
  },
  {
    id: 'm4',
    title: 'Sunset Acoustic Jam at Vagator Beach 🌊',
    place: 'Vagator, North Goa',
    date: '2026-08-28',
    note: 'Semester-end group trip! Watched the Arabian Sea turn molten gold from the cliffside while someone played acoustic guitar. Total split cost came under ₹600 per head.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    liked: false,
    tags: ['goa', 'beach', 'sunset', 'batchtrip'],
    userName: 'Batch of 2026'
  },
  {
    id: 'm5',
    title: 'Toy Train Ride & Tea Estate Walk 🍃',
    place: 'Ooty, Nilgiris',
    date: '2026-08-15',
    note: 'Took the heritage steam locomotive through pine valleys and cold mountain mist. Loaded our backpacks with homemade fudge and eucalyptus tea.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    liked: false,
    tags: ['ooty', 'mountains', 'tea', 'weekend'],
    userName: 'Nature Club'
  }
];

export const MemoriesPage: React.FC<MemoriesPageProps> = ({ user }) => {
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const stored = localStorage.getItem('twy_memories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return PAN_INDIA_MEMORIES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filter, setFilter] = useState<'all' | 'liked'>('all');
  const [newMemory, setNewMemory] = useState({
    title: '',
    place: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
    imageUrl: '',
    tags: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync memories with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twy_memories', JSON.stringify(memories));
    } catch {}
  }, [memories]);

  // Optionally fetch backend memories on initial mount
  useEffect(() => {
    fetchMemoriesBackend().then((serverMemories) => {
      if (serverMemories && Array.isArray(serverMemories) && serverMemories.length > 0) {
        setMemories((local) => {
          const ids = new Set(local.map((m) => m.id));
          const uniqueNew = serverMemories.filter((sm: any) => !ids.has(sm.id));
          return [...uniqueNew, ...local];
        });
      }
    });
  }, []);

  const toggleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m))
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) setSelectedMemory(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setNewMemory((p) => ({ ...p, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = async () => {
    if (!newMemory.title.trim() || !newMemory.place.trim()) return;

    const memory: Memory = {
      id: `m${Date.now()}`,
      title: newMemory.title.trim(),
      place: newMemory.place.trim(),
      date: newMemory.date,
      note: newMemory.note.trim() || 'Logged an unforgettable memory with friends!',
      imageUrl:
        newMemory.imageUrl ||
        imagePreview ||
        `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80`,
      liked: false,
      tags: newMemory.tags.split(',').map((t) => t.trim()).filter(Boolean),
      userName: user?.fullName || 'Student Traveler',
      userId: user?.id
    };

    setMemories((prev) => [memory, ...prev]);
    setIsAdding(false);
    setImagePreview('');
    setNewMemory({ title: '', place: '', date: new Date().toISOString().slice(0, 10), note: '', imageUrl: '', tags: '' });

    // Synchronize to backend/Supabase
    try {
      await createMemoryBackend({
        userId: user?.id,
        userName: memory.userName,
        title: memory.title,
        place: memory.place,
        date: memory.date,
        note: memory.note,
        imageUrl: memory.imageUrl,
        tags: memory.tags
      });
    } catch (e) {
      console.warn('Memory backend sync notice:', e);
    }
  };

  const visibleMemories = filter === 'liked' ? memories.filter((m) => m.liked) : memories;
  const likedCount = memories.filter((m) => m.liked).length;

  return (
    <div className="min-h-screen py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>College Travel Journal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
            Travel Memories 📸
          </h1>
          <p className="text-slate-400 text-sm">
            Your visual college journey — {memories.length} memories, {likedCount} favourites.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            {(['all', 'liked'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
                  filter === f ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'liked' ? `❤️ Favourites (${likedCount})` : `All (${memories.length})`}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>
      </div>

      {/* Add Memory Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">📸 New Memory</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Image Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-40 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                  imagePreview ? 'border-emerald-500/50' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Image className="w-8 h-8 mb-2" />
                    <span className="text-xs">Click to upload photo</span>
                    <span className="text-[10px] text-slate-600">or leave blank for auto image</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory((p) => ({ ...p, title: e.target.value }))}
                placeholder="Memory title (e.g. Sunrise at Nandi Hills 🌅)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
              />
              <input
                type="text"
                value={newMemory.place}
                onChange={(e) => setNewMemory((p) => ({ ...p, place: e.target.value }))}
                placeholder="Place name (e.g. Cubbon Park, Bengaluru)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
              />
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory((p) => ({ ...p, date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white outline-none"
              />
              <textarea
                value={newMemory.note}
                onChange={(e) => setNewMemory((p) => ({ ...p, note: e.target.value }))}
                placeholder="Write your memory... What happened? How did it feel? Any fun moments?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none resize-none"
              />
              <input
                type="text"
                value={newMemory.tags}
                onChange={(e) => setNewMemory((p) => ({ ...p, tags: e.target.value }))}
                placeholder="Tags (comma separated): sunrise, trek, squad..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={handleAddMemory}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm cursor-pointer"
              >
                Save Memory ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory View Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-60">
              <img src={selectedMemory.imageUrl} alt={selectedMemory.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5">
                <h2 className="text-xl font-extrabold text-white">{selectedMemory.title}</h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" />{selectedMemory.place}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-teal-400" />{new Date(selectedMemory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {selectedMemory.note && (
                <p className="text-sm text-slate-300 leading-relaxed">{selectedMemory.note}</p>
              )}
              {selectedMemory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedMemory.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => toggleLike(selectedMemory.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    selectedMemory.liked
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedMemory.liked ? 'fill-current' : ''}`} />
                  {selectedMemory.liked ? 'Favourited' : 'Favourite'}
                </button>
                <button
                  onClick={() => deleteMemory(selectedMemory.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-red-500/30 text-red-400 bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Grid */}
      {visibleMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleMemories.map((memory) => (
            <div
              key={memory.id}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/30 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-pink-500/5"
              onClick={() => setSelectedMemory(memory)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Like button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(memory.id); }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border cursor-pointer transition-all ${
                    memory.liked
                      ? 'bg-rose-500/90 border-rose-400 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${memory.liked ? 'fill-current' : ''}`} />
                </button>

                {/* Date badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-teal-400" />
                  {new Date(memory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                  {memory.title}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  {memory.place}
                </div>
                {memory.note && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{memory.note}</p>
                )}
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {memory.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-slate-800 border-dashed">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {filter === 'liked' ? 'No favourites yet' : 'Your memory journal is empty'}
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
            {filter === 'liked'
              ? 'Heart your memories to mark them as favourites!'
              : 'Start documenting your college adventures! Every outing is worth remembering.'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs cursor-pointer shadow-lg shadow-pink-500/20"
            >
              Add Your First Memory ✨
            </button>
          )}
        </div>
      )}
    </div>
  );
};
