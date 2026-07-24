import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { User, Mail, Shield, Bell, Key } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Perfil' }]}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="text-11 font-serif italic text-stone mb-1">Identidade · Sessão</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Meu Perfil</h1>
            <PreviewBadge />
          </div>
        </div>


        <div className="bg-graphite border border-line rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-proof-blue text-ink flex items-center justify-center font-bold text-24">
              JS
            </div>
            <div>
              <h2 className="text-18 font-bold text-eggshell">João Souza</h2>
              <p className="text-14 text-stone">joao@operacaobr.com</p>
              <p className="text-12 text-stone mt-1">Owner · Operação Brasil</p>
            </div>
          </div>

          <div className="pt-6 border-t border-line space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-stone" />
              <div className="flex-1">
                <label className="block text-12 font-medium text-stone mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  defaultValue="João Souza" 
                  className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-stone" />
              <div className="flex-1">
                <label className="block text-12 font-medium text-stone mb-1.5">Email</label>
                <input 
                  type="email" 
                  defaultValue="joao@operacaobr.com" 
                  className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-line">
            <button className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-verified" />
            <h2 className="text-16 font-medium text-eggshell">Autenticação de Dois Fatores (MFA)</h2>
          </div>
          
          <p className="text-13 text-stone">
            MFA está <span className="text-verified font-bold">ativo</span>. Seu código de backup está armazenado com segurança.
          </p>

          <button className="bg-zinc text-eggshell border border-line px-4 py-2 rounded-md font-medium text-14 hover:bg-iron">
            Reconfigurar MFA
          </button>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-warning" />
            <h2 className="text-16 font-medium text-eggshell">Alterar Senha</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Senha Atual</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Nova Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Confirmar Nova Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
            </div>
          </div>

          <button className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Alterar Senha
          </button>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-proof-blue" />
            <h2 className="text-16 font-medium text-eggshell">Preferências de Notificação</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Notificações por email', checked: true },
              { label: 'Alertas de sistema (downtime, incidentes)', checked: true },
              { label: 'Relatórios semanais', checked: true },
              { label: 'Novidades e atualizações de produto', checked: false },
            ].map((pref, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-line bg-zinc" />
                <span className="text-14 text-eggshell">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}