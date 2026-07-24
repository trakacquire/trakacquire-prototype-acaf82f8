import React from 'react';
import { bottlenecks } from '@/lib/fake/funnelSteps';

interface BottleneckPanelProps {
  period: number;
  onOpenEvidence?: (label: string, value: string, formula: string) => void;
}

const num = (n: number) => n.toLocaleString('pt-BR');

/**
 * BottleneckPanel — diagnóstico do funil.
 * Lista perda absoluta e % por etapa e destaca o PIOR GARGALO em critical.
 * É diagnóstico: aponta, não só lista.
 */
export function BottleneckPanel({ period, onOpenEvidence }: BottleneckPanelProps) {
  const { steps, worst } = bottlenecks(period);

  return (
    <div className="rounded-xl border border-line bg-graphite p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-eggshell text-16 font-medium">Gargalos por etapa</h3>
          <p className="text-stone text-12 mt-0.5">Onde a jornada perde mais gente — em % e em pessoas.</p>
        </div>
        {worst ? (
          <div className="text-right shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-critical">Pior gargalo</div>
            <div className="text-13 font-mono text-critical mt-1">
              {worst.from} → {worst.to}
            </div>
            <div className="text-11 font-mono tabular-nums text-critical/80">
              −{num(worst.lost)} pessoas · {worst.lostPct.toFixed(1)}%
            </div>
          </div>
        ) : null}
      </div>

      <ul className="divide-y divide-line/60">
        {steps.map((b) => {
          const isWorst = worst && b.from === worst.from && b.to === worst.to;
          return (
            <li key={`${b.from}-${b.to}`} className="py-2.5 flex items-center gap-3">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isWorst ? 'bg-critical' : b.lostPct >= 50 ? 'bg-warning' : 'bg-stone/60'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-13 text-eggshell truncate">
                  {b.from} <span className="text-stone">→</span> {b.to}
                </div>
                <div className="h-1 mt-1 rounded-full bg-iron overflow-hidden">
                  <div
                    className={`h-full ${isWorst ? 'bg-critical' : b.lostPct >= 50 ? 'bg-warning' : 'bg-stone/40'}`}
                    style={{ width: `${Math.min(100, b.lostPct)}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenEvidence?.(
                    `Gargalo ${b.from} → ${b.to}`,
                    `${num(b.lost)} pessoas · ${b.lostPct.toFixed(1)}%`,
                    'lost = count(prev_stage) − count(next_stage)',
                  )
                }
                className={`font-mono tabular-nums text-13 shrink-0 hover:opacity-80 ${
                  isWorst ? 'text-critical' : 'text-eggshell'
                }`}
              >
                −{num(b.lost)}{' '}
                <span className={isWorst ? 'text-critical/80' : 'text-stone'}>
                  ({b.lostPct.toFixed(1)}%)
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
