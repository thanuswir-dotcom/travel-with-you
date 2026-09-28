// Google Gemini AI Integration for Travel With You
// IMPORTANT: Replace the placeholder with your actual API key
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// ─── Rich Mock Responses (shown when no API key) ─────────────────────
const getMockTripPlan = (req: TripPlanRequest): TripPlan => {
  const perPerson = Math.floor(req.budget / Math.max(req.friends, 1));
  const isLowBudget = perPerson < 300;

  return {
    title: isLowBudget ? '⚡ The Budget Blitz Day Out' : '🌟 The Perfect Student Saturday',
    totalEstimatedCost: Math.floor(perPerson * 0.85),
    duration: `${req.hours} hours`,
    vibe: req.preferences.includes('street_food') ? 'Foodie' : req.preferences.includes('parks_nature') ? 'Chill' : 'Adventure',
    stops: [
      {
        order: 1,
        name: 'Cubbon Park Morning Walk',
        category: 'parks_nature',
        duration: '1 hour',
        estimatedCost: 0,
        description: 'Start your day fresh at the iconic 300-acre Cubbon Park. Catch the morning joggers, cycle paths, and heritage red buildings. Perfect for group photos.',
        tips: 'Bring a frisbee or badminton rackets! The lawns are spacious and free to use.',
        travelTime: '10–15 min by auto',
      },
      {
        order: 2,
        name: 'Airlines Hotel Banyan Café',
        category: 'cafes',
        duration: '45 min',
        estimatedCost: 120,
        description: 'Legendary open-air café under a 100-year-old banyan tree. Famous for ₹35 filter coffee and crispy masala dosas. A true Bengaluru institution.',
        tips: 'Go early to avoid queues. Order the sambar vada — best in the city under ₹60!',
        travelTime: '5 min walk from Cubbon',
      },
      {
        order: 3,
        name: 'Blossom Book House',
        category: 'study_spots',
        duration: '45 min',
        estimatedCost: 80,
        description: 'A treasure trove for students — 3-storey secondhand bookstore on Church Street with titles at 50% off. Find novels, engineering references, and manga.',
        tips: 'Bargain politely at the counter for bulk purchases. Student ID gets extra 10% off.',
        travelTime: '12 min by auto',
      },
      {
        order: 4,
        name: 'VV Puram Thindi Beedi',
        category: 'street_food',
        duration: '1 hour',
        estimatedCost: 150,
        description: 'The ultimate Bengaluru street food street! 20+ stalls with butter masala dosas, congress kadlekai, rabdi kulfi, and chaats. Heaven for foodies.',
        tips: 'Visit after 5 PM when all stalls open. Split dishes between friends to try more!',
        travelTime: '20 min by auto',
      },
    ],
    budgetBreakdown: {
      food: Math.floor(perPerson * 0.45),
      transport: Math.floor(perPerson * 0.2),
      activities: Math.floor(perPerson * 0.25),
      buffer: Math.floor(perPerson * 0.1),
    },
    quickTips: [
      '🚗 Use Rapido bike taxi between spots to save ₹30–₹50 per leg vs autos',
      '💳 Carry cash — many street food stalls don\'t accept UPI',
      '🌤️ Start before 10 AM to avoid peak heat and crowds',
    ],
  };
};

const getMockChatResponse = (message: string, city: string): string => {
  const lower = message.toLowerCase();
  
  if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
    return `For a tight budget in ${city}, head to VV Puram Thindi Beedi (under ₹150 per person) or Cubbon Park (free!). My top hack: skip restaurants and go straight to street food streets — the quality is often better and you\'ll spend 60% less! 💸`;
  }
  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('study')) {
    return `The best student cafés in ${city} include Airlines Hotel Banyan Café (₹35 filter coffee!), Koshy\'s on St. Marks Road (iconic and affordable), and Cafe Matteo for Wi-Fi + charging. All under ₹200 for a solid work session! ☕`;
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry')) {
    return `Student food spots in ${city} you CANNOT miss: VV Puram Thindi Beedi for street food (₹40–₹150), Shivaji Military Hotel for local thali (₹80), and Maiya's for comfort South Indian food under ₹120. What type of cuisine are you craving? 🍕`;
  }
  if (lower.includes('friend') || lower.includes('group') || lower.includes('gang')) {
    return `For groups in ${city}, Amoeba Bowling on Church Street is perfect (student discounts Mon–Thu!), or check out Smaaash for gaming + food. For free fun, Ulsoor Lake + picnic is a classic student move. Budget ₹300–₹500 per person for a full day out! 🎳`;
  }
  if (lower.includes('weekend') || lower.includes('trip') || lower.includes('getaway')) {
    return `Weekend trips from ${city} under ₹800: Nandi Hills sunrise trek (₹200 transport), Hogenakkal waterfalls (₹400 bus), or Shivanasamudra falls (₹500 by shared cab). These are perfect 1-day student adventures! 🏔️`;
  }
  
  return `Great question! ${city} has so many student-friendly spots. The best way to explore is by category — cafés, street food, parks, or entertainment zones. Use the "Student Mode" planner above to get a custom itinerary for your exact budget and time! What's your budget today? 🎒`;
};
