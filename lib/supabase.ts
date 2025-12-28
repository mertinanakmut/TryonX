
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const safeEnv = (key: string, fallback: string) => {
  try {
    // window.process veya global process kontrolü
    const env = (typeof window !== 'undefined' && (window as any).process?.env) || 
                (typeof process !== 'undefined' && process.env);
    
    return (env && env[key]) || fallback;
  } catch (e) {
    return fallback;
  }
};

const supabaseUrl = safeEnv('SUPABASE_URL', 'https://uenwivymqaprfdyjiwsr.supabase.co');
const supabaseAnonKey = safeEnv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlbndpdnltcWFwcmZkeWppd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzY2MDMsImV4cCI6MjA4MjM1MjYwM30.bMCNPoa_j4LylV9KkK7-Cxve_b44LmJwAo2moLp13V8');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
