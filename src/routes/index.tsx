import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Upload, Check, Building2, Zap, Users, ArrowRight, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vagas do Vale — Empregos no Vale do Ribeira em um só lugar" },
      { name: "description", content: "Todas as vagas do Vale do Ribeira centralizadas. Candidate-se em 30 segundos: nome, WhatsApp e currículo. Para empresas: publique vagas e receba candidatos da região." },
      { property: "og:title", content: "Vagas do Vale — Empregos no Vale do Ribeira" },
      { property: "og:description", content: "Candidate-se em 30 segundos às vagas de Registro, Iguape, Cajati, Pariquera-Açu e toda a região." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const cidades = ["Registro", "Iguape", "Cajati", "Jacupiranga", "Pariquera-Açu", "Eldorado", "Juquiá", "Miracatu", "Sete Barras", "Cananéia", "Ilha Comprida", "Barra do Turvo", "Iporanga", "Itariri", "Pedro de Toledo"];

const vagas = [
  { t: "Auxiliar Administrativo", e: "Cooperativa Agrícola", c: "Registro", tipo: "CLT" },
  { t: "Operador de Produção", e: "Indústria de Mineração", c: "Cajati", tipo: "CLT" },
  { t: "Atendente de Pousada", e: "Pousada Mar Pequeno", c: "Iguape", tipo: "Temporário" },
  { t: "Técnico em Enfermagem", e: "Hospital Regional", c: "Pariquera-Açu", tipo: "CLT" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-display text-2xl font-semibold tracking-tight">Vagas<span className="text-primary">doVale</span></a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como" className="hover:text-foreground">Como funciona</a>
          <a href="#empresas" className="hover:text-foreground">Para empresas</a>
          <a href="#cidades" className="hover:text-foreground">Cidades</a>
        </nav>
        <a href="#empresas" className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">Anunciar vaga</a>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <MapPin className="h-3.5 w-3.5" /> Feito para o Vale do Ribeira
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Todas as vagas do Vale, <em className="text-primary">num lugar só.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Chega de caçar vaga em grupo de WhatsApp, mural de padaria e post perdido no Facebook.
            Aqui você vê tudo que está aberto na região e se candidata em 30 segundos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#candidatar" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)]">Ver vagas <ArrowRight className="h-4 w-4" /></a>
            <a href="#empresas" className="rounded-full border border-border px-6 py-3 font-medium">Sou empresa</a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[["15", "cidades"], ["3", "campos p/ se candidatar"], ["0", "cadastro chato"]].map(([n, l]) => (
              <div key={l}><dt className="font-display text-3xl font-semibold">{n}</dt><dd className="text-xs text-muted-foreground">{l}</dd></div>
            ))}
          </dl>
        </div>
        <QuickApply />
      </section>

      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-semibold">Abertas agora na região</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {vagas.map((v) => (
              <div key={v.t} className="flex items-center justify-between rounded-2xl border border-border bg-background p-5">
                <div>
                  <p className="font-semibold">{v.t}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" />{v.e} · <MapPin className="h-3.5 w-3.5" />{v.c}</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{v.tipo}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Vagas ilustrativas.</p>
        </div>
      </section>

      <section id="como" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-xl font-display text-4xl font-semibold">Quanto menos campo, mais gente se candidata.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            [Zap, "1. Escolha a vaga", "Filtre pela sua cidade. Registro, Cajati, Iguape — tudo separado."],
            [Upload, "2. Envie o currículo", "Nome, WhatsApp e o arquivo. Pode ser até foto do currículo no celular."],
            [MessageCircle, "3. Receba no WhatsApp", "A empresa fala direto com você. Sem e-mail esquecido na caixa de spam."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-3xl bg-secondary p-8">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="empresas" className="bg-foreground py-24 text-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-widest opacity-60">Para empresas do Vale</p>
            <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Contrate gente daqui, sem depender de grupo de WhatsApp.</h2>
          </div>
          <ul className="space-y-4">
            {["Publique uma vaga em 2 minutos", "Receba candidatos só da região", "Veja todos os currículos num painel organizado", "Chame o candidato direto no WhatsApp"].map((i) => (
              <li key={i} className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 text-primary" />{i}</li>
            ))}
            <li className="pt-4"><a href="mailto:contato@vagasdovale.com.br" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Quero anunciar <ArrowRight className="h-4 w-4" /></a></li>
          </ul>
        </div>
      </section>

      <section id="cidades" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold flex items-center gap-3"><Users className="h-7 w-7 text-primary" />Cobrimos todo o Vale do Ribeira</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {cidades.map((c) => <span key={c} className="rounded-full border border-border px-4 py-2 text-sm">{c}</span>)}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Vagas do Vale · Empregos no Vale do Ribeira
      </footer>
    </div>
  );
}

function QuickApply() {
  const [sent, setSent] = useState(false);
  const [file, setFile] = useState<string>("");
  return (
    <div id="candidatar" className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
      {sent ? (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check /></div>
          <p className="mt-4 font-display text-2xl font-semibold">Currículo enviado!</p>
          <p className="mt-2 text-sm text-muted-foreground">A empresa vai te chamar no WhatsApp.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Exemplo de candidatura</p>
            <p className="mt-1 font-semibold">Auxiliar Administrativo · Registro</p>
          </div>
          <input required placeholder="Seu nome" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <input required type="tel" placeholder="WhatsApp (13) 9 0000-0000" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-secondary px-4 py-4 text-sm font-medium text-primary">
            <Upload className="h-4 w-4" />{file || "Anexar currículo (PDF ou foto)"}
            <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
          </label>
          <button className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Enviar candidatura</button>
          <p className="text-center text-xs text-muted-foreground">Só isso. Sem cadastro, sem senha.</p>
        </form>
      )}
    </div>
  );
}
