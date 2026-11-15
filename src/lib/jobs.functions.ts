import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export const listJobs = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL'] ?? import.meta.env['VITE_SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Não foi possível carregar as vagas.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from('jobs').select('id,title,company,city,job_type,application_url').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw new Error('Não foi possível carregar as vagas. Tente novamente.');
  return data;
});