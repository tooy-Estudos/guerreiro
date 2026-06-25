import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://fiqadzwhtpokqaxotvro.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. Usando LocalStorage como fallback.');
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createClient('https://fiqadzwhtpokqaxotvro.supabase.co', 'placeholder-key');
