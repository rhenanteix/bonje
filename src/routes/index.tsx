import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Upload, Check, Building2, Zap, ArrowRight, MessageCircle, Briefcase, Mail, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeuBonjee — Empregos no Vale do Ribeira em um só lugar" },
      { name: "description", content: "Todas as vagas do Vale do Ribeira centralizadas. Candidate-se em 30 segundos: nome, WhatsApp e currículo. Projeto open source." },
      { property: "og:title", content: "MeuBonjee — Empregos no Vale do Ribeira" },
      { property: "og:description", content: "Candidate-se em 30 segundos às vagas de Registro, Iguape, Cajati, Pariquera-Açu e toda a região." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const cidades = ["Registro", "Iguape", "Cajati", "Jacupiranga", "Pariquera-Açu", "Eldorado", "Juquiá", "Miracatu", "Sete Barras", "Cananéia", "Ilha Comprida", "Barra do Turvo", "Iporanga", "Itariri", "Pedro de Toledo"];

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-display text-2xl font-semibold tracking-tight">Meu<span className="text-primary">Bonjee</span></a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#vagas" className="hover:text-foreground">Vagas</a>
          <a href="#como" className="hover:text-foreground">Como funciona</a>
          <a href="#empresas" className="hover:text-foreground">Para empresas</a>
        </nav>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-accent blur-3xl animate-blob [animation-delay:-6s]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Todas as vagas do Vale, <em className="text-gradient">num lugar só.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Chega de caçar vaga em grupo de WhatsApp, mural de padaria e post perdido no Facebook.
              Aqui você vê tudo que está aberto na região e se candidata em 30 segundos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#vagas" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
                Ver vagas <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a href="#empresas" className="rounded-full border border-border bg-background/60 px-6 py-3 font-medium backdrop-blur transition hover:-translate-y-0.5">Sou empresa</a>
            </div>
          </div>
          <HeroDemo />
        </div>

        <div className="relative border-y border-border bg-foreground py-4 text-background">
        </div>
      </section>

      <JobsSection />

      <section id="como" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-xl font-display text-4xl font-semibold">Quanto menos campo, mais gente se candidata.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {([
            [Zap, "Escolha a vaga", "Filtre pela sua cidade. Registro, Cajati, Iguape — tudo separado."],
            [Upload, "Envie o currículo", "Nome, WhatsApp e o arquivo. Pode ser até foto do currículo no celular."],
            [MessageCircle, "Receba no WhatsApp", "A empresa fala direto com você. Sem e-mail perdido no spam."],
          ] as const).map(([Icon, t, d], i) => (
            <div key={t} className="group relative overflow-hidden rounded-3xl bg-secondary p-8 transition duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-soft)]">
              <span className="absolute -right-2 -top-6 font-display text-9xl font-semibold text-primary/10 transition group-hover:text-primary/20">{i + 1}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition group-hover:rotate-6 group-hover:scale-110"><Icon className="h-6 w-6" /></div>
              <h3 className="mt-6 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <NewsletterSection />

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 MeuBonjee · Empregos no Vale do Ribeira · Código aberto, feito pela comunidade
      </footer>
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-700 [animation-delay:200ms] [animation-fill-mode:both]">
      <div className="animate-float rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Candidatura</p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">30 segundos</span>
        </div>
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-input bg-background px-4 py-3 text-sm"><span className="typing">Maria Souza</span></div>
          <div className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-muted-foreground">(13) 9 9876-5432</div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-secondary px-4 py-4 text-sm font-medium text-primary"><Upload className="h-4 w-4" /> curriculo-maria.pdf</div>
          <div className="rounded-xl bg-primary py-3 text-center font-semibold text-primary-foreground">Enviar candidatura</div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)] animate-float [animation-delay:-2s]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></div>
        <div className="text-sm"><p className="font-semibold">Currículo enviado!</p><p className="text-xs text-muted-foreground">Sem cadastro, sem senha</p></div>
      </div>
      <div className="absolute -right-4 -top-5 rotate-6 rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg animate-float [animation-delay:-4s]">
        <Sparkles className="mr-1 inline h-4 w-4 text-primary" />Só 3 campos
      </div>
    </div>
  );
}

function JobsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="vagas" className="border-b border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl font-semibold">Abertas agora na região</h2>
        {isLoading ? (
          <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : data && data.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {data.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-primary">
                <div>
                  <p className="font-semibold">{v.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" />{v.company} · <MapPin className="h-3.5 w-3.5" />{v.city}</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{v.job_type}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-border bg-background px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary animate-float"><Briefcase className="h-6 w-6" /></div>
            <p className="mt-5 font-display text-2xl font-semibold">As primeiras vagas estão chegando</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Estamos conversando com empresas do Vale. Tem uma empresa? Entre na lista e seja uma das primeiras a anunciar.</p>
            <a href="#empresas" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Sou empresa <ArrowRight className="h-4 w-4" /></a>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const company_name = String(f.get("company") ?? "").trim();
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const city = String(f.get("city") ?? "").trim() || null;
    setStatus("loading");
    const { error } = await supabase.from("company_leads").insert({ company_name, email, city });
    if (error && error.code !== "23505") {
      setStatus("error");
      setMsg("Não conseguimos salvar. Confira o e-mail e tente de novo.");
      return;
    }
    setStatus("done");
  }

  return (
    <section id="empresas" className="relative overflow-hidden bg-foreground py-24 text-background">
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/40 blur-3xl animate-blob" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-widest opacity-60">Newsletter para empresas</p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Contrate gente daqui, sem depender de grupo de WhatsApp.</h2>
          <ul className="mt-8 space-y-3 opacity-90">
            {["Seja avisado quando lançarmos o painel de vagas", "Anuncie grátis no lançamento", "Novidades sobre contratação no Vale do Ribeira"].map((i) => (
              <li key={i} className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 text-primary" />{i}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-background p-8 text-foreground shadow-2xl">
          {status === "done" ? (
            <div className="py-10 text-center animate-in zoom-in-95 fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check /></div>
              <p className="mt-4 font-display text-2xl font-semibold">Você está na lista!</p>
              <p className="mt-2 text-sm text-muted-foreground">Vamos te avisar assim que abrirmos para empresas.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <p className="flex items-center gap-2 font-display text-2xl font-semibold"><Mail className="h-6 w-6 text-primary" />Entre na lista</p>
              <input name="company" required maxLength={120} placeholder="Nome da empresa" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
              <input name="email" type="email" required maxLength={255} placeholder="E-mail" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
              <select name="city" defaultValue="" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-muted-foreground outline-none focus:ring-2 focus:ring-ring">
                <option value="">Cidade (opcional)</option>
                {cidades.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60">
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}Quero ser avisado
              </button>
              {status === "error" && <p className="text-sm text-destructive">{msg}</p>}
              <p className="text-center text-xs text-muted-foreground">Sem spam. Só novidades importantes.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
