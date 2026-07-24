/**
 * evidence.ts — payload padrão do EvidenceDrawer.
 *
 * Toda página do Proofline abre o drawer com o mesmo shape:
 *   label, value, formula, source, freshness, state, formingEvents
 */
export interface EvidencePayload {
  label: string;
  value: React.ReactNode;
  formula: string;
  source: string;
  freshness?: string;
  state?: 'Provisório' | 'Reconciliado' | 'Divergente';
  attribution?: string;
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
