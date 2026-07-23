import React, { useState, useEffect } from 'react';
import { usePeriod } from '@/lib/context/PeriodContext';
import { CommandBar } from '@/components/domain/CommandBar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { db } from '@/lib/fake/db';
import { Bell, Sparkles, Sun, Send } from 'lucide-react';

interface TopbarProps {
  breadcrumb: React.ReactNode;
}

// ── Briefing drawer ─────────────────────────────────────────────────────────
function BriefingDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  // Editorial daily briefing derived from db
  const today = new Date('2026-07-23T12:00:00.000Z');
  const dateLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  const ftdToday = db.persons.filter(p => (p as any).ftd_at?.startsWith?.('2026-07-23') || (p as any).last_deposit_at?.startsWith?.('2026-07-23')).length;
  const netDeposit = db.persons.reduce((acc, p) => acc + ((p as any).total_deposited ?? 0) - ((p as any).total_withdrawn ?? 0), 0);
  const divergent = db.persons.filter(p => p.status === 'Divergent').length;

  const highlights = [
    { tone: 'verified', title: 'Integridade estável', body: `${ftdToday} FTDs reconciliados nas últimas 24h — nenhum sinal órfão nos canais principais.` },
    { tone: 'proof-blue', title: 'Meta Ads em aceleração', body: 'Campanha "Brasil Quente Jul/26" superou o CPFTD alvo em 12% após o novo criativo Video_Saque_v3.' },
    { tone: 'warning', title: 'Atenção em conciliação', body: `${divergent} pessoas com sinais divergentes aguardam revisão manual em Reconciliação.` },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-graphite border-line text-eggshell overflow-y-auto">
        <SheetHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-11 font-mono uppercase tracking-[0.18em] text-stone">
            <Sun className="w-3.5 h-3.5" />
            Briefing diário
          </div>
          <SheetTitle asChild>
            <h2 className="font-serif text-eggshell text-[28px] leading-tight tracking-tight capitalize">
              {dateLabel}.
            </h2>
          </SheetTitle>
          <SheetDescription className="text-stone text-13">
            Um resumo curto do que mudou desde ontem — só o que precisa da sua atenção.
          </SheetDescription>
        </SheetHeader>

        {/* Snapshot */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line bg-iron p-3">
            <div className="text-11 font-mono text-stone uppercase tracking-wider">Net deposit 24h</div>
            <div className="text-eggshell font-mono text-18 tabular-nums mt-1">
              R$ {netDeposit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-iron p-3">
            <div className="text-11 font-mono text-stone uppercase tracking-wider">FTDs hoje</div>
            <div className="text-verified font-mono text-18 tabular-nums mt-1">{ftdToday}</div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-6 space-y-3">
          {highlights.map((h, i) => (
            <article key={i} className="rounded-lg border border-line bg-iron p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  h.tone === 'verified' ? 'bg-verified' :
                  h.tone === 'warning' ? 'bg-warning' : 'bg-proof-blue'
                }`} />
                <h3 className="text-13 font-medium text-eggshell">{h.title}</h3>
              </div>
              <p className="text-13 text-stone leading-relaxed">{h.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-11 font-mono text-stone/70 uppercase tracking-wider">
          Gerado às 08:00 · próximo em 24h
        </p>
      </SheetContent>
    </Sheet>
  );
}

// ── Copilot drawer ──────────────────────────────────────────────────────────
function CopilotDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const suggestions = [
    'Por que o CPFTD subiu esta semana?',
    'Quais campanhas estão sem postback confirmado?',
    'Compare a integridade Meta vs TikTok nos últimos 7 dias.',
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-graphite border-line text-eggshell flex flex-col">
        <SheetHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-11 font-mono uppercase tracking-[0.18em] text-stone">
            <Sparkles className="w-3.5 h-3.5 text-proof-blue" />
            Copiloto
          </div>
          <SheetTitle asChild>
            <h2 className="font-serif text-eggshell text-[26px] leading-tight tracking-tight">
              Pergunte sobre seus sinais.
            </h2>
          </SheetTitle>
          <SheetDescription className="text-stone text-13">
            Consulte campanhas, integrações ou pessoas em linguagem natural. Respostas sempre citam a fonte.
          </SheetDescription>
        </SheetHeader>

        {/* Suggestions */}
        <div className="mt-6 space-y-2">
          <div className="text-11 font-mono text-stone/70 uppercase tracking-wider mb-2">Sugestões</div>
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2.5 rounded-lg border border-line bg-iron hover:bg-zinc text-13 text-eggshell transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Placeholder conversation area */}
        <div className="flex-1 mt-6 rounded-lg border border-dashed border-line/60 bg-iron/40 flex items-center justify-center px-6">
          <p className="text-12 text-stone text-center leading-relaxed">
            Cada resposta linka de volta à Signal Ledger — nada de opinião sem prova.
          </p>
        </div>

        {/* Input */}
        <form className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-iron px-3 py-2">
          <input
            type="text"
            placeholder="Pergunte ao Copiloto…"
            className="flex-1 bg-transparent outline-none text-13 text-eggshell placeholder:text-stone"
          />
          <button type="button" className="p-1.5 rounded-md bg-proof-blue/20 text-proof-blue hover:bg-proof-blue/30 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function Topbar({ breadcrumb }: TopbarProps) {
  const { period, setPeriod } = usePeriod();
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  // ⌘⇧B for briefing, ⌘⇧C for copilot (light shortcuts)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setBriefingOpen(v => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setCopilotOpen(v => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const periodOptions: { label: string; value: number }[] = [
    { label: 'Hoje', value: 1 },
    { label: '7 dias', value: 7 },
    { label: '30 dias', value: 30 },
    { label: '90 dias', value: 90 },
  ];

  return (
    <>
      <header className="h-14 bg-iron/80 backdrop-blur border-b border-line flex items-center justify-between gap-4 px-4 lg:px-6 sticky top-0 z-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 min-w-0">{breadcrumb}</div>

        {/* Center: global search */}
        <div className="hidden md:block flex-1 max-w-md">
          <CommandBar />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Period */}
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="hidden md:block bg-graphite border border-line text-eggshell text-12 font-mono rounded-md px-2 py-1.5 focus:outline-none focus:border-proof-blue"
          >
            {periodOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Briefing */}
          <button
            onClick={() => setBriefingOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line bg-graphite hover:bg-zinc text-13 text-eggshell transition-colors"
            title="Briefing diário (⌘⇧B)"
          >
            <Sun className="w-3.5 h-3.5 text-stone" />
            Briefing
          </button>

          {/* Copilot */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-eggshell text-ink hover:bg-eggshell/90 text-13 font-medium transition-colors"
            title="Abrir Copiloto (⌘⇧J)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Copiloto
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-md border border-line bg-graphite hover:bg-zinc flex items-center justify-center text-stone hover:text-eggshell transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-verified" />
          </button>

          {/* Avatar */}
          <button className="w-9 h-9 rounded-full bg-zinc border border-line flex items-center justify-center text-eggshell text-12 font-mono font-medium hover:bg-line transition-colors">
            JO
          </button>
        </div>
      </header>

      <BriefingDrawer open={briefingOpen} onOpenChange={setBriefingOpen} />
      <CopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
    </>
  );
}
