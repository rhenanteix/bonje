import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowUpRight, ArrowRight, MapPin, Search, BriefcaseBusiness, Check, Loader2, MoveUpRight, Code2, Bell, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/meubonjee-logo.png.asset.json';
import { listJobs } from '@/lib/jobs.functions';
import { filterJobs, safeApplicationUrl } from '@/lib/jobs';

const logoUrl = new URL(logo.url, 'https://vale-vagas-perto-de-voce.lovable.app').href;
const jobsOptions = queryOptions({ queryKey: ['jobs'], queryFn: () => listJobs(), staleTime: 60_000 });
const filtersSchema = z.object({ q: z.string().optional(), city: z.string().optional(), type: z.string().optional() });
export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => filtersSchema.parse(search),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsOptions),
  head: () => ({ meta: [
    { title: 'MeuBonjee — Vagas de emprego no Vale do Ribeira' },
    { name: 'description', content: 'Encontre vagas no Vale do Ribeira e candidate-se diretamente no site do anúncio. Em breve, empresas poderão publicar no MeuBonjee.' },
    { property: 'og:title', content: 'MeuBonjee — Seu próximo trabalho pode estar aqui no Vale' },
    { property: 'og:description', content: 'Oportunidades da região em um só lugar. Um projeto aberto, feito por gente daqui.' },
    { property: 'og:image', content: logoUrl }, { name: 'twitter:image', content: logoUrl },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
  pendingComponent: () => <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-foreground" aria-label="Carregando vagas" /></div>,
  errorComponent: JobsError,
  notFoundComponent: () => <p className="p-8">Página não encontrada.</p>,
});
const cidades = ['Registro', 'Iguape', 'Cajati', 'Jacupiranga', 'Pariquera-Açu', 'Eldorado', 'Juquiá', 'Miracatu', 'Sete Barras', 'Cananéia', 'Ilha Comprida', 'Barra do Turvo', 'Iporanga', 'Itariri', 'Pedro de Toledo'];
function JobsError() {
  const router = useRouter();
  return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6"><h1 className="font-display text-3xl">MeuBonjee</h1><p role="alert">Não conseguimos carregar as vagas agora.</p><Button onClick={() => router.invalidate()}>Tentar novamente</Button></main>;
}
function Index() {
  const { data: { jobs, unavailable }, refetch, isFetching } = useSuspenseQuery(jobsOptions);
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const visible = filterJobs(jobs, filters);
  return <div className="min-h-screen bg-background font-body text-foreground">
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2" aria-label="MeuBonjee início"><img src={logoUrl} alt="" className="size-12 object-contain" /><span className="font-display text-2xl font-bold">MeuBonjee<span className="text-brand-strong">.</span></span></a>
        <nav className="flex items-center gap-6"><a href="#vagas" className="hidden text-sm font-semibold sm:block">Encontrar vagas</a><Button asChild variant="outline" className="h-10 rounded-full border-foreground px-4"><a href="#empresas">Sou empresa <ArrowUpRight /></a></Button></nav>
      </div>
    </header>
    <main>
      <section className="relative overflow-hidden">
        <div className="hero-mascot pointer-events-none absolute bottom-0 right-0 hidden md:block"><img src={logoUrl} alt="" className="h-full w-full object-contain" /></div>
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase"><span className="size-2 rounded-full bg-brand-strong" /> De gente daqui. Para gente daqui.</p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.08] sm:text-6xl">MeuBonjee.<br />Seu próximo trabalho<br className="hidden sm:block" /> pode estar <span className="hero-highlight">aqui no Vale.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">Menos vagas perdidas em grupos. Mais oportunidades perto de você. O Vale do Ribeira, agora num lugar só.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild className="h-12 rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"><a href="#vagas">Bora encontrar uma vaga <ArrowRight /></a></Button></div>
          <img src={logoUrl} alt="Logo MeuBonjee: personagem sorridente com chapéu de palha e sinal de paz" className="mx-auto mt-5 h-32 object-contain md:hidden" />
        </div>
      </section>
      <div className="border-y border-border bg-primary"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-sm sm:px-8"><span className="flex items-center gap-2 font-semibold"><BriefcaseBusiness className="size-4" /> Oportunidades reais, perto de casa</span><span className="flex items-center gap-2"><ArrowUpRight className="size-4" /> Candidatura no site da vaga</span><span className="flex items-center gap-2"><Code2 className="size-4" /> Aberto e feito pela comunidade</span></div></div>
      <section id="vagas" className="scroll-mt-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-3 text-xs font-bold uppercase text-muted-foreground">Um novo começo</p><h2 className="font-display text-3xl font-semibold sm:text-4xl">Vagas abertas no Vale<span className="text-brand-strong">.</span></h2></div>{!unavailable && <span className="text-sm text-muted-foreground">{jobs.length} oportunidades encontradas</span>}</div>
          <form className="mt-8 grid gap-3 border-y border-border py-5 sm:grid-cols-[1fr_200px_170px]" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); void navigate({ search: { q: String(f.get('q') || '') || undefined, city: filters.city, type: filters.type }, hash: 'vagas', resetScroll: false }); }}>
            <div className="flex h-12 items-center gap-2 rounded-lg border border-input bg-card pl-4"><Search className="size-4 shrink-0 text-muted-foreground" /><input key={filters.q} name="q" defaultValue={filters.q} placeholder="Cargo ou empresa" aria-label="Cargo ou empresa" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /><Button type="submit" variant="ghost" size="icon" aria-label="Buscar vagas"><ArrowRight /></Button></div>
            <select aria-label="Cidade" className="h-12 rounded-lg border border-input bg-card px-4 text-sm" value={filters.city ?? ''} onChange={e => void navigate({ search: { ...filters, city: e.target.value || undefined }, hash: 'vagas', resetScroll: false })}><option value="">Todas as cidades</option>{cidades.map(c => <option key={c}>{c}</option>)}</select>
            <select aria-label="Tipo de contrato" className="h-12 rounded-lg border border-input bg-card px-4 text-sm" value={filters.type ?? ''} onChange={e => void navigate({ search: { ...filters, type: e.target.value || undefined }, hash: 'vagas', resetScroll: false })}><option value="">Todos os contratos</option>{Array.from(new Set(jobs.map(j => j.job_type))).map(t => <option key={t}>{t}</option>)}</select>
          </form>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map(job => {
            const url = safeApplicationUrl(job.application_url);
            return <article key={job.id} className="job-card flex min-h-56 flex-col rounded-lg border border-border bg-card p-6"><div className="flex items-start justify-between gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><Building2 className="size-5" /></span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{job.job_type}</span></div><h3 className="mt-5 font-display text-xl font-semibold">{job.title}</h3><p className="mt-1 text-sm text-muted-foreground">{job.company}</p><div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6"><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" />{job.city}, SP</span>{url ? <Button asChild variant="ghost" className="h-8 px-0 font-semibold hover:bg-transparent hover:text-brand-strong"><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Ver vaga: ${job.title}`}>Ver vaga <ArrowUpRight /></a></Button> : <span className="text-xs text-muted-foreground">Link em breve</span>}</div></article>;
          })}</div>
          {unavailable ? <div className="py-14 text-center"><p role="alert">Não conseguimos carregar as vagas agora.</p><Button variant="outline" className="mt-5" disabled={isFetching} onClick={() => void refetch()}>{isFetching ? <Loader2 className="animate-spin" /> : null}Tentar novamente</Button></div> : visible.length === 0 && <div className="py-14 text-center"><BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" /><h3 className="mt-4 font-display text-2xl">{jobs.length ? 'Nenhuma vaga com esses filtros' : 'As primeiras oportunidades estão chegando'}</h3>{jobs.length > 0 && <Button variant="outline" className="mt-5" onClick={() => void navigate({ search: {}, hash: 'vagas', resetScroll: false })}>Limpar filtros</Button>}</div>}
          <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ArrowUpRight className="mt-0.5 size-3.5 shrink-0" />Anúncios de sites externos. Requisitos, prazos e disponibilidade são confirmados na página da vaga.</p>
        </div>
      </section>
      <NewsletterSection />
    </main>
    <footer className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-8 sm:px-8"><span className="font-display text-xl font-bold">MeuBonjee.</span><p className="text-xs text-muted-foreground">© 2026 · Feito no Vale do Ribeira, para o Vale do Ribeira.</p><span className="flex items-center gap-2 text-xs"><Code2 className="size-4" /> Projeto open source</span></div></footer>
  </div>;
}
function NewsletterSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus('loading');
    try {
      const { error } = await supabase.from('company_leads').insert({ company_name: String(f.get('company') ?? '').trim(), email: String(f.get('email') ?? '').trim().toLowerCase(), city: String(f.get('city') ?? '').trim() || null });
      setStatus(error && error.code !== '23505' ? 'error' : 'done');
    } catch { setStatus('error'); }
  }
  return <section id="empresas" className="scroll-mt-6 bg-foreground text-background"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-16"><div><span className="inline-flex items-center gap-2 rounded-full border border-background/25 px-3 py-1.5 text-xs"><span className="size-1.5 rounded-full bg-primary" /> Para empresas · Em breve</span><h2 className="mt-6 font-display text-4xl font-medium leading-tight">O próximo talento da sua empresa pode ser seu vizinho.</h2><p className="mt-5 max-w-md text-sm leading-6 text-background/70">Em breve, sua empresa poderá publicar vagas no MeuBonjee. Entre na lista e receba as novidades do lançamento.</p><div className="mt-8 flex items-center gap-2 text-xs text-background/70"><MoveUpRight className="size-4 text-primary" /> Mais conexões. Mais oportunidades para o Vale.</div></div><div className="md:pt-4">{status === 'done' ? <div role="status" className="py-12"><Check className="size-10 text-primary" /><h3 className="mt-5 font-display text-3xl">Sua empresa está na lista!</h3><p className="mt-3 text-background/70">Vamos avisar quando a publicação de vagas estiver disponível.</p></div> : <form onSubmit={submit} className="space-y-4"><h3 className="mb-6 flex items-center gap-2 font-display text-2xl"><Bell className="size-5 text-primary" /> Fique por dentro</h3><div><label htmlFor="company" className="mb-2 block text-xs text-background/80">Nome da empresa</label><input id="company" name="company" required maxLength={120} placeholder="Como sua empresa se chama?" className="newsletter-input" /></div><div><label htmlFor="email" className="mb-2 block text-xs text-background/80">E-mail profissional</label><input id="email" name="email" type="email" required maxLength={255} placeholder="voce@empresa.com.br" className="newsletter-input" /></div><div><label htmlFor="company-city" className="mb-2 block text-xs text-background/80">Cidade <span className="text-background/50">(opcional)</span></label><select id="company-city" name="city" defaultValue="" className="newsletter-input"><option value="">Selecione sua cidade</option>{cidades.map(c => <option key={c}>{c}</option>)}</select></div><Button disabled={status === 'loading'} className="h-12 w-full rounded-full font-semibold">{status === 'loading' ? <Loader2 className="animate-spin" /> : <>Quero saber do lançamento <ArrowUpRight /></>}</Button>{status === 'error' && <p role="alert" className="text-sm text-primary">Não conseguimos salvar. Tente novamente.</p>}<p className="text-center text-xs text-background/50">Sem spam. Só novidades do MeuBonjee.</p></form>}</div></div></section>;
}
