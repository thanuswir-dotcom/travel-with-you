// Google Gemini AI Integration for Travel With You
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_FEATURED_PLACES } from './constants';

// The API key is stored here for hackathon/demo use
// In production, move this to a backend server
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

let genAI: GoogleGenerativeAI | null = null;

export const getGeminiClient = (): GoogleGenerativeAI => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

export const isGeminiConfigured = (): boolean => {
  return API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && API_KEY.length > 10;
};

export interface TripPlanRequest {
  budget: number;
  friends: number;
  hours: number;
  city: string;
  preferences: string[];
  currentTime?: string;
}

export interface TripStop {
  order: number;
  name: string;
  category: string;
  duration: string;
  estimatedCost: number;
  description: string;
  tips: string;
  travelTime: string;
}

export interface TripPlan {
  title: string;
  totalEstimatedCost: number;
  duration: string;
  stops: TripStop[];
  budgetBreakdown: {
    food: number;
    transport: number;
    activities: number;
    buffer: number;
  };
  quickTips: string[];
  vibe: string;
}

export const generateTripPlan = async (req: TripPlanRequest): Promise<TripPlan> => {
  if (!isGeminiConfigured()) {
    // Return a rich mock response when no API key is set
    return getMockTripPlan(req);
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an AI travel planner for college students in India. Create a detailed, budget-optimized trip itinerary.

Student details:
- City: ${req.city}
- Total Budget: ₹${req.budget}
- Number of friends: ${req.friends} (split costs between them)
- Available time: ${req.hours} hours
- Preferences: ${req.preferences.join(', ') || 'General exploration'}

Create a realistic, fun multi-stop student trip plan. Return a JSON object with this EXACT structure:
{
  "title": "catchy trip title",
  "totalEstimatedCost": number (per person),
  "duration": "X hours",
  "vibe": "one word vibe (e.g. Adventure, Chill, Foodie, Cultural)",
  "stops": [
    {
      "order": 1,
      "name": "Place name",
      "category": "cafe/park/restaurant/etc",
      "duration": "1.5 hours",
      "estimatedCost": 150,
      "description": "2-3 sentence description of what to do there",
      "tips": "specific student-friendly tip",
      "travelTime": "10 min by auto"
    }
  ],
  "budgetBreakdown": {
    "food": number,
    "transport": number,
    "activities": number,
    "buffer": number
  },
  "quickTips": ["tip1", "tip2", "tip3"]
}

Rules:
- All costs are per person
- Include 3-5 stops
- Focus on real, well-known places in ${req.city}
- Keep total cost UNDER ₹${req.budget}
- Make it genuinely exciting for college students
- Include student discounts/hacks where possible
- Response must be valid JSON only, no extra text`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const parsed = JSON.parse(jsonMatch[0]) as TripPlan;
    return parsed;
  } catch (err) {
    console.error('Gemini API error:', err);
    return getMockTripPlan(req);
  }
};

export const generateAIChat = async (
  userMessage: string,
  city: string,
  conversationHistory: Array<{ role: 'user' | 'model'; text: string }>
): Promise<string> => {
  if (!isGeminiConfigured()) {
    return getMockChatResponse(userMessage, city);
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemContext = `You are TripBot, a friendly AI travel assistant for college students in ${city}, India. 
You help students discover affordable places, plan trips on tight budgets, and find the best student deals.
You know about local cafes, street food, parks, theatres, gaming zones, study spots, and weekend trips.
Keep responses concise (2-4 sentences max), friendly, and practical. Include specific place names and prices where possible.
Always think about student budgets (typically ₹100-₹500 per person).`;

  const history = conversationHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemContext }] },
      { role: 'model', parts: [{ text: `Hi! I'm TripBot, your student travel companion for ${city}! Ask me anything about places to go, budget tips, or trip planning! 🎒` }] },
      ...history,
    ],
  });

  try {
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (err) {
    console.error('Gemini chat error:', err);
    return getMockChatResponse(userMessage, city);
  }
};

