import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { DataTable } from '@/components/data/DataTable';

const invoices = [
  { id: 'INV-2026-07', period: 'Julho / 2026', amount: 797.0, status: 'Pago', paidAt: '2026-07-05' },
  { id: 'INV-2026-06', period: 'Junho / 2026', amount: 797.0, status: 'Pago', paidAt: '2026-06-05' },
  { id: 'INV-2026-05', period: 'Maio / 2026', amount: 797.0, status: 'Pago', paidAt: '2026-05-05' },
];

const usage = [
  { label: 'Eventos Ingeridos', used: 127450, cap: 500000, unit: '' },
  { label: 'Assentos Ativos', used: 4, cap: 10, unit: '' },
  { label: 'Automations publicadas', used: 6, cap: 20, unit: '' },
];

export default function SettingsBillingPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Faturamento' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-11 font-serif italic text-stone mb-1">Investimento · Plano vigente</div>
            <div className="flex items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Billing & Usage</h1>
              <PreviewBadge />
            </div>
          </div>
          <button className="bg-proof-blue text-ink px-4 py-2 rounded-md font-medium text-14 hover:opacity-90 transition-colors">
            Upgrade para Scale
          </button>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-11 uppercase tracking-wider text-stone">Plano atual</div>
              <div className="text-18 font-medium text-eggshell mt-1">Growth · <MetricValue value={`R$ ${(797).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} size="sm" />/mês</div>
            </div>
            <FreshnessTag ageSeconds={60 * 30} />
          </div>

          <div className="space-y-5">
            {usage.map(u => {
              const pct = Math.min(100, (u.used / u.cap) * 100);
              return (
                <div key={u.label}>
                  <div className="flex justify-between text-13 mb-2">
                    <span className="text-stone">{u.label}</span>
                    <span className="font-mono tabular-nums text-eggshell">
                      {u.used.toLocaleString('pt-BR')} / {u.cap.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-iron h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pct >= 95 ? 'bg-critical' : pct >= 80 ? 'bg-warning' : 'bg-proof-blue'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-16 font-medium text-eggshell mb-3">Faturas</h2>
          <DataTable
            data={invoices}
            columns={[
              { header: 'Fatura', accessorKey: 'id', cell: (r: any) => <span className="font-mono text-12 text-eggshell">{r.id}</span> },
              { header: 'Período', accessorKey: 'period', cell: (r: any) => <span className="text-13 text-stone">{r.period}</span> },
              { header: 'Valor', accessorKey: 'amount', cell: (r: any) => <MetricValue value={`R$ ${r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} size="sm" /> },
              { header: 'Status', accessorKey: 'status', cell: (r: any) => <span className="px-2 py-0.5 rounded text-11 font-bold bg-verified/10 text-verified uppercase">{r.status}</span> },
              { header: 'Pago em', accessorKey: 'paidAt', cell: (r: any) => <span className="font-mono text-12 text-stone">{r.paidAt}</span> },
            ]}
          />
        </div>
      </div>
    </AppShell>
  );
}
