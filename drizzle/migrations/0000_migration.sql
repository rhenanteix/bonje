CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  city text NOT NULL,
  job_type text NOT NULL DEFAULT 'CLT',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.company_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  city text CHECK (city IS NULL OR char_length(city) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX company_leads_email_key ON public.company_leads (lower(email));
GRANT INSERT ON public.company_leads TO anon, authenticated;
GRANT ALL ON public.company_leads TO service_role;
ALTER TABLE public.company_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.company_leads FOR INSERT TO anon, authenticated WITH CHECK (true);