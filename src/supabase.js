import { createClient } from '@supabase/supabase-js';

// Usar valores placeholder se as variáveis estiverem vazias para evitar crash no carregamento da aplicação
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fiqadzwhtpokqaxotvro.supabase.co'; // Usando sua URL como fallback seguro
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.warn('Supabase: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. Usando LocalStorage como fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
