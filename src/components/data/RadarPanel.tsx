import React from 'react';
import { AlertTriangle, TrendingDown, ShieldOff, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { bottlenecks, KPI_TARGETS } from '@/lib/fake/funnelSteps';
import { db } from '@/lib/fake/db';

/**
 * RadarPanel (DECISIONS D8) — 2–3 anomalias derivadas de regras simples
 * sobre o dataset canônico. Cada anomalia mostra POR QUÊ, IMPACTO e AÇÃO.
 */
export function RadarPanel({ period }: { period: number }) {
  const m = db.metricsForPeriod(period);
  const { worst } = bottlenecks(period);

  type Anomaly = {
    key: string;
    icon: React.ReactNode;
    tone: 'warning' | 'critical' | 'proof';
    title: string;
    why: string;
    impact: string;
    action: { label: string; href: string };
  };

  const items: Anomaly[] = [];

  if (worst && worst.lostPct >= 40) {
    items.push({
      key: 'bottleneck',
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      tone: 'critical',
      title: `Gargalo severo em ${worst.from} → ${worst.to}`,
      why: `Perda de ${worst.lostPct.toFixed(1)}% (${worst.lost.toLocaleString('pt-BR')} pessoas) — acima do histórico da operação.`,
      impact: 'Cada 10 pp recuperados aqui devolvem ~ 500 pessoas ao topo do bot.',
      action: { label: 'Diagnosticar em Tracking', href: '/tracking' },
    });
  }

  if (m.cpftd > KPI_TARGETS.cost_ftd) {
    const over = ((m.cpftd - KPI_TARGETS.cost_ftd) / KPI_TARGETS.cost_ftd) * 100;
    items.push({
      key: 'cpftd',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      tone: 'warning',
      title: `Custo/FTD acima da meta`,
      why: `R$ ${m.cpftd.toLocaleString('pt-BR')} vs. meta R$ ${KPI_TARGETS.cost_ftd} (${over.toFixed(0)}% acima).`,
      impact: 'Margem operacional cai ~ R$ 3,4 mil no recorte se persistir 7 dias.',
      action: { label: 'Rever criativos', href: '/media/creatives' },
    });
  }

  // Sempre inclui o alerta de integração degradada como demonstração da regra.
  items.push({
    key: 'integration',
    icon: <ShieldOff className="w-3.5 h-3.5" />,
    tone: 'warning',
    title: 'Meta CAPI em modo degradado',
    why: 'Match Quality caiu para 6.4 (7 dias) — abaixo do piso de 7.0.',
    impact: 'Atribuição de ~ 8% dos FTDs pode estar sub-reportada ao Ads Manager.',
    action: { label: 'Abrir Integration360 · Meta', href: '/integrations/meta' },
  });

  const trimmed = items.slice(0, 3);
  if (trimmed.length === 0) return null;

  const toneClasses: Record<Anomaly['tone'], string> = {
    critical: 'border-critical/30 bg-critical/10 text-critical',
    warning:  'border-warning/30 bg-warning/10 text-warning',
    proof:    'border-proof-blue/30 bg-proof-blue/10 text-proof-blue',
  };

  return (
    <section className="rounded-xl border border-line bg-graphite p-5">
      <header className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-eggshell text-16 font-medium">Radar</h3>
          <p className="text-stone text-12 mt-0.5">
            {trimmed.length} anomalia{trimmed.length === 1 ? '' : 's'} detectada{trimmed.length === 1 ? '' : 's'} pelas regras da operação.
          </p>
        </div>
        <span className="text-11 font-mono uppercase tracking-wider text-stone">DECISIONS · D8</span>
      </header>

      <ul className="space-y-2">
        {trimmed.map((a) => (
          <li key={a.key} className="rounded-lg border border-line bg-iron/60 p-3">
            <div className="flex items-start gap-3">
              <span className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md border ${toneClasses[a.tone]}`}>
                {a.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-13 text-eggshell font-medium">{a.title}</div>
                <div className="text-12 text-stone mt-1">{a.why}</div>
                <div className="text-12 text-stone/80 mt-0.5">{a.impact}</div>
                <Link
                  href={a.action.href}
                  className="mt-2 inline-flex items-center gap-1 text-12 text-proof-blue hover:underline font-mono"
                >
                  {a.action.label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
