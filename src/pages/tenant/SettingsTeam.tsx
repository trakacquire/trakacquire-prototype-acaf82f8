import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';

const ROLE_OPTIONS = ['Admin', 'Analista', 'Visualizador'];

export default function SettingsTeamPage() {
  const { state, dispatch } = useAppState();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Analista');

  const members = [
    { email: 'jota@operacao.com', role: 'Owner', mfa: 'Sim', access: 'Hoje' },
    { email: 'ana@operacao.com', role: 'Admin', mfa: 'Sim', access: 'Ontem' },
    { email: 'carlos@operacao.com', role: 'Analyst', mfa: 'Não', access: 'Há 3 dias' },
  ];

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
    {
      header: 'Status', accessorKey: 'sentAt',
      cell: () => (
        <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--warning)]/10 text-[var(--warning)] uppercase">Pendente</span>
      )
    },
    {
      header: 'Enviado em', accessorKey: 'sentAt',
      cell: (m: any) => <span className="text-13 text-stone">{new Date(m.sentAt).toLocaleDateString('pt-BR')}</span>
    },
  ];

  const memberColumns = [
    { header: 'Email', accessorKey: 'email', cell: (m: any) => <span className="font-medium text-14 text-eggshell">{m.email}</span> },
    { header: 'Papel', accessorKey: 'role', cell: (m: any) => <span className="font-mono text-12 px-2 py-0.5 bg-zinc rounded text-stone">{m.role}</span> },
    { header: 'MFA', accessorKey: 'mfa', cell: (m: any) => <span className={`text-13 ${m.mfa === 'Sim' ? 'text-verified' : 'text-critical font-bold'}`}>{m.mfa}</span> },
    { header: 'Último Acesso', accessorKey: 'access', cell: (m: any) => <span className="text-13 text-stone">{m.access}</span> }
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Equipe' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-11 font-serif italic text-stone mb-1">Governança · Assentos</div>
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


        {/* Pending invites */}
        {state.pendingInvites.length > 0 && (
          <div>
            <h2 className="text-14 font-semibold text-stone mb-2">Convites Pendentes</h2>
            <DataTable data={state.pendingInvites} columns={inviteColumns} />
          </div>
        )}

        {/* Members */}
        <DataTable data={members} columns={memberColumns} />
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={(v) => { if (!v) { setInviteOpen(false); setEmail(''); setRole('Analista'); } }}>
        <DialogContent className="bg-[var(--graphite)] border-[var(--line)] text-[var(--eggshell)] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[var(--eggshell)] text-16 font-bold">Convidar membro</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-12 text-stone mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] placeholder:text-[var(--stone)] focus:outline-none focus:border-[var(--proof-blue)]"
              />
            </div>

            <div>
              <label className="text-12 text-stone mb-1 block">Papel</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] focus:outline-none focus:border-[var(--proof-blue)]"
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
              className="px-4 py-2 rounded-md text-14 font-medium text-[var(--stone)] bg-[var(--zinc)] hover:text-[var(--eggshell)] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!email.trim()}
              className="px-4 py-2 rounded-md text-14 font-medium bg-[var(--eggshell)] text-[var(--ink)] hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
