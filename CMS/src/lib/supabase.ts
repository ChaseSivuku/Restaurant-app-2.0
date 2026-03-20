import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file');
}

// Read-only client (uses anon key; ideal for public reads)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Write client (uses service role key when provided; bypasses RLS).
// NOTE: Avoid exposing service role keys in production frontends.
export const supabaseWrite = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

