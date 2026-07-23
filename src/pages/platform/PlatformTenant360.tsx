import React, { useState } from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { UserCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';
import { StatusChip } from '@/components/domain/StatusChip';
import type { EventStatus } from '@/lib/types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = '#7C91FF' }: { value: number; max: number; color?: string }) {
  const pct = max <= 0 ? 100 : Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 bg-[var(--zinc)] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

function fmtMrr(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// ── Per-tenant integration data ────────────────────────────────────────────────
const INTEGRATIONS: Record<string, Array<{ name: string; icon: string; status: 'active' | 'error' | 'pending' | 'inactive'; description: string }>> = {
  tenant_001: [
    { name: 'Meta CAPI', icon: '📘', status: 'error', description: 'Travado há 5 dias — verificar token' },
    { name: 'TAP Postback', icon: '🔗', status: 'active', description: 'Recebendo eventos em tempo real' },
    { name: 'Telegram Bot', icon: '🤖', status: 'active', description: '@operacaobr_bot ativo' },
  ],
  tenant_002: [
    { name: 'Meta CAPI', icon: '📘', status: 'active', description: 'Todas as conversões sendo enviadas' },
    { name: 'TikTok Events', icon: '🎵', status: 'active', description: 'API v2 sincronizada' },
    { name: 'TAP Postback', icon: '🔗', status: 'active', description: 'Multi-provider configurado' },
  ],
  tenant_003: [
    { name: 'Meta CAPI', icon: '📘', status: 'inactive', description: 'Não configurado' },
    { name: 'TAP Postback', icon: '🔗', status: 'pending', description: 'Aguardando configuração de URL' },
    { name: 'Telegram Bot', icon: '🤖', status: 'pending', description: 'Token pendente' },
  ],
};

function intStatusStyle(status: string) {
  switch (status) {
    case 'active':   return { color: 'var(--verified)', label: 'Conectado' };
    case 'error':    return { color: 'var(--critical)', label: 'Erro' };
    case 'pending':  return { color: 'var(--warning)', label: 'Pendente' };
    default:         return { color: 'var(--stone)', label: 'Inativo' };
  }
}

// ── Plan limits data ───────────────────────────────────────────────────────────
const PLAN_LIMITS: Record<string, Array<{ name: string; limit: number; unit: string }>> = {
  Starter: [
    { name: 'Eventos/mês',  limit: 50000,  unit: '' },
    { name: 'Players',      limit: 1000,   unit: '' },
    { name: 'Flows',        limit: 5,      unit: '' },
    { name: 'Membros',      limit: 3,      unit: '' },
  ],
  Growth: [
    { name: 'Eventos/mês',  limit: 500000, unit: '' },
    { name: 'Players',      limit: 10000,  unit: '' },
    { name: 'Flows',        limit: 20,     unit: '' },
    { name: 'Membros',      limit: 10,     unit: '' },
  ],
  Scale: [
    { name: 'Eventos/mês',  limit: -1,     unit: '' },
    { name: 'Players',      limit: -1,     unit: '' },
    { name: 'Flows',        limit: -1,     unit: '' },
    { name: 'Membros',      limit: -1,     unit: '' },
  ],
};

// ── Members per tenant ─────────────────────────────────────────────────────────
const MEMBERS: Record<string, Array<{ name: string; email: string; role: string; mfa: boolean; last_access: string }>> = {
  tenant_001: [
    { name: 'João Silva',    email: 'joao@operacaobr.com', role: 'Admin',   mfa: true,  last_access: '2026-07-23T10:00:00Z' },
    { name: 'Ana Costa',     email: 'ana@operacaobr.com',  role: 'Manager', mfa: true,  last_access: '2026-07-22T14:30:00Z' },
    { name: 'Carlos Mendes', email: 'carlos@operacaobr.com', role: 'Viewer', mfa: false, last_access: '2026-07-20T09:00:00Z' },
    { name: 'Maria Ramos',   email: 'maria@operacaobr.com', role: 'Viewer', mfa: false, last_access: '2026-07-18T11:00:00Z' },
  ],
  tenant_002: [
    { name: 'Admin Agency',  email: 'admin@agency.com',  role: 'Admin',   mfa: true,  last_access: '2026-07-23T09:30:00Z' },
    { name: 'Media Buyer',   email: 'media@agency.com',  role: 'Manager', mfa: false, last_access: '2026-07-23T08:00:00Z' },
    { name: 'Analytics',     email: 'bi@agency.com',     role: 'Viewer',  mfa: true,  last_access: '2026-07-21T16:00:00Z' },
  ],
  tenant_003: [
    { name: 'Teste Admin',   email: 'admin@teste-mx.com',  role: 'Admin',   mfa: false, last_access: '2026-07-23T14:20:00Z' },
    { name: 'Dev MX',        email: 'dev@teste-mx.com',    role: 'Manager', mfa: false, last_access: '2026-07-22T11:00:00Z' },
  ],
};

function fmtAccess(isoStr: string) {
  const d = new Date(isoStr);
  const now = new Date('2026-07-23T12:00:00Z');
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Agora';
  if (diffH < 24) return `${diffH}h atrás`;
  return `${Math.floor(diffH / 24)}d atrás`;
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ['Visão', 'Uso', 'Integrações', 'Faturamento', 'Ativação', 'Limites', 'Segurança', 'Ações'] as const;
type TabType = typeof TABS[number];

// Status mapping for StatusChip
function tenantStatusChip(status: string): EventStatus {
  if (status === 'active')    return 'Confirmed';
  if (status === 'trial')     return 'Divergent'; // yellow for trial
  return 'Synthetic';                              // grey for suspended
}

export default function PlatformTenant360Page({ params }: { params: { id: string } }) {
  const tenants = db.tenants;
  const tenant = tenants.find(t => t.id === params.id) ?? tenants[0];
  const [activeTab, setActiveTab] = useState<TabType>('Visão');
  const { dispatch } = useAppState();

  // Action dialog state
  const [confirmDialog, setConfirmDialog] = useState<null | {
    title: string; description: string; confirmLabel: string; danger: boolean; onConfirm: () => void;
  }>(null);

  // Build 14-day bar chart data using db.dailySeries
  const series = db.dailySeries(14, 'ftds');
  const tenantIdx = tenants.findIndex(t => t.id === tenant.id);
  const scale = tenantIdx === 1 ? 34945 : tenantIdx === 0 ? 9104 : tenantIdx === 2 ? 917 : 0;
  const barData = series.map((s, i) => ({
    date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    eventos: scale > 0 ? Math.max(0, Math.round(scale * (0.6 + (s.value * 0.4) / Math.max(1, Math.max(...series.map(x => x.value)))))) : 0,
  }));

  const plan = tenant.plan;
  const planLimits = PLAN_LIMITS[plan] ?? PLAN_LIMITS['Growth'];
  const members = MEMBERS[tenant.id] ?? MEMBERS['tenant_001'];
  const integrations = INTEGRATIONS[tenant.id] ?? INTEGRATIONS['tenant_001'];

  // Storage (config per tenant)
  const storageUsed = tenant.id === 'tenant_002' ? 7.1 : tenant.id === 'tenant_001' ? 2.3 : 0.4;
  const storageLimit = plan === 'Scale' ? 50 : plan === 'Growth' ? 10 : 2;

  // Plan limits with real events_30d data for the events row
  const limitsWithUsage = planLimits.map((lim, idx) => {
    let used = lim.limit === -1 ? 0 : Math.round(lim.limit * 0.25); // default fallback
    if (idx === 0) used = tenant.events_30d; // Eventos/mês — real data
    if (idx === 3) used = tenant.members;    // Membros — real data
    return { ...lim, used };
  });

  const appendAudit = (action: string, detail: string) => {
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'platform-admin',
        action,
        object: tenant.name,
        detail,
      },
    });
  };

  const statusLabel = tenant.status === 'active' ? 'Ativo' : tenant.status === 'trial' ? 'Trial' : 'Suspenso';

  return (
    <PlatformShell breadcrumb={[{ label: 'Tenants', href: '/platform/tenants' }, { label: tenant.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-24 font-bold text-[var(--eggshell)]">{tenant.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-[var(--line)] bg-[var(--zinc)] text-11 uppercase font-bold text-[var(--stone)]">
                {plan}
              </span>
              <StatusChip status={tenantStatusChip(tenant.status)} />
              <span className="text-13 font-mono text-[var(--stone)]">MRR {fmtMrr(tenant.mrr)}</span>
            </div>
          </div>
          <button className="bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 px-4 py-2 rounded-md font-medium text-14 hover:bg-[var(--warning)]/20 transition-colors flex items-center gap-2">
            <UserCircle className="w-4 h-4" /> Impersonar Tenant
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--line)] flex gap-6 px-2 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-[var(--eggshell)] border-[var(--proof-blue)]'
                  : 'text-[var(--stone)] border-transparent hover:text-[var(--eggshell)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab: Visão ── */}
        {activeTab === 'Visão' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Plano',          value: plan },
              { label: 'MRR',            value: fmtMrr(tenant.mrr) },
              { label: 'Membros',        value: String(tenant.members) },
              { label: 'Saúde',          value: tenant.health === 'green' ? 'Boa' : tenant.health === 'yellow' ? 'Atenção' : 'Crítica' },
              { label: 'Status',         value: statusLabel },
              { label: 'Eventos 30d',    value: fmtNum(tenant.events_30d) },
              { label: 'Quota',          value: tenant.events_quota === -1 ? 'Ilimitado' : fmtNum(tenant.events_quota) },
              { label: 'Criado em',      value: new Date(tenant.created_at).toLocaleDateString('pt-BR') },
            ].map(s => (
              <div key={s.label} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                <div className="text-11 font-mono text-[var(--stone)] uppercase mb-1">{s.label}</div>
                <div className="text-16 font-mono text-[var(--eggshell)]">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Uso ── */}
        {activeTab === 'Uso' && (
          <div className="space-y-5">
            {/* Events quota bar */}
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
              <div className="flex justify-between mb-2">
                <span className="text-14 font-medium text-[var(--eggshell)]">Eventos / Quota</span>
                <span className="text-13 font-mono text-[var(--stone)]">
                  {fmtNum(tenant.events_30d)} / {tenant.events_quota === -1 ? '∞' : fmtNum(tenant.events_quota)}
                </span>
              </div>
              <ProgressBar
                value={tenant.events_30d}
                max={tenant.events_quota === -1 ? tenant.events_30d : tenant.events_quota}
                color={tenant.events_quota !== -1 && tenant.events_30d / tenant.events_quota > 0.9 ? 'var(--critical)' : 'var(--proof-blue)'}
              />
              <div className="text-11 text-[var(--stone)] mt-1">
                {tenant.events_quota === -1
                  ? 'Plano Scale — sem limite'
                  : `${Math.round((tenant.events_30d / tenant.events_quota) * 100)}% utilizado`}
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
              <h2 className="text-14 font-medium text-[var(--eggshell)] mb-4">Eventos — últimos 14 dias</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="date" tick={{ fill: 'var(--stone)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--stone)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => fmtNum(v)} />
                  <Tooltip
                    contentStyle={{ background: 'var(--graphite)', border: '1px solid var(--line)', color: 'var(--eggshell)', borderRadius: '8px' }}
                    formatter={(v: number) => [fmtNum(v), 'Eventos']}
                  />
                  <Bar dataKey="eventos" fill="var(--proof-blue)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Storage bar */}
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
              <div className="flex justify-between mb-2">
                <span className="text-14 font-medium text-[var(--eggshell)]">Armazenamento</span>
                <span className="text-13 font-mono text-[var(--stone)]">{storageUsed} GB / {storageLimit} GB</span>
              </div>
              <ProgressBar
                value={storageUsed}
                max={storageLimit}
                color={storageUsed / storageLimit > 0.8 ? 'var(--warning)' : 'var(--verified)'}
              />
              <div className="text-11 text-[var(--stone)] mt-1">{Math.round((storageUsed / storageLimit) * 100)}% utilizado</div>
            </div>
          </div>
        )}

        {/* ── Tab: Integrações ── */}
        {activeTab === 'Integrações' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations.map(intg => {
              const { color, label } = intStatusStyle(intg.status);
              return (
                <div key={intg.name} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-20">{intg.icon}</span>
                      <span className="text-14 font-medium text-[var(--eggshell)]">{intg.name}</span>
                    </div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-11 font-medium border"
                      style={{ color, borderColor: color + '44', background: color + '18' }}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-12 text-[var(--stone)]">{intg.description}</p>
                  <button className="px-3 py-1.5 rounded text-12 font-medium bg-[var(--zinc)] text-[var(--eggshell)] border border-[var(--line)] hover:bg-[var(--iron)] transition-colors w-full">
                    Configurar
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Tab: Faturamento ── */}
        {activeTab === 'Faturamento' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 space-y-4">
            <h2 className="text-16 font-medium text-[var(--eggshell)]">Faturamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Plano',          value: plan },
                { label: 'MRR',            value: fmtMrr(tenant.mrr) },
                { label: 'ARR',            value: fmtMrr(tenant.mrr * 12) },
                { label: 'Próxima fatura', value: '01/08/2026' },
                { label: 'Status',         value: tenant.status === 'active' ? 'Em dia' : 'Inadimplente' },
                { label: 'Método',         value: 'Cartão de crédito' },
              ].map(s => (
                <div key={s.label} className="bg-[var(--zinc)] border border-[var(--line)] rounded-lg p-3">
                  <div className="text-11 text-[var(--stone)] uppercase mb-1">{s.label}</div>
                  <div className="font-mono text-14 text-[var(--eggshell)]">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Ativação ── */}
        {activeTab === 'Ativação' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6">
            <h2 className="text-18 font-medium text-[var(--eggshell)] mb-4">Status de Ativação do Tenant</h2>
            <div className="space-y-4">
              {[
                { label: 'Criar workspace', done: true },
                { label: 'Conectar provedor (TAP)', done: true },
                { label: 'Receber primeiro evento', done: tenant.events_30d > 0 },
              ].map(step => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 text-14 p-3 rounded-md ${
                    step.done
                      ? 'text-[var(--eggshell)] bg-[var(--zinc)] border border-[var(--line)]'
                      : 'text-[var(--stone)] bg-[var(--iron)] border border-[var(--line)]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-[var(--verified)]/20 text-[var(--verified)]' : 'border border-[var(--stone)]'}`}>
                    {step.done ? '✓' : ''}
                  </div>
                  {step.label}
                </div>
              ))}
              {integrations.find(i => i.name === 'Meta CAPI')?.status !== 'active' ? (
                <div className="flex items-center gap-3 text-14 text-[var(--warning)] p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-[var(--warning)]/20 text-[var(--warning)] flex items-center justify-center text-12 font-bold">!</div>
                  Conectar Meta CAPI (pendente)
                </div>
              ) : (
                <div className="flex items-center gap-3 text-14 text-[var(--eggshell)] p-3 bg-[var(--zinc)] border border-[var(--line)] rounded-md">
                  <div className="w-5 h-5 rounded-full bg-[var(--verified)]/20 text-[var(--verified)] flex items-center justify-center">✓</div>
                  Meta CAPI conectado
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Limites ── */}
        {activeTab === 'Limites' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
            <h2 className="text-14 font-medium text-[var(--stone)] uppercase tracking-wider mb-4">Limites do Plano — {plan}</h2>
            <div className="space-y-4">
              {limitsWithUsage.map(lim => (
                <div key={lim.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-13 text-[var(--eggshell)]">{lim.name}</span>
                    <span className="text-12 font-mono text-[var(--stone)]">
                      {fmtNum(lim.used)} / {lim.limit === -1 ? '∞' : fmtNum(lim.limit)}
                    </span>
                  </div>
                  <ProgressBar
                    value={lim.used}
                    max={lim.limit === -1 ? lim.used : lim.limit}
                    color={
                      lim.limit !== -1 && lim.used / lim.limit > 0.9
                        ? 'var(--critical)'
                        : lim.limit !== -1 && lim.used / lim.limit > 0.7
                        ? 'var(--warning)'
                        : 'var(--proof-blue)'
                    }
                  />
                  {lim.limit !== -1 && (
                    <div className="text-10 text-[var(--stone)] mt-1 font-mono">
                      {Math.round((lim.used / lim.limit) * 100)}% utilizado
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Segurança ── */}
        {activeTab === 'Segurança' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 space-y-4">
            <h2 className="text-14 font-medium text-[var(--stone)] uppercase tracking-wider mb-4">Membros e Segurança</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-13">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="text-left text-11 text-[var(--stone)] font-medium pb-2 pr-4">Membro</th>
                    <th className="text-left text-11 text-[var(--stone)] font-medium pb-2 pr-4">Função</th>
                    <th className="text-center text-11 text-[var(--stone)] font-medium pb-2 pr-4">MFA</th>
                    <th className="text-left text-11 text-[var(--stone)] font-medium pb-2">Último acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.email} className="border-b border-[var(--line)]/50 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="text-13 font-medium text-[var(--eggshell)]">{m.name}</div>
                        <div className="text-11 text-[var(--stone)] font-mono">{m.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded text-11 bg-[var(--zinc)] border border-[var(--line)] text-[var(--stone)]">{m.role}</span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        {m.mfa ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-11 bg-[var(--verified)]/10 text-[var(--verified)] border border-[var(--verified)]/30">✓ Ativo</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-11 bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30">⚠ Desativado</span>
                        )}
                      </td>
                      <td className="py-3 text-12 font-mono text-[var(--stone)]">{fmtAccess(m.last_access)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Ações ── */}
        {activeTab === 'Ações' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 space-y-4">
            <h2 className="text-14 font-medium text-[var(--stone)] uppercase tracking-wider mb-2">Ações Administrativas</h2>

            <div className="flex flex-col gap-3">
              {/* Estender trial */}
              <div className="flex items-center justify-between p-4 bg-[var(--zinc)] border border-[var(--line)] rounded-lg">
                <div>
                  <div className="text-14 font-medium text-[var(--eggshell)]">Estender trial</div>
                  <div className="text-12 text-[var(--stone)]">Adicionar 14 dias ao período de trial</div>
                </div>
                <button
                  onClick={() => setConfirmDialog({
                    title: 'Estender trial',
                    description: `Tem certeza que deseja estender o trial de "${tenant.name}" por 14 dias?`,
                    confirmLabel: 'Estender',
                    danger: false,
                    onConfirm: () => {
                      toast.success('Trial estendido por 14 dias.');
                      appendAudit('Estender trial', '+14 dias');
                    },
                  })}
                  className="px-4 py-2 rounded-md text-13 font-medium bg-[var(--proof-blue)]/10 text-[var(--proof-blue)] border border-[var(--proof-blue)]/30 hover:bg-[var(--proof-blue)]/20 transition-colors whitespace-nowrap"
                >
                  Estender
                </button>
              </div>

              {/* Suspender */}
              <div className="flex items-center justify-between p-4 bg-[var(--zinc)] border border-[var(--warning)]/20 rounded-lg">
                <div>
                  <div className="text-14 font-medium text-[var(--warning)]">Suspender tenant</div>
                  <div className="text-12 text-[var(--stone)]">Bloquear acesso imediatamente</div>
                </div>
                <button
                  onClick={() => setConfirmDialog({
                    title: 'Suspender tenant',
                    description: `Tem certeza que deseja suspender "${tenant.name}"? O acesso será bloqueado imediatamente.`,
                    confirmLabel: 'Suspender',
                    danger: true,
                    onConfirm: () => {
                      toast.error(`Tenant "${tenant.name}" suspenso.`);
                      appendAudit('Suspender tenant', 'Acesso bloqueado');
                    },
                  })}
                  className="px-4 py-2 rounded-md text-13 font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 hover:bg-[var(--warning)]/20 transition-colors whitespace-nowrap"
                >
                  Suspender
                </button>
              </div>

              {/* Deletar */}
              <div className="flex items-center justify-between p-4 bg-[var(--zinc)] border border-[var(--critical)]/20 rounded-lg">
                <div>
                  <div className="text-14 font-medium text-[var(--critical)]">Deletar tenant</div>
                  <div className="text-12 text-[var(--stone)]">Ação irreversível — remove todos os dados</div>
                </div>
                <button
                  onClick={() => setConfirmDialog({
                    title: 'Deletar tenant',
                    description: `ATENÇÃO: Esta ação é irreversível. Todos os dados de "${tenant.name}" serão removidos permanentemente.`,
                    confirmLabel: 'Deletar',
                    danger: true,
                    onConfirm: () => {
                      toast.error(`Tenant "${tenant.name}" deletado.`);
                      appendAudit('Deletar tenant', 'Remoção permanente');
                    },
                  })}
                  className="px-4 py-2 rounded-md text-13 font-medium bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/30 hover:bg-[var(--critical)]/20 transition-colors whitespace-nowrap"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          open={true}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmLabel={confirmDialog.confirmLabel}
          danger={confirmDialog.danger}
          onConfirm={confirmDialog.onConfirm}
          onClose={() => setConfirmDialog(null)}
        />
      )}
    </PlatformShell>
  );
}
