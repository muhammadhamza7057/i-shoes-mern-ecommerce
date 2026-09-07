import { env } from '../src/config/env.js';

if (!env.supabase.url || !env.supabase.serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env first');
}

const { default: supabase, verifySupabaseConnection } = await import('../src/config/supabase.js');

try {
  await verifySupabaseConnection();
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  console.log(`Supabase connected successfully. Categories: ${count ?? 0}`);
} catch (error) {
  console.error('Supabase connection failed:', error.message);
  process.exitCode = 1;
}