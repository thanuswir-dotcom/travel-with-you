import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

let supabaseClient = null;

if (config.supabaseUrl && (config.supabaseAnonKey || config.supabaseServiceKey)) {
  try {
    const key = config.supabaseServiceKey || config.supabaseAnonKey;
    supabaseClient = createClient(config.supabaseUrl, key, {
      auth: {
        persistSession: false
      }
    });
    console.log('⚡ Connected to Supabase Cloud Database at:', config.supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase client:', err.message);
  }
} else {
  console.log('📦 Supabase credentials not set — using resilient local JSON database.');
}

export const isSupabaseConfigured = () => Boolean(supabaseClient);

export const getSupabaseClient = () => supabaseClient;
