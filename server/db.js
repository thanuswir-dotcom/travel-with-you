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
      fullName: 'Student Explorer',
      collegeName: 'Campus University',
      city: 'All India',
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
      userName: 'Campus Explorer',
      title: 'Lepakshi Monolith & Hanging Pillar 🛕',
      place: 'Lepakshi, Sri Sathya Sai District, AP',
      date: '2026-09-24',
      note: 'College weekend expedition from campus! Stood beneath the colossal monolithic Nandi and tested passing cloth under the hanging pillar. Outstanding Vijayanagara stone carvings and zero ticket cost for students.',
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['heritage', 'lepakshi', 'squadtrip', 'rayalaseema']
    },
    {
      id: 'mem-2',
      userId: 'usr-1',
      userName: 'Hostel Squad',
      title: 'Sunrise Ridge Trek at Penukonda Fort 🏔️',
      place: 'Penukonda Fort, Anantapur District',
      date: '2026-09-19',
      note: 'Began the ascent at 5:00 AM with hostel friends. The rolling misty horizon of Rayalaseema from the watchtower was sensational. Hot ginger tea and mirchi bajjis at the foothill cost only ₹35!',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['trek', 'sunrise', 'penukonda', 'budgetwin']
    },
    {
      id: 'mem-3',
      userId: 'usr-1',
      userName: 'Student Backpacker',
      title: 'Vistadome Glass Train to Araku Valley 🚂',
      place: 'Araku Valley, Visakhapatnam',
      date: '2026-09-12',
      note: 'Rode through 58 mountain tunnels and cascading waterfalls in the Eastern Ghats. The fresh local bamboo chicken and organic coffee aroma in the hills was unforgettable.',
      imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['train', 'araku', 'nature', 'coffee']
    },
    {
      id: 'mem-4',
      userId: 'usr-1',
      userName: 'Goa Crew',
      title: 'Sunset Acoustic Jam at Vagator Beach 🌊',
      place: 'Vagator, North Goa',
      date: '2026-09-05',
      note: 'Post-semester break getaway! Rented budget scooters for ₹350/day and gathered on the red cliffs overlooking the Arabian Sea as someone played guitar.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['beach', 'goa', 'semesterbreak', 'sunset']
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
    const data = JSON.parse(raw);
    // Ensure all SEED_PLACES (including pan-India destinations) are present without duplicates
    if (Array.isArray(data.places)) {
      let updated = false;
      for (const sp of SEED_PLACES) {
        if (!data.places.some(p => p.id === sp.id || (p.name === sp.name && p.city === sp.city))) {
          data.places.push(sp);
          updated = true;
        }
      }
      if (updated) {
        writeDB(data);
      }
    }
    return data;
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
