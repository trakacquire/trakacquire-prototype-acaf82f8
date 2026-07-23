import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { EvidenceDrawer } from '../data/EvidenceDrawer';
import { Link, useLocation } from 'wouter';
import { ChevronRight, LayoutDashboard, BarChart2, Users, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

const EvidenceContext = createContext<{
  openEvidence: (data: any) => void;
  closeEvidence: () => void;
}>({
  openEvidence: () => {},
  closeEvidence: () => {},
});

export const useEvidence = () => useContext(EvidenceContext);

const MOBILE_TABS = [
  { href: '/command', icon: LayoutDashboard, label: 'Command' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/players', icon: Users, label: 'Players' },
  { href: '/inbox', icon: MessageSquare, label: 'Inbox' },
  { href: '/settings/general', icon: Settings, label: 'Settings' },
];

export function AppShell({ children, breadcrumb = [] }: AppShellProps) {
  const [evidenceData, setEvidenceData] = useState<any | null>(null);
  const [location] = useLocation();

  const breadcrumbNode = (
    <div className="flex items-center text-sm">
      <span className="text-stone">TrakAcquire</span>
      {breadcrumb.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-4 h-4 text-line mx-1" />
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
    <EvidenceContext.Provider value={{
      openEvidence: setEvidenceData,
      closeEvidence: () => setEvidenceData(null)
    }}>
      <div className="flex h-[100dvh] w-full bg-ink overflow-hidden text-eggshell font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar breadcrumb={breadcrumbNode} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
            {children}
          </main>
        </div>
        
        {/* Evidence Drawer Overlay */}
        <EvidenceDrawer 
          isOpen={!!evidenceData} 
          onClose={() => setEvidenceData(null)} 
          data={evidenceData} 
        />
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden h-14 bg-iron border-t border-line fixed bottom-0 left-0 w-full z-30 flex items-center justify-around px-2">
          {MOBILE_TABS.map(({ href, icon: Icon, label }) => {
            const isActive = location === href || (href !== '/settings/general' && location.startsWith(href));
            const isSettingsActive = href === '/settings/general' && location.startsWith('/settings');
            const active = isActive || isSettingsActive;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors',
                  active ? 'text-[var(--proof-blue)]' : 'text-[var(--stone)]'
                )}
              >
                <Icon size={20} />
                <span className="text-[9px]">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </EvidenceContext.Provider>
  );
}
