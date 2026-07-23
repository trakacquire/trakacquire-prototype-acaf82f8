// @ts-nocheck
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useParams } from 'wouter';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';
import { StatusChip } from '@/components/domain/StatusChip';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

const fmtDate = (iso: string | undefined) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';
const fmtDT = (iso: string) => new Date(iso).toLocaleString('pt-BR');

function relativeTime(iso: string): string {
  const diff = (new Date('2026-07-23T12:00:00.000Z').getTime() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

type Tab = 'visao_geral' | 'configuracao' | 'eventos' | 'saude' | 'historico';

export default function Integration360Page() {
  const params = useParams<{ id: string }>();
  const integrationId = params.id || 'tap';
  const { dispatch } = useAppState();

  const [activeTab, setActiveTab] = useState<Tab>('visao_geral');
  const [connected, setConnected] = useState(true);
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  type IntegrationConfig = {
    name: string;
    category: string;
    version: string;
    endpoint: string;
    health: number;
    errors24h: number;
    lastSync: string | undefined;
  };

  const configs: Record<string, IntegrationConfig> = {
    tap: {
      name: 'TAP',
      category: 'Provedor de Receita',
      version: 'v2.1',
      endpoint: 'https://api.tap.bet/v2/postback',
      health: 98.7,
      errors24h: 2,
      lastSync: db.events.filter(e => e.type === 'ftd').slice(-1)[0]?.timestamp,
    },
    meta: {
      name: 'Meta CAPI',
      category: 'Aquisição',
      version: 'v17.0',
      endpoint: 'https://graph.facebook.com/v17.0/events',
      health: 99.2,
      errors24h: 0,
      lastSync: db.events.filter(e => e.type === 'capi').slice(-1)[0]?.timestamp,
    },
    tiktok: {
      name: 'TikTok Events',
      category: 'Aquisição',
      version: 'v1.3',
      endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      health: 97.1,
      errors24h: 5,
      lastSync: db.events.filter(e => e.type === 'click').slice(-1)[0]?.timestamp,
    },
    telegram: {
      name: 'Telegram Bot',
      category: 'Mensageria',
      version: 'v6.0',
      endpoint: 'https://api.telegram.org/bot{token}/sendMessage',
      health: 99.9,
      errors24h: 0,
      lastSync: db.events.filter(e => e.type === 'bot_message').slice(-1)[0]?.timestamp,
    },
  };

  const config: IntegrationConfig = configs[integrationId] ?? configs.tap;

  const recentEvents = db.events.filter(e => {
    if (integrationId === 'tap') return e.type === 'ftd' || e.type === 'deposit';
    if (integrationId === 'meta') return e.type === 'capi';
    if (integrationId === 'tiktok') return e.type === 'click';
    if (integrationId === 'telegram') return e.type === 'bot_message';
    return false;
  }).slice(0, 20);

  // Health chart: seed 7 values from integrationId
  const healthSeed = integrationId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const healthData = Array.from({ length: 7 }, (_, i) => {
    const base = config.health;
    const jitter = ((healthSeed * (i + 1)) % 30) / 10 - 1.5;
    return {
      dia: `D-${6 - i}`,
      saude: Math.min(100, Math.max(90, +(base + jitter).toFixed(1))),
    };
  });

  // Historical log entries
  const histLog = [
    { at: '2026-07-22T10:00:00Z', acao: 'Integração conectada', detalhe: `${config.name} conectada com sucesso`, tipo: 'sucesso' },
    { at: '2026-07-20T14:30:00Z', acao: 'Sincronização automática', detalhe: '248 eventos sincronizados', tipo: 'info' },
    { at: '2026-07-19T09:15:00Z', acao: 'Teste de webhook', detalhe: 'Payload de teste enviado e recebido com sucesso', tipo: 'sucesso' },
    { at: '2026-07-18T16:45:00Z', acao: 'Configuração atualizada', detalhe: 'Endpoint atualizado para nova versão', tipo: 'info' },
    { at: '2026-07-15T08:00:00Z', acao: 'Alerta de latência', detalhe: 'Latência acima de 2000ms detectada por 5 min', tipo: 'aviso' },
  ];

  const typeChipLabel = (type: string) => {
    const map: Record<string, string> = {
      ftd: 'FTD', deposit: 'Depósito', capi: 'CAPI', click: 'Clique',
      bot_message: 'Bot', postback: 'Postback', register: 'Registro',
      webhook: 'Webhook', withdrawal: 'Saque',
    };
    return map[type] ?? type;
  };

  const handleSync = () => {
    toast('Sincronização iniciada…');
    setTimeout(() => toast.success('Sincronização concluída.'), 2000);
  };

  const handleDisconnect = (reason?: string) => {
    setConnected(false);
    toast('Integração desconectada.');
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'João Oliveira',
        action: 'Integração desconectada',
        object: config.name,
        detail: reason ?? 'Desconectado manualmente.',
      },
    });
  };

  const tooltipStyle = {
    contentStyle: {
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      color: 'var(--eggshell)',
      borderRadius: '8px',
    },
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'visao_geral', label: 'Visão Geral' },
    { id: 'configuracao', label: 'Configuração' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'saude', label: 'Saúde' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Integrações', href: '/integrations' }, { label: config.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-24 font-bold text-[var(--eggshell)]">{config.name}</h1>
              <StatusChip status={connected ? 'Confirmed' : 'Orphan'} />
            </div>
            <div className="text-13 text-[var(--stone)]">{config.category} · {config.version}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSync}
              className="flex items-center gap-2 bg-[var(--proof-blue)] text-white px-3 py-1.5 rounded-md font-medium text-13 hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" /> Sincronizar agora
            </button>
            {connected && (
              <button
                onClick={() => setDisconnectOpen(true)}
                className="flex items-center gap-2 bg-[var(--zinc)] text-[var(--critical)] border border-[var(--critical)]/30 px-3 py-1.5 rounded-md font-medium text-13 hover:bg-[var(--iron)] transition-colors"
              >
                Desconectar
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--line)] flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-14 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--eggshell)] border-[var(--proof-blue)]'
                  : 'text-[var(--stone)] border-transparent hover:text-[var(--eggshell)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Visão Geral */}
        {activeTab === 'visao_geral' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                <div className="text-12 text-[var(--stone)] mb-1">Saúde</div>
                <div className={`text-24 font-mono font-bold ${config.health >= 99 ? 'text-[var(--verified)]' : config.health >= 95 ? 'text-[var(--warning)]' : 'text-[var(--critical)]'}`}>
                  {config.health}%
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--zinc)]">
                  <div
                    className={`h-2 rounded-full ${config.health >= 99 ? 'bg-[var(--verified)]' : config.health >= 95 ? 'bg-[var(--warning)]' : 'bg-[var(--critical)]'}`}
                    style={{ width: `${config.health}%` }}
                  />
                </div>
              </div>
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                <div className="text-12 text-[var(--stone)] mb-1">Erros (24h)</div>
                <div className={`text-24 font-mono font-bold ${config.errors24h > 0 ? 'text-[var(--critical)]' : 'text-[var(--verified)]'}`}>
                  {config.errors24h}
                </div>
              </div>
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                <div className="text-12 text-[var(--stone)] mb-1">Última sincronização</div>
                <div className="text-14 font-medium text-[var(--eggshell)]">{fmtDate(config.lastSync)}</div>
              </div>
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                <div className="text-12 text-[var(--stone)] mb-1">Eventos (30d)</div>
                <div className="text-24 font-mono font-bold text-[var(--eggshell)]">{recentEvents.length}</div>
              </div>
            </div>
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
              <div className="text-12 text-[var(--stone)] mb-1">Endpoint</div>
              <div className="font-mono text-13 text-[var(--eggshell)] break-all">{config.endpoint}</div>
            </div>
          </div>
        )}

        {/* Tab: Configuração */}
        {activeTab === 'configuracao' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <h2 className="text-16 font-medium text-[var(--eggshell)] mb-2">Configuração</h2>
            <div>
              <label className="block text-12 font-medium text-[var(--stone)] mb-1.5">Endpoint (somente leitura)</label>
              <input
                type="text"
                value={config.endpoint}
                readOnly
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-12 font-medium text-[var(--stone)] mb-1.5">Chave de API</label>
              <input
                type="password"
                defaultValue="pk_live_••••••••••••••••••••••xyz"
                readOnly
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-12 font-medium text-[var(--stone)] mb-1.5">URL do Webhook</label>
              <input
                type="text"
                defaultValue={`https://app.trakacquire.com/webhook/${integrationId}`}
                readOnly
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] font-mono outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab: Eventos */}
        {activeTab === 'eventos' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
            {recentEvents.length === 0 ? (
              <div className="p-12 text-center text-14 text-[var(--stone)]">Nenhum evento encontrado para esta integração.</div>
            ) : (
              <table className="w-full text-13">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {['Tipo', 'Status', 'Pessoa', 'Latência', 'Quando'].map(h => (
                      <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map(e => (
                    <tr key={e.id} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-[var(--proof-blue)]/10 text-[var(--proof-blue)] text-11 font-mono">
                          {typeChipLabel(e.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip status={e.status as any} />
                      </td>
                      <td className="px-4 py-3 font-mono text-12 text-[var(--eggshell)]">
                        <a href={`/identity/${e.person_id}`} className="hover:underline text-[var(--proof-blue)]">
                          {e.person_id}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-mono text-12 text-[var(--stone)]">{e.latency_ms}ms</td>
                      <td className="px-4 py-3 text-12 text-[var(--stone)]">{relativeTime(e.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab: Saúde */}
        {activeTab === 'saude' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6">
            <h2 className="text-16 font-medium text-[var(--eggshell)] mb-4">Saúde — últimos 7 dias</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={healthData}>
                <XAxis dataKey="dia" tick={{ fill: 'var(--stone)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[90, 100]} tick={{ fill: 'var(--stone)', fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Saúde']} />
                <Line type="monotone" dataKey="saude" stroke="var(--verified)" strokeWidth={2} dot={{ fill: 'var(--verified)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'historico' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  {['Data', 'Ação', 'Detalhe', 'Tipo'].map(h => (
                    <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {histLog.map((entry, i) => (
                  <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                    <td className="px-4 py-3 font-mono text-12 text-[var(--stone)] whitespace-nowrap">{fmtDT(entry.at)}</td>
                    <td className="px-4 py-3 text-[var(--eggshell)] font-medium">{entry.acao}</td>
                    <td className="px-4 py-3 text-[var(--stone)]">{entry.detalhe}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-11 font-medium ${
                        entry.tipo === 'sucesso' ? 'bg-[var(--verified)]/10 text-[var(--verified)]' :
                        entry.tipo === 'aviso' ? 'bg-[var(--warning)]/10 text-[var(--warning)]' :
                        'bg-[var(--proof-blue)]/10 text-[var(--proof-blue)]'
                      }`}>
                        {entry.tipo === 'sucesso' ? 'Sucesso' : entry.tipo === 'aviso' ? 'Aviso' : 'Info'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        onConfirm={handleDisconnect}
        title={`Desconectar ${config.name}?`}
        description="Esta ação interromperá a sincronização imediatamente. Eventos futuros não serão capturados até reconexão."
        confirmLabel="Desconectar"
        danger
        requireReason
      />
    </AppShell>
  );
}
