/**
 * Proofline primitives (Fase D · calibragem de design).
 *
 * IconTile · MicroStat · CardFooter · EntityHeader · Stepper · ContextRail.
 * Zero hex literal. Zero regra semântica de cor relaxada.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────
 * IconTile — quadrado 28px, raio 8, hairline, glifo 14 monocromático.
 * ──────────────────────────────────────────────────────────────── */
export function IconTile({
  icon,
  active = false,
  tone = 'default',
  size = 28,
  className,
}: {
  icon: React.ReactNode;
  active?: boolean;
  tone?: 'default' | 'proof' | 'verified' | 'warning' | 'critical';
  size?: number;
  className?: string;
}) {
  const toneCls =
    tone === 'proof'    ? 'text-proof-blue border-proof-blue/30' :
    tone === 'verified' ? 'text-verified border-verified/25' :
    tone === 'warning'  ? 'text-warning border-warning/25' :
    tone === 'critical' ? 'text-critical border-critical/25' :
                          '';
  return (
    <span
      className={cn(
        'icon-tile shrink-0',
        active && 'icon-tile-active',
        toneCls,
        className,
      )}
      style={{ width: size, height: size, borderRadius: 8 }}
      aria-hidden
    >
      <span className="inline-flex items-center justify-center" style={{ width: 14, height: 14 }}>
        {icon}
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────
 * MicroStat — par micro-label + valor mono empilhado.
 * ──────────────────────────────────────────────────────────────── */
export function MicroStat({ label, value, tone = 'default' }: {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'proof' | 'verified' | 'warning' | 'critical';
}) {
  const cls =
    tone === 'proof'    ? 'text-proof-blue' :
    tone === 'verified' ? 'text-verified' :
    tone === 'warning'  ? 'text-warning' :
    tone === 'critical' ? 'text-critical' :
                          'text-eggshell';
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="micro-label truncate">{label}</span>
      <span className={cn('mono-value tabular-nums truncate', cls)}>{value}</span>
    </div>
  );
}

export function MicroStatRow({ items }: { items: Array<{ label: string; value: React.ReactNode; tone?: 'default' | 'proof' | 'verified' | 'warning' | 'critical' }> }) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 gap-y-3">
      {items.map((it, i) => <MicroStat key={i} {...it} />)}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * CardFooter — hairline no rodapé do card, meta à esquerda, ação à direita.
 * ──────────────────────────────────────────────────────────────── */
export function CardFooter({
  meta,
  actionLabel,
  onAction,
  href,
}: {
  meta?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}) {
  const Action = href
    ? (props: React.ComponentProps<'a'>) => <a href={href} {...props} />
    : (props: React.ComponentProps<'button'>) => <button type="button" onClick={onAction} {...props} />;
  return (
    <div className="hairline-divider mt-4 pt-3 flex items-center justify-between gap-3">
      <span className="micro-label truncate">{meta}</span>
      {actionLabel && (
        <Action className="inline-flex items-center gap-1 text-12 font-medium text-proof-blue hover:text-eggshell transition-colors">
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Action>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * EntityHeader — tile do logo + nome + tipo/ambiente + micro-stats + pill à direita.
 * ──────────────────────────────────────────────────────────────── */
export function EntityHeader({
  logo,
  name,
  category,
  environment,
  stats,
  right,
  description,
}: {
  logo: React.ReactNode;
  name: string;
  category?: string;
  environment?: string;
  stats?: Array<{ label: string; value: React.ReactNode; tone?: 'default' | 'proof' | 'verified' | 'warning' | 'critical' }>;
  right?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className="surface-flat rounded-[12px] p-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 items-start">
        <div className="grid place-items-center w-11 h-11 rounded-[10px] surface-inset text-eggshell text-16 shrink-0">
          {logo}
        </div>
        <div className="min-w-0">
          <h2 className="card-title truncate">{name}</h2>
          {(category || environment) && (
            <p className="text-12 text-stone mt-0.5">
              {category}{category && environment ? ' · ' : ''}{environment}
            </p>
          )}
          {description && <p className="card-body mt-2">{description}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {stats && stats.length > 0 && (
        <div className="hairline-divider mt-5 pt-4">
          <MicroStatRow items={stats} />
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Stepper — vertical, círculos conectados. Concluído · atual · pendente.
 * ──────────────────────────────────────────────────────────────── */
export interface Step {
  title: string;
  description?: string;
  status: 'done' | 'current' | 'pending';
  content?: React.ReactNode;
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const circleCls =
          s.status === 'done'    ? 'bg-verified/10 text-verified border-verified/40' :
          s.status === 'current' ? 'bg-proof-blue/10 text-proof-blue border-proof-blue/40' :
                                   'bg-transparent text-stone border-eggshell/10';
        return (
          <li key={i} className="relative pl-12 pb-6 last:pb-0">
            {/* connector */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 bottom-0 w-px bg-eggshell/10"
              />
            )}
            {/* circle */}
            <span
              className={cn(
                'absolute left-0 top-0 w-8 h-8 rounded-full border grid place-items-center font-mono text-12 font-semibold',
                circleCls,
              )}
            >
              {s.status === 'done' ? <Check className="w-4 h-4" /> : i + 1}
            </span>
            <div className="min-w-0">
              <div className="card-title">{s.title}</div>
              {s.description && <p className="card-body mt-1">{s.description}</p>}
              {s.content && <div className="mt-3">{s.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ────────────────────────────────────────────────────────────────
 * ContextRail — coluna lateral 1/3: título, descrição, links + health.
 * ──────────────────────────────────────────────────────────────── */
export function ContextRail({
  title,
  description,
  links,
  health,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  links?: Array<{ label: string; href?: string; onClick?: () => void; hint?: string }>;
  health?: { score: number; label?: string };
  children?: React.ReactNode;
}) {
  const healthTone =
    !health ? '' :
    health.score >= 95 ? 'bg-verified' :
    health.score >= 80 ? 'bg-proof-blue' :
    health.score >= 60 ? 'bg-warning' :
                         'bg-critical';
  return (
    <aside className="surface-flat rounded-[12px] p-6 space-y-4 h-fit sticky top-6">
      <div>
        <div className="kicker mb-2">{title}</div>
        {description && <p className="card-body">{description}</p>}
      </div>
      {links && links.length > 0 && (
        <ul className="divide-y divide-eggshell/[0.06]">
          {links.map((l, i) => (
            <li key={i}>
              {l.href ? (
                <a href={l.href} className="flex items-center justify-between gap-3 py-3 text-13 text-eggshell hover:text-proof-blue transition-colors">
                  <span className="truncate">{l.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone shrink-0" />
                </a>
              ) : (
                <button type="button" onClick={l.onClick} className="w-full flex items-center justify-between gap-3 py-3 text-13 text-eggshell hover:text-proof-blue transition-colors text-left">
                  <span className="min-w-0">
                    <span className="block truncate">{l.label}</span>
                    {l.hint && <span className="block micro-label mt-0.5 truncate">{l.hint}</span>}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone shrink-0" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {health && (
        <div className="pt-2">
          <div className="flex items-baseline justify-between">
            <span className="micro-label">{health.label ?? 'Health score'}</span>
            <span className="mono-value tabular-nums text-eggshell">{health.score.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-eggshell/[0.06] overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', healthTone)} style={{ width: `${Math.min(100, Math.max(0, health.score))}%` }} />
          </div>
        </div>
      )}
      {children}
    </aside>
  );
}

/* ────────────────────────────────────────────────────────────────
 * StatusPill — enum fechado para o catálogo de integrações.
 * ──────────────────────────────────────────────────────────────── */
export type IntegrationPillState = 'active' | 'available' | 'restricted' | 'error';

export function StatusPill({ state, label }: { state: IntegrationPillState; label?: string }) {
  const map: Record<IntegrationPillState, { cls: string; label: string; dot: string }> = {
    active:     { cls: 'text-verified border-verified/30 bg-verified/5',     label: 'Ativa',        dot: 'bg-verified' },
    available:  { cls: 'text-stone border-eggshell/10 bg-transparent',        label: 'Disponível',   dot: 'bg-stone' },
    restricted: { cls: 'text-warning border-warning/30 bg-warning/5',         label: 'Restrita',     dot: 'bg-warning' },
    error:      { cls: 'text-critical border-critical/30 bg-critical/5',      label: 'Erro',         dot: 'bg-critical' },
  };
  const m = map[state];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-11 font-mono uppercase tracking-wider', m.cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', m.dot)} />
      {label ?? m.label}
    </span>
  );
}
