import { createClient } from '@supabase/supabase-js';

// User provided configuration
const PROVIDED_URL = 'https://cadjfadpxuzzeyffbqzp.supabase.co';
const PROVIDED_KEY = 'sb_publishable_HNEnOR_TdMNiJGwNOuCL5Q_hfaM2EEx';

// Access environment variables safely, falling back to provided credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || PROVIDED_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || PROVIDED_KEY;

// We export a flag to check if the app is connected to a real backend
// or should use mock data for demonstration purposes.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;