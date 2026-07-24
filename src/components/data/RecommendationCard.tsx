import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * RecommendationCard — sugestão do copiloto (Fase F.4/F.5).
 *
 * Fica dentro do Campaign360 (e afins). Nunca decide sozinha; sempre exibe:
 *   • hipótese  (por que o sistema sugere)
 *   • impacto esperado
 *   • confiança (mono tabular)
 *   • CTA único que abre ApprovalCard.
 *
 * Superfície com brilho azul sutil no canto — sinal claro de "sugestão IA".
 */
export interface RecommendationCardProps {
  title: string;
  hypothesis: string;
  expectedImpact: string;
  confidence: number; // 0–100
  risk?: 'baixo' | 'médio' | 'alto';
  ctaLabel?: string;
  onCta?: () => void;
  onExplain?: () => void;
}

const RISK_TONE: Record<NonNullable<RecommendationCardProps['risk']>, string> = {
  baixo: 'text-verified border-verified/30 bg-verified/10',
  médio: 'text-warning  border-warning/30  bg-warning/10',
  alto:  'text-critical border-critical/30 bg-critical/10',
};

export function RecommendationCard({
  title,
  hypothesis,
  expectedImpact,
  confidence,
  risk = 'baixo',
  ctaLabel = 'Enviar para aprovação',
  onCta,
  onExplain,
}: RecommendationCardProps) {
  const confTone = confidence >= 85 ? 'text-verified' : confidence >= 65 ? 'text-proof-blue' : 'text-warning';
  return (
    <article
      className="relative overflow-hidden rounded-[12px] p-5 border"
      style={{
        borderColor: 'hsl(var(--proof-blue) / 0.28)',
        background:
          'radial-gradient(circle at 100% 0%, hsl(var(--proof-blue) / 0.10) 0%, transparent 55%), linear-gradient(180deg, hsl(240 6% 11%) 0%, hsl(240 7% 6%) 100%)',
        boxShadow: 'inset 0 1px 0 0 hsl(0 0% 100% / 0.04)',
      }}
    >
      <header className="flex items-start gap-3">
        <span
          className="grid place-items-center shrink-0"
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(180deg, hsl(230 40% 22%) 0%, hsl(240 7% 6%) 100%)',
            border: '1px solid hsl(var(--proof-blue) / 0.35)',
            boxShadow: '0 0 12px hsl(var(--proof-blue) / 0.25)',
          }}
        >
          <Sparkles className="w-4 h-4 text-proof-blue" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="kicker mb-1">Copiloto · sugestão</div>
          <h4 className="text-14 font-semibold text-eggshell">{title}</h4>
        </div>
        <span className={`text-11 font-mono px-1.5 py-0.5 rounded border ${RISK_TONE[risk]} shrink-0`}>
          risco {risk}
        </span>
      </header>

      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 sm:items-baseline">
        <div className="min-w-0">
          <dt className="text-11 font-mono uppercase tracking-wider text-stone">Hipótese</dt>
          <dd className="text-13 text-eggshell mt-1">{hypothesis}</dd>
        </div>
        <div className="text-right shrink-0">
          <dt className="text-11 font-mono uppercase tracking-wider text-stone">Confiança</dt>
          <dd className={`mono-value text-16 tabular-nums ${confTone}`}>{confidence}%</dd>
        </div>
      </dl>

      <div className="mt-3">
        <dt className="text-11 font-mono uppercase tracking-wider text-stone">Impacto esperado</dt>
        <dd className="text-13 font-mono text-eggshell tabular-nums mt-1">{expectedImpact}</dd>
      </div>

      <footer className="mt-5 flex items-center justify-between gap-3">
        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="text-12 font-mono text-proof-blue-soft hover:underline underline-offset-2"
          >
            por que essa sugestão?
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={onCta}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-12 font-medium border border-proof-blue/40 bg-proof-blue/10 text-proof-blue hover:bg-proof-blue/20 transition-colors"
        >
          {ctaLabel} <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </button>
      </footer>
    </article>
  );
}