// ─── Dynamic Responses per City (used when no Gemini API key is configured) ───
const getMockTripPlan = (req: TripPlanRequest): TripPlan => {
  const perPerson = Math.floor(req.budget / Math.max(req.friends, 1));
  const cityLower = req.city.toLowerCase();

  // Find places matching the user's city, area, or state
  let matched = INITIAL_FEATURED_PLACES.filter(p => 
    p.city.toLowerCase().includes(cityLower) || 
    (p.area && p.area.toLowerCase().includes(cityLower)) ||
    (p.state && p.state.toLowerCase().includes(cityLower))
  );

  if (matched.length === 0) {
    matched = INITIAL_FEATURED_PLACES.slice(0, 4);
  }

  const selected = matched.slice(0, 4);
  const stops: TripStop[] = selected.map((p, idx) => ({
    order: idx + 1,
    name: p.name,
    category: p.category,
    duration: '1.5 hours',
    estimatedCost: p.approxCostForOne === 0 ? 0 : Math.min(p.approxCostForOne, Math.floor(perPerson / 3)),
    description: p.description,
    tips: p.studentPerks?.[0] || 'Popular student spot with great views',
    travelTime: idx === 0 ? 'Start here' : '15 min by auto / bike'
  }));

  return {
    title: `🌟 The Perfect ${req.city} Student Outing`,
    totalEstimatedCost: stops.reduce((sum, s) => sum + s.estimatedCost, 0) || Math.floor(perPerson * 0.8),
    duration: `${req.hours} hours`,
    vibe: req.preferences.includes('street_food') ? 'Foodie' : req.preferences.includes('parks_nature') ? 'Chill' : 'Adventure',
    stops,
    budgetBreakdown: {
      food: Math.floor(perPerson * 0.45),
      transport: Math.floor(perPerson * 0.2),
      activities: Math.floor(perPerson * 0.25),
      buffer: Math.floor(perPerson * 0.1),
    },
    quickTips: [
      `🚗 Travel locally around ${req.city} by shared auto or bike to save money`,
      '💳 Carry UPI and some cash for small student stalls',
      '🌤️ Start early in the morning or late afternoon for the best experience'
    ]
  };
};

const getMockChatResponse = (message: string, city: string): string => {
  const cityLower = city.toLowerCase();
  const cityPlaces = INITIAL_FEATURED_PLACES.filter(p =>
    p.city.toLowerCase().includes(cityLower) ||
    (p.area && p.area.toLowerCase().includes(cityLower)) ||
    (p.state && p.state.toLowerCase().includes(cityLower))
  );

  const topSpot = cityPlaces[0] || INITIAL_FEATURED_PLACES[0];
  const secondSpot = cityPlaces[1] || INITIAL_FEATURED_PLACES[1];

  const lower = message.toLowerCase();
  if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
    return `For a student budget in ${city}, head to ${topSpot.name} (${topSpot.approxCostForOne === 0 ? 'Free entry!' : `around ₹${topSpot.approxCostForOne} per head`}). It's located in ${topSpot.area} and verified for students! 💸`;
  }
  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('study')) {
    const cafeSpot = cityPlaces.find(p => p.category === 'cafes' || p.category === 'study_spots') || topSpot;
    return `In ${city}, check out ${cafeSpot.name} in ${cafeSpot.area}. Great ambiance, student-friendly prices, and perfect for reading or catching up with friends! ☕`;
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry')) {
    const foodSpot = cityPlaces.find(p => p.category === 'street_food' || p.category === 'restaurants') || topSpot;
    return `Student food in ${city} you shouldn't miss: ${foodSpot.name} (${foodSpot.approxCostForOne === 0 ? 'Budget friendly' : `under ₹${foodSpot.approxCostForOne}`}). Known for delicious local flavors! 🍕`;
  }
  if (lower.includes('weekend') || lower.includes('trip') || lower.includes('getaway')) {
    const tripSpot = cityPlaces.find(p => p.category === 'weekend_trips' || p.category === 'viewpoints') || secondSpot;
    return `Top weekend getaway from ${city}: ${tripSpot.name} in ${tripSpot.area}. Spectacular views and loved by students for 1-day road trips! 🏔️`;
  }

  return `In ${city}, you have awesome spots like ${topSpot.name} and ${secondSpot.name}. Use the Student Planner to map out your full itinerary based on your exact budget and free hours! 🎒`;
};
