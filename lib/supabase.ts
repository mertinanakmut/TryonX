import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const getEnv = (key: string, fallback: string) => {
  try {
    const env = (globalThis as any).process?.env;
    if (env && env[key]) return env[key];
    return fallback;
  } catch (e) {
    return fallback;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL', 'https://uenwivymqaprfdyjiwsr.supabase.co');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlbndpdnltcWFwcmZkeWppd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzY2MDMsImV4cCI6MjA4MjM1MjYwM30.bMCNPoa_j4LylV9KkK7-Cxve_b44LmJwAo2moLp13V8');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});