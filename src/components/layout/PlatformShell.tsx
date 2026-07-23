import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Server, Building2, Wallet, Users, LayoutList, Puzzle, ShieldAlert, BadgeInfo, BellRing, Settings, ShieldCheck, Activity, Search
} from 'lucide-react';
import { Topbar } from './Topbar';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== '/platform' && location.startsWith(href));

  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-14 font-medium transition-colors group",
      isActive 
        ? "bg-zinc text-eggshell" 
        : "text-stone hover:bg-zinc hover:text-eggshell"
    )}>
      <span className={cn("transition-colors", isActive ? "text-proof-blue" : "text-stone group-hover:text-eggshell")}>
        {icon}
      </span>
      {label}
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

export function PlatformSidebar() {
  return (
    <aside className="w-60 bg-[#0E0E10] border-r border-line h-[100dvh] flex flex-col flex-shrink-0 hidden md:flex">
      <div className="p-4 border-b border-line flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-proof-blue text-ink flex items-center justify-center font-bold text-12">
          P
        </div>
        <span className="text-14 font-semibold text-eggshell tracking-wide uppercase">Platform Admin</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent pb-20">
        <SidebarGroup title="Overview">
          <SidebarItem href="/platform" icon={<LayoutDashboard className="w-4 h-4" />} label="Command" />
        </SidebarGroup>

        <SidebarGroup title="Tenants">
          <SidebarItem href="/platform/tenants" icon={<Building2 className="w-4 h-4" />} label="Tenants" />
        </SidebarGroup>

        <SidebarGroup title="Faturamento & Planos">
          <SidebarItem href="/platform/plans" icon={<LayoutList className="w-4 h-4" />} label="Planos" />
          <SidebarItem href="/platform/entitlements" icon={<ShieldCheck className="w-4 h-4" />} label="Direitos" />
          <SidebarItem href="/platform/usage" icon={<Activity className="w-4 h-4" />} label="Uso / Medição" />
          <SidebarItem href="/platform/invoices" icon={<Wallet className="w-4 h-4" />} label="Faturas" />
        </SidebarGroup>

        <SidebarGroup title="IA & APIs">
          <SidebarItem href="/platform/ai/providers" icon={<Server className="w-4 h-4" />} label="Provedores IA" />
          <SidebarItem href="/platform/ai/routing" icon={<Puzzle className="w-4 h-4" />} label="Roteamento" />
          <SidebarItem href="/platform/ai/prompts" icon={<MessageSquareIcon className="w-4 h-4" />} label="Prompts" />
          <SidebarItem href="/platform/ai/cost" icon={<DollarSignIcon className="w-4 h-4" />} label="Custo de IA" />
          <SidebarItem href="/platform/ai/guardrails" icon={<ShieldAlert className="w-4 h-4" />} label="Guardrails" />
          <SidebarItem href="/platform/apis" icon={<Puzzle className="w-4 h-4" />} label="Registro de APIs" />
        </SidebarGroup>

        <SidebarGroup title="Confiabilidade">
          <SidebarItem href="/platform/reliability" icon={<Activity className="w-4 h-4" />} label="Reliability" />
          <SidebarItem href="/platform/incidents" icon={<ShieldAlert className="w-4 h-4" />} label="Incidents" />
          <SidebarItem href="/platform/status" icon={<BadgeInfo className="w-4 h-4" />} label="Status Page" />
          <SidebarItem href="/platform/releases" icon={<Server className="w-4 h-4" />} label="Releases" />
        </SidebarGroup>

        <SidebarGroup title="Suporte">
          <SidebarItem href="/platform/support" icon={<Search className="w-4 h-4" />} label="Support Console" />
          <SidebarItem href="/platform/announcements" icon={<BellRing className="w-4 h-4" />} label="Announcements" />
        </SidebarGroup>

        <SidebarGroup title="Compliance">
          <SidebarItem href="/platform/compliance" icon={<ShieldCheck className="w-4 h-4" />} label="Compliance" />
        </SidebarGroup>

        <SidebarGroup title="Interno">
          <SidebarItem href="/platform/staff" icon={<Users className="w-4 h-4" />} label="Staff" />
          <SidebarItem href="/platform/settings" icon={<Settings className="w-4 h-4" />} label="Platform Settings" />
        </SidebarGroup>
      </div>
    </aside>
  );
}

// Temporary icon fallbacks
function MessageSquareIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function DollarSignIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }

export function PlatformShell({ children, breadcrumb = [] }: { children: React.ReactNode, breadcrumb?: Array<{ label: string; href?: string }> }) {
  const breadcrumbNode = (
    <div className="flex items-center text-sm">
      <span className="text-stone">Platform</span>
      {breadcrumb.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="text-line mx-1">/</span>
          {item.href ? (
            <Link href={item.href} className="text-stone hover:text-eggshell transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-eggshell font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="flex h-[100dvh] w-full bg-ink overflow-hidden text-eggshell font-sans">
      <PlatformSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar breadcrumb={breadcrumbNode} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}