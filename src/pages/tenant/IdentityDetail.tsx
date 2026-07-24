import React, { useState, useEffect } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { IdentityGraph } from '@/components/data/IdentityGraph';
import { db, Person } from '@/lib/fake/db';
import { StatusChip } from '@/components/domain/StatusChip';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTs(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const TYPE_TONE: Record<string, string> = {
  click: 'text-proof-blue border-proof-blue/40 bg-proof-blue/10',
  register: 'text-verified border-verified/40 bg-verified/10',
  ftd: 'text-verified border-verified/40 bg-verified/10',
  deposit: 'text-verified border-verified/40 bg-verified/10',
  withdrawal: 'text-critical border-critical/40 bg-critical/10',
  postback: 'text-warning border-warning/40 bg-warning/10',
  capi: 'text-warning border-warning/40 bg-warning/10',
  webhook: 'text-stone border-line bg-zinc',
  bot_message: 'text-proof-blue border-proof-blue/40 bg-proof-blue/10',
  conversation_start: 'text-stone border-line bg-zinc',
};

function TypeChip({ type }: { type: string }) {
  const cls = TYPE_TONE[type] ?? 'text-stone border-line bg-zinc';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-11 font-mono border ${cls}`}>
      {type}
    </span>
  );
}

// Identifier rows for the identity tab right side
function buildIdentifiers(person: Person) {
  const rows: { field: string; masked: string; method: string; confidence: number }[] = [];
  rows.push({ field: 'Person ID', masked: person.id, method: 'Interno', confidence: 100 });
  if (person.click_id) rows.push({ field: 'Click ID', masked: person.click_id.slice(0, 4) + '••••' + person.click_id.slice(-4), method: 'fbclid', confidence: 100 });
  if (person.telegram_id) rows.push({ field: 'Telegram ID', masked: '••' + person.telegram_id.slice(-4), method: 'telegram_start', confidence: 100 });
  if (person.phone_token) rows.push({ field: 'Phone Token', masked: person.phone_token.slice(0, 6) + '••••', method: 'Hash SHA-256', confidence: 90 });
  if (person.customer_id) rows.push({ field: 'Customer ID', masked: 'cust_•••••', method: 'TAP Postback', confidence: person.identity_confidence });
  if (person.email) {
    const [local, domain] = person.email.split('@');
    rows.push({ field: 'Email', masked: local[0] + '***@' + domain, method: 'Registro', confidence: 85 });
  }
  return rows;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function IdentityDetailPage({ params }: { params: { personId: string } }) {
  const person = db.getPerson(params.personId) ?? db.persons[0];
  const [activeTab, setActiveTab] = useState<'Identidade' | 'Timeline' | 'Dados PII'>('Identidade');

  // Vault state
  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultDialogOpen, setVaultDialogOpen] = useState(false);
  const [vaultReason, setVaultReason] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!vaultOpen) return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setVaultOpen(false);
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [vaultOpen]);

  const personEvents = db.events.filter(e => e.person_id === person.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const identifiers = buildIdentifiers(person);
  const tabs: Array<'Identidade' | 'Timeline' | 'Dados PII'> = ['Identidade', 'Timeline', 'Dados PII'];

  return (
    <AppShell breadcrumb={[{ label: 'Identity Graph', href: '/identity' }, { label: params.personId }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-2"><PreviewBadge /></div>
        {/* Header */}
        <div className="bg-graphite border border-line rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-20 font-bold text-eggshell">{person.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusChip status={person.status} />
              <span className="text-12 font-mono text-stone">{person.id}</span>
              <span className="text-12 text-stone">• Conf. <span className="text-verified font-mono">{person.identity_confidence}%</span></span>
            </div>
          </div>
          <a href={`/players/${person.id}`} className="text-13 text-proof-blue underline underline-offset-2 hover:text-eggshell transition-colors">
            Ver Player 360 →
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Identidade */}
        {activeTab === 'Identidade' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: graph */}
            <div className="bg-graphite border border-line rounded-xl p-4">
              <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-3">Grafo de Identidade</h2>
              <IdentityGraph person={person} />
            </div>
            {/* Right: identifier table */}
            <div className="bg-graphite border border-line rounded-xl p-4">
              <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-3">Identificadores</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left text-11 text-stone font-medium pb-2 pr-3">Campo</th>
                      <th className="text-left text-11 text-stone font-medium pb-2 pr-3">Valor</th>
                      <th className="text-left text-11 text-stone font-medium pb-2 pr-3">Método</th>
                      <th className="text-right text-11 text-stone font-medium pb-2">Conf.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {identifiers.map(row => (
                      <tr key={row.field} className="border-b border-line/50 last:border-0">
                        <td className="py-2 pr-3 text-stone text-12 whitespace-nowrap">{row.field}</td>
                        <td className="py-2 pr-3 font-mono text-eggshell text-11 break-all">{row.masked}</td>
                        <td className="py-2 pr-3 text-stone text-12 whitespace-nowrap">{row.method}</td>
                        <td className="py-2 text-right font-mono text-verified text-12 whitespace-nowrap">{row.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Timeline */}
        {activeTab === 'Timeline' && (
          <div className="bg-graphite border border-line rounded-xl p-5">
            <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-4">Timeline de Eventos</h2>
            {personEvents.length === 0 ? (
              <p className="text-stone text-14">Nenhum evento encontrado.</p>
            ) : (
              <div className="space-y-3">
                {personEvents.map(evt => (
                  <div key={evt.id} className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-proof-blue" />
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <TypeChip type={evt.type} />
                      <StatusChip status={evt.status} />
                      <span className="font-mono text-11 text-stone whitespace-nowrap tabular-nums">{fmtTs(evt.timestamp)}</span>
                      {evt.value !== undefined && (
                        <span className="font-mono text-12 text-eggshell tabular-nums">
                          {evt.type === 'withdrawal' ? '-' : ''}R$ {evt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      <span className="text-11 font-mono text-stone tabular-nums">{evt.latency_ms}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Dados PII */}
        {activeTab === 'Dados PII' && (
          <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
            {/* Warning banner */}
            <div className="flex items-center gap-2 bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
              <span className="text-warning text-16">⚠</span>
              <span className="text-13 text-warning font-medium">Acesso auditado e registrado. Toda visualização é logada.</span>
            </div>

            {/* Masked fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-line/50">
                <span className="text-13 text-stone">Telefone</span>
                <span className="font-mono text-13 text-eggshell">
                  {vaultOpen ? (person.phone_token ?? '—') : '•••• ••62'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-line/50">
                <span className="text-13 text-stone">Email</span>
                <span className="font-mono text-13 text-eggshell">
                  {vaultOpen ? person.email : (() => {
                    const [local, domain] = person.email.split('@');
                    return local[0] + '***@' + domain;
                  })()}
                </span>
              </div>
              {person.customer_id && (
                <div className="flex items-center justify-between py-2 border-b border-line/50">
                  <span className="text-13 text-stone">Customer ID</span>
                  <span className="font-mono text-13 text-eggshell">
                    {vaultOpen ? person.customer_id : 'cust_•••••'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-line/50">
                <span className="text-13 text-stone">Nome</span>
                <span className="font-mono text-13 text-eggshell">
                  {vaultOpen ? person.name : person.name[0] + '••• ' + person.name.split(' ').slice(-1)[0][0] + '•••'}
                </span>
              </div>
            </div>

            {vaultOpen ? (
              <div className="flex items-center gap-3 bg-verified/10 border border-verified/30 rounded-lg px-4 py-3">
                <span className="text-verified text-13 font-medium">🔓 Cofre aberto — fecha em <span className="font-mono">{countdown}s</span></span>
              </div>
            ) : (
              <button
                onClick={() => { setVaultDialogOpen(true); setVaultReason(''); }}
                className="px-4 py-2 rounded-md text-13 font-medium bg-zinc text-eggshell border border-line hover:bg-iron transition-colors"
              >
                🔐 Abrir cofre
              </button>
            )}
          </div>
        )}
      </div>

      {/* Vault Dialog */}
      <Dialog open={vaultDialogOpen} onOpenChange={open => { if (!open) setVaultDialogOpen(false); }}>
        <DialogContent className="bg-graphite border-line text-eggshell max-w-md">
          <DialogHeader>
            <DialogTitle className="text-eggshell">Confirmar acesso a dados PII</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-13 text-stone">Descreva o motivo de acesso. Este registro será auditado.</p>
            <div>
              <textarea
                value={vaultReason}
                onChange={e => setVaultReason(e.target.value)}
                placeholder="Ex: Verificação solicitada pelo suporte para resolver reclamação do cliente..."
                rows={4}
                className="w-full bg-iron border border-line rounded-md px-3 py-2 text-13 text-eggshell placeholder:text-stone focus:outline-none focus:border-proof-blue/50 resize-none"
              />
              <div className="text-right text-11 font-mono mt-1" style={{ color: vaultReason.length >= 20 ? 'var(--color-verified)' : 'var(--color-stone)' }}>
                {vaultReason.length}/20 mín
              </div>
            </div>
            <button
              disabled={vaultReason.trim().length < 20}
              onClick={() => {
                setVaultDialogOpen(false);
                setVaultOpen(true);
                setCountdown(30);
              }}
              className="w-full px-4 py-2 rounded-md text-13 font-medium bg-proof-blue/20 text-proof-blue border border-proof-blue/30 hover:bg-proof-blue/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar acesso
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
