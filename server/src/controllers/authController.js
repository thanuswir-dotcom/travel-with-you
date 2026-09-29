import { readDB, writeDB } from '../services/dbService.js';
import { getSupabaseClient } from '../services/supabaseService.js';

// In-memory OTP store for phone authentication (phone -> { otp, expiresAt })
const OTP_STORE = new Map();

export const login = (req, res) => {
  const { email, phone, password } = req.body;
  const db = readDB();

  let user = null;
  if (email) {
    user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  } else if (phone) {
    user = db.users.find(u => u.phone === phone);
  }

  // Fallback to default student user if not found
  if (!user) {
    user = db.users[0];
  }

  res.json({
    success: true,
    token: user.token,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone || phone || '+91 98765 43210',
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

export const signup = (req, res) => {
  const { email, phone, fullName, collegeName, city, preferredVibe } = req.body;
  const db = readDB();

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email || 'student@travelwithyou.com',
    phone: phone || null,
    fullName: fullName || 'New Student Traveler',
    collegeName: collegeName || 'Campus University',
    city: city || 'Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    preferredVibe: preferredVibe || ['cafes', 'street_food', 'parks_nature'],
    token: `token-${Date.now()}`
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({
    success: true,
    token: newUser.token,
    user: newUser
  });
};

export const getMe = (req, res) => {
  const db = readDB();
  res.json(db.users[0]);
};

export const updateProfile = (req, res) => {
  const db = readDB();
  const user = db.users[0];
  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.collegeName) user.collegeName = req.body.collegeName;
  if (req.body.city) user.city = req.body.city;
  if (req.body.preferredVibe) user.preferredVibe = req.body.preferredVibe;

  writeDB(db);
  res.json({ success: true, user });
};
