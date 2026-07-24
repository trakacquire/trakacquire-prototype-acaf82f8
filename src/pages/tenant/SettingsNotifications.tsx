import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

export default function SettingsNotificationsPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Notificações' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="kicker mb-1">Settings · Notificações</div>
          <div className="flex items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Notificações</h1>
            <PreviewBadge />
          </div>
          <p className="text-13 text-stone mt-1">Configure como e quando você quer receber alertas</p>
        </div>


        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-proof-blue" />
            <h2 className="text-16 font-medium text-eggshell">Notificações por Email</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Relatórios semanais de performance', checked: true },
              { label: 'Alertas de reconciliação com divergência', checked: true },
              { label: 'Notificações de novos FTDs (diário)', checked: false },
              { label: 'Avisos de quota (80% e 95%)', checked: true },
              { label: 'Novidades e atualizações de produto', checked: false },
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
            <MessageSquare className="w-5 h-5 text-verified" />
            <h2 className="text-16 font-medium text-eggshell">Notificações In-App</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Novos membros adicionados ao workspace', checked: true },
              { label: 'Alterações em integrações', checked: true },
              { label: 'Automações que falharam', checked: true },
              { label: 'Comentários em conversas do Inbox', checked: true },
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
            <AlertTriangle className="w-5 h-5 text-critical" />
            <h2 className="text-16 font-medium text-eggshell">Alertas Críticos</h2>
          </div>

          <p className="text-13 text-stone">
            Alertas críticos (downtime, violações de segurança, falhas de integração) são sempre enviados por email e in-app, independente das suas configurações.
          </p>

          <div className="space-y-3">
            {[
              { label: 'Enviar também via SMS', checked: false },
              { label: 'Enviar também via Telegram', checked: true },
            ].map((pref, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer py-2 hover:bg-zinc rounded px-2 transition-colors">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-line bg-iron" />
                <span className="text-14 text-eggshell flex-1">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-warning" />
            <h2 className="text-16 font-medium text-eggshell">Horário de Notificações</h2>
          </div>

          <p className="text-13 text-stone">
            Defina um horário em que você <strong className="text-eggshell">não</strong> deseja receber notificações não-críticas.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-14 text-stone">Modo silencioso:</span>
            <input type="time" defaultValue="22:00" className="bg-zinc border border-line rounded px-3 py-1.5 text-eggshell text-13" />
            <span className="text-14 text-stone">até</span>
            <input type="time" defaultValue="08:00" className="bg-zinc border border-line rounded px-3 py-1.5 text-eggshell text-13" />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Salvar Preferências
          </button>
        </div>
      </div>
    </AppShell>
  );
}