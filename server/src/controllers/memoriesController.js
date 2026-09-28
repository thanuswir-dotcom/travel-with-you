import { readDB, writeDB } from '../services/dbService.js';

export const getMemories = (req, res) => {
  const db = readDB();
  res.json(db.memories || []);
};

export const createMemory = (req, res) => {
  const db = readDB();
  const { title, place, date, note, imageUrl, tags, userName } = req.body;

  const newMemory = {
    id: `mem-${Date.now()}`,
    userId: req.body.userId || 'usr-1',
    userName: userName || 'Pooja Sharma',
    title: title || 'Campus Outing',
    place: place || 'Bengaluru',
    date: date || new Date().toISOString().slice(0, 10),
    note: note || 'Made unforgettable memories!',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    liked: false,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['travel', 'friends']),
    createdAt: new Date().toISOString()
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
