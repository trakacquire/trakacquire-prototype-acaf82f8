import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { DOMAINS } from '@/lib/fake/db';

type Tab = 'dns' | 'ssl' | 'health' | 'pool' | 'historico';

export default function Domain360Page() {
  const params = useParams<{ id: string }>();
  const { openEvidence } = useEvidence();
  const domain = DOMAINS.find((d) => d.id === params.id) ?? DOMAINS[0];
  const [tab, setTab] = useState<Tab>('dns');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);

  const runSyntheticLead = () => {
    setTesting(true); setTestResult(null);
    setTimeout(() => { setTesting(false); setTestResult('ok'); }, 1200);
  };

  const dnsRecords = [
    { host: '@', type: 'A', value: '198.51.100.42', status: domain.status === 'active' ? 'ok' : 'pending' },
    { host: '@', type: 'AAAA', value: '2001:db8::42', status: domain.status === 'active' ? 'ok' : 'pending' },
    { host: '_proof', type: 'TXT', value: 'proofline-verify=' + domain.id, status: 'ok' },
    { host: 'www', type: 'CNAME', value: 'proxy.trakacquire.io', status: domain.status === 'active' ? 'ok' : 'pending' },
  ];

  const p95 = domain.status === 'active' ? 48 : 0;
  const uptime = domain.status === 'active' ? 99.98 : 0;

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'dns', label: 'DNS records' },
    { id: 'ssl', label: 'SSL' },
    { id: 'health', label: 'Health check' },
    { id: 'pool', label: 'Pool / rotação' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Domínios', href: '/domains' }, { label: domain.domain }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="kicker">Connect · Domínio</span>
              <PreviewBadge />
              <StatusChip status={domain.status === 'active' ? 'Confirmed' : 'Captured'} />
              <FreshnessTag ageSeconds={120} source="Edge probes · a cada 2min" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24 font-mono">{domain.domain}</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">DNS por estado, SSL com validade, health check com lead sintético (rotulado <span className="font-mono text-eggshell">Synthetic</span>) e pool com domínio reserva pronto.</p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPI label="Uptime (30d)" value={`${uptime.toFixed(2)}%`} tone={uptime >= 99.9 ? 'verified' : 'warning'} onOpenEvidence={() => openEvidence(buildEvidence({ label: `Uptime · ${domain.domain}`, value: `${uptime.toFixed(2)}%`, formula: '1 - (down_seconds / total_seconds)', source: 'Cloudflare probes' }))} />
          <KPI label="P95 redirect" value={`${p95}ms`} tone={p95 > 200 ? 'warning' : 'default'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Latência P95', value: `${p95}ms`, formula: 'percentile(latency_ms, 0.95)', source: 'Edge logs' }))} />
          <KPI label="Cliques (30d)" value={domain.clicks_30d.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Cliques 30d', value: domain.clicks_30d.toLocaleString('pt-BR'), formula: 'count(events.click) where domain=?', source: 'Signal Ledger' }))} />
          <KPI label="SSL válido até" value={domain.ssl ? '2027-01-14' : '—'} tone={domain.ssl ? 'verified' : 'warning'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'SSL validity', value: domain.ssl ? '2027-01-14' : '—', formula: 'certificate.expires_at', source: "Let's Encrypt · renovação automática" }))} />
        </div>

        <div className="border-b border-line flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`pb-3 text-13 font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}>{t.label}</button>
          ))}
        </div>

        <ScenarioStateGate emptyTitle="Sem métricas para este domínio">
          {tab === 'dns' && (
            <div className="bg-graphite border border-line rounded-xl overflow-hidden">
              <table className="w-full text-13">
                <thead>
                  <tr className="border-b border-line">
                    {['Host', 'Tipo', 'Valor', 'Estado'].map((h) => (
                      <th key={h} className="text-left text-11 font-mono uppercase text-stone px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dnsRecords.map((r, i) => (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-mono text-12 text-eggshell">{r.host}</td>
                      <td className="px-4 py-3 font-mono text-12 text-stone">{r.type}</td>
                      <td className="px-4 py-3 font-mono text-12 text-eggshell">{r.value}</td>
                      <td className="px-4 py-3"><StatusChip status={r.status === 'ok' ? 'Confirmed' : 'Captured'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'ssl' && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
              <h3 className="text-14 font-semibold text-eggshell">Certificado</h3>
              <div className="grid grid-cols-2 gap-4 text-13">
                <div><div className="text-11 font-mono uppercase text-stone">Emissor</div><div className="text-eggshell mt-1">Let's Encrypt R3</div></div>
                <div><div className="text-11 font-mono uppercase text-stone">Válido de</div><div className="font-mono text-eggshell mt-1 tabular-nums">2026-10-14</div></div>
                <div><div className="text-11 font-mono uppercase text-stone">Válido até</div><div className="font-mono text-eggshell mt-1 tabular-nums">2027-01-14</div></div>
                <div><div className="text-11 font-mono uppercase text-stone">Renovação</div><div className="text-eggshell mt-1">Automática · 30d antes</div></div>
              </div>
            </div>
          )}

          {tab === 'health' && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-14 font-semibold text-eggshell">Health check com lead sintético</h3>
                <StatusChip status="Synthetic" />
              </div>
              <p className="text-12 text-stone">O check dispara um clique marcado <span className="font-mono text-eggshell">Synthetic</span>, segue toda a jornada (presell → bot → registro fake) e verifica o postback. Nunca conta na receita.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={runSyntheticLead} className="text-13 bg-eggshell text-ink rounded-md px-4 py-2 hover:bg-white">{testing ? 'Executando…' : 'Rodar lead sintético'}</button>
                {testResult === 'ok' && (
                  <span className="inline-flex items-center gap-2 text-12 font-mono text-verified">
                    <span className="w-2 h-2 rounded-full bg-verified" /> Redirect 96ms · postback OK · sem divergência
                  </span>
                )}
              </div>
            </div>
          )}

          {tab === 'pool' && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
              <h3 className="text-14 font-semibold text-eggshell">Pool &amp; rotação</h3>
              <p className="text-12 text-stone">Se este domínio degradar, o tráfego migra para o reserva sem downtime.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DOMAINS.slice(0, 3).map((d) => (
                  <Link key={d.id} href={`/domains/${d.id}`} className="border border-line rounded-md p-3 bg-zinc/60 hover:border-stone">
                    <div className="text-11 font-mono uppercase text-stone">{d.id === domain.id ? 'Ativo' : d.type === 'offer' ? 'Reserva' : 'Alternativo'}</div>
                    <div className="text-13 font-mono text-eggshell mt-1 truncate">{d.domain}</div>
                    <StatusChip status={d.status === 'active' ? 'Confirmed' : 'Captured'} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tab === 'historico' && (
            <div className="bg-graphite border border-line rounded-xl overflow-hidden">
              <table className="w-full text-13">
                <thead>
                  <tr className="border-b border-line">
                    {['Data', 'Evento', 'Detalhe'].map((h) => (
                      <th key={h} className="text-left text-11 font-mono uppercase text-stone px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { at: '2026-07-22 09:11', evento: 'Health check', detalhe: 'Synthetic lead 96ms · OK' },
                    { at: '2026-07-15 14:00', evento: 'SSL renovado', detalhe: 'Let\'s Encrypt · até 2027-01-14' },
                    { at: '2026-05-04 08:22', evento: 'Domínio adicionado', detalhe: 'Verificação DNS concluída em 47min' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-mono text-11 text-stone tabular-nums">{r.at}</td>
                      <td className="px-4 py-3 text-eggshell">{r.evento}</td>
                      <td className="px-4 py-3 text-stone">{r.detalhe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
