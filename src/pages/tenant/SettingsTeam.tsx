import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';

/**
 * SettingsTeam — Fase R · Bloco 3 item 11.
 * Matriz de permissões perfil × ação por módulo + tabela de usuários +
 * log de alteração de permissões (audit).
 */

type Perfil = 'Owner' | 'Admin' | 'Gestor' | 'Analista' | 'Atendente' | 'Expert' | 'Viewer';
type Acao   = 'Ver' | 'Criar' | 'Editar' | 'Excluir' | 'Exportar' | 'Executar automação' | 'Ver financeiro' | 'Gerenciar permissões';

const PERFIS: Perfil[] = ['Owner', 'Admin', 'Gestor', 'Analista', 'Atendente', 'Expert', 'Viewer'];
const ACOES: Acao[]    = ['Ver', 'Criar', 'Editar', 'Excluir', 'Exportar', 'Executar automação', 'Ver financeiro', 'Gerenciar permissões'];

const MODULES = [
  { key: 'tracking',    label: 'Tracking' },
  { key: 'identity',    label: 'Identity Graph' },
  { key: 'automations', label: 'Automações' },
  { key: 'inbox',       label: 'Inbox' },
  { key: 'ledger',      label: 'Signal Ledger' },
  { key: 'reports',     label: 'Reports' },
  { key: 'billing',     label: 'Financeiro' },
];

// Matriz padrão por perfil (baseline realista da operação).
const BASELINE: Record<Perfil, Set<Acao>> = {
  Owner:     new Set(ACOES),
  Admin:     new Set(ACOES.filter((a) => a !== 'Gerenciar permissões') as Acao[]),
  Gestor:    new Set<Acao>(['Ver', 'Criar', 'Editar', 'Exportar', 'Executar automação', 'Ver financeiro']),
  Analista:  new Set<Acao>(['Ver', 'Criar', 'Editar', 'Exportar']),
  Atendente: new Set<Acao>(['Ver', 'Editar']),
  Expert:    new Set<Acao>(['Ver', 'Exportar']),
  Viewer:    new Set<Acao>(['Ver']),
};

const ROLE_OPTIONS = PERFIS;

