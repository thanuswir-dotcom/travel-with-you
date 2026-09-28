import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { readDB } from './dbService.js';

let aiClient = null;

if (config.geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
    console.log('🤖 Google Gemini AI Client initialized with live API key.');
  } catch (e) {
    console.warn('⚠️ Could not initialize Google GenAI:', e.message);
  }
}

// Preferred active model
const MODEL_NAME = 'gemini-3.1-flash-lite';

export const generatePlan = async ({ budget = 500, friends = 3, hours = 4, city = 'Bengaluru', preferences = [] }) => {
  const db = readDB();

  let cityPlaces = db.places.filter(p => p.city.toLowerCase() === city.toLowerCase());
  if (cityPlaces.length === 0) {
    cityPlaces = db.places;
  }

  let candidatePlaces = cityPlaces;
  if (preferences.length > 0) {
    candidatePlaces = cityPlaces.filter(p => preferences.includes(p.category));
    if (candidatePlaces.length < 3) candidatePlaces = cityPlaces;
  }

  const budgetPerPerson = Math.floor(budget / Math.max(friends, 1));
  const stops = [];
  let currentHour = 14; // Default starting at 2 PM

  const categoriesToPick = ['cafes', 'parks_nature', 'entertainment', 'street_food'];
  categoriesToPick.slice(0, Math.min(hours, 4)).forEach((cat, idx) => {
    const matched = candidatePlaces.find(p => p.category === cat && !stops.some(s => s.placeId === p.id))
      || candidatePlaces[idx % candidatePlaces.length];

    if (matched) {
      const stopCost = Math.min(matched.approxCostForOne, Math.floor(budgetPerPerson * 0.35));
      stops.push({
        order: idx + 1,
        time: `${currentHour}:00 PM`,
        name: matched.name,
        category: matched.category,
        area: matched.area,
        estimatedCostPerPerson: stopCost,
        totalCostForGroup: stopCost * friends,
        description: matched.description,
        tips: matched.studentPerks ? matched.studentPerks[0] : 'Carry student ID for special discounts'
      });
      currentHour += Math.max(1, Math.floor(hours / 3));
    }
  });

  const totalCostPerPerson = stops.reduce((sum, s) => sum + s.estimatedCostPerPerson, 0);
  const totalCostForGroup = totalCostPerPerson * friends;

  let transitAdvice = 'Namma Metro / local buses are quickest and most economical between these locations.';

  // If Gemini API is configured, get real AI dynamic transit tip
  if (aiClient) {
    try {
      const prompt = `Give 1 quick, punchy sentence of transit and timing advice for college students visiting ${stops.map(s => s.name).join(', ')} in ${city}.`;
      const aiRes = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
      });
      if (aiRes && aiRes.text) {
        transitAdvice = aiRes.text.trim();
      }
    } catch (e) {
      // Keep heuristic fallback
    }
  }

  return {
    title: `${city} Student Adventure: ${hours} Hours of Fun & Food`,
    city,
    duration: `${hours} hours`,
    headcount: friends,
    totalBudget: budget,
    estimatedCostPerPerson: totalCostPerPerson,
    estimatedCostForGroup: totalCostForGroup,
    budgetGuardianAlert: totalCostForGroup > budget
      ? 'Warning: Plan exceeds target budget by ₹' + (totalCostForGroup - budget)
      : 'Within Budget! You save ₹' + (budget - totalCostForGroup),
    budgetBreakdown: {
      food: Math.round(totalCostForGroup * 0.45),
      transit: Math.round(totalCostForGroup * 0.20),
      activities: Math.round(totalCostForGroup * 0.25),
      buffer: Math.round(totalCostForGroup * 0.10)
    },
    stops,
    transitAdvice,
    thingsToCarry: ['Student ID card', 'Metro smart card / UPI app', 'Water bottle', 'Power bank']
  };
};

