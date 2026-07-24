import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { EvidenceDrawer } from '../data/EvidenceDrawer';
import { Link, useLocation } from 'wouter';
import { ChevronRight, LayoutDashboard, Puzzle, Activity, Megaphone, DollarSign } from 'lucide-react';
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

// UI-SYSTEM §5 — barra inferior mobile (5 destinos por prioridade de trabalho).
// Command · Connect · Signals · Media · Revenue.
const MOBILE_TABS = [
  { href: '/command',      icon: LayoutDashboard, label: 'Command'  },
  { href: '/integrations', icon: Puzzle,          label: 'Connect'  },
  { href: '/ledger',       icon: Activity,        label: 'Signals'  },
  { href: '/media',        icon: Megaphone,       label: 'Media'    },
  { href: '/revenue',      icon: DollarSign,      label: 'Revenue'  },
];

export function AppShell({ children, breadcrumb = [] }: AppShellProps) {
  const [evidenceData, setEvidenceData] = useState<any | null>(null);
  const [location] = useLocation();
  const workspaceName = workspaces?.[0]?.name ?? 'Operação Brasil';

  // Padrão "<Workspace> / <Página>" — workspace sempre clicável (→ /command).
  const breadcrumbNode = (
    <div className="flex items-center text-13 min-w-0">
      <Link href="/command" className="text-stone hover:text-eggshell transition-colors truncate">
        {workspaceName}
      </Link>
      {breadcrumb.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="text-stone/40 mx-1.5 shrink-0">/</span>
          {item.href && idx < breadcrumb.length - 1 ? (
            <Link href={item.href} className="text-stone hover:text-eggshell transition-colors truncate">
              {item.label}
            </Link>
          ) : (
            <span className="text-eggshell font-medium truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <EvidenceContext.Provider
      value={{
        openEvidence: setEvidenceData,
        closeEvidence: () => setEvidenceData(null),
      }}
    >
      <div className="flex h-[100dvh] w-full bg-ink overflow-hidden text-eggshell font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar breadcrumb={breadcrumbNode} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
            {children}
          </main>
        </div>

        <EvidenceDrawer
          isOpen={!!evidenceData}
          onClose={() => setEvidenceData(null)}
          data={evidenceData}
        />

        {/* Mobile bottom nav — UI-SYSTEM §5 */}
        <nav className="md:hidden h-14 bg-iron border-t border-line fixed bottom-0 left-0 w-full z-30 flex items-center justify-around px-2">
          {MOBILE_TABS.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== '/command' && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors',
                  active ? 'text-proof-blue' : 'text-stone hover:text-eggshell',
                )}
              >
                <Icon size={20} />
                <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </EvidenceContext.Provider>
  );
}
