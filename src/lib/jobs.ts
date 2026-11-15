export type JobFilters = { q?: string | undefined; city?: string | undefined; type?: string | undefined };

export function safeApplicationUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function filterJobs<T extends { title: string; company: string; city: string; job_type: string }>(jobs: T[], filters: JobFilters): T[] {
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const term = normalize(filters.q?.trim() ?? '');
  return jobs.filter(job => (!term || normalize(`${job.title} ${job.company}`).includes(term)) && (!filters.city || job.city === filters.city) && (!filters.type || job.job_type === filters.type));
}