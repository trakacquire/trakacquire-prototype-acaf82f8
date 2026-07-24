/**
 * funnelSteps.ts — FUNIL DE AQUISIÇÃO (Clique → StartBot → EntradaCanal → Cadastro → FTD)
 *
 * RELAÇÃO COM O JOURNEY PROOF:
 *   Journey proof (Captured → Linked → Registered → Confirmed → Reconciled)
 *   é a CADEIA DE PROVA da atribuição. Este arquivo expõe o FUNIL DE AQUISIÇÃO —
 *   duas vistas da mesma verdade: ambas começam em `clicks` (78 · Capturados)
 *   e terminam em `ftds` (36 · Reconciliados) para o período canônico.
 *
 * REGRA (Fase R · correção crítica):
 *   ÂNCORAS NUNCA SÃO CLAMPADOS — só as etapas intermediárias são derivadas.
 *     - Clique   = m.clicks          (âncora imutável — Captured)
 *     - Cadastro = m.registrations   (âncora imutável — Registered)
 *     - FTD      = m.ftds            (âncora imutável — Reconciled/FTD)
 *   StartBot e EntradaCanal são interpolados no intervalo [registrations, clicks],
 *   preservando 78 ≥ StartBot ≥ EntradaCanal ≥ 75 ≥ 36.
 *
 * Custos: investimento total do período ÷ eventos da etapa.
 */

import { metricsForPeriod, spendForPeriod } from './db';

export interface FunnelStep {
  key: 'click' | 'start_bot' | 'entrada_canal' | 'cadastro' | 'ftd';
  label: string;
  count: number;
  costLabel: string;
  cost: number;
  target: number;
}

/**
 * Posição da etapa intermediária dentro do intervalo [clicks, registrations].
 * 0 = ancora em clicks · 1 = ancora em registrations.
 * Ajuste apenas para mudar a curva; jamais para forçar um número específico.
 */
const POS_START_BOT     = 0.35;
const POS_ENTRADA_CANAL = 0.70;

export const KPI_TARGETS = {
  cost_click:         0,
  cost_start_bot:     30,
  cost_entrada_canal: 60,
  cost_cadastro:      120,
  cost_ftd:           300,
} as const;

/** Interpola entre `hi` (clicks) e `lo` (registrations) na posição `pos ∈ [0,1]`. */
function between(hi: number, lo: number, pos: number): number {
  return Math.round(hi - (hi - lo) * pos);
}

export function funnelSteps(period: number): FunnelStep[] {
  const m = metricsForPeriod(period);
  const spend = spendForPeriod(period).total;

  const clicks        = m.clicks;         // âncora
  const cadastro      = m.registrations;  // âncora
  const ftd           = m.ftds;           // âncora
  const startBot      = between(clicks, cadastro, POS_START_BOT);
  const entradaCanal  = between(clicks, cadastro, POS_ENTRADA_CANAL);

  // Assert de coerência: âncoras intocados + monotonia.
  const seq = [clicks, startBot, entradaCanal, cadastro, ftd];
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] > seq[i - 1]) {
      throw new Error(`funnelSteps: monotonia quebrada em i=${i} (${seq[i]} > ${seq[i - 1]})`);
    }
  }
  if (seq[0] !== m.clicks)        throw new Error('funnelSteps: âncora Clique divergiu de metricsForPeriod.clicks');
  if (seq[3] !== m.registrations) throw new Error('funnelSteps: âncora Cadastro divergiu de metricsForPeriod.registrations');
  if (seq[4] !== m.ftds)          throw new Error('funnelSteps: âncora FTD divergiu de metricsForPeriod.ftds');

  const c = (n: number) => (n > 0 ? Math.round(spend / n) : 0);

  return [
    { key: 'click',         label: 'Clique',        count: clicks,       costLabel: 'Custo/Clique',       cost: c(clicks),       target: KPI_TARGETS.cost_click },
    { key: 'start_bot',     label: 'StartBot',      count: startBot,     costLabel: 'Custo/StartBot',     cost: c(startBot),     target: KPI_TARGETS.cost_start_bot },
    { key: 'entrada_canal', label: 'Entrada Canal', count: entradaCanal, costLabel: 'Custo/EntradaCanal', cost: c(entradaCanal), target: KPI_TARGETS.cost_entrada_canal },
    { key: 'cadastro',      label: 'Cadastro',      count: cadastro,     costLabel: 'Custo/Cadastro',     cost: c(cadastro),     target: KPI_TARGETS.cost_cadastro },
    { key: 'ftd',           label: 'FTD',           count: ftd,          costLabel: 'Custo/FTD',          cost: c(ftd),          target: KPI_TARGETS.cost_ftd },
  ];
}

export interface Bottleneck {
  from: string;
  to: string;
  lost: number;
  lostPct: number;
  retention: number;
}

export function bottlenecks(period: number): { steps: Bottleneck[]; worst: Bottleneck | null } {
  const s = funnelSteps(period);
  const steps: Bottleneck[] = [];
  for (let i = 1; i < s.length; i++) {
    const prev = s[i - 1].count;
    const curr = s[i].count;
    const lost = Math.max(0, prev - curr);
    const lostPct = prev > 0 ? (lost / prev) * 100 : 0;
    steps.push({ from: s[i - 1].label, to: s[i].label, lost, lostPct, retention: 100 - lostPct });
  }
  const worst = steps.length
    ? steps.reduce((w, x) => (x.lostPct > w.lostPct ? x : w), steps[0])
    : null;
  return { steps, worst };
}

export type Semaphore = 'verified' | 'warning' | 'critical' | 'neutral';
export function costSemaphore(value: number, target: number): Semaphore {
  if (!target) return 'neutral';
  if (value <= target * 0.8) return 'verified';
  if (value <= target) return 'warning';
  return 'critical';
}
