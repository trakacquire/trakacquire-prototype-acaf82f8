import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { PhasePreviewBanner } from '@/components/state/PhasePreviewBanner';
import { DataTable } from '@/components/data/DataTable';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';

const KILL_SWITCH_CONFIG = [
  {
    key: 'meta_write',
    label: 'Meta — Acesso de Escrita',
    description: 'Permite que o sistema escreva conversões na API do Meta (CAPI). Desativar bloqueia envio de eventos.',
  },
  {
    key: 'capi_send',
    label: 'CAPI — Envio de Eventos',
    description: 'Controla o envio de eventos via CAPI ao Meta. Desativar interrompe todo tráfego de postback.',
  },
  {
    key: 'broadcast_all',
    label: 'Broadcast Geral',
    description: 'Habilita o disparo de mensagens em massa. Desativar suspende todos os broadcasts agendados.',
  },
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = React.useState('rules');
  const { state, dispatch } = useAppState();

  // Kill switch confirm dialog state
  const [pendingKillKey, setPendingKillKey] = React.useState<string | null>(null);

  // Approval confirm dialogs
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);

  const rules = [
    { id: 'rule_1', name: 'Bloquear multi-contas (mesmo device)', type: 'Fraud', severity: 'High', status: 'Ativa', triggered: 34, blocked: 34, last_trigger: 'Há 12 min' },
    { id: 'rule_2', name: 'Limitar depósitos < 18 anos', type: 'Compliance', severity: 'Critical', status: 'Ativa', triggered: 3, blocked: 3, last_trigger: 'Há 2 horas' },
    { id: 'rule_3', name: 'Alertar depósitos > R$ 5k', type: 'AML', severity: 'High', status: 'Ativa', triggered: 12, blocked: 0, last_trigger: 'Há 47 min' },
    { id: 'rule_4', name: 'Bloquear IPs em blacklist', type: 'Fraud', severity: 'High', status: 'Ativa', triggered: 89, blocked: 89, last_trigger: 'Há 5 min' },
    { id: 'rule_5', name: 'Rate limit: 10 registros/IP/hora', type: 'Security', severity: 'Medium', status: 'Ativa', triggered: 21, blocked: 21, last_trigger: 'Há 1 hora' },
    { id: 'rule_6', name: 'Validar CPF em bureau', type: 'Compliance', severity: 'High', status: 'Pausada', triggered: 0, blocked: 0, last_trigger: '—' },
  ];

  const incidents = [
    { id: 'inc_1', rule: 'Bloquear multi-contas', person_id: 'person_103', reason: '3 contas com mesmo device_id', severity: 'High', action: 'Bloqueado', timestamp: '2025-07-07 14:23' },
    { id: 'inc_2', rule: 'Alertar depósitos > R$ 5k', person_id: 'person_89', reason: 'Depósito de R$ 8.500', severity: 'High', action: 'Alertado', timestamp: '2025-07-07 13:45' },
    { id: 'inc_3', rule: 'Limitar depósitos < 18 anos', person_id: 'person_142', reason: 'Idade 16 anos no cadastro', severity: 'Critical', action: 'Bloqueado', timestamp: '2025-07-07 12:10' },
    { id: 'inc_4', rule: 'Bloquear IPs em blacklist', person_id: 'person_67', reason: 'IP 45.132.89.12 em blacklist', severity: 'High', action: 'Bloqueado', timestamp: '2025-07-07 11:58' },
    { id: 'inc_5', rule: 'Rate limit: 10 registros/IP/hora', person_id: 'person_201', reason: '12 registros do IP 189.45.23.10', severity: 'Medium', action: 'Bloqueado', timestamp: '2025-07-07 10:34' },
  ];

  const planStatus = state.actionPlans['ap_001'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-critical';
      case 'High': return 'text-warning';
      case 'Medium': return 'text-stone';
      default: return 'text-stone';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-critical/10';
      case 'High': return 'bg-warning/10';
      case 'Medium': return 'bg-stone/10';
      default: return 'bg-stone/10';
    }
  };

  const ruleColumns = [
    { 
      header: 'Regra', 
      accessorKey: 'name', 
      cell: (r: any) => (
        <div>
          <div className="text-14 text-eggshell font-medium">{r.name}</div>
          <div className="text-11 text-stone">{r.type}</div>
        </div>
      )
    },
    { 
      header: 'Severidade', 
      accessorKey: 'severity', 
      cell: (r: any) => (
        <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${getSeverityBg(r.severity)} ${getSeverityColor(r.severity)}`}>
          {r.severity}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: (r: any) => (
        <div className="flex items-center gap-1.5">
          {r.status === 'Ativa' ? (
            <><CheckCircle2 className="w-4 h-4 text-verified" /><span className="text-13 text-verified">Ativa</span></>
          ) : (
            <><XCircle className="w-4 h-4 text-stone" /><span className="text-13 text-stone">Pausada</span></>
          )}
        </div>
      )
    },
    { header: 'Acionada', accessorKey: 'triggered', className: 'text-right', cell: (r: any) => <span className="font-mono text-13">{r.triggered}x</span> },
    { header: 'Bloqueios', accessorKey: 'blocked', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-warning">{r.blocked}</span> },
    { header: 'Último Acionamento', accessorKey: 'last_trigger', cell: (r: any) => <span className="text-13 text-stone">{r.last_trigger}</span> },
  ];

  const incidentColumns = [
    { header: 'Regra', accessorKey: 'rule', cell: (i: any) => <span className="text-13 text-eggshell">{i.rule}</span> },
    { header: 'Person ID', accessorKey: 'person_id', cell: (i: any) => <span className="font-mono text-13 text-proof-blue">{i.person_id}</span> },
    { header: 'Motivo', accessorKey: 'reason', cell: (i: any) => <span className="text-13 text-stone">{i.reason}</span> },
    { 
      header: 'Ação', 
      accessorKey: 'action', 
      cell: (i: any) => (
        <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${
          i.action === 'Bloqueado' ? 'bg-critical/10 text-critical' : 'bg-warning/10 text-warning'
        }`}>
          {i.action}
        </span>
      )
    },
    { header: 'Timestamp', accessorKey: 'timestamp', cell: (i: any) => <span className="font-mono text-12 text-stone">{i.timestamp}</span> },
  ];

  const handleKillToggleConfirm = (reason?: string) => {
    if (!pendingKillKey) return;
    const key = pendingKillKey;
    dispatch({ type: 'TOGGLE_KILL', key });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'TOGGLE_KILL',
        object: key,
        detail: reason || '',
      },
    });
    const cfg = KILL_SWITCH_CONFIG.find(c => c.key === key);
    const newVal = !state.killSwitches[key];
    toast(`${cfg?.label || key} ${newVal ? 'ativado' : 'desativado'}.`);
    setPendingKillKey(null);
  };

  const handleApprove = () => {
    dispatch({ type: 'APPROVE_PLAN', id: 'ap_001' });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'APPROVE_PLAN',
        object: 'ap_001',
        detail: 'Aprovado via Governance',
      },
    });
    toast('Plano aprovado.');
    setApproveOpen(false);
  };

  const handleReject = () => {
    dispatch({ type: 'REJECT_PLAN', id: 'ap_001' });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'REJECT_PLAN',
        object: 'ap_001',
        detail: 'Rejeitado via Governance',
      },
    });
    toast('Plano rejeitado.');
    setRejectOpen(false);
  };

  return (
    <AppShell breadcrumb={[{ label: 'Governança' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
          <PhasePreviewBanner phase="P4" scope="Regras versionadas, kill switches auditados" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-24 font-bold text-eggshell mb-1">Governança & Compliance</h1><PreviewBadge /></div>
            <p className="text-13 text-stone">Regras de fraude, compliance e segurança</p>
          </div>
          
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Criar Regra
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-verified/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-verified" />
              </div>
              <div>
                <div className="text-12 text-stone">Regras Ativas</div>
                <div className="text-18 font-mono text-eggshell">{rules.filter(r => r.status === 'Ativa').length}</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-critical" />
              </div>
              <div>
                <div className="text-12 text-stone">Incidentes (24h)</div>
                <div className="text-18 font-mono text-eggshell">159</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-12 text-stone">Bloqueios (24h)</div>
                <div className="text-18 font-mono text-eggshell">147</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-stone" />
              </div>
              <div>
                <div className="text-12 text-stone">Tempo Médio Resposta</div>
                <div className="text-18 font-mono text-eggshell">12ms</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {[
            { key: 'rules', label: 'Regras' },
            { key: 'incidents', label: 'Incidentes' },
            { key: 'audit', label: 'Audit Log' },
            { key: 'kill', label: 'Kill Switches' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'rules' && (
          <DataTable data={rules} columns={ruleColumns} />
        )}

        {activeTab === 'incidents' && (
          <DataTable data={incidents} columns={incidentColumns} />
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            {state.auditLog.length === 0 ? (
              <div className="bg-graphite border border-line rounded-xl p-8 text-center text-14 text-stone">
                Audit log completo disponível em breve. Use o endpoint <span className="font-mono text-proof-blue">/api/audit</span> para consultar logs via API.
              </div>
            ) : (
              <div className="bg-graphite border border-line rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase">Usuário</th>
                      <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase">Ação</th>
                      <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase">Objeto</th>
                      <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.auditLog.map((entry, i) => (
                      <tr key={i} className="border-b border-line last:border-0 hover:bg-[var(--zinc)]/20">
                        <td className="px-4 py-2.5 font-mono text-11 text-stone">{new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-2.5 text-13 text-eggshell">{entry.user}</td>
                        <td className="px-4 py-2.5 font-mono text-12 text-proof-blue">{entry.action}</td>
                        <td className="px-4 py-2.5 font-mono text-12 text-stone">{entry.object}</td>
                        <td className="px-4 py-2.5 text-12 text-stone">{entry.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Approval Center */}
            <div className="bg-graphite border border-line rounded-xl p-5">
              <h3 className="text-16 font-bold text-eggshell mb-4">Central de Aprovações</h3>

              {planStatus === 'pending' && (
                <div className="border border-line rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-15 font-semibold text-eggshell">Escalar Budget Meta +20%</div>
                      <span className="font-mono text-11 text-stone">ap_001</span>
                    </div>
                    <div className="text-14 font-bold text-[var(--verified)]">+R$1.200 est.</div>
                  </div>
                  <div className="text-13 text-stone">Amostra: 72h ✓ · Expira em 2h</div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setApproveOpen(true)}
                      className="px-3 py-1.5 rounded-md bg-[var(--eggshell)] text-[var(--ink)] text-13 font-medium hover:bg-white transition-colors"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => setRejectOpen(true)}
                      className="px-3 py-1.5 rounded-md bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 text-13 font-medium hover:bg-[var(--critical)]/20 transition-colors"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}

              {planStatus === 'approved' && (
                <div className="flex items-center gap-3 p-4 border border-[var(--verified)]/20 rounded-lg bg-[var(--verified)]/5">
                  <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--verified)]/10 text-[var(--verified)] uppercase">Aprovado</span>
                  <span className="text-13 text-stone">Plano ap_001 — Escalar Budget Meta +20%</span>
                </div>
              )}

              {planStatus === 'rejected' && (
                <div className="flex items-center gap-3 p-4 border border-[var(--critical)]/20 rounded-lg bg-[var(--critical)]/5">
                  <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--critical)]/10 text-[var(--critical)] uppercase">Rejeitado</span>
                  <span className="text-13 text-stone">Plano ap_001 — Escalar Budget Meta +20%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kill' && (
          <div className="bg-graphite border border-line rounded-xl divide-y divide-line">
            {KILL_SWITCH_CONFIG.map((cfg) => {
              const isOn = state.killSwitches[cfg.key] ?? false;
              return (
                <div key={cfg.key} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-14 font-semibold text-eggshell">{cfg.label}</div>
                    <div className="text-12 text-stone mt-0.5">{cfg.description}</div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => setPendingKillKey(cfg.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      isOn ? 'bg-[var(--proof-blue)]' : 'bg-[var(--line)]'
                    }`}
                    aria-label={`Toggle ${cfg.label}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        isOn ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Kill Switch Confirm Dialog */}
      <ConfirmDialog
        open={pendingKillKey !== null}
        onClose={() => setPendingKillKey(null)}
        onConfirm={handleKillToggleConfirm}
        title={`Confirmar alteração: ${KILL_SWITCH_CONFIG.find(c => c.key === pendingKillKey)?.label || ''}`}
        description={`Você está prestes a ${state.killSwitches[pendingKillKey ?? ''] ? 'desativar' : 'ativar'} este kill switch. Esta ação terá efeito imediato.`}
        confirmLabel="Confirmar"
        danger={true}
        requireReason={true}
      />

      {/* Approve Confirm */}
      <ConfirmDialog
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onConfirm={handleApprove}
        title="Aprovar plano de ação"
        description="Confirme a aprovação do plano ap_001: Escalar Budget Meta +20%."
        confirmLabel="Aprovar"
      />

      {/* Reject Confirm */}
      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title="Rejeitar plano de ação"
        description="Confirme a rejeição do plano ap_001: Escalar Budget Meta +20%."
        confirmLabel="Rejeitar"
        danger={true}
      />
    </AppShell>
  );
}
