import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, BarChart3, FileText, 
  Puzzle, Globe, Link2, 
  Activity, Users, UserSquare, ShieldAlert, MonitorPlay,
  Zap, Filter, Radio, MessageSquare, Megaphone,
  DollarSign, ShieldCheck, Settings, CheckSquare
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { CommandBar } from '../domain/CommandBar';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
}

function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== '/' && location.startsWith(href) && href !== '/tracking' && href !== '/media' && href !== '/integrations' && href !== '/settings');

  // Exact matching for specific parent routes to prevent highlighting multiple items
  const isSettingsActive = href === '/settings/general' && location.startsWith('/settings');
  const isTrackingActive = href === '/tracking' && location.startsWith('/tracking') && !location.startsWith('/tracking/sources');
  const isMediaActive = href === '/media' && location.startsWith('/media') && !location.startsWith('/media/creatives');
  const isIntegrationsActive = href === '/integrations' && location.startsWith('/integrations');
  const isIdentityActive = href === '/identity' && location.startsWith('/identity');
  const isLedgerActive = href === '/ledger' && location.startsWith('/ledger');
  const isPlayersActive = href === '/players' && location.startsWith('/players');

  const active = isActive || isSettingsActive || isTrackingActive || isMediaActive || isIntegrationsActive || isIdentityActive || isLedgerActive || isPlayersActive;

  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-14 font-medium transition-colors group",
      active 
        ? "bg-zinc text-eggshell" 
        : "text-stone hover:bg-zinc hover:text-eggshell"
    )}>
      <span className={cn("transition-colors", active ? "text-proof-blue" : "text-stone group-hover:text-eggshell")}>
        {icon}
      </span>
      {label}
      {badge && <span className="ml-auto">{badge}</span>}
    </Link>
  );
}

function SidebarGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-11 font-bold tracking-wider text-stone uppercase">{title}</h3>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

const LiveDot = () => (
  <span className="w-2 h-2 rounded-full bg-[var(--verified)] animate-pulse inline-block" />
);

export function Sidebar() {
  return (
    <aside className="w-60 bg-iron border-r border-line h-[100dvh] flex flex-col flex-shrink-0 hidden md:flex">
      <div className="p-4 border-b border-line">
        <WorkspaceSwitcher />
      </div>
      <div className="p-4 border-b border-line">
        <CommandBar />
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent pb-20">
        <SidebarGroup title="Visão Geral">
          <SidebarItem href="/command" icon={<LayoutDashboard className="w-4 h-4" />} label="Command" />
          <SidebarItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <SidebarItem href="/reports" icon={<FileText className="w-4 h-4" />} label="Relatórios" />
          <SidebarItem href="/approvals" icon={<CheckSquare className="w-4 h-4" />} label="Aprovações" />
        </SidebarGroup>

        <SidebarGroup title="Conectar">
          <SidebarItem href="/integrations" icon={<Puzzle className="w-4 h-4" />} label="Integrações" />
          <SidebarItem href="/domains" icon={<Globe className="w-4 h-4" />} label="Domínios" />
          <SidebarItem href="/tracking" icon={<Link2 className="w-4 h-4" />} label="Tracking / Links" />
        </SidebarGroup>

        <SidebarGroup title="Observar">
          <SidebarItem href="/ledger" icon={<Activity className="w-4 h-4" />} label="Signal Ledger" />
          <SidebarItem href="/identity" icon={<Users className="w-4 h-4" />} label="Grafo de Identidade" />
          <SidebarItem href="/players" icon={<UserSquare className="w-4 h-4" />} label="Jogadores" />
          <SidebarItem href="/signals" icon={<ShieldAlert className="w-4 h-4" />} label="Saúde CAPI" />
          <SidebarItem href="/monitoring" icon={<MonitorPlay className="w-4 h-4" />} label="Monitoramento" />
          <SidebarItem href="/live" icon={<Radio className="w-4 h-4" />} label="Ao Vivo" badge={<LiveDot />} />
        </SidebarGroup>

        <SidebarGroup title="Operar">
          <SidebarItem href="/automations" icon={<Zap className="w-4 h-4" />} label="Automações" />
          <SidebarItem href="/segments" icon={<Filter className="w-4 h-4" />} label="Segmentos" />
          <SidebarItem href="/broadcasts" icon={<Radio className="w-4 h-4" />} label="Broadcasts" />
          <SidebarItem href="/inbox" icon={<MessageSquare className="w-4 h-4" />} label="Caixa de Entrada" />
          <SidebarItem href="/media" icon={<Megaphone className="w-4 h-4" />} label="Mídia" />
        </SidebarGroup>

        <SidebarGroup title="Provar">
          <SidebarItem href="/revenue" icon={<DollarSign className="w-4 h-4" />} label="Receita" />
          <SidebarItem href="/governance" icon={<ShieldCheck className="w-4 h-4" />} label="Governança" />
          <SidebarItem href="/settings/general" icon={<Settings className="w-4 h-4" />} label="Configurações" />
        </SidebarGroup>
      </div>
    </aside>
  );
}
