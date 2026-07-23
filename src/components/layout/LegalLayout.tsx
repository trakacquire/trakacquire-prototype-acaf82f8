import React from 'react';
import { Link, useLocation } from 'wouter';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  version: string;
  effectiveDate: string;
}

export function LegalLayout({ children, title, version, effectiveDate }: LegalLayoutProps) {
  const [location] = useLocation();

  const docs = [
    { name: 'Termos de Serviço', path: '/legal/termos', version: 'v1.3', date: '2024-01-15' },
    { name: 'Política de Privacidade', path: '/legal/privacidade', version: 'v1.2', date: '2024-03-01' },
    { name: 'DPA', path: '/legal/dpa', version: 'v1.1', date: '2024-01-15' },
    { name: 'Subprocessadores', path: '/legal/subprocessadores', version: 'v1.4', date: '2025-06-01' },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <header className="h-16 border-b border-line px-6 flex items-center justify-between sticky top-0 bg-ink z-10">
        <Link href="/" className="flex items-center gap-2 text-18 font-bold text-eggshell">
          <span className="w-5 h-5 rounded bg-proof-blue shrink-0"></span>
          TrakAcquire
        </Link>
        <div className="flex gap-4 text-14 text-stone">
          <Link href="/pricing" className="hover:text-eggshell transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-eggshell transition-colors">Login</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-13 text-stone mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-eggshell">TrakAcquire</Link>
          <span className="text-line">/</span>
          <span>Legal</span>
          <span className="text-line">/</span>
          <span className="text-eggshell">{title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-60 shrink-0">
            <div className="bg-graphite border border-line rounded-xl p-4 sticky top-24">
              <h3 className="text-14 font-bold text-eggshell mb-4">Documentos Legais</h3>
              <nav className="space-y-2">
                {docs.map((doc) => (
                  <Link
                    key={doc.path}
                    href={doc.path}
                    className={`block px-3 py-2 rounded-md text-13 transition-colors ${
                      location === doc.path
                        ? 'bg-zinc text-eggshell font-medium'
                        : 'text-stone hover:text-eggshell hover:bg-zinc'
                    }`}
                  >
                    {doc.name}
                    <div className="text-11 font-mono text-stone mt-0.5">
                      {doc.version} · {doc.date}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-graphite border border-line rounded-xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-32 font-bold text-eggshell mb-2">{title}</h1>
                  <div className="flex gap-4 text-13 text-stone">
                    <span>Versão {version}</span>
                    <span>•</span>
                    <span>Vigente desde {effectiveDate}</span>
                  </div>
                </div>
                <button className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md text-13 font-medium hover:bg-line transition-colors">
                  Baixar PDF
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}