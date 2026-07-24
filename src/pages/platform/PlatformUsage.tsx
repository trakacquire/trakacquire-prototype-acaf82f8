import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Users, Database, TrendingUp } from 'lucide-react';

export default function PlatformUsagePage() {
  const tenantUsage = [
    { tenant: 'Operação Brasil', plan: 'Growth', events_30d: 342000, quota: 500000, overage: 0, revenue: 499, health: 100 },
    { tenant: 'Operação MX', plan: 'Starter', events_30d: 128000, quota: 100000, overage: 28000, revenue: 99, health: 95 },
    { tenant: 'Agency Demo', plan: 'Scale', events_30d: 1240000, quota: 2000000, overage: 0, revenue: 1499, health: 100 },
    { tenant: 'iGaming PT', plan: 'Growth', events_30d: 487000, quota: 500000, overage: 0, revenue: 499, health: 98 },
    { tenant: 'Afiliados BR', plan: 'Starter', events_30d: 67000, quota: 100000, overage: 0, revenue: 99, health: 100 },
  ];

  const dailyEventsData = [
    { date: '01 Jul', events: 48200, tenants: 23 },
    { date: '02 Jul', events: 52100, tenants: 24 },
    { date: '03 Jul', events: 49800, tenants: 23 },
    { date: '04 Jul', events: 56300, tenants: 25 },
    { date: '05 Jul', events: 51900, tenants: 24 },
    { date: '06 Jul', events: 54200, tenants: 25 },
    { date: '07 Jul', events: 58900, tenants: 26 },
  ];

  const columns = [
    { header: 'Tenant', accessorKey: 'tenant', cell: (t: any) => <span className="text-14 text-eggshell font-medium">{t.tenant}</span> },
    { header: 'Plano', accessorKey: 'plan', cell: (t: any) => <span className="text-13 text-stone">{t.plan}</span> },
    { 
      header: 'Eventos (30d)', 
      accessorKey: 'events_30d', 
      className: 'text-right',
      cell: (t: any) => (
        <div>
          <div className="text-14 font-mono text-eggshell">{t.events_30d.toLocaleString()}</div>
          <div className="text-11 text-stone">de {t.quota.toLocaleString()}</div>
        </div>
      )
    },
    { 
      header: 'Uso %', 
      accessorKey: 'usage_pct', 
      className: 'text-right',
      cell: (t: any) => {
        const pct = Math.round((t.events_30d / t.quota) * 100);
        return (
          <div className="flex items-center justify-end gap-2">
            <div className="w-20 h-2 bg-iron rounded-full overflow-hidden">
              <div 
                className={`h-full ${pct >= 95 ? 'bg-critical' : pct >= 80 ? 'bg-warning' : 'bg-verified'}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span className="font-mono text-12 text-stone">{pct}%</span>
          </div>
        );
      }
    },
    { 
      header: 'Overage', 
      accessorKey: 'overage', 
      className: 'text-right',
      cell: (t: any) => (
        <span className={`font-mono text-13 ${t.overage > 0 ? 'text-warning' : 'text-stone'}`}>
          {t.overage > 0 ? `+${t.overage.toLocaleString()}` : '—'}
        </span>
      )
    },
    { header: 'MRR', accessorKey: 'revenue', className: 'text-right', cell: (t: any) => <span className="font-mono text-14 text-proof-blue">US$ {t.revenue}</span> },
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Usage & Quotas' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · Usage" title="Usage & Quotas" description="Consumo agregado e quotas por tenant." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-verified/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-verified" />
              </div>
              <div>
                <div className="text-12 text-stone">Eventos (30d)</div>
                <div className="text-18 font-mono text-eggshell">2.26M</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-proof-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-proof-blue" />
              </div>
              <div>
                <div className="text-12 text-stone">Tenants Ativos</div>
                <div className="text-18 font-mono text-eggshell">26</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-12 text-stone">Overage Total</div>
                <div className="text-18 font-mono text-eggshell">28k</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-stone" />
              </div>
              <div>
                <div className="text-12 text-stone">MRR Total</div>
                <div className="text-18 font-mono text-eggshell">US$ 2.7k</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-16 font-medium text-eggshell mb-6">Eventos Processados por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyEventsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--line))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--stone))" 
                style={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--stone))" 
                style={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--zinc))', 
                  border: '1px solid hsl(var(--line))',
                  borderRadius: '8px',
                  fontSize: 13
                }}
              />
              <Bar dataKey="events" fill="hsl(var(--proof-blue))" radius={[4, 4, 0, 0]} name="Eventos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-16 font-medium text-eggshell mb-6">Uso por Tenant</h2>
          <DataTable data={tenantUsage} columns={columns} />
        </div>
      </div>
    </PlatformShell>
  );
}