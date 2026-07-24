/**
 * evidence.ts — payload padrão do EvidenceDrawer.
 *
 * Onda A · A7 — completa os 8 campos canônicos do Build Pack:
 *   label, value, formula, source, freshness, state, attribution (+ confidence),
 *   reversals, auditRef, formingEvents, navegação.
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
  /** Confiança do modelo (0-1). Exibida como percentual quando presente. */
  confidence?: number;
  /** Nº de reversões / estornos aplicados ao número (D+1). */
  reversals?: number;
  /** Audit reference (aud_*) — rastreabilidade obrigatória do plano/reconciliação. */
  auditRef?: string;
  view?: EvidenceView;
  formingEvents?: Array<{ id: string; type: string; timestamp: string; value?: number }>;
  ledgerHref?: string;
  /** E4 — todo número prova E navega. CTA visível no rodapé do drawer. */
  navigateTo?: string;
  navigateLabel?: string;
}

import type React from 'react';

export function buildEvidence(partial: Partial<EvidencePayload> & { label: string; value: React.ReactNode }): EvidencePayload {
  return {
    formula: partial.formula ?? 'sum(events.value) where confirmed = true',
    source: partial.source ?? 'TAP Postback (operacional)',
    freshness: partial.freshness ?? 'Dados atualizados há 4 min',
    state: partial.state ?? 'Reconciliado',
    attribution: partial.attribution ?? 'Last Qualified Click · janela 30d · congelado no registro',
    confidence: partial.confidence ?? 0.94,
    reversals: partial.reversals ?? 0,
    auditRef: partial.auditRef ?? 'aud_c94f21',
    formingEvents: partial.formingEvents ?? [],
    ledgerHref: partial.ledgerHref ?? '/ledger',
    ...partial,
  };
}
