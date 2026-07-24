/**
 * experts.ts — dimensão Expert/Afiliado como cidadão de primeira classe.
 *
 * Regras (Fase R · Bloco 1.4):
 * - Determinístico a partir do índice da person (não muda por reload).
 * - Cobre 100% das personas meta/tiktok/organic — nunca as orphan.
 * - NÃO altera nenhum total canônico (78/36/R$ 12.013/R$ 334/R$ 19.618),
 *   é somente atributo derivado.
 */

export interface Expert {
  id: string;
  name: string;
  handle: string;
  status: 'active' | 'paused';
}

export const EXPERTS: Expert[] = [
  { id: 'exp_aline',  name: 'Aline Rocha',   handle: '@alinerocha',   status: 'active' },
  { id: 'exp_bruno',  name: 'Bruno Faria',   handle: '@brunofaria',   status: 'active' },
  { id: 'exp_camila', name: 'Camila Nunes',  handle: '@camilanunes',  status: 'active' },
  { id: 'exp_diego',  name: 'Diego Sá',      handle: '@diegosa',      status: 'active' },
  { id: 'exp_elisa',  name: 'Elisa Prado',   handle: '@elisaprado',   status: 'paused' },
  { id: 'exp_fabio',  name: 'Fábio Torres',  handle: '@fabiotorres',  status: 'active' },
];

/** Mapa determinístico personId → expertId (null para órfãs). */
export function expertForPerson(personId: string): Expert | null {
  const idx = parseInt(personId.replace(/^person_/, ''), 10);
  if (!Number.isFinite(idx) || idx >= 229) return null; // 229-240 são órfãs
  return EXPERTS[(idx - 1) % EXPERTS.length];
}

export function expertById(id: string): Expert | undefined {
  return EXPERTS.find((e) => e.id === id);
}
