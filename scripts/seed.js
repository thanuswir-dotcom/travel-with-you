import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_PLACES } from '../server/data/places.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '..', 'server', 'data', 'database.json');

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
        { time: '16:00', place: 'Cubbon Park Promenade', note: 'Lawn games & guitar', cost: 0 }
      ],
      createdAt: '2026-09-25T18:00:00.000Z'
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      tripId: 'trip-1',
      description: 'Filter coffee & samosas',
      amount: 180,
      paidBy: 'Pooja Sharma',
      category: 'food',
      createdAt: '2026-09-25T15:30:00.000Z'
    }
  ],
  memories: [
    {
      id: 'mem-1',
      userId: 'usr-1',
      userName: 'Pooja Sharma',
      title: 'Golden Hour at Nandi Hills',
      place: 'Nandi Hills Viewpoint',
      date: '2026-09-18',
      note: 'Woke up at 4 AM with the hostel crew. The mist rolling over the valley was pure magic!',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      liked: true,
      tags: ['sunrise', 'hostelcrew', 'weekendtrip'],
      createdAt: '2026-09-18T10:00:00.000Z'
    }
  ]
};

fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
console.log(`✅ Seed complete: ${SEED_PLACES.length} places and starter data written to ${DB_FILE}`);
