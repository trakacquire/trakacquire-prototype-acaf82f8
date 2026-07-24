import React, { useState } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db, BROADCASTS, SEGMENTS } from '@/lib/fake/db';
import { EventStatus } from '@/lib/types';
import { ShieldCheck, Send, Gauge, Clock } from 'lucide-react';
import { toast } from 'sonner';

const fmt = {
  int: (n: number) => n.toLocaleString('pt-BR'),
};

type BRow = (typeof BROADCASTS)[number];

const statusMap: Record<string, EventStatus> = {
  sent: 'Reconciled', sending: 'Confirmed', scheduled: 'Linked', draft: 'Captured',
};

export default function BroadcastsPage() {
  const { openEvidence } = useEvidence();
  const [showComposer, setShowComposer] = useState(false);
  const [rateLimit, setRateLimit] = useState(120);
  const [sendWindow, setSendWindow] = useState('09:00–21:00');

  const totalSent = BROADCASTS.reduce((s, b) => s + b.sent, 0);
  const totalFtds = BROADCASTS.reduce((s, b) => s + b.ftds_generated, 0);
  const consentBlocked = 178;
  const consentAllowed = totalSent;

  const columns: ColumnDef<BRow>[] = [
    { header: 'Nome', accessorKey: 'name', cell: (b) => (
      <div className="flex flex-col">
        <span className="text-14 font-medium text-eggshell">{b.name}</span>
        <span className="font-mono text-11 text-stone tabular-nums">{b.id}</span>
      </div>
    )},
    { header: 'Canal', accessorKey: 'channel', cell: (b) => (
      <span className={`px-2 py-0.5 rounded-[6px] border text-11 font-medium ${
        b.channel === 'telegram' ? 'bg-proof-blue/10 text-proof-blue border-proof-blue/20' : 'bg-verified/10 text-verified border-verified/20'
      }`}>{b.channel}</span>
    )},
    { header: 'Segmento', accessorKey: 'segment_name', cell: (b) => <span className="text-13 text-stone">{b.segment_name}</span> },
    { header: 'Enviados', accessorKey: 'sent', className: 'text-right', cell: (b) => (
      <span className="font-mono text-13 text-eggshell tabular-nums">{fmt.int(b.sent)}</span>
    )},
    { header: 'Entrega', accessorKey: 'delivered', className: 'text-right', cell: (b) => (
      <span className="font-mono text-13 text-stone tabular-nums">{b.sent > 0 ? ((b.delivered / b.sent) * 100).toFixed(1) + '%' : '—'}</span>
    )},
    { header: 'FTDs', accessorKey: 'ftds_generated', className: 'text-right', cell: (b) => (
      <button
        onClick={(e) => { e.stopPropagation(); openEvidence(buildEvidence({
          label: `FTDs · ${b.name}`,
          value: fmt.int(b.ftds_generated),
          formula: 'count(ftd) attributed to broadcast = ' + b.id,
          source: 'Signal Ledger · confirmados',
          state: 'Reconciliado',
        })); }}
        className="font-mono text-13 text-verified tabular-nums font-bold hover:underline"
      >{b.ftds_generated}</button>
    )},
    { header: 'Estado', accessorKey: 'status', cell: (b) => <StatusChip status={statusMap[b.status] ?? 'Captured'} /> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate' }, { label: 'Broadcasts' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-11 font-serif italic text-stone mb-1">Operate · Broadcasts</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Broadcasts</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Envio em massa medido em FTD. Policy Engine checa consentimento na fila e imediatamente antes do envio.</p>
          </div>
          <button
            onClick={() => setShowComposer(v => !v)}
            className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Criar broadcast
          </button>
        </div>

        <ScenarioStateGate
          emptyTitle="Nenhum broadcast criado"
          emptyDescription="Crie um broadcast para começar a operar."
          emptyPrerequisite="Configure um canal de mensageria em Integrações."
        >
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-verified" />
              <h3 className="text-13 font-semibold text-eggshell">Policy Engine · dois checkpoints de consentimento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => openEvidence(buildEvidence({
                  label: 'Checkpoint T-0 · Consentimento na fila',
                  value: `${fmt.int(consentAllowed)} permitidos · ${consentBlocked} bloqueados`,
                  formula: 'policy_engine.check(consent) at enqueue',
                  source: 'Policy Engine · versão 3.4',
                  state: 'Reconciliado',
                }))}
                className="text-left border border-verified/25 bg-verified/5 rounded-lg p-3 hover:border-verified/50 transition-colors"
              >
                <div className="text-11 font-mono uppercase tracking-wider text-verified mb-1">T-0 · na fila</div>
                <div className="text-13 text-eggshell">Consentimento verificado <span className="font-mono tabular-nums">{fmt.int(consentAllowed)}</span></div>
                <div className="font-mono text-11 text-stone tabular-nums">{consentBlocked} bloqueados por opt-out</div>
              </button>
              <button
                onClick={() => openEvidence(buildEvidence({
                  label: 'Checkpoint T-envio · Consentimento imediato',
                  value: 're-check antes do POST',
                  formula: 'policy_engine.check(consent) at send() — janela < 200ms',
                  source: 'Policy Engine · versão 3.4',
                  state: 'Reconciliado',
                }))}
                className="text-left border border-proof-blue/25 bg-proof-blue/5 rounded-lg p-3 hover:border-proof-blue/50 transition-colors"
              >
                <div className="text-11 font-mono uppercase tracking-wider text-proof-blue mb-1">T-envio · imediato</div>
                <div className="text-13 text-eggshell">Re-check antes do POST — bloqueia se opt-out chegou entre T-0 e envio</div>
                <div className="font-mono text-11 text-stone tabular-nums">latência p95 132ms</div>
              </button>
            </div>
          </div>

          {showComposer && (
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
              <h3 className="text-14 font-semibold text-eggshell">Composer</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-11 font-mono uppercase tracking-wider text-stone">Segmento</span>
                  <select className="bg-zinc border border-line rounded-md px-3 py-2 text-13 text-eggshell">
                    {SEGMENTS.map(s => <option key={s.id}>{s.name} ({fmt.int(s.count)})</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-11 font-mono uppercase tracking-wider text-stone flex items-center gap-1"><Clock className="w-3 h-3" /> Janela</span>
                  <input value={sendWindow} onChange={e => setSendWindow(e.target.value)} className="bg-zinc border border-line rounded-md px-3 py-2 text-13 text-eggshell font-mono" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-11 font-mono uppercase tracking-wider text-stone flex items-center gap-1"><Gauge className="w-3 h-3" /> Rate limit (msg/min · anti-ban)</span>
                  <input type="number" value={rateLimit} onChange={e => setRateLimit(Number(e.target.value))} className="bg-zinc border border-line rounded-md px-3 py-2 text-13 text-eggshell font-mono" />
                </label>
              </div>
              <textarea rows={3} placeholder="Mensagem…" className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-13 text-eggshell" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowComposer(false)} className="px-3 py-2 text-13 text-stone hover:text-eggshell">Cancelar</button>
                <button onClick={() => { toast('Broadcast agendado — Policy Engine na fila e antes do envio.'); setShowComposer(false); }} className="bg-eggshell text-ink px-4 py-2 rounded-md text-13 font-medium">Agendar</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => openEvidence(buildEvidence({
              label: 'Mensagens enviadas 30d', value: fmt.int(totalSent),
              formula: 'sum(broadcasts.sent) window=30d', source: 'Mensageria · Telegram/WhatsApp',
            }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
              <div className="text-11 uppercase tracking-wider text-stone font-mono">Enviadas 30d</div>
              <div className="mt-2"><MetricValue value={fmt.int(totalSent)} size="lg" /></div>
            </button>
            <button onClick={() => openEvidence(buildEvidence({
              label: 'FTDs atribuídos a broadcasts', value: fmt.int(totalFtds),
              formula: 'sum(broadcasts.ftds_generated)', source: 'Signal Ledger', state: 'Reconciliado',
            }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
              <div className="text-11 uppercase tracking-wider text-stone font-mono">FTDs gerados</div>
              <div className="mt-2"><MetricValue value={fmt.int(totalFtds)} size="lg" tone="verified" /></div>
            </button>
            <button onClick={() => openEvidence(buildEvidence({
              label: 'Segmentos disponíveis', value: fmt.int(SEGMENTS.length),
              formula: 'count(segments)', source: 'Query Builder',
            }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
              <div className="text-11 uppercase tracking-wider text-stone font-mono">Segmentos</div>
              <div className="mt-2"><MetricValue value={fmt.int(SEGMENTS.length)} size="lg" /></div>
            </button>
          </div>

          <DataTable data={db.broadcasts as unknown as BRow[]} columns={columns} />
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
