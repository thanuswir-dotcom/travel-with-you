import { readDB, writeDB } from '../services/dbService.js';
import { getSupabaseClient } from '../services/supabaseService.js';

export const getMemories = async (req, res) => {
  const db = readDB();
  const supabase = getSupabaseClient();
  let supabaseMemories = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*, user_profiles(full_name, college_name)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        supabaseMemories = data.map(m => {
          const parts = (m.caption || '').split(' - ');
          const title = parts.length > 1 ? parts[0] : (m.place_name_tag || 'College Travel Memory');
          const note = parts.length > 1 ? parts.slice(1).join(' - ') : (m.caption || 'Campus travel memories');

          return {
            id: m.id,
            userId: m.user_id,
            userName: m.user_profiles?.full_name || 'Student Traveler',
            title,
            place: m.place_name_tag || 'India',
            date: m.memory_date || m.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            note,
            imageUrl: m.image_url || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
            liked: false,
            tags: m.friends_tagged || ['college', 'travel', 'squad'],
            fromSupabase: true
          };
        });
      }
    } catch (e) {
      console.warn('Supabase getMemories error:', e.message);
    }
  }

  // Combine Supabase memories with local database memories
  const localMemories = db.memories || [];
  const combined = [...supabaseMemories];
  for (const lm of localMemories) {
    if (!combined.some(c => c.id === lm.id || (c.title === lm.title && c.date === lm.date))) {
      combined.push(lm);
    }
  }

  res.json(combined);
};

export const createMemory = async (req, res) => {
  const db = readDB();
  const supabase = getSupabaseClient();
  const { title, place, date, note, imageUrl, tags, userName, userId } = req.body;

  let supabaseMemId = null;

  // 1. Sync to Supabase cloud database if user is authenticated with a valid Supabase UUID
  if (supabase && userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: userId,
          place_name_tag: place || title || 'Campus Expedition',
          caption: `${title ? title + ' - ' : ''}${note || 'Unforgettable student journey!'}`,
          image_url: imageUrl || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
          memory_date: date || new Date().toISOString().slice(0, 10),
          friends_tagged: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['travel', 'friends'])
        })
        .select()
        .single();

      if (data && !error) {
        supabaseMemId = data.id;
        console.log('⚡ Successfully saved memory to Supabase Cloud Database:', supabaseMemId);
      }
    } catch (err) {
      console.warn('Supabase createMemory error:', err.message);
    }
  }

  const newMemory = {
    id: supabaseMemId || `mem-${Date.now()}`,
    userId: userId || 'usr-1',
    userName: userName || 'Student Explorer',
    title: title || 'Campus Outing',
    place: place || 'India',
    date: date || new Date().toISOString().slice(0, 10),
    note: note || 'Made unforgettable memories with friends!',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    liked: false,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['travel', 'friends']),
    createdAt: new Date().toISOString(),
    savedToSupabase: Boolean(supabaseMemId)
  };

  db.memories.unshift(newMemory);
  writeDB(db);
  res.status(201).json(newMemory);
};

export const toggleLikeMemory = (req, res) => {
  const db = readDB();
  const memory = db.memories.find(m => m.id === req.params.id);
  if (!memory) return res.status(404).json({ error: 'Memory not found' });

  memory.liked = !memory.liked;
  writeDB(db);
  res.json({ success: true, liked: memory.liked });
};

export const deleteMemory = (req, res) => {
  const db = readDB();
  db.memories = db.memories.filter(m => m.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
};

