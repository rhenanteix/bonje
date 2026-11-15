import { describe, expect, it } from 'vitest';
import { safeApplicationUrl, filterJobs } from '@/lib/jobs';

describe('External applications', () => {
  it('preserves the original job destination', () => {
    expect(safeApplicationUrl('https://vagas.solides.com.br/vaga/945489')).toBe('https://vagas.solides.com.br/vaga/945489');
  });
  it('rejects unsafe destinations', () => {
    expect(safeApplicationUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeApplicationUrl(null)).toBeUndefined();
  });
});
describe('Job filters', () => {
  const rows = [
    { title: 'Técnico conferente', company: 'Menegazzo', city: 'Registro', job_type: 'CLT' },
    { title: 'Estágio administrativo', company: 'Educar', city: 'Registro', job_type: 'Estágio' },
  ];
  it('searches without accents and combines filters', () => {
    expect(filterJobs(rows, { q: 'tecnico', city: 'Registro', type: 'CLT' })).toEqual([rows[0]]);
    expect(filterJobs(rows, { city: 'Iguape' })).toEqual([]);
  });
});