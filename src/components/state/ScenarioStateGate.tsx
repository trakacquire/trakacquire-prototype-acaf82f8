import React from 'react';
import { useDemoScenario } from '@/components/domain/ScenarioSelector';
import {
  LoadingSkeleton,
  EmptyState,
  PartialDataBanner,
  PermissionDenied,
  PolicyBlocked,
  IntegrationDegraded,
  ErrorState,
  SuccessState,
} from './FeedbackStates';

/**
 * ScenarioStateGate — expõe os 8 estados de UX ligados ao ScenarioSelector.
 *
 * Mapeamento cenário → estado exibido:
 *   normal        → children (Success implícito)
 *   degraded      → IntegrationDegraded (fonte da verdade lenta)
 *   dlq_full      → PartialDataBanner + children (dados parciais)
 *   divergencias  → PartialDataBanner + children (provisórios)
 *   sem_dados     → EmptyState
 *   erro_sistema  → ErrorState (com correlation_id)
 *
 * PermissionDenied / PolicyBlocked / Success com AuditRef são renderizados
 * inline pelas próprias páginas quando fizerem sentido no fluxo.
 */
export function ScenarioStateGate({
  children,
  emptyTitle = 'Sem sinais no período',
  emptyDescription = 'Nenhum evento chegou dentro do recorte atual.',
  emptyPrerequisite = 'Verifique se ao menos uma origem (Meta, TAP, Telegram) está em produção.',
  degradedIntegration = 'Signal Ingest',
  degradedSince = '2026-07-23 09:12',
  errorMessage = 'Falha ao consultar a fonte da verdade. O time foi notificado.',
  correlationId = 'evt_9f2a-4b1c-8d33',
  monitoringHref = '/monitoring',
  partialSource = 'TAP Postback',
  partialAge = 'há 4m',
}: {
  children: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyPrerequisite?: string;
  degradedIntegration?: string;
  degradedSince?: string;
  errorMessage?: string;
  correlationId?: string;
  monitoringHref?: string;
  partialSource?: string;
  partialAge?: string;
}) {
  const scenario = useDemoScenario();

  if (scenario === 'sem_dados') {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        prerequisite={emptyPrerequisite}
        actionLabel="Abrir integrações"
        onAction={() => (window.location.href = '/integrations')}
      />
    );
  }

  if (scenario === 'erro_sistema') {
    return (
      <ErrorState
        message={errorMessage}
        correlationId={correlationId}
        monitoringHref={monitoringHref}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (scenario === 'degraded') {
    return (
      <IntegrationDegraded
        integration={degradedIntegration}
        since={degradedSince}
        detail="Latência P95 acima de 800ms. Reconciliação temporariamente provisória."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (scenario === 'dlq_full' || scenario === 'divergencias') {
    return (
      <div className="space-y-4">
        <PartialDataBanner
          message={
            scenario === 'dlq_full'
              ? 'Fila morta acima do limite — parte dos eventos ainda não foi reprocessada.'
              : 'Divergências entre postback e CAPI — valores exibidos são provisórios.'
          }
          source={partialSource}
          ageLabel={partialAge}
        />
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * StateShowcase — chip helper que sinaliza qual estado o cenário atual está
 * exibindo. Útil para os inspetores das páginas P2+ demonstrarem os 8 estados.
 */
export function StateShowcase({ className = '' }: { className?: string }) {
  const scenario = useDemoScenario();
  const label: Record<string, string> = {
    normal: 'Estado: Success (fluxo feliz)',
    degraded: 'Estado: Integration degraded',
    dlq_full: 'Estado: Partial data (DLQ cheio)',
    divergencias: 'Estado: Partial data (divergências)',
    sem_dados: 'Estado: Empty',
    erro_sistema: 'Estado: Error',
  };
  const tone: Record<string, string> = {
    normal: 'text-verified border-verified/30 bg-verified/5',
    degraded: 'text-warning border-warning/30 bg-warning/5',
    dlq_full: 'text-warning border-warning/30 bg-warning/5',
    divergencias: 'text-warning border-warning/30 bg-warning/5',
    sem_dados: 'text-stone border-line bg-zinc/40',
    erro_sistema: 'text-critical border-critical/30 bg-critical/5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-11 tabular-nums ${
        tone[scenario] ?? tone.normal
      } ${className}`}
      title="Alterne o cenário no chip 🎬 Demo (canto inferior direito) para percorrer os 8 estados de UX."
    >
      {label[scenario] ?? label.normal}
    </span>
  );
}

/**
 * useIsScenarioBlocking — atalho para páginas que precisam trocar o layout
 * inteiro (não só uma seção) quando o cenário é bloqueante.
 */
export function useIsScenarioBlocking(): boolean {
  const s = useDemoScenario();
  return s === 'sem_dados' || s === 'erro_sistema' || s === 'degraded';
}
