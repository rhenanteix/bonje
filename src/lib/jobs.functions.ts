import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export const listJobs = createServerFn({ method: 'GET' }).handler(async () => {
  // Vercel must use externally reachable configuration, not a sandbox-local URL.
  const publicUrl = process.env['VITE_SUPABASE_URL'] || import.meta.env['VITE_SUPABASE_URL'];
  const publicKey = process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] || import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['VERCEL'] ? publicUrl || process.env['SUPABASE_URL'] : process.env['SUPABASE_URL'] || publicUrl;
  const key = process.env['VERCEL'] ? publicKey || process.env['SUPABASE_PUBLISHABLE_KEY'] : process.env['SUPABASE_PUBLISHABLE_KEY'] || publicKey;
  if (!url || !key) {
    console.error('[jobs] Missing public database configuration');
    return { jobs: [], unavailable: true };
  }
  try {
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(input instanceof Request ? input.headers : undefined);
      new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers, signal: init?.signal ?? AbortSignal.timeout(8_000) });
    } },
  });
  const { data, error } = await client.from('jobs').select('id,title,company,city,job_type,application_url').eq('is_active', true).order('created_at', { ascending: false });
  if (error) {
    // Log diagnostic codes, never connection URLs, keys, or response bodies.
    console.error('[jobs] Public read failed', { code: error.code });
    return { jobs: [], unavailable: true };
  }
  return { jobs: data ?? [], unavailable: false };
  } catch {
    console.error('[jobs] Public read unavailable: connection or configuration failure');
    return { jobs: [], unavailable: true };
  }
});