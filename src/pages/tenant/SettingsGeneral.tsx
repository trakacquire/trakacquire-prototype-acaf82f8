import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';

/**
 * SettingsGeneral — Fase R · Bloco 3 item 12.
 * Adiciona toggles de MÓDULOS por workspace (o admin liga/desliga o que sua
 * operação usa). Contagem "N módulos ativos" fica visível no topo.
 */
type ModuleDef = { key: string; label: string; description: string; defaultOn: boolean };

const MODULES: ModuleDef[] = [
  { key: 'tracking',     label: 'Tracking & Links',     description: 'Criação de links rastreáveis, click_id opaco, split A/B.',           defaultOn: true  },
  { key: 'identity',     label: 'Identity Graph',       description: 'Costura de identidades por click_id, telegram, fingerprint.',        defaultOn: true  },
  { key: 'automations',  label: 'Automações & Flows',   description: 'Broadcasts, filas de retention, gatilhos por evento.',               defaultOn: true  },
  { key: 'inbox',        label: 'Inbox multicanal',     description: 'Atendimento humano com contexto por identidade.',                    defaultOn: false },
  { key: 'ledger',       label: 'Signal Ledger',        description: 'Auditoria evento-a-evento e reprocessamento (SRE mode).',            defaultOn: true  },
  { key: 'reports',      label: 'Reports & Cohorts',    description: 'Relatórios agendados, cohorts semanais, recompra.',                  defaultOn: true  },
  { key: 'reconcil',     label: 'Reconciliação',        description: 'Casamento de FTDs com pagador, divergências e ledger.',              defaultOn: true  },
  { key: 'ai_copilot',   label: 'Copiloto de IA',       description: 'Sugestões de gargalo, brief automático, custo por IA.',              defaultOn: false },
];

export default function GeneralSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(MODULES.map((m) => [m.key, m.defaultOn]))
  );
  const activeCount = Object.values(enabled).filter(Boolean).length;

  const toggle = (key: string) => setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Geral' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="kicker mb-1">Settings · Geral</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Configurações Gerais</h1>
            <PreviewBadge />
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line">
            <h2 className="text-18 font-medium text-eggshell mb-4">Informações do Workspace</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-12 font-medium text-stone mb-1.5">Nome da Operação</label>
                <input
                  type="text"
                  defaultValue="Operação Tainá"
                  className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-12 font-medium text-stone mb-1.5">Fuso Horário</label>
                  <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue">
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>Europe/London (UTC+1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-12 font-medium text-stone mb-1.5">Moeda Principal</label>
                  <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue">
                    <option>BRL (R$)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-iron flex justify-end">
            <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Bloco R.3.12 — Módulos ligáveis por workspace */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <h2 className="text-18 font-medium text-eggshell">Módulos do Workspace</h2>
              <p className="text-13 text-stone mt-1">Ative apenas o que a operação usa — menos ruído na sidebar, menos custo em IA.</p>
            </div>
            <span className="font-mono tabular-nums text-13 text-proof-blue px-3 py-1 rounded-md bg-proof-blue/10 border border-proof-blue/20">
              {activeCount}/{MODULES.length} módulos ativos
            </span>
          </div>
          <ul className="divide-y divide-line">
            {MODULES.map((m) => {
              const on = enabled[m.key];
              return (
                <li key={m.key} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="text-14 font-medium text-eggshell">{m.label}</div>
                    <div className="text-12 text-stone mt-0.5">{m.description}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(m.key)}
                    aria-pressed={on}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${on ? 'bg-verified' : 'bg-zinc border border-line'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-eggshell transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-graphite border border-critical/30 rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-18 font-medium text-critical mb-2">Zona de Perigo</h2>
            <p className="text-14 text-stone mb-4">Ações destrutivas para este workspace. Não podem ser desfeitas.</p>
            <button className="bg-transparent border border-critical text-critical px-4 py-2 rounded-md font-medium text-14 hover:bg-critical/10 transition-colors">
              Apagar Workspace
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
