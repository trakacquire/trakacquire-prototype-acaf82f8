import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { Settings, Database, Shield, Bell } from 'lucide-react';

export default function PlatformSettingsPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Platfor<PlatformPageHeader kicker="Platform · Settings" title="Platform Settings" />       <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-proof-blue" />
            <h2 className="text-16 font-medium text-eggshell">Configurações Gerais</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Nome da Plataforma</label>
              <input 
                type="text" 
                defaultValue="TrakAcquire" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>

            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Domínio Principal</label>
              <input 
                type="text" 
                defaultValue="trakacquire.io" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>

            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Email de Suporte</label>
              <input 
                type="email" 
                defaultValue="support@trakacquire.io" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-verified" />
            <h2 className="text-16 font-medium text-eggshell">Retenção de Dados</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-14 text-eggshell">Eventos de tracking (clicks, registrations)</div>
                <div className="text-12 text-stone">Mantém histórico completo de eventos</div>
              </div>
              <select className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13">
                <option>365 dias</option>
                <option>180 dias</option>
                <option>90 dias</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-14 text-eggshell">Logs de auditoria</div>
                <div className="text-12 text-stone">Ações administrativas dos tenants</div>
              </div>
              <select className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13">
                <option>1825 dias (5 anos)</option>
                <option>730 dias (2 anos)</option>
                <option>365 dias (1 ano)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-14 text-eggshell">Conversas do Inbox</div>
                <div className="text-12 text-stone">Mensagens arquivadas</div>
              </div>
              <select className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13">
                <option>180 dias</option>
                <option>90 dias</option>
                <option>60 dias</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-critical" />
            <h2 className="text-16 font-medium text-eggshell">Segurança</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Exigir MFA para todos os super admins', checked: true },
              { label: 'Permitir acesso via API key', checked: true },
              { label: 'Log de alterações sensíveis', checked: true },
              { label: 'Rate limiting agressivo (DDoS protection)', checked: true },
            ].map((pref, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer py-2 hover:bg-zinc rounded px-2 transition-colors">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-line bg-iron" />
                <span className="text-14 text-eggshell flex-1">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-warning" />
            <h2 className="text-16 font-medium text-eggshell">Notificações de Sistema</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Alertas de downtime', checked: true },
              { label: 'Novos tenants criados', checked: true },
              { label: 'Upgrades/downgrades de planos', checked: true },
              { label: 'Overage significativo (>20% da quota)', checked: true },
              { label: 'Violações de segurança', checked: true },
            ].map((pref, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer py-2 hover:bg-zinc rounded px-2 transition-colors">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-line bg-iron" />
                <span className="text-14 text-eggshell flex-1">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>
    </PlatformShell>
  );
}