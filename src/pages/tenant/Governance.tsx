import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { DataTable } from '@/components/data/DataTable';
import { MetricCard } from '@/components/data/MetricCard';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Clock,
  Lock, EyeOff, Server, ClipboardList, Zap,
} from 'lucide-react';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';

const KILL_SWITCH_CONFIG = [
  { key: 'meta_write', label: 'Meta — Escrita CAPI', description: 'Permite que o sistema escreva conversões na API do Meta. Desativar bloqueia o envio.' },
  { key: 'capi_send', label: 'CAPI — Envio de eventos', description: 'Interrompe o envio de eventos via CAPI.' },
  { key: 'broadcast_all', label: 'Broadcast geral', description: 'Suspende todos os broadcasts agendados.' },
];

type HubCard = 'policy' | 'approvals' | 'pii' | 'kill' | 'isolation' | 'audit';

export default function GovernancePage() {
  const [card, setCard] = React.useState<HubCard>('policy');
  const { state, dispatch } = useAppState();

  const [pendingKillKey, setPendingKillKey] = React.useState<string | null>(null);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [piiConfirmOpen, setPiiConfirmOpen] = React.useState(false);

  const rules = [
    { id: 'rule_1', name: 'Bloquear multi-contas (mesmo device)', type: 'Fraud', severity: 'High', status: 'Ativa', triggered: 34, blocked: 34, last_trigger: 'Há 12 min' },
    { id: 'rule_2', name: 'Limitar depósitos < 18 anos', type: 'Compliance', severity: 'Critical', status: 'Ativa', triggered: 3, blocked: 3, last_trigger: 'Há 2 horas' },
    { id: 'rule_3', name: 'Alertar depósitos > R$ 5k', type: 'AML', severity: 'High', status: 'Ativa', triggered: 12, blocked: 0, last_trigger: 'Há 47 min' },
    { id: 'rule_4', name: 'Bloquear IPs em blacklist', type: 'Fraud', severity: 'High', status: 'Ativa', triggered: 89, blocked: 89, last_trigger: 'Há 5 min' },
    { id: 'rule_5', name: 'Rate limit: 10 registros/IP/hora', type: 'Security', severity: 'Medium', status: 'Ativa', triggered: 21, blocked: 21, last_trigger: 'Há 1 hora' },
    { id: 'rule_6', name: 'Validar CPF em bureau', type: 'Compliance', severity: 'High', status: 'Pausada', triggered: 0, blocked: 0, last_trigger: '—' },
  ];

  const piiOpenings = [
    { id: 'pii_001', object: 'person_089', field: 'cpf', user: 'ana@operacaobr.com', at: '2026-07-24 09:14', reason: 'Investigação de chargeback' },
    { id: 'pii_002', object: 'person_142', field: 'email', user: 'jota@operacaobr.com', at: '2026-07-23 16:22', reason: 'Suporte técnico' },
    { id: 'pii_003', object: 'person_067', field: 'phone', user: 'carlos@operacaobr.com', at: '2026-07-23 11:47', reason: 'Reconciliação de identidade' },
  ];

  const planStatus = state.actionPlans['ap_001'];

  const activeRules = rules.filter(r => r.status === 'Ativa').length;
  const activeKills = Object.values(state.killSwitches).filter(Boolean).length;

  const getSeverityColor = (s: string) => s === 'Critical' ? 'text-critical' : s === 'High' ? 'text-warning' : 'text-stone';
  const getSeverityBg = (s: string) => s === 'Critical' ? 'bg-critical/10' : s === 'High' ? 'bg-warning/10' : 'bg-stone/10';

  const ruleColumns = [
    { header: 'Regra', accessorKey: 'name', cell: (r: any) => (
      <div>
        <div className="text-14 text-eggshell font-medium">{r.name}</div>
        <div className="text-11 text-stone">{r.type}</div>
      </div>
    )},
    { header: 'Severidade', accessorKey: 'severity', cell: (r: any) => (
      <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${getSeverityBg(r.severity)} ${getSeverityColor(r.severity)}`}>{r.severity}</span>
    )},
    { header: 'Status', accessorKey: 'status', cell: (r: any) => (
      <div className="flex items-center gap-1.5">
        {r.status === 'Ativa'
          ? <><CheckCircle2 className="w-4 h-4 text-verified" /><span className="text-13 text-verified">Ativa</span></>
          : <><XCircle className="w-4 h-4 text-stone" /><span className="text-13 text-stone">Pausada</span></>}
      </div>
    )},
    { header: 'Acionada', accessorKey: 'triggered', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 tabular-nums">{r.triggered}x</span> },
    { header: 'Bloqueios', accessorKey: 'blocked', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-warning tabular-nums">{r.blocked}</span> },
    { header: 'Última', accessorKey: 'last_trigger', cell: (r: any) => <span className="text-13 text-stone">{r.last_trigger}</span> },
  ];

  const piiColumns = [
    { header: 'ID', accessorKey: 'id', cell: (p: any) => <span className="font-mono text-12 text-proof-blue tabular-nums">{p.id}</span> },
    { header: 'Objeto', accessorKey: 'object', cell: (p: any) => <span className="font-mono text-12 text-eggshell tabular-nums">{p.object}</span> },
    { header: 'Campo', accessorKey: 'field', cell: (p: any) => (
      <span className="flex items-center gap-1.5 text-13">
        <EyeOff className="w-3.5 h-3.5 text-stone" />
        <span className="font-mono text-eggshell">{p.field}</span>
        <span className="font-mono text-11 text-stone">••• mascarado</span>
      </span>
    )},
    { header: 'Usuário', accessorKey: 'user', cell: (p: any) => <span className="text-13 text-eggshell">{p.user}</span> },
    { header: 'Motivo', accessorKey: 'reason', cell: (p: any) => <span className="text-13 text-stone">{p.reason}</span> },
    { header: 'Data', accessorKey: 'at', cell: (p: any) => <span className="font-mono text-12 text-stone tabular-nums">{p.at}</span> },
  ];

  const handleKillToggleConfirm = (reason?: string) => {
    if (!pendingKillKey) return;
    const key = pendingKillKey;
    dispatch({ type: 'TOGGLE_KILL', key });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: { timestamp: new Date().toISOString(), user: 'jota@operacao.com', action: 'TOGGLE_KILL', object: key, detail: reason || '' },
    });
    const cfg = KILL_SWITCH_CONFIG.find(c => c.key === key);
    toast(`${cfg?.label || key} ${!state.killSwitches[key] ? 'ativado' : 'desativado'}.`);
    setPendingKillKey(null);
  };

  const handleApprove = () => {
    dispatch({ type: 'APPROVE_PLAN', id: 'ap_001' });
    dispatch({ type: 'APPEND_AUDIT', entry: { timestamp: new Date().toISOString(), user: 'jota@operacao.com', action: 'APPROVE_PLAN', object: 'ap_001', detail: 'Aprovado via Governance' } });
    toast('Plano aprovado.');
    setApproveOpen(false);
  };
  const handleReject = () => {
    dispatch({ type: 'REJECT_PLAN', id: 'ap_001' });
    dispatch({ type: 'APPEND_AUDIT', entry: { timestamp: new Date().toISOString(), user: 'jota@operacao.com', action: 'REJECT_PLAN', object: 'ap_001', detail: 'Rejeitado via Governance' } });
    toast('Plano rejeitado.');
    setRejectOpen(false);
  };

  const hubCards: Array<{ key: HubCard; icon: React.ReactNode; title: string; value: string; hint: string; tone: string }> = [
    { key: 'policy', icon: <Shield className="w-5 h-5" />, title: 'Policy Engine', value: `${activeRules} ativas`, hint: 'Autorizações vigentes', tone: 'text-proof-blue bg-proof-blue/10' },
    { key: 'approvals', icon: <ClipboardList className="w-5 h-5" />, title: 'Approval Center', value: planStatus === 'pending' ? '1 aguardando' : 'Vazio', hint: 'Planos imutáveis', tone: 'text-warning bg-warning/10' },
    { key: 'pii', icon: <Lock className="w-5 h-5" />, title: 'PII Vault', value: `${piiOpenings.length} aberturas`, hint: 'Sempre mascarado', tone: 'text-eggshell bg-zinc' },
    { key: 'kill', icon: <Zap className="w-5 h-5" />, title: 'Kill Switches', value: `${activeKills}/3 ativos`, hint: 'Ação irreversível', tone: 'text-critical bg-critical/10' },
    { key: 'isolation', icon: <Server className="w-5 h-5" />, title: 'Tenant Isolation', value: 'ws_1 · escopo total', hint: 'RLS + tenant_id em toda consulta', tone: 'text-verified bg-verified/10' },
    { key: 'audit', icon: <AlertTriangle className="w-5 h-5" />, title: 'Audit Log', value: `${state.auditLog.length + 5} eventos`, hint: 'Toda ação administrativa', tone: 'text-stone bg-zinc' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Prove' }, { label: 'Governança' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-12 font-serif italic text-stone/80 mb-1">Prove / Governança</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Hub de governança</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Policy Engine, aprovações imutáveis, PII Vault, kill switches e isolamento.</p>
          </div>
        </header>

        <ScenarioStateGate>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            <MetricCard label="Regras ativas" value={activeRules} evidenceData={buildEvidence({ label: 'Regras ativas', value: activeRules, formula: 'count(rules) where status = Ativa', source: 'Policy Engine', state: 'Reconciliado' })} />
            <MetricCard label="Kill switches" value={`${activeKills}/3`} evidenceData={buildEvidence({ label: 'Kill switches ativos', value: activeKills, formula: 'count(killSwitches) where value = true', source: 'Runtime state', state: 'Reconciliado' })} />
            <MetricCard label="Aberturas PII (7d)" value={piiOpenings.length} evidenceData={buildEvidence({ label: 'Aberturas de PII', value: piiOpenings.length, formula: 'count(pii_open_events) where ts within 7d', source: 'PII Vault log', state: 'Reconciliado' })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            {hubCards.map(hc => (
              <button
                key={hc.key}
                onClick={() => setCard(hc.key)}
                className={`text-left bg-graphite border rounded-xl p-4 transition-colors ${card === hc.key ? 'border-proof-blue' : 'border-line hover:border-stone'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hc.tone}`}>{hc.icon}</div>
                  <div>
                    <div className="text-12 text-stone">{hc.title}</div>
                    <div className="text-16 font-mono text-eggshell tabular-nums">{hc.value}</div>
                  </div>
                </div>
                <div className="mt-2 text-11 text-stone">{hc.hint}</div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            {card === 'policy' && (
              <div className="space-y-3">
                <h3 className="text-16 font-bold text-eggshell">Policy Engine — autorizações vigentes</h3>
                <DataTable data={rules} columns={ruleColumns} />
              </div>
            )}

            {card === 'approvals' && (
              <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
                <h3 className="text-16 font-bold text-eggshell">Approval Center</h3>
                {planStatus === 'pending' && (
                  <div className="border border-line rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-15 font-semibold text-eggshell">Escalar Budget Meta +20%</div>
                        <span className="font-mono text-11 text-stone tabular-nums">ap_001 · plano imutável</span>
                      </div>
                      <div className="text-14 font-bold text-verified">+R$1.200 est.</div>
                    </div>
                    <div className="text-13 text-stone">Amostra: 72h ✓ · Expira em 2h · Dono: jota@operacao.com</div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setApproveOpen(true)} className="px-3 py-1.5 rounded-md bg-eggshell text-ink text-13 font-medium hover:bg-white">Aprovar</button>
                      <button onClick={() => setRejectOpen(true)} className="px-3 py-1.5 rounded-md bg-critical/10 text-critical border border-critical/20 text-13 font-medium hover:bg-critical/20">Rejeitar</button>
                    </div>
                  </div>
                )}
                {planStatus === 'approved' && (
                  <div className="flex items-center gap-3 p-4 border border-verified/20 rounded-lg bg-verified/5">
                    <span className="px-2 py-0.5 rounded text-11 font-bold bg-verified/10 text-verified uppercase">Aprovado</span>
                    <span className="text-13 text-stone">Plano ap_001 — Escalar Budget Meta +20%</span>
                  </div>
                )}
                {planStatus === 'rejected' && (
                  <div className="flex items-center gap-3 p-4 border border-critical/20 rounded-lg bg-critical/5">
                    <span className="px-2 py-0.5 rounded text-11 font-bold bg-critical/10 text-critical uppercase">Rejeitado</span>
                    <span className="text-13 text-stone">Plano ap_001 — Escalar Budget Meta +20%</span>
                  </div>
                )}
              </div>
            )}

            {card === 'pii' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-16 font-bold text-eggshell">PII Vault — aberturas recentes</h3>
                  <button onClick={() => setPiiConfirmOpen(true)} className="text-13 text-proof-blue hover:text-eggshell">Registrar nova abertura</button>
                </div>
                <DataTable data={piiOpenings} columns={piiColumns} />
              </div>
            )}

            {card === 'kill' && (
              <div className="bg-graphite border border-line rounded-xl divide-y divide-line">
                {KILL_SWITCH_CONFIG.map(cfg => {
                  const isOn = state.killSwitches[cfg.key] ?? false;
                  return (
                    <div key={cfg.key} className="flex items-center justify-between px-5 py-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-14 font-semibold text-eggshell">{cfg.label}</div>
                        <div className="text-12 text-stone mt-0.5">{cfg.description}</div>
                      </div>
                      <button
                        onClick={() => setPendingKillKey(cfg.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-proof-blue' : 'bg-line'}`}
                        aria-label={`Toggle ${cfg.label}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {card === 'isolation' && (
              <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
                <h3 className="text-16 font-bold text-eggshell">Tenant Isolation</h3>
                <p className="text-13 text-stone">Toda consulta obrigatoriamente inclui <span className="font-mono text-eggshell">tenant_id = ws_1</span>. Verificado por policy check em cada endpoint.</p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded border border-line">
                    <div className="text-11 text-stone">RLS Postgres</div>
                    <div className="text-13 text-verified">✓ Ativo</div>
                  </div>
                  <div className="p-3 rounded border border-line">
                    <div className="text-11 text-stone">Middleware API</div>
                    <div className="text-13 text-verified">✓ Ativo</div>
                  </div>
                  <div className="p-3 rounded border border-line">
                    <div className="text-11 text-stone">Cross-tenant scan</div>
                    <div className="text-13 text-verified">0 vazamentos (24h)</div>
                  </div>
                </div>
              </div>
            )}

            {card === 'audit' && (
              <div className="bg-graphite border border-line rounded-xl overflow-hidden">
                {state.auditLog.length === 0 ? (
                  <div className="p-8 text-center text-14 text-stone">
                    Sem ações registradas nesta sessão. Toggle um kill switch ou aprove um plano para ver o log preenchido.
                  </div>
                ) : (
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
                        <tr key={i} className="border-b border-line last:border-0 hover:bg-zinc/20">
                          <td className="px-4 py-2.5 font-mono text-11 text-stone tabular-nums">{new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
                          <td className="px-4 py-2.5 text-13 text-eggshell">{entry.user}</td>
                          <td className="px-4 py-2.5 font-mono text-12 text-proof-blue">{entry.action}</td>
                          <td className="px-4 py-2.5 font-mono text-12 text-stone">{entry.object}</td>
                          <td className="px-4 py-2.5 text-12 text-stone">{entry.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </ScenarioStateGate>

        {pendingKillKey && (
          <ConfirmDialog
            open={!!pendingKillKey}
            onOpenChange={v => { if (!v) setPendingKillKey(null); }}
            title={`Confirmar toggle: ${KILL_SWITCH_CONFIG.find(c => c.key === pendingKillKey)?.label}`}
            description="Digite o nome do switch para confirmar. Ação auditada."
            confirmToken={pendingKillKey}
            requireReason
            onConfirm={handleKillToggleConfirm}
            destructive
          />
        )}
        <ConfirmDialog open={approveOpen} onOpenChange={setApproveOpen} title="Aprovar plano ap_001" description="Digite 'ap_001' para confirmar." confirmToken="ap_001" onConfirm={handleApprove} />
        <ConfirmDialog open={rejectOpen} onOpenChange={setRejectOpen} title="Rejeitar plano ap_001" description="Digite 'ap_001' para confirmar." confirmToken="ap_001" onConfirm={handleReject} destructive />
        <ConfirmDialog open={piiConfirmOpen} onOpenChange={setPiiConfirmOpen} title="Registrar abertura de PII" description="Digite 'PII' e informe o motivo. Ação auditada." confirmToken="PII" requireReason onConfirm={() => { toast('Abertura registrada no vault (mock).'); setPiiConfirmOpen(false); }} />
      </div>
    </AppShell>
  );
}
