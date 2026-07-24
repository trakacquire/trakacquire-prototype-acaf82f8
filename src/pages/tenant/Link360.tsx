import React, { useState } from 'react';
import { useParams } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { LINKS } from '@/lib/fake/db';
import { Copy, Check } from 'lucide-react';

type Tab = 'visao' | 'ab' | 'regras' | 'snippet' | 'historico';

export default function Link360Page() {
  const params = useParams<{ id: string }>();
  const { openEvidence } = useEvidence();
  const link = LINKS.find((l) => l.id === params.id) ?? LINKS[0];
  const [tab, setTab] = useState<Tab>('visao');
  const [copied, setCopied] = useState<string | null>(null);

  const conv = link.clicks > 0 ? (link.ftds / link.clicks) * 100 : 0;
  const clickId = `cid_${link.id.slice(-4)}A19f2c`;
  const fullUrl = `https://${link.url}?click_id=${clickId}`;

  const copy = (v: string, k: string) => { navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(null), 1500); };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'visao', label: 'Visão' },
    { id: 'ab', label: 'Split A/B' },
    { id: 'regras', label: 'Regras device/geo/hora' },
    { id: 'snippet', label: 'QR + snippet' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Tracking', href: '/tracking' }, { label: link.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-14 font-serif italic text-stone leading-none">Connect · Link {link.id}</span>
              <PreviewBadge />
              <StatusChip status={link.status === 'active' ? 'Confirmed' : link.status === 'paused' ? 'Captured' : 'Orphan'} />
              <FreshnessTag ageSeconds={120} source="Signal Ledger" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">{link.name}</h1>
          </div>
        </header>

        <div className="bg-graphite border border-line rounded-xl p-4 flex items-center gap-2">
          <code className="flex-1 font-mono text-12 text-eggshell truncate">{fullUrl}</code>
          <button onClick={() => copy(fullUrl, 'url')} className="border border-line rounded-md px-3 py-2 text-stone hover:text-eggshell hover:border-stone">
            {copied === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Cliques" value={link.clicks.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Cliques', value: link.clicks.toLocaleString('pt-BR'), formula: 'count(events.click) where link_id=?', source: 'Signal Ledger' }))} />
          <KPI label="Únicos" value={link.unique_clicks.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Cliques únicos', value: link.unique_clicks.toLocaleString('pt-BR'), formula: 'count(distinct click_id)', source: 'Signal Ledger' }))} />
          <KPI label="Registros" value={link.registrations.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Registros', value: link.registrations.toLocaleString('pt-BR'), formula: 'count(persons.registered_at)', source: 'TAP postback' }))} />
          <KPI label="FTDs" value={link.ftds.toLocaleString('pt-BR')} tone="verified" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'FTDs', value: link.ftds.toLocaleString('pt-BR'), formula: 'count(persons.ftd_at)', source: 'TAP postback (reconciliado)', state: 'Reconciliado' }))} />
        </div>

        <div className="border-b border-line flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`pb-3 text-13 font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}>{t.label}</button>
          ))}
        </div>

        <ScenarioStateGate emptyTitle="Sem tráfego neste link">
          {tab === 'visao' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-graphite border border-line rounded-xl p-5 space-y-2">
                <div className="text-11 font-mono uppercase text-stone">click_id (opaco)</div>
                <code className="block font-mono text-13 text-eggshell tabular-nums">{clickId}</code>
                <div className="text-11 text-stone">Nunca reversível · não expõe UTMs no cliente.</div>
              </div>
              <div className="bg-graphite border border-line rounded-xl p-5 space-y-2">
                <div className="text-11 font-mono uppercase text-stone">Destino</div>
                <div className="font-mono text-13 text-eggshell truncate">{link.destination}</div>
                <div className="text-11 text-stone">Conv. observada: <MetricValue value={`${conv.toFixed(1)}%`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Conversão', value: `${conv.toFixed(1)}%`, formula: 'ftds / clicks', source: 'Signal Ledger' }))} /></div>
              </div>
            </div>
          )}

          {tab === 'ab' && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
              <h3 className="text-14 font-semibold text-eggshell">Split A/B</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ v: 'A', share: 50, conv: (conv * 0.95).toFixed(1) }, { v: 'B', share: 50, conv: (conv * 1.05).toFixed(1) }].map((v) => (
                  <div key={v.v} className="border border-line rounded-md p-4">
                    <div className="text-11 font-mono uppercase text-stone">Variante {v.v}</div>
                    <div className="text-24 font-mono text-eggshell tabular-nums mt-2">{v.conv}%</div>
                    <div className="text-11 text-stone mt-1">Tráfego: {v.share}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'regras' && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
              <h3 className="text-14 font-semibold text-eggshell">Regras ativas</h3>
              <ul className="space-y-2 text-13">
                {[
                  { rule: 'device = mobile', action: 'destino /mobile-first' },
                  { rule: 'geo in [BR, PT]', action: 'liberar' },
                  { rule: 'hora in [06:00, 23:59]', action: 'liberar' },
                  { rule: 'default', action: 'bloquear' },
                ].map((r, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
                    <span className="font-mono text-12 text-eggshell">{r.rule}</span>
                    <span className="text-12 text-stone">→ {r.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'snippet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-graphite border border-line rounded-xl p-5">
                <div className="text-11 font-mono uppercase text-stone mb-2">QR Code</div>
                <div className="aspect-square max-w-[200px] bg-eggshell rounded-md grid place-items-center text-ink font-mono text-11">QR · {link.id}</div>
              </div>
              <div className="bg-graphite border border-line rounded-xl p-5">
                <div className="text-11 font-mono uppercase text-stone mb-2">Snippet</div>
                <pre className="bg-ink border border-line rounded-md p-3 overflow-x-auto text-11 font-mono text-eggshell">{`<a href="${fullUrl}">${link.name}</a>`}</pre>
              </div>
            </div>
          )}

          {tab === 'historico' && (
            <div className="bg-graphite border border-line rounded-xl p-5 text-13 text-stone">
              Criado em {new Date(link.created_at).toLocaleDateString('pt-BR')} · 0 alterações registradas.
            </div>
          )}
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function KPI({ label, value, tone = 'default', onOpenEvidence }: { label: string; value: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onOpenEvidence?: () => void }) {
  const cls = tone === 'verified' ? 'text-verified' : tone === 'warning' ? 'text-warning' : tone === 'critical' ? 'text-critical' : 'text-eggshell';
  return (
    <button type="button" onClick={onOpenEvidence} className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4">
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className={`font-mono tabular-nums text-24 leading-none font-semibold ${cls}`}>{value}</div>
    </button>
  );
}
