import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_KEY');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
