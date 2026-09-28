import { readDB, writeDB } from '../services/dbService.js';

export const getTrips = (req, res) => {
  const db = readDB();
  res.json(db.trips || []);
};

export const createTrip = (req, res) => {
  const db = readDB();
  const { title, plannedDate, totalBudget, headcount, transitMode, stops } = req.body;

  const newTrip = {
    id: `trip-${Date.now()}`,
    userId: req.body.userId || 'usr-1',
    title: title || 'Weekend Squad Outing',
    plannedDate: plannedDate || new Date().toISOString().slice(0, 10),
    totalBudget: Number(totalBudget) || 1000,
    headcount: Number(headcount) || 3,
    transitMode: transitMode || 'PUBLIC_TRANSIT',
    stops: stops || [],
    createdAt: new Date().toISOString()
  };

  db.trips.unshift(newTrip);
  writeDB(db);
  res.status(201).json(newTrip);
};

export const deleteTrip = (req, res) => {
  const db = readDB();
  db.trips = db.trips.filter(t => t.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
};
