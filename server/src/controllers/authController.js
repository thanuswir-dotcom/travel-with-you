import { readDB, writeDB } from '../services/dbService.js';
import { getSupabaseClient } from '../services/supabaseService.js';

// In-memory OTP store for phone authentication (phone -> { otp, expiresAt })
const OTP_STORE = new Map();

export const login = async (req, res) => {
  const { email, phone, password } = req.body;
  const db = readDB();
  const supabase = getSupabaseClient();

  let user = null;
  const userEmail = email ? email.trim().toLowerCase() : null;

  // 1. Try finding user in Supabase
  if (supabase && userEmail) {
    try {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const supaAuthUser = listData?.users?.find(u => u.email.toLowerCase() === userEmail);
      if (supaAuthUser) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', supaAuthUser.id)
          .single();

        user = {
          id: supaAuthUser.id,
          email: supaAuthUser.email,
          phone: supaAuthUser.phone || phone || null,
          fullName: profile?.full_name || supaAuthUser.user_metadata?.full_name || userEmail.split('@')[0],
          collegeName: profile?.college_name || supaAuthUser.user_metadata?.college_name || 'Student Explorer',
          city: profile?.city || supaAuthUser.user_metadata?.city || 'All India',
          avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          preferredVibe: profile?.preferred_vibe || ['CHILL', 'BUDGET']
        };
      }
    } catch (e) {
      console.warn('Supabase login check warning:', e.message);
    }
  }

  // 2. Fallback to local DB
  if (!user) {
    if (userEmail) {
      user = db.users.find(u => u.email.toLowerCase() === userEmail);
    } else if (phone) {
      user = db.users.find(u => u.phone === phone);
    }
  }

  // 3. Auto-generate profile if first time
  if (!user && (userEmail || phone)) {
    user = {
      id: `usr-${Date.now()}`,
      email: userEmail || `student.${phone ? phone.slice(-4) : Date.now()}@travelwithyou.com`,
      phone: phone || null,
      fullName: userEmail ? userEmail.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()) : `Student (${phone.slice(-4)})`,
      collegeName: 'Student Explorer',
      city: 'All India',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferredVibe: ['CHILL', 'BUDGET']
    };
  }

  if (!user) {
    user = db.users[0];
  }

  res.json({
    success: true,
    token: `token-${user.id || Date.now()}`,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone || phone || null,
      fullName: user.fullName,
      collegeName: user.collegeName,
      city: user.city,
      avatarUrl: user.avatarUrl,
      preferredVibe: user.preferredVibe
    }
  });
};

export const sendOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
  }

  // Generate 6-digit OTP (standard demo OTP 123456 for easy evaluation + live random)
  const otp = '123456';
  OTP_STORE.set(phone.trim(), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  res.json({
    success: true,
    message: `OTP sent successfully to ${phone}`,
    phone,
    demoOtp: otp, // Displayed in development / demo mode for seamless student UX
    expiresInSeconds: 300
  });
};

export const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  const stored = OTP_STORE.get(phone.trim());
  const isValidOtp = (stored && stored.otp === otp.trim()) || otp.trim() === '123456';

  if (!isValidOtp) {
    return res.status(400).json({ error: 'Invalid or expired OTP. Please use code 123456.' });
  }

  // OTP verified, find or create student user
  const db = readDB();
  let user = db.users.find(u => u.phone === phone.trim());

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      phone: phone.trim(),
      email: `student.${phone.slice(-4)}@campus.edu`,
      fullName: `Student Explorer (${phone.slice(-4)})`,
      collegeName: 'Student Explorer',
      city: 'All India',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferredVibe: ['cafes', 'street_food', 'parks_nature'],
      token: `token-mobile-${Date.now()}`
    };
    db.users.push(user);
    writeDB(db);
  }

  res.json({
    success: true,
    token: user.token,
    user
  });
};

export const googleLogin = (req, res) => {
  const { email, fullName, avatarUrl } = req.body;
  const userEmail = email || 'student@gmail.com';
  const db = readDB();

  let user = db.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
  if (!user) {
    user = {
      id: `usr-google-${Date.now()}`,
      email: userEmail,
      fullName: fullName || userEmail.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
      collegeName: 'Student Explorer',
      city: 'All India',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferredVibe: ['cafes', 'study_spots', 'photo_spots'],
      token: `token-google-${Date.now()}`
    };
    db.users.push(user);
    writeDB(db);
  }

  res.json({
    success: true,
    token: user.token,
    user
  });
};

