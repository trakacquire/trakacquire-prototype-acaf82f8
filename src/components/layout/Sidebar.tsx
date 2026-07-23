import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3, FileText, CheckSquare,
  Puzzle, Globe, Link2,
  Activity, Users, UserSquare, ShieldAlert, MonitorPlay, Radio,
  Zap, Filter, Send, MessageSquare, Megaphone,
  DollarSign, Scale, GitBranch, ShieldCheck,
  Settings, UserCircle2,
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';


interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}

function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
  const [location] = useLocation();
  const active =
    location === href ||
    (href !== '/' && location === href) ||
    (href.split('/').length > 2 && location.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-md text-13 font-medium transition-colors group',
        active
          ? 'bg-zinc/60 text-eggshell'
          : 'text-stone hover:bg-zinc/40 hover:text-eggshell',
      )}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full bg-proof-blue" />
      )}
      <span
        className={cn(
          'transition-colors',
          active ? 'text-proof-blue' : 'text-stone group-hover:text-eggshell',
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {badge && <span className="ml-auto shrink-0">{badge}</span>}
    </Link>
  );
}

function SidebarGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="px-3 mb-1.5 text-[10px] font-mono font-semibold tracking-[0.18em] text-stone/70 uppercase">
        {title}
      </h3>
      <div className="space-y-px">{children}</div>
    </div>
  );
}

const LiveDot = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse inline-block" />
);

export function Sidebar() {
  return (
    <aside className="w-60 bg-iron border-r border-line h-[100dvh] flex-col flex-shrink-0 hidden md:flex">
      {/* Wordmark */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-proof-blue" />
          <span className="text-13 font-serif text-eggshell tracking-tight">Proofline</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone ml-auto">
            v1
          </span>
        </div>
      </div>

      <div className="px-3 pb-3 border-b border-line">
        <WorkspaceSwitcher />
      </div>



      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
        <SidebarGroup title="Overview">
          <SidebarItem href="/command" icon={<LayoutDashboard className="w-4 h-4" />} label="Command" />
          <SidebarItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <SidebarItem href="/reports" icon={<FileText className="w-4 h-4" />} label="Relatórios" />
          <SidebarItem href="/approvals" icon={<CheckSquare className="w-4 h-4" />} label="Aprovações" />
        </SidebarGroup>

        <SidebarGroup title="Connect">
          <SidebarItem href="/integrations" icon={<Puzzle className="w-4 h-4" />} label="Integrações" />
          <SidebarItem href="/domains" icon={<Globe className="w-4 h-4" />} label="Domínios" />
          <SidebarItem href="/tracking" icon={<Link2 className="w-4 h-4" />} label="Tracking / Links" />
        </SidebarGroup>

        <SidebarGroup title="Observe">
          <SidebarItem href="/live" icon={<Radio className="w-4 h-4" />} label="Eventos ao vivo" badge={<LiveDot />} />
          <SidebarItem href="/ledger" icon={<Activity className="w-4 h-4" />} label="Signal Ledger" />
          <SidebarItem href="/identity" icon={<Users className="w-4 h-4" />} label="Grafo de identidade" />
          <SidebarItem href="/players" icon={<UserSquare className="w-4 h-4" />} label="Jogadores" />
          <SidebarItem href="/signals" icon={<ShieldAlert className="w-4 h-4" />} label="Saúde CAPI" />
          <SidebarItem href="/monitoring" icon={<MonitorPlay className="w-4 h-4" />} label="Monitoramento" />
        </SidebarGroup>

        <SidebarGroup title="Operate">
          <SidebarItem href="/automations" icon={<Zap className="w-4 h-4" />} label="Automações" />
          <SidebarItem href="/segments" icon={<Filter className="w-4 h-4" />} label="Segmentos" />
          <SidebarItem href="/broadcasts" icon={<Send className="w-4 h-4" />} label="Broadcasts" />
          <SidebarItem href="/inbox" icon={<MessageSquare className="w-4 h-4" />} label="Caixa de entrada" />
          <SidebarItem href="/media" icon={<Megaphone className="w-4 h-4" />} label="Mídia" />
        </SidebarGroup>

        <SidebarGroup title="Prove">
          <SidebarItem href="/revenue" icon={<DollarSign className="w-4 h-4" />} label="Receita" />
          <SidebarItem href="/revenue/reconciliation" icon={<Scale className="w-4 h-4" />} label="Reconciliação" />
          <SidebarItem href="/revenue/cohorts" icon={<GitBranch className="w-4 h-4" />} label="Coortes" />
          <SidebarItem href="/governance" icon={<ShieldCheck className="w-4 h-4" />} label="Governança" />
        </SidebarGroup>
      </nav>

      {/* Footer — Settings & Profile */}
      <div className="border-t border-line px-2 py-3 space-y-px">
        <SidebarItem href="/settings/general" icon={<Settings className="w-4 h-4" />} label="Configurações" />
        <SidebarItem href="/profile" icon={<UserCircle2 className="w-4 h-4" />} label="Perfil" />
      </div>
    </aside>
  );
}
