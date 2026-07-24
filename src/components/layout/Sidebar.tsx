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
        'relative flex items-center gap-2.5 h-[40px] pl-2.5 pr-2 rounded-[9px] text-13 font-medium transition-colors group',
        active
          ? 'text-eggshell bg-[hsl(var(--eggshell)/0.07)] ring-1 ring-inset ring-[hsl(var(--eggshell)/0.10)]'
          : 'text-stone hover:text-eggshell hover:bg-[hsl(var(--eggshell)/0.03)]',
      )}
    >
      <span
        className={cn(
          'icon-tile',
          active && 'icon-tile-active',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className="truncate flex-1">{label}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </Link>
  );
}

function NavBadge({ tone = 'stone', children }: { tone?: 'live' | 'stone' | 'warning'; children: React.ReactNode }) {
  const cls =
    tone === 'live'    ? 'border-warning/30 bg-warning/8 text-warning' :
    tone === 'warning' ? 'border-warning/25 bg-warning/5 text-warning' :
                         'border-eggshell/10 bg-iron text-stone';
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-[4px] border px-1 py-[1px] font-mono uppercase text-[9px] tracking-[0.16em] tabular-nums',
      cls,
    )}>
      {tone === 'live' && <span className="w-1 h-1 rounded-full bg-warning dot-glow-warning" />}
      {children}
    </span>
  );
}

function SidebarGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="px-2.5 mb-2 text-[9px] font-mono font-semibold tracking-[0.18em] text-stone/70 uppercase">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[232px] surface-sidebar h-[100dvh] flex-col flex-shrink-0 hidden md:flex relative">
      {/* Wordmark — TRAK ACQUIRE (produto). Proofline não aparece aqui. */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <Brand size="sm" />
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-stone/70">v1</span>
      </div>

      <div className="px-3 pb-4 border-b border-line">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-5 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
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
          <SidebarItem
            href="/ledger"
            icon={<Activity className="w-4 h-4" />}
            label="Signal Ledger"
            badge={<NavBadge tone="live">Live</NavBadge>}
          />
          <SidebarItem
            href="/monitoring"
            icon={<ShieldAlert className="w-4 h-4" />}
            label="Monitoramento"
            badge={<NavBadge tone="warning">4</NavBadge>}
          />
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

      {/* Footer — Settings, Profile, Roadmap + assinatura discreta do DS */}
      <div className="border-t border-line px-2.5 py-3 space-y-0.5">
        <SidebarItem href="/settings/general" icon={<Settings className="w-4 h-4" />} label="Configurações" />
        <SidebarItem href="/profile"          icon={<UserCircle2 className="w-4 h-4" />} label="Perfil" />
        <SidebarItem href="/roadmap"          icon={<Construction className="w-4 h-4" />} label="Em construção" />
        <div className="pt-3 pb-1 px-2 text-[9px] font-mono uppercase tracking-[0.18em] text-stone/50">
          Proofline · design system
        </div>
      </div>
    </aside>
  );
}
