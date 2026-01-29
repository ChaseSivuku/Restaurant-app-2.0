import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Read from environment variables (set in .env file)
// Priority: 1. Constants.expoConfig.extra (from app.config.js), 2. EXPO_PUBLIC_ env vars, 3. Regular env vars
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 
                    process.env.EXPO_PUBLIC_SUPABASE_URL || 
                    process.env.SUPABASE_URL ||
                    '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.SUPABASE_ANON_KEY ||
                       '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
  console.warn('Create a .env file in the root with:');
  console.warn('EXPO_PUBLIC_SUPABASE_URL=your_url (or SUPABASE_URL)');
  console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key (or SUPABASE_ANON_KEY)');
}

// Create client - will throw error if URL/key are missing, which is better than silent failure
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