export default function SettingsTeamPage() {
  const { state, dispatch } = useAppState();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Perfil>('Analista');
  const [selectedModule, setSelectedModule] = useState(MODULES[0].key);
  const [matrix, setMatrix] = useState<Record<string, Record<Perfil, Set<Acao>>>>(() => {
    const m: Record<string, Record<Perfil, Set<Acao>>> = {};
    for (const mod of MODULES) {
      m[mod.key] = {} as Record<Perfil, Set<Acao>>;
      for (const p of PERFIS) m[mod.key][p] = new Set(BASELINE[p]);
    }
    return m;
  });
  const [permLog, setPermLog] = useState<Array<{ at: string; who: string; change: string }>>([
    { at: '2026-07-23 14:12', who: 'jota@operacao.com', change: 'Analista · +Exportar em Reports' },
    { at: '2026-07-22 09:47', who: 'jota@operacao.com', change: 'Expert · +Ver financeiro em Tracking (revertido)' },
  ]);

  const members = [
    { email: 'jota@operacao.com',      role: 'Owner',     status: 'Ativo',    access: 'Agora' },
    { email: 'ana@operacao.com',       role: 'Admin',     status: 'Ativo',    access: 'Ontem' },
    { email: 'taina@operacao.com',     role: 'Gestor',    status: 'Ativo',    access: 'Há 2h' },
    { email: 'carlos@operacao.com',    role: 'Analista',  status: 'Ativo',    access: 'Há 3 dias' },
    { email: 'renata@operacao.com',    role: 'Atendente', status: 'Suspenso', access: 'Há 30 dias' },
    { email: 'gabriel@operacao.com',   role: 'Expert',    status: 'Ativo',    access: 'Há 5h' },
    { email: 'viewer@auditoria.com',   role: 'Viewer',    status: 'Ativo',    access: 'Há 1 sem' },
  ];

  const toggleCell = (perfil: Perfil, acao: Acao) => {
    if (perfil === 'Owner') return; // Owner intocável
    setMatrix((prev) => {
      const next = { ...prev, [selectedModule]: { ...prev[selectedModule] } };
      const setCopy = new Set(next[selectedModule][perfil]);
      const willAdd = !setCopy.has(acao);
      if (willAdd) setCopy.add(acao); else setCopy.delete(acao);
      next[selectedModule][perfil] = setCopy;
      setPermLog((log) => [
        { at: new Date().toISOString().slice(0, 16).replace('T', ' '), who: 'jota@operacao.com', change: `${perfil} · ${willAdd ? '+' : '−'}${acao} em ${MODULES.find((m) => m.key === selectedModule)?.label}` },
        ...log,
      ].slice(0, 20));
      return next;
    });
  };

  const handleSend = () => {
    if (!email.trim()) return;
    const inv = { email: email.trim(), role, sentAt: new Date().toISOString() };
    dispatch({ type: 'ADD_INVITE', inv });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'INVITE_MEMBER',
        object: email.trim(),
        detail: `Papel: ${role}`,
      },
    });
    toast(`Convite enviado para ${email.trim()}`);
    setEmail('');
    setRole('Analista');
    setInviteOpen(false);
  };

  const inviteColumns = [
    { header: 'Email', accessorKey: 'email', cell: (m: any) => <span className="font-medium text-14 text-eggshell">{m.email}</span> },
    { header: 'Papel', accessorKey: 'role', cell: (m: any) => <span className="font-mono text-12 px-2 py-0.5 bg-zinc rounded text-stone">{m.role}</span> },
    { header: 'Status', accessorKey: 'sentAt', cell: () => <span className="px-2 py-0.5 rounded text-11 font-bold bg-warning/10 text-warning uppercase">Pendente</span> },
    { header: 'Enviado em', accessorKey: 'sentAt', cell: (m: any) => <span className="text-13 text-stone">{new Date(m.sentAt).toLocaleDateString('pt-BR')}</span> },
  ];

  const memberColumns = [
    { header: 'Email', accessorKey: 'email', cell: (m: any) => <span className="font-medium text-14 text-eggshell">{m.email}</span> },
    { header: 'Papel', accessorKey: 'role', cell: (m: any) => <span className="font-mono text-12 px-2 py-0.5 bg-zinc rounded text-stone">{m.role}</span> },
    { header: 'Status', accessorKey: 'status', cell: (m: any) => <span className={`text-13 ${m.status === 'Ativo' ? 'text-verified' : 'text-critical font-bold'}`}>{m.status}</span> },
    { header: 'Último Acesso', accessorKey: 'access', cell: (m: any) => <span className="text-13 text-stone">{m.access}</span> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Equipe' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="kicker mb-1">Settings · Equipe</div>
            <div className="flex items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Equipe & Acessos</h1>
              <PreviewBadge />
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
          >
            Convidar Membro
          </button>
        </div>

        {state.pendingInvites.length > 0 && (
          <div>
            <h2 className="text-14 font-semibold text-stone mb-2">Convites Pendentes</h2>
            <DataTable data={state.pendingInvites} columns={inviteColumns} />
          </div>
        )}

        <div>
          <h2 className="text-14 font-semibold text-stone mb-2">Membros</h2>
          <DataTable data={members} columns={memberColumns} />
        </div>

        {/* Matriz de permissões perfil × ação por módulo */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line flex flex-wrap items-center gap-3 justify-between">
            <div>
              <h2 className="text-16 font-medium text-eggshell">Matriz de Permissões</h2>
              <p className="text-12 text-stone mt-0.5">Perfil × ação · escolha o módulo. Owner é imutável.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-12 text-stone">Módulo</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="bg-zinc border border-line rounded-md px-3 py-1.5 text-13 text-eggshell focus:outline-none focus:border-proof-blue"
              >
                {MODULES.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-3 text-11 font-mono uppercase text-stone">Perfil</th>
                  {ACOES.map((a) => (
                    <th key={a} className="p-3 text-11 font-mono uppercase text-stone text-center">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERFIS.map((p) => (
                  <tr key={p} className="border-b border-line last:border-0 hover:bg-zinc/40">
                    <td className="p-3 text-13 text-eggshell font-medium">{p}</td>
                    {ACOES.map((a) => {
                      const on = matrix[selectedModule][p].has(a);
                      const locked = p === 'Owner';
                      return (
                        <td key={a} className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleCell(p, a)}
                            disabled={locked}
                            className={`w-6 h-6 rounded-md inline-flex items-center justify-center text-12 font-mono transition-colors ${
                              on
                                ? locked
                                  ? 'bg-stone/20 text-stone cursor-not-allowed'
                                  : 'bg-verified/15 text-verified hover:bg-verified/25'
                                : 'bg-zinc text-stone/40 border border-line hover:text-eggshell'
                            }`}
                            title={locked ? 'Owner é imutável' : on ? 'Revogar' : 'Conceder'}
                          >
                            {on ? '✓' : '·'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log de alteração de permissões */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="text-14 font-medium text-eggshell">Log de alterações de permissão</h2>
            <p className="text-11 text-stone mt-0.5">Cada mudança fica registrada com timestamp e autor.</p>
          </div>
          <ul className="divide-y divide-line">
            {permLog.map((l, i) => (
              <li key={i} className="p-3 flex items-center gap-4">
                <span className="font-mono text-11 text-stone tabular-nums whitespace-nowrap">{l.at}</span>
                <span className="text-12 text-stone">{l.who}</span>
                <span className="text-13 text-eggshell flex-1">{l.change}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={(v) => { if (!v) { setInviteOpen(false); setEmail(''); setRole('Analista'); } }}>
        <DialogContent className="bg-graphite border-line text-eggshell max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-eggshell text-16 font-bold">Convidar membro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-12 text-stone mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell placeholder:text-stone focus:outline-none focus:border-proof-blue"
              />
            </div>
            <div>
              <label className="text-12 text-stone mb-1 block">Papel</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Perfil)}
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => { setInviteOpen(false); setEmail(''); setRole('Analista'); }}
              className="px-4 py-2 rounded-md text-14 font-medium text-stone bg-zinc hover:text-eggshell transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!email.trim()}
              className="px-4 py-2 rounded-md text-14 font-medium bg-eggshell text-ink hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
