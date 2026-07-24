/**
 * funnelSteps.ts — etapas intermediárias derivadas (StartBot, EntradaCanal, Cadastro, FTD)
 * e custos por etapa. Deriva do dataset canônico — nunca redefine anchors.
 *
 * Monotonia: Clicks ≥ StartBot ≥ EntradaCanal ≥ Cadastro ≥ FTD.
 * Custos: investimento total do período ÷ eventos da etapa.
 */

import { metricsForPeriod, spendForPeriod } from './db';

export interface FunnelStep {
  key: 'click' | 'start_bot' | 'entrada_canal' | 'cadastro' | 'ftd';
  label: string;
  count: number;
  costLabel: string;   // rótulo do custo por etapa (ex.: "Custo/StartBot")
  cost: number;        // R$ investimento / count
  target: number;      // meta em R$
}

/** Coeficientes derivados de comportamento real (loop presell→bot→canal→casa). */
const RATE_START_BOT      = 0.65;   // 65% dos cliques entram no bot
const RATE_ENTRADA_CANAL  = 0.42;   // 42% dos cliques entram no canal
// Cadastro = registrations (já monotônico); FTD = ftds

/** Metas semânticas de custo por etapa (R$). */
export const KPI_TARGETS = {
  cost_click:         0,     // sem meta (referência)
  cost_start_bot:     30,
  cost_entrada_canal: 60,
  cost_cadastro:      120,
  cost_ftd:           300,
} as const;

export function funnelSteps(period: number): FunnelStep[] {
  const m = metricsForPeriod(period);
  const spend = spendForPeriod(period).total;

  const clicks        = m.clicks;
  const startBot      = Math.min(clicks, Math.round(clicks * RATE_START_BOT));
  const entradaCanal  = Math.min(startBot, Math.round(clicks * RATE_ENTRADA_CANAL));
  const cadastro      = Math.min(entradaCanal, m.registrations);
  const ftd           = Math.min(cadastro, m.ftds);

  const c = (n: number) => (n > 0 ? Math.round(spend / n) : 0);

  return [
    { key: 'click',         label: 'Clique',          count: clicks,       costLabel: 'Custo/Clique',       cost: c(clicks),       target: KPI_TARGETS.cost_click },
    { key: 'start_bot',     label: 'StartBot',        count: startBot,     costLabel: 'Custo/StartBot',     cost: c(startBot),     target: KPI_TARGETS.cost_start_bot },
    { key: 'entrada_canal', label: 'Entrada Canal',   count: entradaCanal, costLabel: 'Custo/EntradaCanal', cost: c(entradaCanal), target: KPI_TARGETS.cost_entrada_canal },
    { key: 'cadastro',      label: 'Cadastro',        count: cadastro,     costLabel: 'Custo/Cadastro',     cost: c(cadastro),     target: KPI_TARGETS.cost_cadastro },
    { key: 'ftd',           label: 'FTD',             count: ftd,          costLabel: 'Custo/FTD',          cost: c(ftd),          target: KPI_TARGETS.cost_ftd },
  ];
}

export interface Bottleneck {
  from: string;
  to: string;
  lost: number;       // perda absoluta
  lostPct: number;    // 0-100
  retention: number;  // 0-100
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

/**
 * Semáforo semântico para KPIs de CUSTO (menor é melhor).
 * Regra Fase R: dentro da meta = verified · 80–100% da meta = warning · acima = critical.
 */
export type Semaphore = 'verified' | 'warning' | 'critical' | 'neutral';
export function costSemaphore(value: number, target: number): Semaphore {
  if (!target) return 'neutral';
  if (value <= target * 0.8) return 'verified';
  if (value <= target) return 'warning';
  return 'critical';
}
