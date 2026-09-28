// Persistent JSON-based database engine for Travel With You full-stack app
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_PLACES } from './data/places.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Initial seed state
const INITIAL_DB = {
  places: SEED_PLACES,
  users: [
    {
      id: 'usr-1',
      email: 'student@travelwithyou.com',
      fullName: 'Pooja Sharma',
      collegeName: 'RV College of Engineering',
      city: 'Bengaluru',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferredVibe: ['cafes', 'study_spots', 'street_food', 'photo_spots'],
      token: 'demo-token-123'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      placeId: 'blr-cafe-1',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      rating: 5,
      cleanliness: 5,
      valueForMoney: 4,
      studentFriendliness: 5,
      comment: 'The banoffee pie and iced latte are unreal! Quiet upstairs courtyard to finish assignments with high-speed Wi-Fi.',
      createdAt: '2026-09-20T14:30:00.000Z'
    },
    {
      id: 'rev-2',
      placeId: 'blr-food-1',
      userId: 'usr-2',
      userName: 'Arjun K.',
      rating: 5,
      cleanliness: 4,
      valueForMoney: 5,
      studentFriendliness: 5,
      comment: 'VV Puram is unbeatable! Got 3 friends fed for under ₹400 total. The garlic butter bun dosa is legendary.',
      createdAt: '2026-09-22T20:15:00.000Z'
    },
    {
      id: 'rev-3',
      placeId: 'blr-study-1',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      rating: 5,
      cleanliness: 5,
      valueForMoney: 5,
      studentFriendliness: 5,
      comment: 'Found my favorite design engineering textbook here for ₹140. Staff gave me an extra 10% student discount when I showed my college ID!',
      createdAt: '2026-09-24T11:00:00.000Z'
    }
  ],
  savedPlaces: [
    {
      id: 'sp-1',
      userId: 'usr-1',
      placeId: 'blr-cafe-1',
      status: 'FAVORITE',
      personalNote: 'Go here for Sunday morning sketching',
      createdAt: '2026-09-21T09:00:00.000Z'
    },
    {
      id: 'sp-2',
      userId: 'usr-1',
      placeId: 'blr-study-1',
      status: 'WANT_TO_VISIT',
      personalNote: 'Buy semester textbooks',
      createdAt: '2026-09-23T16:00:00.000Z'
    }
  ],
  trips: [
    {
      id: 'trip-1',
      userId: 'usr-1',
      title: 'Church Street & Cubbon Friday Outing',
      plannedDate: '2026-10-02',
      totalBudget: 1200,
      headcount: 3,
      transitMode: 'METRO',
      stops: [
        { time: '14:00', place: 'Blossom Book House', note: 'Book browsing & coffee', cost: 150 },
        { time: '16:00', place: 'Cubbon Park Promenade', note: 'Lawn games & guitar', cost: 0 },
        { time: '18:30', place: 'Amoeba Bowling', note: '1 game bowling match', cost: 540 },
        { time: '20:30', place: 'VV Puram Food Street', note: 'Dinner feast', cost: 400 }
      ],
      createdAt: '2026-09-25T18:00:00.000Z'
    }
  ],
  expenses: [
    { id: 'exp-1', tripId: 'trip-1', description: 'Filter Coffee & Cookies', amount: 150, paidBy: 'Pooja', category: 'food' },
    { id: 'exp-2', tripId: 'trip-1', description: 'Metro Smart Card Recharge', amount: 120, paidBy: 'Arjun', category: 'transport' },
    { id: 'exp-3', tripId: 'trip-1', description: 'Bowling 3 Games', amount: 540, paidBy: 'Pooja', category: 'activities' }
  ],
  memories: [
    {
      id: 'mem-1',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      title: 'Sunrise at Nandi Hills 🌅',
      place: 'Nandi Hills, Chikkaballapur',
      date: '2026-09-15',
      note: 'Left at 4 AM with 4 hostel friends. The rolling cloud bed was completely magical! Total cost per head: ₹120 including entry and hot chai.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['trek', 'sunrise', 'hostellife', 'nandi']
    },
    {
      id: 'mem-2',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      title: 'Street Food Challenge at VV Puram 🍕',
      place: 'VV Puram Food Street',
      date: '2026-09-18',
      note: 'Ate 4 different dosas and rabdi jalebi with the gang. ₹130 per person and full stomach guaranteed.',
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['foodie', 'streetfood', 'budgetwin']
    },
    {
      id: 'mem-3',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      title: 'Late Night Coffee & Assignment Grind ☕',
      place: 'DYU Art Cafe, Koramangala',
      date: '2026-09-22',
      note: 'Finished our hackathon slide deck under fairy lights and lush trees. Best vibes for focused students.',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      liked: false,
      tags: ['hackathon', 'cafe', 'latenight']
    }
  ]
};

// Initialize DB if not present
export function initDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
  }
}

// Read database
export function readDB() {
  try {
    initDB();
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, returning initial DB:', err);
    return INITIAL_DB;
  }
}

// Write database atomically
export function writeDB(data) {
  try {
    initDB();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}
