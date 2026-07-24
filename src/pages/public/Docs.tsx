import React from 'react';
import { Link } from 'wouter';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <header className="h-16 border-b border-line px-6 flex items-center justify-between sticky top-0 bg-ink z-10">
        <Link href="/" className="flex items-center gap-2 text-18 font-bold text-eggshell">
          <span className="w-5 h-5 rounded bg-proof-blue shrink-0"></span>
          TrakAcquire Docs
        </Link>
        <div className="flex gap-4 text-14 text-stone">
          <Link href="/pricing" className="hover:text-eggshell transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-eggshell transition-colors">Login</Link>
        </div>
      </header>
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside className="w-64 border-r border-line h-[calc(100vh-64px)] overflow-y-auto hidden md:block py-6 pr-4 shrink-0 sticky top-16">
          <nav className="space-y-6">
            <div>
              <h4 className="text-11 font-bold uppercase tracking-wider text-stone mb-2">Getting Started</h4>
              <ul className="space-y-2 text-14 text-eggshell">
                <li><a href="#" className="text-proof-blue-soft font-medium">Início</a></li>
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">Guia TAP</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-11 font-bold uppercase tracking-wider text-stone mb-2">Integration</h4>
              <ul className="space-y-2 text-14 text-stone">
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">Meta/CAPI</a></li>
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">WhatsApp</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-11 font-bold uppercase tracking-wider text-stone mb-2">Developers</h4>
              <ul className="space-y-2 text-14 text-stone">
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-proof-blue-soft transition-colors">Webhooks</a></li>
              </ul>
            </div>
          </nav>
        </aside>
        
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="kicker mb-2">Guia · Início</div>
          <h1 className="text-32 font-bold text-eggshell mb-4">Início</h1>
          <p className="text-16 text-stone mb-8 max-w-3xl">
            Bem-vindo à documentação do TrakAcquire. Aprenda a instrumentar sua operação de iGaming para provar a origem exata de cada FTD, cruzando dados de anúncios, mensagens e provedores de receita.
          </p>

          
          <h2 className="text-24 font-bold text-eggshell mb-4 mt-12">Exemplo de Postback TAP</h2>
          <p className="text-14 text-stone mb-4 max-w-3xl">
            Envie os eventos do seu provider para a nossa API em tempo real usando o payload abaixo.
          </p>
          
          <div className="bg-graphite border border-line rounded-lg p-4 font-mono text-13 overflow-x-auto relative">
            <button className="absolute top-4 right-4 text-stone hover:text-eggshell text-12 border border-line bg-zinc px-2 py-1 rounded">Copiar</button>
            <pre className="text-proof-blue"><code className="language-json">
{`{
  "event": "first_deposit",
  "customer_id": "cust_123456",
  "click_id": "clk_8f72h9a",
  "value": 200.00,
  "currency": "BRL",
  "timestamp": "2025-07-24T14:30:00Z"
}`}
            </code></pre>
          </div>
        </main>
      </div>
    </div>
  );
}