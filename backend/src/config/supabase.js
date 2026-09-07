import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const verifySupabaseConnection = async () => {
  const { error } = await supabase.from('categories').select('id').limit(1);
  if (error) throw error;
  return true;
};

export default supabase;