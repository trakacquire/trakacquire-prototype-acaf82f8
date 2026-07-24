import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3,
  Puzzle, Link2, Globe,
  Activity, ShieldAlert, Users, Network,
  Zap, Megaphone,
  DollarSign, FileText, ShieldCheck,
  Settings, UserCircle2, Construction,
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { Brand } from '@/components/brand/Brand';

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
        'relative flex items-center gap-2.5 h-[38px] pl-3 pr-2 rounded-[9px] text-13 font-medium transition-colors group',
        active
          ? 'text-eggshell bg-[linear-gradient(180deg,hsl(var(--eggshell)/0.09),hsl(var(--eggshell)/0.045))] ring-1 ring-inset ring-[hsl(var(--eggshell)/0.08)]'
          : 'text-stone hover:text-eggshell hover:bg-[hsl(var(--eggshell)/0.025)]',
      )}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full bg-proof-blue" />
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

export function Sidebar() {
  return (
    <aside className="w-60 surface-sidebar h-[100dvh] flex-col flex-shrink-0 hidden md:flex relative">
      {/* Wordmark — glifo Proofline oficial (Fase F.2) */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <Brand size="sm" />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone">v1</span>
      </div>

      <div className="px-3 pb-3 border-b border-line">
        <WorkspaceSwitcher />
      </div>

      {/*
        Sidebar curada — 14 itens visíveis (Fase E · 2026-07-24).
        Overview 2 · Connect 3 · Observe 4 · Operate 2 · Prove 3.
        Removidos: Eventos ao vivo (fundido no Ledger via ?live=1),
        Signals (fundido em Integration360 / Meta), Broadcasts, Caixa de
        Entrada, Aprovações (movidos para /roadmap ou acessados por Governança).
        Glifo único por item — sem duplicatas.
      */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
        <SidebarGroup title="Overview">
          <SidebarItem href="/command"  icon={<LayoutDashboard className="w-4 h-4" />} label="Command" />
          <SidebarItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />}     label="Analytics" />
        </SidebarGroup>

        <SidebarGroup title="Connect">
          <SidebarItem href="/integrations" icon={<Puzzle className="w-4 h-4" />} label="Integrações" />
          <SidebarItem href="/tracking"     icon={<Link2 className="w-4 h-4" />}  label="Tracking / Links" />
          <SidebarItem href="/domains"      icon={<Globe className="w-4 h-4" />}  label="Domínios" />
        </SidebarGroup>

        <SidebarGroup title="Observe">
          <SidebarItem href="/ledger"     icon={<Activity className="w-4 h-4" />}    label="Signal Ledger" />
          <SidebarItem href="/monitoring" icon={<ShieldAlert className="w-4 h-4" />} label="Monitoramento" />
          <SidebarItem href="/players"    icon={<Users className="w-4 h-4" />}       label="Players" />
          <SidebarItem href="/identity"   icon={<Network className="w-4 h-4" />}     label="Identity Graph" />
        </SidebarGroup>

        <SidebarGroup title="Operate">
          <SidebarItem href="/automations" icon={<Zap className="w-4 h-4" />}       label="Automações" />
          <SidebarItem href="/media"       icon={<Megaphone className="w-4 h-4" />} label="Mídia" />
        </SidebarGroup>

        <SidebarGroup title="Prove">
          <SidebarItem href="/revenue"    icon={<DollarSign className="w-4 h-4" />}  label="Receita" />
          <SidebarItem href="/reports"    icon={<FileText className="w-4 h-4" />}    label="Relatórios" />
          <SidebarItem href="/governance" icon={<ShieldCheck className="w-4 h-4" />} label="Governança" />
        </SidebarGroup>
      </nav>

      {/* Footer — Settings, Profile e Roadmap */}
      <div className="border-t border-line px-2 py-3 space-y-px">
        <SidebarItem href="/settings/general" icon={<Settings className="w-4 h-4" />} label="Configurações" />
        <SidebarItem href="/profile"          icon={<UserCircle2 className="w-4 h-4" />} label="Perfil" />
        <SidebarItem href="/roadmap"          icon={<Construction className="w-4 h-4" />} label="Em construção" />
      </div>
    </aside>
  );
}
