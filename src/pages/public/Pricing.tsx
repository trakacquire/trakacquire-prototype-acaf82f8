import React from 'react';
import { Link } from 'wouter';
import { Check } from 'lucide-react';
import { PreviewBadge } from '@/components/data/PreviewBadge';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ink pt-20 pb-24 px-4 font-sans text-eggshell">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-24 font-bold mb-8">
            <span className="w-6 h-6 rounded bg-proof-blue shrink-0"></span>
            TrakAcquire
          </Link>
          <div className="kicker mb-3">Investimento · Densidade da operação</div>
          <h1 className="text-32 md:text-4xl font-bold mb-4">Planos que escalam com sua prova.</h1>
          <p className="text-16 text-stone max-w-2xl mx-auto">Sem taxas escondidas. Pague pela densidade da sua operação.</p>
          <div className="mt-4 flex justify-center"><PreviewBadge /></div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-graphite border border-line rounded-2xl p-8 flex flex-col">
            <h3 className="text-18 font-medium text-stone mb-2">Starter</h3>
            <div className="text-32 font-bold font-mono mb-6">R$ 297<span className="text-14 font-sans text-stone font-normal">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Até 50k eventos</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> 1 Workspace</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> 2 Assentos</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Integrações base</li>
            </ul>
            <Link href="/signup" className="block text-center w-full bg-zinc text-eggshell border border-line py-2.5 rounded-md font-medium text-14 hover:bg-line transition-colors">
              Assinar Starter
            </Link>
          </div>

          {/* Growth */}
          <div className="bg-iron border border-proof-blue rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-proof-blue text-ink px-3 py-1 rounded-full text-11 font-bold tracking-wide uppercase">
              Mais popular
            </div>
            <h3 className="text-18 font-medium text-proof-blue mb-2">Growth</h3>
            <div className="text-32 font-bold font-mono mb-6 text-eggshell">R$ 797<span className="text-14 font-sans text-stone font-normal">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-14 text-eggshell"><Check className="w-5 h-5 text-verified shrink-0" /> Até 500k eventos</li>
              <li className="flex gap-2 text-14 text-eggshell"><Check className="w-5 h-5 text-verified shrink-0" /> 5 Workspaces</li>
              <li className="flex gap-2 text-14 text-eggshell"><Check className="w-5 h-5 text-verified shrink-0" /> 10 Assentos</li>
              <li className="flex gap-2 text-14 text-eggshell"><Check className="w-5 h-5 text-verified shrink-0" /> WhatsApp + Telegram</li>
              <li className="flex gap-2 text-14 text-eggshell"><Check className="w-5 h-5 text-verified shrink-0" /> Meta CAPI Avançado</li>
            </ul>
            <Link href="/signup" className="block text-center w-full bg-eggshell text-ink py-2.5 rounded-md font-medium text-14 hover:bg-white transition-colors">
              Assinar Growth
            </Link>
          </div>

          {/* Scale */}
          <div className="bg-graphite border border-line rounded-2xl p-8 flex flex-col">
            <h3 className="text-18 font-medium text-stone mb-2">Scale</h3>
            <div className="text-32 font-bold font-mono mb-6">R$ 1.997<span className="text-14 font-sans text-stone font-normal">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Eventos Ilimitados</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Workspaces Ilimitados</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Assentos Ilimitados</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> SLA 99.9%</li>
              <li className="flex gap-2 text-14 text-stone"><Check className="w-5 h-5 text-verified shrink-0" /> Suporte Dedicado</li>
            </ul>
            <Link href="/signup" className="block text-center w-full bg-zinc text-eggshell border border-line py-2.5 rounded-md font-medium text-14 hover:bg-line transition-colors">
              Assinar Scale
            </Link>
          </div>
        </div>

        {/* Feature comparison table stub */}
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="py-4 font-medium text-stone">Features</th>
                <th className="py-4 font-medium text-stone text-center">Starter</th>
                <th className="py-4 font-medium text-stone text-center">Growth</th>
                <th className="py-4 font-medium text-stone text-center">Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-14 text-eggshell">
              <tr>
                <td className="py-4">Signal Ledger</td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4">Automations / Flows</td>
                <td className="py-4 text-center text-stone">-</td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-4">Custom Reporting API</td>
                <td className="py-4 text-center text-stone">-</td>
                <td className="py-4 text-center text-stone">-</td>
                <td className="py-4 text-center"><Check className="w-4 h-4 text-verified mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}