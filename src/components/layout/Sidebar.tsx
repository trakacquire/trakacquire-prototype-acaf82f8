import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3,
  Puzzle, Globe, Link2,
  Radio, Activity, UserSquare, ShieldAlert,
  Zap, Megaphone, Send, Inbox as InboxIcon, GitPullRequestArrow,
  DollarSign, ShieldCheck, FileText,
  Settings, UserCircle2, Construction,
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
        'relative flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-md text-13 font-medium transition-colors group',
        active ? 'text-eggshell' : 'text-stone hover:text-eggshell',
      )}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full bg-proof-blue" />
      )}
      <span
        className={cn(
          'icon-tile',
          active && 'icon-tile-active',
          !active && 'group-hover:text-eggshell',
        )}
        aria-hidden
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
    <aside className="w-60 surface-glass border-r border-line/70 h-[100dvh] flex-col flex-shrink-0 hidden md:flex relative">
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

      {/*
        Sidebar curada (14 itens visíveis). Regra: página só volta à sidebar
        quando a linha dela na matriz CONFORMANCE.md está verde. Tudo o mais
        continua roteável via links contextuais, ⌘K e /roadmap.
      */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
        <SidebarGroup title="Overview">
          <SidebarItem href="/command" icon={<LayoutDashboard className="w-4 h-4" />} label="Command" />
          <SidebarItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
        </SidebarGroup>

        <SidebarGroup title="Connect">
          <SidebarItem href="/integrations" icon={<Puzzle className="w-4 h-4" />} label="Integrações" />
          <SidebarItem href="/tracking" icon={<Link2 className="w-4 h-4" />} label="Tracking / Links" />
          <SidebarItem href="/domains" icon={<Globe className="w-4 h-4" />} label="Domínios" />
        </SidebarGroup>

        <SidebarGroup title="Observe">
          <SidebarItem href="/live" icon={<Radio className="w-4 h-4" />} label="Eventos ao vivo" badge={<LiveDot />} />
          <SidebarItem href="/ledger" icon={<Activity className="w-4 h-4" />} label="Signal Ledger" />
          <SidebarItem href="/monitoring" icon={<ShieldAlert className="w-4 h-4" />} label="Monitoramento" />
          <SidebarItem href="/signals" icon={<Radio className="w-4 h-4" />} label="Signals" />
          <SidebarItem href="/players" icon={<UserSquare className="w-4 h-4" />} label="Players" />
          <SidebarItem href="/identity" icon={<UserSquare className="w-4 h-4" />} label="Identity Graph" />
        </SidebarGroup>

        <SidebarGroup title="Operate">
          <SidebarItem href="/automations" icon={<Zap className="w-4 h-4" />} label="Automações" />
          <SidebarItem href="/broadcasts" icon={<Send className="w-4 h-4" />} label="Broadcasts" />
          <SidebarItem href="/inbox" icon={<InboxIcon className="w-4 h-4" />} label="Caixa de Entrada" />
          <SidebarItem href="/approvals" icon={<GitPullRequestArrow className="w-4 h-4" />} label="Aprovações" />
          <SidebarItem href="/media" icon={<Megaphone className="w-4 h-4" />} label="Mídia" />
        </SidebarGroup>

        <SidebarGroup title="Prove">
          <SidebarItem href="/revenue" icon={<DollarSign className="w-4 h-4" />} label="Receita" />
          <SidebarItem href="/reports" icon={<FileText className="w-4 h-4" />} label="Relatórios" />
          <SidebarItem href="/governance" icon={<ShieldCheck className="w-4 h-4" />} label="Governança" />
        </SidebarGroup>
      </nav>

      {/* Footer — Settings, Profile e Roadmap */}
      <div className="border-t border-line px-2 py-3 space-y-px">
        <SidebarItem href="/settings/general" icon={<Settings className="w-4 h-4" />} label="Configurações" />
        <SidebarItem href="/profile" icon={<UserCircle2 className="w-4 h-4" />} label="Perfil" />
        <SidebarItem href="/roadmap" icon={<Construction className="w-4 h-4" />} label="Em construção" />
      </div>
    </aside>
  );
}
