DROP POLICY IF EXISTS "Anyone can subscribe" ON public.company_leads;
CREATE POLICY "Anyone can subscribe with valid data" ON public.company_leads
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(company_name)) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (city IS NULL OR char_length(city) <= 80)
);