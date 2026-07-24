import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '@/lib/fake/db';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { StatusChip } from '@/components/domain/StatusChip';
import { EvidenceDrawer } from '@/components/data/EvidenceDrawer';
import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence, type EvidencePayload } from '@/lib/evidence';
import { Link } from 'wouter';
import type { SignalEvent, EventStatus } from '@/lib/fake/db';

const EVENT_TYPES = ['all', 'click', 'register', 'ftd', 'deposit', 'withdrawal', 'postback', 'capi', 'webhook'];

// Editorial translations — replace raw event types with narrative phrasing.
const TYPE_COPY: Record<string, { label: string; verb: string; tone: string }> = {
  click:              { label: 'Clique',          verb: 'Clique capturado',        tone: 'proof-blue' },
  register:           { label: 'Cadastro',        verb: 'Cadastro registrado',     tone: 'eggshell' },
  ftd:                { label: 'FTD',             verb: 'FTD reconciliado',        tone: 'verified' },
  deposit:            { label: 'Depósito',        verb: 'Depósito confirmado',     tone: 'verified' },
  withdrawal:         { label: 'Saque',           verb: 'Saque processado',        tone: 'critical' },
  postback:           { label: 'Postback',        verb: 'Postback recebido',       tone: 'proof-blue' },
  capi:               { label: 'CAPI',            verb: 'Sinal enviado ao CAPI',   tone: 'stone' },
  webhook:            { label: 'Webhook',         verb: 'Webhook confirmado',      tone: 'stone' },
  bot_message:        { label: 'Mensagem bot',    verb: 'Bot respondeu',           tone: 'stone' },
  conversation_start: { label: 'Conversa',        verb: 'Conversa iniciada',       tone: 'proof-blue' },
};

function toneClasses(tone: string) {
  switch (tone) {
    case 'verified':   return 'bg-verified/10 text-verified border-verified/20';
    case 'proof-blue': return 'bg-proof-blue/10 text-proof-blue border-proof-blue/20';
    case 'warning':    return 'bg-warning/10 text-warning border-warning/20';
    case 'critical':   return 'bg-critical/10 text-critical border-critical/20';
    case 'eggshell':   return 'bg-eggshell/10 text-eggshell border-eggshell/20';
    default:           return 'bg-zinc text-stone border-line';
  }
}