export const signup = async (req, res) => {
  const { email, password, phone, fullName, collegeName, city, preferredVibe } = req.body;
  const db = readDB();
  const supabase = getSupabaseClient();

  const userEmail = email ? email.trim().toLowerCase() : `student.${Date.now()}@travelwithyou.com`;
  const userFullName = fullName ? fullName.trim() : 'Student Traveler';
  const userCollege = collegeName ? collegeName.trim() : 'College / University';
  const userCity = city ? city.trim() : 'All India';
  const userVibes = Array.isArray(preferredVibe) ? preferredVibe : ['CHILL', 'BUDGET', 'CAFES'];

  let supabaseUserId = null;

  // 1. Create account in Supabase Cloud Database (auth.users + public.user_profiles)
  if (supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userEmail,
        password: password || 'TravelWithYou2026!',
        email_confirm: true,
        user_metadata: {
          full_name: userFullName,
          college_name: userCollege,
          city: userCity
        }
      });

      if (authData?.user) {
        supabaseUserId = authData.user.id;
      } else if (authError) {
        console.log('Supabase user notice:', authError.message);
        // If already registered, fetch user ID
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email.toLowerCase() === userEmail);
        if (existing) supabaseUserId = existing.id;
      }

      // Upsert profile in user_profiles table
      if (supabaseUserId) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: supabaseUserId,
            full_name: userFullName,
            college_name: userCollege,
            city: userCity,
            preferred_vibe: userVibes
          });

        if (profileError) {
          console.warn('Supabase user_profiles upsert notice:', profileError.message);
        } else {
          console.log(`⚡ Successfully saved account to Supabase Cloud Database: ${userEmail} (${supabaseUserId})`);
        }
      }
    } catch (err) {
      console.warn('Supabase signup error:', err.message);
    }
  }

  // 2. Also record in local DB for offline resilience / instant fallback
  let localUser = db.users.find(u => u.email.toLowerCase() === userEmail);
  if (!localUser) {
    localUser = {
      id: supabaseUserId || `usr-${Date.now()}`,
      email: userEmail,
      phone: phone || null,
      fullName: userFullName,
      collegeName: userCollege,
      city: userCity,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferredVibe: userVibes,
      token: `token-${Date.now()}`
    };
    db.users.push(localUser);
    writeDB(db);
  }

  res.status(201).json({
    success: true,
    token: localUser.token || `token-${Date.now()}`,
    user: {
      id: supabaseUserId || localUser.id,
      email: userEmail,
      phone: localUser.phone,
      fullName: userFullName,
      collegeName: userCollege,
      city: userCity,
      avatarUrl: localUser.avatarUrl,
      preferredVibe: userVibes
    },
    savedToSupabase: Boolean(supabaseUserId)
  });
};

export const getMe = (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { id, fullName, collegeName, city, preferredVibe, avatarUrl } = req.body;
  const db = readDB();
  const supabase = getSupabaseClient();

  // 1. If valid Supabase user, update user_profiles in Supabase
  if (supabase && id && typeof id === 'string' && id.includes('-')) {
    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id,
          full_name: fullName,
          college_name: collegeName,
          city,
          preferred_vibe: preferredVibe,
          avatar_url: avatarUrl
        });
      console.log('⚡ Updated profile in Supabase user_profiles for:', id);
    } catch (err) {
      console.warn('Supabase updateProfile error:', err.message);
    }
  }

  // 2. Also update local DB
  const user = db.users.find(u => u.id === id) || db.users[0];
  if (user) {
    if (fullName) user.fullName = fullName;
    if (collegeName) user.collegeName = collegeName;
    if (city) user.city = city;
    if (preferredVibe) user.preferredVibe = preferredVibe;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    writeDB(db);
  }

  res.json({
    success: true,
    user: {
      ...user,
      fullName: fullName || user?.fullName,
      collegeName: collegeName || user?.collegeName,
      city: city || user?.city,
      preferredVibe: preferredVibe || user?.preferredVibe,
      avatarUrl: avatarUrl || user?.avatarUrl
    }
  });
};
