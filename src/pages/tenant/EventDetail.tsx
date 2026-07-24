import React from 'react';
import { Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { StatusChip } from '@/components/domain/StatusChip';
import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const { openEvidence } = useEvidence();
  const evt = db.events.find((e) => e.id === params.eventId);
  const person = evt ? db.persons.find((p) => p.id === evt.person_id) : null;

  const ageSec = evt
    ? Math.max(1, Math.round((Date.now() - new Date(evt.timestamp).getTime()) / 1000))
    : 0;

  const json = evt ? {
    id: evt.id,
    type: evt.type,
    status: evt.status,
    occurred_at: evt.timestamp,
    latency_ms: evt.latency_ms,
    source: { adapter: `signal-ingest-v3.2.1` },
    correlation: {
      person_id: evt.person_id,
      click_id: evt.click_id ?? null,
    },
    payload: {
      value: evt.value ?? null,
      currency: evt.value != null ? 'BRL' : null,
    },
    meta: evt.meta ?? {},
  } : null;

  return (
    <AppShell breadcrumb={[{ label: 'Observe', href: '/ledger' }, { label: 'Signal Ledger', href: '/ledger' }, { label: params.eventId }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <ScenarioStateGate emptyTitle="Evento não encontrado" emptyDescription="Nenhum sinal com esse ID no dataset atual.">
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="kicker">Observe · Evento</span>
              <PreviewBadge />
              {evt && <FreshnessTag ageSeconds={ageSec} source="Signal Ingest" />}
            </div>
            <h1 className="text-24 font-semibold text-eggshell font-sans">
              Evento <span className="font-mono text-stone tabular-nums">{params.eventId}</span>
            </h1>
          </header>

          {evt && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Tile label="Tipo" value={<span className="font-mono text-14 text-eggshell">{evt.type}</span>} />
                <Tile label="Status" value={<StatusChip status={evt.status} />} />
                <Tile
                  label="Valor"
                  value={
                    <MetricValue
                      value={evt.value != null ? `R$ ${evt.value.toLocaleString('pt-BR')}` : '—'}
                      size="md"
                      onOpenEvidence={() => openEvidence(buildEvidence({
                        label: `Valor · ${evt.id}`,
                        value: evt.value != null ? `R$ ${evt.value.toLocaleString('pt-BR')}` : '—',
                        formula: 'events[id].value',
                        source: 'TAP Postback',
                        state: evt.status === 'Reconciled' ? 'Reconciliado' : 'Provisório',
                        freshness: `latência ${evt.latency_ms}ms`,
                      }))}
                    />
                  }
                />
                <Tile label="Latência" value={<span className="font-mono tabular-nums text-14 text-eggshell">{evt.latency_ms}ms</span>} />
              </div>

              {person && (
                <div className="bg-graphite border border-line rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-11 font-mono uppercase tracking-wider text-stone">Pessoa correlacionada</div>
                    <div className="mt-1 text-14 text-eggshell truncate">{person.name}</div>
                    <div className="text-11 font-mono text-stone tabular-nums truncate">{person.id}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/identity/${person.id}`} className="px-3 py-1.5 bg-zinc border border-line rounded-md text-12 text-eggshell hover:bg-iron">Identidade</Link>
                    <Link href={`/players/${person.id}`} className="px-3 py-1.5 bg-zinc border border-line rounded-md text-12 text-eggshell hover:bg-iron">Player 360</Link>
                  </div>
                </div>
              )}

              <div className="bg-graphite border border-line rounded-xl p-6 font-mono text-13 overflow-x-auto">
                <div className="text-11 uppercase tracking-wider text-stone mb-2">Payload bruto</div>
                <pre className="text-proof-blue whitespace-pre">{JSON.stringify(json, null, 2)}</pre>
              </div>
            </>
          )}
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-graphite p-3">
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div>{value}</div>
    </div>
  );
}
