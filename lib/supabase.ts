
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Bu değişkenlerin Supabase panelinden alınması ve ortama eklenmiş olması gerekir.
// process.env üzerinden erişildiğini varsayıyoruz.
const supabaseUrl = process.env.SUPABASE_URL || 'https://uenwivymqaprfdyjiwsr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlbndpdnltcWFwcmZkeWppd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzY2MDMsImV4cCI6MjA4MjM1MjYwM30.bMCNPoa_j4LylV9KkK7-Cxve_b44LmJwAo2moLp13V8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