export const chatWithAI = async ({ message = '', city = 'Bengaluru' }) => {
  // If Gemini API key is configured, call live Gemini model
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: `You are "Travel With You" — a friendly, witty, smart AI travel companion specifically for college students in ${city}, India. 
Always prioritize student budgets (under ₹150-500), student ID perks, public transit/metro access, chill vibes, photo spots, and great food.
User asks: "${message}". 
Respond with enthusiasm, clear bullet points, emojis, and specific local tips.`
      });
      if (response && response.text) {
        return { reply: response.text };
      }
    } catch (err) {
      console.warn('⚠️ Gemini live inference failed, using student heuristics:', err.message);
    }
  }

  // Resilient heuristic engine
  const db = readDB();
  const q = message.toLowerCase();
  const cityPlaces = db.places.filter(p => p.city.toLowerCase() === city.toLowerCase());
  let reply = '';

  if (q.includes('hang out') || q.includes('friends') || q.includes('under 500') || q.includes('cheap')) {
    const cheapSpots = cityPlaces.filter(p => p.approxCostForOne <= 150).slice(0, 3);
    reply = `Here is a fantastic student plan for friends under ₹500 in ${city} 🎉:\n\n` +
      cheapSpots.map((s, i) => `${i + 1}. **${s.name}** (${s.area}) — ₹${s.approxCostForOne}/person. ${s.description}`).join('\n\n') +
      `\n\n💡 Total group spend stays well under your ₹500 limit with enough left for filter coffee!`;
  } else if (q.includes('peaceful') || q.includes('quiet') || q.includes('study')) {
    const quietSpots = cityPlaces.filter(p => p.isQuiet || p.category === 'study_spots' || p.category === 'parks_nature').slice(0, 3);
    reply = `If you want calm, peaceful vibes in ${city} 🍃:\n\n` +
      quietSpots.map((s, i) => `${i + 1}. **${s.name}** — ${s.description} (Rating: ⭐ ${s.rating})`).join('\n\n');
  } else if (q.includes('food') || q.includes('eat') || q.includes('under 200')) {
    const foodSpots = cityPlaces.filter(p => p.category === 'street_food' || p.category === 'restaurants').slice(0, 3);
    reply = `Craving great student food in ${city} under ₹200? 🍔🍕:\n\n` +
      foodSpots.map((s, i) => `${i + 1}. **${s.name}** (${s.area}) — Approx ₹${s.approxCostForOne} for one. Famous for: ${s.studentPerks?.[0] || 'Crispy treats'}`).join('\n\n');
  } else if (q.includes('3 hours') || q.includes('4 hours') || q.includes('today')) {
    reply = `Here is a quick mini itinerary for today in ${city} ⏱️:\n\n` +
      `• **2:00 PM** — Grab iced coffee at a student café (approx ₹90)\n` +
      `• **3:30 PM** — Chill at Cubbon Park or lake promenade (Free)\n` +
      `• **5:00 PM** — Sunset street food run (₹120)\n\n` +
      `Total cost: Under ₹210 per person!`;
  } else {
    const randomPick = cityPlaces[Math.floor(Math.random() * (cityPlaces.length || 1))] || db.places[0];
    reply = `Great question! In ${city}, I highly recommend checking out **${randomPick?.name}** in ${randomPick?.area}. ${randomPick?.description} It costs only about ₹${randomPick?.approxCostForOne} per person and has a ⭐ ${randomPick?.rating} rating from local students!`;
  }

  return { reply };
};

export const getSurprisePlace = async ({ city = 'Bengaluru', budget = 300 }) => {
  const db = readDB();
  const cityPlaces = db.places.filter(p => p.city.toLowerCase() === city.toLowerCase()) || db.places;
  const eligible = cityPlaces.filter(p => p.approxCostForOne <= budget);
  const pick = eligible.length > 0
    ? eligible[Math.floor(Math.random() * eligible.length)]
    : cityPlaces[Math.floor(Math.random() * cityPlaces.length)];

  const rationale = [
    `Because you have free time right now, why not try this hidden student gem just a short ride away?`,
    `Students rate this spot ⭐ ${pick?.rating || 4.8} for value and unforgettable vibes with friends!`,
    `Great weather match — ideal for an impromptu adventure under ₹${pick?.approxCostForOne || 100}.`
  ];

  return {
    place: pick,
    reason: rationale[Math.floor(Math.random() * rationale.length)],
    suggestedActivity: `Head to ${pick?.name || 'the spot'}, grab their student special, and take photos for your memories journal!`
  };
};
