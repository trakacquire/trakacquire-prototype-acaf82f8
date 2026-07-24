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

// Operação Tainá — cliente-zero contratual (DECISIONS.md, Parte III).
export const EXPERTS: Expert[] = [
  { id: 'exp_taina',   name: 'Tainá Souza',      handle: '@tainasouza',      status: 'active' },
  { id: 'exp_renata',  name: 'Renata Alves',     handle: '@renataalves',     status: 'active' },
  { id: 'exp_jeferson',name: 'Jeferson Lima',    handle: '@jefersonlima',    status: 'active' },
  { id: 'exp_marcos',  name: 'Marcos Vinícius',  handle: '@marcosvinicius',  status: 'active' },
  { id: 'exp_larissa', name: 'Larissa Prado',    handle: '@larissaprado',    status: 'paused' },
  { id: 'exp_gabriel', name: 'Gabriel Menezes',  handle: '@gabrielmenezes',  status: 'active' },
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