function relativeTime(isoStr: string): string {
  const now = new Date('2026-07-23T12:00:00.000Z').getTime();
  const then = new Date(isoStr).getTime();
  const diff = Math.abs(now - then);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `há ${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `há ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

export default function LiveEvents() {
  // Build lookups for editorial origin/name resolution
  const personMap = useMemo(() => {
    const m = new Map<string, (typeof db.persons)[number]>();
    for (const p of db.persons) m.set(p.id, p);
    return m;
  }, []);
  const campaignMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of db.campaigns ?? []) m.set(c.id, c.name);
    return m;
  }, []);

  function originOf(evt: SignalEvent): { source: string; campaign: string } {
    const p = personMap.get(evt.person_id);
    if (!p) return { source: '—', campaign: '—' };
    const sourceMap: Record<string, string> = {
      meta: 'Meta Ads',
      tiktok: 'TikTok Ads',
      telegram: 'Telegram',
      organic: 'Orgânico',
      direct: 'Direto',
      orphan: 'Sem origem',
    };
    const source = sourceMap[p.source as string] ?? String(p.source);
    const campaign = (p.campaign_id && campaignMap.get(p.campaign_id)) || p.utm_campaign || '—';
    return { source, campaign };
  }

  const [evts, setEvts] = useState<(SignalEvent & { _key: string })[]>(() =>
    db.events.slice(0, 40).map((e, i) => ({ ...e, _key: e.id + '_' + i }))
  );
  const [paused, setPaused] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [count, setCount] = useState(db.events.length);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const randomEvt = db.events[Math.floor(Math.random() * db.events.length)];
      const key = randomEvt.id + '_' + Date.now();
      setEvts(prev => [{ ...randomEvt, _key: key }, ...prev].slice(0, 80));
      setCount(c => c + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [evidence, setEvidence] = useState<EvidencePayload | null>(null);

  const openEvidenceFor = (evt: SignalEvent) => {
    const origin = originOf(evt);
    setEvidence(
      buildEvidence({
        label: `${evt.type.toUpperCase()} · ${evt.id}`,
        value: evt.value != null ? `R$ ${evt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—',
        formula:
          evt.type === 'ftd'
            ? 'first(deposit) per person where confirmed = true'
            : 'sum(events.value) where person_id = ? and type = ?',
        source: `${origin.source} · ${origin.campaign}`,
        state: evt.status === 'Reconciled' ? 'Reconciliado' : evt.status === 'Divergent' ? 'Divergente' : 'Provisório',
        freshness: `latência ${evt.latency_ms}ms`,
        formingEvents: [{ id: evt.id, type: evt.type, timestamp: evt.timestamp, value: evt.value ?? undefined }],
      }),
    );
  };

  const filtered = typeFilter === 'all' ? evts : evts.filter(e => e.type === typeFilter);

  return (
    <AppShell breadcrumb={[{ label: 'Observe', href: '/live' }, { label: 'Eventos ao Vivo' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Editorial header ─────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-2">
          <div>
            <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-3">
              Signal Stream
            </div>
            <h1
              className="text-eggshell font-serif tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}
            >
              O pulso da aquisição, em tempo real.
            </h1>
            <p className="text-stone text-14 mt-3 max-w-xl">
              Cada linha é um sinal — capturado, confirmado e correlacionado a uma pessoa e uma campanha.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2"><PreviewBadge /><StateShowcase /></div>
          </div>


          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verified/10 border border-verified/20">
              <span className={`w-2 h-2 rounded-full bg-verified ${paused ? '' : 'animate-pulse'}`} />
              <span className="text-11 text-verified font-medium">
                {paused ? 'Pausado' : 'Conectado'}
              </span>
            </div>
            <span className="text-12 font-mono text-stone tabular-nums">
              {count.toLocaleString('pt-BR')} sinais hoje
            </span>
          </div>
        </header>

        {/* ── Filter bar ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-graphite border border-line text-eggshell text-13 rounded-lg px-3 py-2 focus:outline-none focus:border-proof-blue"
          >
            {EVENT_TYPES.map(t => (
              <option key={t} value={t}>
                {t === 'all' ? 'Todos os tipos' : (TYPE_COPY[t]?.label ?? t)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setPaused(p => !p)}
            className={`h-9 px-4 rounded-lg text-13 font-medium transition-colors ${
              paused
                ? 'bg-eggshell text-ink hover:bg-eggshell/90'
                : 'bg-graphite border border-line text-eggshell hover:bg-zinc'
            }`}
          >
            {paused ? 'Retomar stream' : 'Pausar stream'}
          </button>
        </div>

        {/* ── Stream ───────────────────────────────────────────────────── */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-iron/60">
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Evento</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Origem</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Pessoa</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Latência</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Quando</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.slice(0, 50).map((evt) => {
                    const copy = TYPE_COPY[evt.type] ?? { label: evt.type, verb: evt.type, tone: 'stone' };
                    const origin = originOf(evt);
                    const person = personMap.get(evt.person_id);
                    return (
                      <motion.tr
                        key={evt._key}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="border-b border-line/60 last:border-0 hover:bg-zinc/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                              copy.tone === 'verified' ? 'bg-verified' :
                              copy.tone === 'proof-blue' ? 'bg-proof-blue' :
                              copy.tone === 'critical' ? 'bg-critical' :
                              copy.tone === 'warning' ? 'bg-warning' :
                              'bg-stone'
                            }`} />
                            <div className="min-w-0">
                              <div className="text-13 text-eggshell leading-tight">{copy.verb}</div>
                              <div className="text-11 font-mono text-stone truncate">{evt.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-12 text-eggshell leading-tight">{origin.source}</div>
                          <div className="text-11 text-stone truncate max-w-[180px]" title={origin.campaign}>
                            {origin.campaign}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/players/${evt.person_id}`} className="block group">
                            <div className="text-12 text-eggshell group-hover:text-proof-blue transition-colors leading-tight">
                              {person?.name ?? 'Anônimo'}
                            </div>
                            <div className="text-11 font-mono text-stone">{evt.person_id}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <StatusChip status={evt.status as EventStatus} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {evt.value != null ? (
                            <span className="font-mono text-13 text-eggshell tabular-nums">
                              R$ {evt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-stone text-13">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono text-12 tabular-nums ${
                            evt.latency_ms > 500 ? 'text-warning' : 'text-stone'
                          }`}>
                            {evt.latency_ms}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-12 text-stone whitespace-nowrap">{relativeTime(evt.timestamp)}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
