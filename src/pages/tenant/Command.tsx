import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const brl = (n: number) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
const num = (n: number) => n.toLocaleString('pt-BR');

// ── Editorial live feed mapping ─────────────────────────────────────────────
const EVENT_COPY: Record<string, { label: string; tone: 'verified' | 'proof' | 'warning' | 'stone' }> = {
  ftd:                { label: 'FTD reconciliado',       tone: 'verified' },
  deposit:            { label: 'Depósito reconciliado',  tone: 'verified' },
  postback:           { label: 'Postback recebido',      tone: 'proof' },
  capi:               { label: 'CAPI aceita',            tone: 'proof' },
  webhook:            { label: 'Webhook confirmado',     tone: 'proof' },
  register:           { label: 'Identidade confirmada',  tone: 'proof' },
  click:              { label: 'Clique capturado',       tone: 'stone' },
  bot_message:        { label: 'Mensagem do bot',        tone: 'stone' },
  conversation_start: { label: 'Conversa iniciada',      tone: 'stone' },
  withdrawal:         { label: 'Saque conciliado',       tone: 'stone' },
};

const SOURCE_LABEL: Record<string, string> = {
  meta: 'Meta',
  tiktok: 'TikTok',
  organic: 'Orgânico',
  orphan: 'Origem órfã',
};

const TONE_DOT: Record<string, string> = {
  verified: 'bg-verified',
  proof: 'bg-proof-blue',
  warning: 'bg-warning',
  stone: 'bg-stone/60',
};

