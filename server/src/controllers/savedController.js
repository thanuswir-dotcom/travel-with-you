import { readDB, writeDB } from '../services/dbService.js';

export const getSavedPlaces = (req, res) => {
  const db = readDB();
  const userId = req.query.userId;
  // Return saved places only for the specific requested user; new accounts start with empty wishlist
  const saved = (db.savedPlaces || []).filter(s => {
    if (userId) return s.userId === userId;
    return false;
  });
  const savedPlaces = saved.map(s => {
    const place = db.places.find(p => p.id === s.placeId);
    return {
      ...s,
      place
    };
  }).filter(s => s.place);

  res.json(savedPlaces);
};

export const toggleSavedPlace = (req, res) => {
  const { placeId, userId = 'usr-1', status = 'WANT_TO_VISIT' } = req.body;
  const db = readDB();
  const existingIndex = db.savedPlaces.findIndex(s => s.placeId === placeId && s.userId === userId);

  let isSaved = false;
  if (existingIndex >= 0) {
    db.savedPlaces.splice(existingIndex, 1);
    isSaved = false;
  } else {
    db.savedPlaces.push({
      id: `sp-${Date.now()}`,
      userId,
      placeId,
      status,
      createdAt: new Date().toISOString()
    });
    isSaved = true;
  }

  writeDB(db);
  res.json({ success: true, isSaved, placeId });
};
