const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://travel-with-you-backend.onrender.com/api' 
    : 'http://localhost:5000/api');

export async function fetchPlaces(params: Record<string, string | number | boolean> = {}) {
  try {
    const url = new URL(`${BACKEND_URL}/places`);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, String(val));
      }
    });

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch places');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, falling back to local dataset:', err);
    return null;
  }
}

export async function fetchPlaceDetails(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/places/${id}`);
    if (!res.ok) throw new Error('Place not found');
    return await res.json();
  } catch (err) {
    console.warn('Place details API error:', err);
    return null;
  }
}

export async function submitPlaceReview(placeId: string, reviewData: {
  rating: number;
  cleanliness: number;
  valueForMoney: number;
  studentFriendliness: number;
  comment: string;
  userName?: string;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/places/${placeId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return await res.json();
  } catch (err) {
    console.warn('Submit review API error:', err);
    return null;
  }
}

export interface WeatherData {
  city: string;
  tempC: number;
  condition: string;
  humidity: number;
  isRaining: boolean;
  advice: string;
  suggestedCategories: string[];
}

export async function fetchWeather(city: string = 'Bengaluru'): Promise<WeatherData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('Weather API error');
    return await res.json();
  } catch (err) {
    console.warn('Weather API unavailable:', err);
    return null;
  }
}

export async function generateAIPlan(params: {
  budget: number;
  friends: number;
  hours: number;
  city: string;
  preferences?: string[];
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/ai/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('AI Plan generation failed');
    return await res.json();
  } catch (err) {
    console.warn('AI Plan backend offline, falling back to client planner:', err);
    return null;
  }
}

export async function sendAIChat(message: string, city: string = 'Bengaluru') {
  try {
    const res = await fetch(`${BACKEND_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, city })
    });
    if (!res.ok) throw new Error('Chat API error');
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('Chat API offline:', err);
    return `In ${city}, check out Blossom Book House on Church Street or VV Puram Food Street for great student vibes under ₹200!`;
  }
}

export async function saveTripToBackend(tripData: Record<string, any>) {
  try {
    const res = await fetch(`${BACKEND_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Trips API offline:', err);
    return { success: true, id: `trip-${Date.now()}` };
  }
}

export async function toggleSavePlaceBackend(placeId: string, userId: string = 'usr-1') {
  try {
    const res = await fetch(`${BACKEND_URL}/saved/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, userId })
    });
    return await res.json();
  } catch (err) {
    console.warn('Saved toggle offline:', err);
    return { success: true };
  }
}

// ─── AUTHENTICATION (MOBILE OTP & GMAIL) ────────────────────────────────────

export async function sendPhoneOtp(phone: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return await res.json();
  } catch (err) {
    console.warn('Send OTP backend offline, fallback demo:', err);
    return { success: true, demoOtp: '123456', message: `OTP sent to ${phone}` };
  }
}

export async function verifyPhoneOtp(phone: string, otp: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    return await res.json();
  } catch (err) {
    console.warn('Verify OTP backend offline, fallback:', err);
    return {
      success: true,
      token: `demo-token-${Date.now()}`,
      user: {
        id: `usr-mobile-${Date.now()}`,
        phone,
        email: `student.${phone.slice(-4)}@campus.edu`,
        fullName: `Student Explorer (${phone.slice(-4)})`,
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'BUDGET', 'COFFEE']
      }
    };
  }
}

export async function loginWithGoogle(email: string, fullName?: string, avatarUrl?: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, avatarUrl })
    });
    return await res.json();
  } catch (err) {
    console.warn('Google Auth backend offline, fallback:', err);
    return {
      success: true,
      token: `demo-google-${Date.now()}`,
      user: {
        id: `usr-google-${Date.now()}`,
        email,
        fullName: fullName || email.split('@')[0],
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'COFFEE', 'STUDY']
      }
    };
  }
}
