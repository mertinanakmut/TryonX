
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Proje URL ve Key değerlerinizi buradan kontrol edin
const supabaseUrl = 'https://swecftktjvydakbqsukl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZWNmdGt0anZ5ZGFrYnFzdWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDc0OTYsImV4cCI6MjA4MjUyMzQ5Nn0.nHZsoFvk0tt87bDbCE_uAdMNZextlkLpLwbdaW3y5qo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: { 'x-application-name': 'tryonx' }
  }
});
