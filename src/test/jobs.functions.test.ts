import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), order: vi.fn() }));
vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({ handler: (handler: () => unknown) => handler }),
}));
vi.mock('@supabase/supabase-js', () => ({ createClient: mocks.createClient }));

import { listJobs } from '@/lib/jobs.functions';

describe('Public jobs availability', () => {
  beforeEach(() => {
    vi.stubEnv('SUPABASE_URL', 'http://sandbox-local:8000');
    vi.stubEnv('SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_local_test');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://public.example.test');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_public_test');
    vi.stubEnv('VERCEL', '1');
    mocks.createClient.mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ order: mocks.order }) }) }) });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.clearAllMocks(); });

  it('uses the public URL and matching publishable key on Vercel and returns current rows', async () => {
    const rows = [{ id: 'vacancy-1', title: 'Assistente', company: 'Empresa', city: 'Registro', job_type: 'CLT', application_url: 'https://example.test/job' }];
    mocks.order.mockResolvedValue({ data: rows, error: null });
    expect(await listJobs()).toEqual({ jobs: rows, unavailable: false });
    expect(mocks.createClient).toHaveBeenCalledWith('https://public.example.test', 'sb_publishable_public_test', expect.any(Object));
  });
  it('preserves the local server configuration outside Vercel', async () => {
    vi.stubEnv('VERCEL', '');
    mocks.order.mockResolvedValue({ data: [], error: null });
    expect(await listJobs()).toEqual({ jobs: [], unavailable: false });
    expect(mocks.createClient).toHaveBeenCalledWith('http://sandbox-local:8000', 'sb_publishable_local_test', expect.any(Object));
  });
  it('reports a failed query without throwing into the page loader', async () => {
    mocks.order.mockResolvedValue({ data: null, error: { code: '42501' } });
    expect(await listJobs()).toEqual({ jobs: [], unavailable: true });
  });
  it('reports a network failure without throwing into the page loader', async () => {
    mocks.order.mockRejectedValue(new Error('Connection failed'));
    expect(await listJobs()).toEqual({ jobs: [], unavailable: true });
  });
  it('sends opaque publishable keys only as apikey, not bearer JWTs', async () => {
    mocks.order.mockResolvedValue({ data: [], error: null });
    await listJobs();
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]'));
    vi.stubGlobal('fetch', fetchMock);
    try {
      const options = mocks.createClient.mock.calls[0]?.[2];
      await options.global.fetch(new Request('https://public.example.test/rest/v1/jobs', {
        headers: { Authorization: 'Bearer sb_publishable_public_test' },
      }));
      const headers = fetchMock.mock.calls[0]?.[1].headers as Headers;
      expect(headers.get('apikey')).toBe('sb_publishable_public_test');
      expect(headers.has('Authorization')).toBe(false);
    } finally { vi.unstubAllGlobals(); }
  });
});