export default function CommandPage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);
  const spend = db.spendForPeriod(period);

  // ── Proof integrity: reconciled / (reconciled + divergent) across all deposits
  const allDeposits = db.persons.flatMap((p) => p.deposits).filter((d) => d.amount > 0 && d.type !== 'chargeback');
  const reconciledCount = allDeposits.filter((d) => d.reconciled).length;
  const proofIntegrity = allDeposits.length > 0
    ? (reconciledCount / allDeposits.length) * 100
    : 100;

  // ── Journey proof stages (Captured → Linked → Registered → Confirmed → Reconciled)
  const statusCounts: Record<string, number> = {};
  for (const p of db.persons) statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;

  const capturedTotal = m.clicks;
  const linkedTotal = db.persons.filter((p) => !p.is_orphan).length;
  const registeredTotal = m.registrations;
  const confirmedTotal = m.ftds;
  const reconciledTotal = reconciledCount;
  const pendingReconcile = allDeposits.length - reconciledCount;

  const journey = [
    { key: 'captured',   label: 'Captured',   value: capturedTotal,   sub: 'Cliques' },
    { key: 'linked',     label: 'Linked',     value: linkedTotal,     sub: 'Identidades costuradas' },
    { key: 'registered', label: 'Registered', value: registeredTotal, sub: 'Cadastros' },
    { key: 'confirmed',  label: 'Confirmed',  value: confirmedTotal,  sub: 'FTDs' },
    { key: 'reconciled', label: 'Reconciled', value: reconciledTotal, sub: pendingReconcile > 0 ? `${pendingReconcile} pendentes` : 'D+1 completa' },
  ];

  // ── Journey chart: FTDs (área proof-blue) + baseline reconciliação tracejada
  const ftdsSeries = db.dailySeries(period, 'ftds');
  const chartData = ftdsSeries.map((pt) => {
    const raw = pt.value;
    return {
      date: pt.date.slice(-5).replace('-', '/'),
      ftds: raw,
      reconciled: Math.max(0, Math.round(raw * (reconciledCount / Math.max(1, allDeposits.length)))),
    };
  });

  // ── Live feed com linguagem editorial
  const liveFeed = db.events.slice(0, 8).map((e) => {
    const person = db.persons.find((p) => p.id === e.person_id);
    const copy = EVENT_COPY[e.type] ?? { label: e.type, tone: 'stone' as const };
    const origin = person
      ? [SOURCE_LABEL[person.source] ?? person.source, person.campaign_id ? '· ' + person.campaign_id.replace(/^camp_/, '') : ''].filter(Boolean).join(' ')
      : '—';
    return {
      id: e.id,
      time: e.timestamp.slice(11, 19),
      label: copy.label,
      tone: copy.tone,
      origin,
      value: (e as any).value as number | undefined,
    };
  });

  const lastEventAgo = db.events[0]
    ? Math.max(1, Math.round((Date.now() - new Date(db.events[0].timestamp).getTime()) / 1000))
    : null;

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 12,
    color: 'hsl(var(--eggshell))',
  } as const;

  return (
    <AppShell breadcrumb={[{ label: 'Command' }]}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Editorial header ─────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-2">
          <div>
            <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-3">
              Proofline Command
            </div>
            <h1
              className="text-eggshell font-serif tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}
            >
              Todos os sinais estão sob controle.
            </h1>
            <p className="text-stone text-14 mt-3 max-w-xl">
              Uma visão objetiva da aquisição, identidade, receita e integridade das integrações.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="h-9 px-4 rounded-lg border border-line bg-graphite hover:bg-zinc text-13 text-eggshell transition-colors">
              Briefing diário
            </button>
            <button className="h-9 px-4 rounded-lg bg-eggshell text-ink text-13 font-medium hover:bg-eggshell/90 transition-colors">
              Abrir copiloto
            </button>
          </div>
        </header>

        {/* ── KPI row (Proof integrity + 4 métricas Proofline) ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Proof integrity — hero */}
          <div className="md:col-span-1 relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-graphite via-graphite to-iron p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-verified opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-verified" />
              </span>
              <span className="text-11 font-mono uppercase tracking-wider text-stone">Proof integrity</span>
            </div>
            <div className="text-eggshell font-mono tabular-nums text-[28px] leading-none font-semibold">
              {proofIntegrity.toFixed(1)}<span className="text-stone text-18">%</span>
            </div>
            <div className="text-11 text-stone mt-2 leading-relaxed">
              {lastEventAgo !== null ? <>Último evento há {lastEventAgo}s ·<br/></> : null}
              {pendingReconcile === 0 ? 'reconciliação D+1 completa' : `${pendingReconcile} depósitos pendentes`}
            </div>
          </div>

          <KpiCard label="Investimento" value={brl(spend.total)} delta={`↗ ${m.roi_pct}% ROI`} deltaTone="verified" />
          <KpiCard label="FTDs oficiais" value={num(m.ftds)} delta={`${m.ftd_rate}% conversão`} deltaTone="proof" />
          <KpiCard label="Custo / FTD" value={brl(m.cpftd)} delta="↓ 4,8%" deltaTone="verified" />
          <KpiCard label="Net deposit" value={brl(m.net_deposits)} delta={`↑ ${brl(m.gross_margin)}`} deltaTone="verified" />
        </div>

        {/* ── Journey proof + Live proof feed ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Journey proof (2/3) */}
          <div className="lg:col-span-2 rounded-xl border border-line bg-graphite p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-eggshell text-16 font-medium">Journey proof</h3>
                <p className="text-stone text-12 mt-0.5">Do clique ao valor reconciliado</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-11 font-mono text-verified border border-verified/30 bg-verified/10 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-verified" /> Ao vivo
              </span>
            </div>

            {/* Etapas do funil embutidas */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {journey.map((stg, i) => {
                const pctFromPrev = i === 0
                  ? 100
                  : journey[i - 1].value > 0
                    ? (stg.value / journey[i - 1].value) * 100
                    : 0;
                return (
                  <div key={stg.key} className="rounded-lg border border-line bg-iron/60 px-3 py-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone">{stg.label}</div>
                    <div className="text-eggshell font-mono tabular-nums text-20 mt-1">{num(stg.value)}</div>
                    <div className="text-11 text-stone mt-0.5">
                      {i === 0 ? stg.sub : `${pctFromPrev.toFixed(1)}%`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart: FTDs (área) + baseline reconciliada (linha tracejada) */}
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ftdArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C91FF" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#7C91FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--line))' }} />
                  <Area type="monotone" dataKey="ftds" stroke="#7C91FF" strokeWidth={2} fill="url(#ftdArea)" name="FTDs" dot={false} />
                  <Area type="monotone" dataKey="reconciled" stroke="#F6F1E7" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Reconciliado" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 mt-2 text-11 text-stone">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-proof-blue" /> FTDs</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-px border-t border-dashed border-eggshell" /> Reconciliado</span>
            </div>
          </div>

          {/* Live proof feed (1/3) */}
          <div className="rounded-xl border border-line bg-graphite p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-eggshell text-16 font-medium">Live proof feed</h3>
                <p className="text-stone text-12 mt-0.5">Eventos com impacto real</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-11 font-mono text-verified border border-verified/30 bg-verified/10 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-verified" /> saudável
              </span>
            </div>

            <ul className="flex-1 space-y-3">
              {liveFeed.map((evt) => (
                <li key={evt.id} className="flex items-start gap-3">
                  <span className="font-mono text-11 text-stone/80 tabular-nums shrink-0 w-14 pt-0.5">{evt.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${TONE_DOT[evt.tone]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-eggshell text-13 leading-tight truncate">{evt.label}</div>
                    <div className="text-stone text-11 mt-0.5 truncate">{evt.origin}</div>
                  </div>
                  {evt.value !== undefined && (
                    <span className="font-mono text-12 text-eggshell tabular-nums shrink-0">
                      {brl(evt.value)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </AppShell>
  );
}

// ── KPI card compacto ────────────────────────────────────────────────────────
function KpiCard({
  label, value, delta, deltaTone,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'verified' | 'proof' | 'warning' | 'critical';
}) {
  const toneClass =
    deltaTone === 'verified' ? 'text-verified'
    : deltaTone === 'proof' ? 'text-proof-blue'
    : deltaTone === 'warning' ? 'text-warning'
    : deltaTone === 'critical' ? 'text-critical'
    : 'text-stone';
  return (
    <div className="rounded-xl border border-line bg-graphite hover:bg-graphite/80 transition-colors p-4">
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className="text-eggshell font-mono tabular-nums text-[26px] leading-none font-semibold">{value}</div>
      {delta && <div className={`text-11 mt-2 ${toneClass}`}>{delta}</div>}
    </div>
  );
}
