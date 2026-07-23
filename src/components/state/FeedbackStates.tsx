import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  PlugZap,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditRef } from '@/components/data/AuditRef';

/* ── Shell reutilizável ──────────────────────────────────────────── */
interface ShellProps {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  tone?: 'neutral' | 'warning' | 'critical' | 'verified' | 'proof';
  className?: string;
  compact?: boolean;
}

function StateShell({ icon, title, description, children, tone = 'neutral', className, compact }: ShellProps) {
  const border =
    tone === 'critical'
      ? 'border-critical/30'
      : tone === 'warning'
        ? 'border-warning/30'
        : tone === 'verified'
          ? 'border-verified/30'
          : tone === 'proof'
            ? 'border-proof-blue/30'
            : 'border-line';

  const iconRing =
    tone === 'critical'
      ? 'bg-critical/10 text-critical'
      : tone === 'warning'
        ? 'bg-warning/10 text-warning'
        : tone === 'verified'
          ? 'bg-verified/10 text-verified'
          : tone === 'proof'
            ? 'bg-proof-blue/10 text-proof-blue'
            : 'bg-zinc text-stone';

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center rounded-xl border bg-graphite',
        compact ? 'p-6 min-h-[180px]' : 'p-8 min-h-[280px]',
        border,
        className,
      )}
    >
      <div className={cn('mb-4 flex h-10 w-10 items-center justify-center rounded-full', iconRing)}>{icon}</div>
      <h3 className="text-16 font-medium text-eggshell mb-1.5">{title}</h3>
      {description && <div className="text-13 text-stone max-w-md">{description}</div>}
      {children && <div className="mt-5 flex items-center gap-2">{children}</div>}
    </div>
  );
}

/* ── 1. Loading ──────────────────────────────────────────────────── */
export function LoadingSkeleton({ label = 'Carregando dados…', compact }: { label?: string; compact?: boolean }) {
  return (
    <StateShell
      icon={<Loader2 className="h-5 w-5 animate-spin" />}
      title={label}
      description="Consultando fonte da verdade e projeções."
      compact={compact}
    />
  );
}

/* ── 2. Empty ────────────────────────────────────────────────────── */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  prerequisite,
  compact,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Pré-requisito exigido pelo Proofline: nunca só "sem dados". */
  prerequisite?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<ShieldAlert className="h-5 w-5" />}
      title={title}
      description={
        <>
          {description}
          {prerequisite && (
            <div className="mt-2 text-12 text-stone/80">
              <span className="text-eggshell/80 font-medium">Pré-requisito: </span>
              {prerequisite}
            </div>
          )}
        </>
      }
      compact={compact}
    >
      {actionLabel && (
        <button
          onClick={onAction}
          className="rounded-md bg-eggshell px-4 py-2 text-13 font-medium text-ink hover:bg-eggshell/90 transition-colors press"
        >
          {actionLabel}
        </button>
      )}
    </StateShell>
  );
}

/* ── 3. Partial data / freshness ─────────────────────────────────── */
export function PartialDataBanner({
  message,
  source,
  ageLabel,
  className,
}: {
  message?: string;
  source?: string;
  ageLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/5 px-4 py-3',
        className,
      )}
      role="status"
    >
      <Clock className="h-4 w-4 text-warning mt-0.5 shrink-0" />
      <div className="flex-1 text-13 text-eggshell/90">
        <span className="text-warning font-medium">Dados parciais.</span>{' '}
        {message ?? 'Uma ou mais fontes estão atrasadas — o valor exibido é provisório.'}
        {(source || ageLabel) && (
          <span className="ml-2 font-mono text-11 text-stone">
            {source} {ageLabel && `· ${ageLabel}`}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── 4. Permission denied ────────────────────────────────────────── */
export function PermissionDenied({
  requiredRole,
  contactHint,
  compact,
}: {
  requiredRole: string;
  contactHint?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<ShieldX className="h-5 w-5" />}
      title="Acesso negado"
      description={
        <>
          Este conteúdo exige o papel <span className="font-mono text-eggshell">{requiredRole}</span>.
          {contactHint && <div className="mt-2 text-12 text-stone/80">{contactHint}</div>}
        </>
      }
      tone="warning"
      compact={compact}
    />
  );
}

/* ── 5. Policy blocked ───────────────────────────────────────────── */
export function PolicyBlocked({
  policy,
  resolution,
  compact,
}: {
  policy: string;
  resolution?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<Lock className="h-5 w-5" />}
      title="Bloqueado por política"
      description={
        <>
          <span className="font-mono text-eggshell">{policy}</span>
          {resolution && <div className="mt-2 text-12 text-stone/80">Como resolver: {resolution}</div>}
        </>
      }
      tone="critical"
      compact={compact}
    />
  );
}

/* ── 6. Integration degraded ─────────────────────────────────────── */
export function IntegrationDegraded({
  integration,
  since,
  detail,
  onRetry,
  compact,
}: {
  integration: string;
  since?: string;
  detail?: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<PlugZap className="h-5 w-5" />}
      title={`${integration} degradada`}
      description={
        <>
          {detail ?? 'A integração está respondendo com latência elevada ou erros intermitentes.'}
          {since && <div className="mt-2 text-12 text-stone/80 font-mono">degradada desde {since}</div>}
        </>
      }
      tone="warning"
      compact={compact}
    >
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-line bg-zinc px-4 py-2 text-13 font-medium text-eggshell hover:bg-zinc/80 transition-colors press"
        >
          Reexecutar health check
        </button>
      )}
    </StateShell>
  );
}

/* ── 7. Error ────────────────────────────────────────────────────── */
export function ErrorState({
  message,
  correlationId,
  onRetry,
  monitoringHref,
  compact,
}: {
  message: string;
  correlationId?: string;
  onRetry?: () => void;
  monitoringHref?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<AlertTriangle className="h-5 w-5" />}
      title="Algo deu errado"
      description={message}
      tone="critical"
      compact={compact}
    >
      {correlationId && (
        <span className="rounded border border-line bg-iron px-2 py-1 font-mono text-11 text-stone tabular-nums">
          corr: {correlationId}
        </span>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-line bg-zinc px-4 py-2 text-13 font-medium text-eggshell hover:bg-zinc/80 transition-colors press"
        >
          Tentar novamente
        </button>
      )}
      {monitoringHref && (
        <a
          href={monitoringHref}
          className="text-13 text-proof-blue hover:underline underline-offset-4"
        >
          Abrir monitoramento →
        </a>
      )}
    </StateShell>
  );
}

/* ── 8. Success + AuditRef ───────────────────────────────────────── */
export function SuccessState({
  title = 'Ação concluída',
  description,
  auditId,
  compact,
}: {
  title?: string;
  description?: string;
  auditId?: string;
  compact?: boolean;
}) {
  return (
    <StateShell
      icon={<CheckCircle2 className="h-5 w-5" />}
      title={title}
      description={description}
      tone="verified"
      compact={compact}
    >
      {auditId && <AuditRef id={auditId} />}
    </StateShell>
  );
}

/* ── Convenience map — para consumir num shell/loader unificado ── */
export const uxState = {
  Loading: LoadingSkeleton,
  Empty: EmptyState,
  Partial: PartialDataBanner,
  PermissionDenied,
  PolicyBlocked,
  IntegrationDegraded,
  Error: ErrorState,
  Success: SuccessState,
};
