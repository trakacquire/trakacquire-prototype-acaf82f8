import React from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
// PreviewBadge + FreshnessTag consolidados no chip-honest do header (Onda H1).

import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { TargetKpi } from '@/components/data/TargetKpi';
import { BottleneckPanel } from '@/components/data/BottleneckPanel';
import { RadarPanel } from '@/components/data/RadarPanel';
import { ActivationChecklist } from '@/components/data/ActivationChecklist';
import { KPI_TARGETS } from '@/lib/fake/funnelSteps';
import { buildEvidence } from '@/lib/evidence';
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
  const { openEvidence } = useEvidence();
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

  // Monotonic funnel: each stage <= previous. Enforced by clamping so the
  // narrative of proof never inverts — Reconciled can never exceed Confirmed, etc.
  const capturedTotal = m.clicks;
  // Linked = cliques amarrados a uma pessoa (identidade resolvida via cookie/UTM/telegram_id).
  // NÃO é 100% dos capturados: a diferença Captured→Linked é a perda de atribuição.
  const linkedTotal = db.journeyLinked(period);

  const registeredTotal = Math.min(m.registrations, linkedTotal);
  const confirmedTotal = Math.min(m.ftds, registeredTotal);
  const reconciledTotal = Math.min(reconciledCount, confirmedTotal);
  const pendingReconcile = Math.max(0, confirmedTotal - reconciledTotal);

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

  // ── Live feed em ordem cronológica decrescente (timestamp mono, data curta)
  const nowMs = Date.now();
  const liveFeed = [...db.events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)
    .map((e) => {
      const person = db.persons.find((p) => p.id === e.person_id);
      const copy = EVENT_COPY[e.type] ?? { label: e.type, tone: 'stone' as const };
      const origin = person
        ? [SOURCE_LABEL[person.source] ?? person.source, person.campaign_id ? '· ' + person.campaign_id.replace(/^camp_/, '') : ''].filter(Boolean).join(' ')
        : '—';
      const ts = new Date(e.timestamp);
      const ageMin = (nowMs - ts.getTime()) / 60000;
      const time = ageMin < 60
        ? `há ${Math.max(1, Math.round(ageMin))}m`
        : ageMin < 60 * 24
          ? `há ${Math.round(ageMin / 60)}h`
          : `${String(ts.getUTCDate()).padStart(2, '0')}/${String(ts.getUTCMonth() + 1).padStart(2, '0')} ${e.timestamp.slice(11, 16)}`;
      return {
        id: e.id,
        time,
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

        {/* ── Onda H1 · header enxuto: 1 eyebrow + 1 h1 + 1 subtitle + chip único ── */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-2">
          <div className="min-w-0">
            <div className="eyebrow mb-2">Overview · Command</div>
            <h1 className="page-title">Todos os sinais estão sob controle.</h1>
            <p className="page-subtitle mt-1.5 max-w-xl">
              Uma visão objetiva da aquisição, identidade, receita e integridade das integrações.
            </p>
            {/* Chip honesto — funde PRÉVIA + freshness + reconciliação + estado do cenário */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip-honest">
                <span className="w-1 h-1 rounded-full bg-warning" />
                Prévia
                <span className="chip-honest-sep" />
                {lastEventAgo !== null ? <>ao vivo · há {lastEventAgo}s</> : 'sem eventos'}
                <span className="chip-honest-sep" />
                <span className="text-verified">{pendingReconcile === 0 ? 'reconciliado D+1' : `${pendingReconcile} pendentes`}</span>
                <span className="chip-honest-sep" />
                <ScenarioChipSegment />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="h-9 px-4 rounded-[9px] border border-line bg-graphite hover:bg-zinc text-13 text-eggshell transition-colors press">
              Briefing diário
            </button>
            <button className="btn-eggshell h-9 px-4 text-13">
              Abrir copiloto
            </button>
          </div>
        </header>


        {/* ── KPI row (Proof integrity + 4 métricas Proofline) ─────────── */}
        <ScenarioStateGate
          emptyTitle="Sem sinais no período"
          emptyDescription="Nenhum evento chegou dentro do recorte atual — o Command não tem o que provar."
          degradedIntegration="Signal Ingest"
        >
        {/* E5 · Checklist de ativação — só aparece até o primeiro FTD reconciliar. */}
        <ActivationChecklist />

        {/* E7 · Nível 1 — o quê */}
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-11 font-mono uppercase tracking-[0.18em] text-stone">Nível 1 · Sinais</span>
          <span className="h-px flex-1 bg-line/70" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Proof integrity — hero */}
          <button
            type="button"
            onClick={() => openEvidence(buildEvidence({
              label: 'Proof integrity',
              value: `${proofIntegrity.toFixed(1)}%`,
              formula: 'count(deposits.reconciled == true) / count(deposits.amount > 0)',
              source: 'TAP Postback vs. Ledger interno',
              state: pendingReconcile === 0 ? 'Reconciliado' : 'Provisório',
              freshness: lastEventAgo !== null ? `último evento há ${lastEventAgo}s` : 'sem eventos',
            }))}
            className="text-left md:col-span-1 relative overflow-hidden rounded-xl border border-line surface-raised p-4 hover:border-stone transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              {/* Health Orb — Fase F.3 */}
              <span className="health-orb" aria-hidden />
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone mb-0.5">Proof integrity</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified dot-glow-verified" />
                  <span className="text-11 font-mono text-verified">operacional</span>
                </div>
              </div>
            </div>
            <MetricValue value={proofIntegrity.toFixed(1)} unit="%" size="xl" tone="default" />
            <div className="text-11 text-stone mt-2 leading-relaxed font-mono tabular-nums">
              {lastEventAgo !== null ? <>último evento há {lastEventAgo}s ·<br/></> : null}
              {pendingReconcile === 0 ? 'reconciliação D+1 completa' : `${pendingReconcile} depósitos pendentes`}
            </div>
          </button>

          <KpiCard
            label="Investimento"
            value={brl(spend.total)}
            delta={`↗ ${m.roi_pct}% ROI`}
            deltaTone="verified"
            onClick={() => openEvidence(buildEvidence({
              label: 'Investimento',
              value: brl(spend.total),
              formula: 'sum(spend.daily) where source in {meta, tiktok}',
              source: 'Meta Ads API + TikTok Ads API (D+1)',
              state: 'Reconciliado',
            }))}
          />
          <KpiCard
            label="FTDs oficiais"
            value={num(m.ftds)}
            delta={`${m.ftd_rate}% conversão`}
            deltaTone="proof"
            onClick={() => openEvidence(buildEvidence({
              label: 'FTDs oficiais',
              value: num(m.ftds),
              formula: 'count(deposits) where type == "ftd" and reconciled == true',
              source: 'TAP Postback (operacional)',
              state: 'Reconciliado',
              attribution: 'Last Qualified Click · janela 30d · congelado no registro',
            }))}
          />
          <TargetKpi
            label="Custo / FTD"
            value={m.cpftd}
            format={brl}
            target={KPI_TARGETS.cost_ftd}
            onOpenEvidence={() => openEvidence(buildEvidence({
              label: 'Custo / FTD',
              value: `${brl(m.cpftd)} (meta < ${brl(KPI_TARGETS.cost_ftd)})`,
              formula: 'sum(spend.total) / count(ftds)',
              source: 'Derivado — Investimento ÷ FTDs oficiais',
              state: 'Reconciliado',
              attribution: 'Semáforo: <80% meta = verified · 80–100% = warning · acima = critical',
            }))}
          />

          <KpiCard
            label="Net deposit"
            value={brl(m.net_deposits)}
            delta={`↑ ${brl(m.gross_margin)}`}
            deltaTone="verified"
            onClick={() => openEvidence(buildEvidence({
              label: 'Net deposit',
              value: brl(m.net_deposits),
              formula: 'sum(deposits.amount) − sum(withdrawals.amount)',
              source: 'TAP Postback + Payments Ledger',
              state: 'Reconciliado',
            }))}
          />
        </div>

        {/* E7 · Nível 2 — o porquê */}
        <div className="flex items-baseline gap-3 pt-4">
          <span className="text-11 font-mono uppercase tracking-[0.18em] text-stone">Nível 2 · Diagnóstico</span>
          <span className="h-px flex-1 bg-line/70" />
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

            {/* Etapas do funil embutidas (cada bloco abre Evidence) */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {journey.map((stg, i) => {
                const pctFromPrev = i === 0
                  ? 100
                  : journey[i - 1].value > 0
                    ? (stg.value / journey[i - 1].value) * 100
                    : 0;
                return (
                  <button
                    key={stg.key}
                    type="button"
                    onClick={() => openEvidence(buildEvidence({
                      label: `Journey · ${stg.label}`,
                      value: num(stg.value),
                      formula: `count(persons) where stage_reached >= "${stg.label}"`,
                      source: 'Identity Graph + TAP Postback',
                      state: stg.key === 'reconciled' && pendingReconcile > 0 ? 'Provisório' : 'Reconciliado',
                      attribution: i === 0 ? '—' : `Retenção etapa anterior: ${pctFromPrev.toFixed(1)}%`,
                    }))}
                    className="text-left rounded-lg border border-line bg-iron/60 px-3 py-2.5 hover:border-stone transition-colors"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-stone">{stg.label}</div>
                    <div className="text-eggshell font-mono tabular-nums text-20 mt-1">{num(stg.value)}</div>
                    <div className="text-11 text-stone mt-0.5">
                      {i === 0 ? stg.sub : `${pctFromPrev.toFixed(1)}%`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chart: FTDs (área) + baseline reconciliada (linha tracejada) */}
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ftdArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--proof-blue))" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="hsl(var(--proof-blue))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--line))' }} />
                  <Area type="monotone" dataKey="ftds" stroke="hsl(var(--proof-blue))" strokeWidth={2} fill="url(#ftdArea)" name="FTDs" dot={false} />
                  <Area type="monotone" dataKey="reconciled" stroke="hsl(var(--eggshell))" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Reconciliado" dot={false} />
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
                  <span className="font-mono text-11 text-stone/80 tabular-nums shrink-0 w-16 pt-0.5">{evt.time}</span>
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

        {/* ── Gargalos por etapa (diagnóstico) ─────────────────────────── */}
        <BottleneckPanel
          period={period}
          onOpenEvidence={(label, value, formula) =>
            openEvidence(buildEvidence({
              label,
              value,
              formula,
              source: 'Journey proof (dataset canônico)',
              state: 'Reconciliado',
            }))
          }
        />

        {/* E6 · Radar — anomalias derivadas do dataset canônico. */}
        <RadarPanel period={period} />
        </ScenarioStateGate>

      </div>
    </AppShell>
  );
}

// ── KPI card compacto (clicável — abre Evidence Drawer) ─────────────────────
function KpiCard({
  label, value, delta, deltaTone, onClick,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'verified' | 'proof' | 'warning' | 'critical';
  onClick?: () => void;
}) {
  const toneClass =
    deltaTone === 'verified' ? 'text-verified'
    : deltaTone === 'proof' ? 'text-proof-blue'
    : deltaTone === 'warning' ? 'text-warning'
    : deltaTone === 'critical' ? 'text-critical'
    : 'text-stone';
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4"
    >
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className="text-eggshell font-mono tabular-nums text-[26px] leading-none font-semibold">{value}</div>
      {delta && <div className={`text-11 mt-2 ${toneClass}`}>{delta}</div>}
    </button>
  );
}
