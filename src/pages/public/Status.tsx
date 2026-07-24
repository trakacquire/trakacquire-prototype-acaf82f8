import React from 'react';
import { Link } from 'wouter';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { PreviewBadge } from '@/components/data/PreviewBadge';


export default function StatusPage() {
  const services = [
    { name: 'API Core', status: 'operational', icon: <CheckCircle2 className="w-5 h-5 text-verified" /> },
    { name: 'Signal Ingest', status: 'operational', icon: <CheckCircle2 className="w-5 h-5 text-verified" /> },
    { name: 'Meta CAPI', status: 'degraded', icon: <AlertTriangle className="w-5 h-5 text-warning" /> },
    { name: 'Telegram Gateway', status: 'operational', icon: <CheckCircle2 className="w-5 h-5 text-verified" /> },
    { name: 'TAP Webhook', status: 'operational', icon: <CheckCircle2 className="w-5 h-5 text-verified" /> },
    { name: 'Dashboard', status: 'operational', icon: <CheckCircle2 className="w-5 h-5 text-verified" /> },
  ];

  return (
    <div className="min-h-screen bg-ink pt-16 pb-24 px-4 font-sans text-eggshell">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="kicker mb-1">Público · Status</div>
            <Link href="/" className="flex items-center gap-2 text-24 font-bold">
              <span className="w-6 h-6 rounded bg-proof-blue shrink-0"></span>
              TrakAcquire System Status
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <PreviewBadge />
            <button className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md font-medium text-14 hover:bg-line transition-colors">
              Assinar Atualizações
            </button>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-8 text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-24 font-bold text-eggshell mb-2">Sistemas Operando com Lentidão</h2>
          <p className="text-16 text-stone max-w-xl mx-auto">
            Identificamos uma degradação de performance no Meta CAPI devido a rate limits da API Graph. O delivery ledger está empilhando retentativas seguras. Nenhum evento será perdido.
          </p>
        </div>

        <div>
          <h3 className="text-18 font-bold text-eggshell mb-6">Status por Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(s => (
              <div key={s.name} className="bg-iron border border-line rounded-lg p-5 flex items-center justify-between">
                <span className="text-16 font-medium text-eggshell">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-14 font-medium ${s.status === 'operational' ? 'text-verified' : 'text-warning'}`}>
                    {s.status === 'operational' ? 'Operacional' : 'Degradado'}
                  </span>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-18 font-bold text-eggshell mb-4">Últimos Incidentes (30 dias)</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-warning pl-4 py-1">
              <div className="text-16 font-semibold text-warning mb-1">Meta CAPI Rate Limits</div>
              <div className="text-12 text-stone font-mono mb-2">Jul 24, 2025 - Ativo</div>
              <p className="text-14 text-eggshell">Investigando a latência de respostas do endpoint do Facebook Graph API. Eventos estão na fila de retry segura.</p>
            </div>
            <div className="border-l-2 border-verified pl-4 py-1">
              <div className="text-16 font-semibold text-eggshell mb-1">Manutenção de Banco de Dados</div>
              <div className="text-12 text-stone font-mono mb-2">Jul 15, 2025 - Resolvido</div>
              <p className="text-14 text-stone">Manutenção planejada executada com sucesso. Sem impacto na ingestão de eventos.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}