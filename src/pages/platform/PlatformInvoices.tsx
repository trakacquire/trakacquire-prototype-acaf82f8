import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { db } from '@/lib/fake/db';
import { StatusChip } from '@/components/domain/StatusChip';
import type { EventStatus } from '@/lib/types';

export default function PlatformInvoicesPage() {
  const tenants = db.tenants;

  const invoices = tenants.flatMap((t, i) => [
    {
      id: `inv_${t.id}_jul`,
      tenant: t.name,
      period: 'Julho 2026',
      amount: t.mrr,
      status: 'Pago' as const,
      due: '2026-07-01',
      plan: t.plan,
    },
    {
      id: `inv_${t.id}_jun`,
      tenant: t.name,
      period: 'Junho 2026',
      amount: t.mrr * 0.97,
      status: (i === 0 ? 'Pendente' : 'Pago') as 'Pago' | 'Pendente',
      due: '2026-06-01',
      plan: t.plan,
    },
  ]);

  const totalMrr = tenants.reduce((s, t) => s + t.mrr, 0);

  function fmtMoney(v: number) {
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
  }

  return (
    <PlatformShell breadcrumb={[{ label<PlatformPageHeader kicker="Platform · Finance" title="Faturas" />ce-y-6">
        {/* Stat card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">MRR Total</div>
            <div className="text-22 font-mono text-eggshell">{fmtMoney(totalMrr)}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Faturas Emitidas</div>
            <div className="text-22 font-mono text-eggshell">{invoices.length}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Pendentes</div>
            <div className="text-22 font-mono text-warning">
              {invoices.filter(inv => inv.status === 'Pendente').length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">ID</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Cliente</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Plano</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Período</th>
                  <th className="text-right text-11 text-stone font-medium px-4 py-3 uppercase">Valor</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Status</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Vencimento</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-line/50 last:border-0 hover:bg-iron transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-12 text-stone">{inv.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-13 font-medium text-eggshell">{inv.tenant}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded border border-line bg-zinc text-11 uppercase font-bold text-stone">
                        {inv.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone">{inv.period}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-13 text-eggshell">{fmtMoney(inv.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={(inv.status === 'Pago' ? 'Reconciled' : 'Divergent') as EventStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-12 font-mono text-stone">{fmtDate(inv.due)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
