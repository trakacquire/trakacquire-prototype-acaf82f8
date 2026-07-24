/**
 * evidence.ts — payload padrão do EvidenceDrawer.
 *
 * Toda página do Proofline abre o drawer com o mesmo shape:
 *   label, value, formula, source, freshness, state, formingEvents
 */
export type EvidenceView = 'journey_proof' | 'acquisition_funnel' | 'operational';

export interface EvidencePayload {
  label: string;
  value: React.ReactNode;
  formula: string;
  source: string;
  freshness?: string;
  state?: 'Provisório' | 'Reconciliado' | 'Divergente';
  attribution?: string;
  /**
   * A qual vista do dataset canônico este número pertence.
   *   - journey_proof       → Captured → Linked → Registered → Confirmed → Reconciled
   *   - acquisition_funnel  → Clique → StartBot → EntradaCanal → Cadastro → FTD
   *   - operational         → métrica operacional (latência, saúde, custo, etc.)
   */
  view?: EvidenceView;
  formingEvents?: Array<{ id: string; type: string; timestamp: string; value?: number }>;
  ledgerHref?: string;
}

import type React from 'react';

export function buildEvidence(partial: Partial<EvidencePayload> & { label: string; value: React.ReactNode }): EvidencePayload {
  return {
    formula: partial.formula ?? 'sum(events.value) where confirmed = true',
    source: partial.source ?? 'TAP Postback (operacional)',
    freshness: partial.freshness ?? 'atualizado há 4m',
    state: partial.state ?? 'Reconciliado',
    attribution: partial.attribution ?? 'Last Qualified Click · janela 30d · congelado no registro',
    formingEvents: partial.formingEvents ?? [],
    ledgerHref: partial.ledgerHref ?? '/ledger',
    ...partial,
  };
}
