import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * TeachingError — erro que ensina (Fase R · Bloco 2.8).
 * Padrão: código + causa + ação exata + onde executar.
 *
 * Referência canônica:
 *   (#200) Missing Permissions. Para puxar dados de campanha aqui, gere um
 *   token com a permissão ads_read no Business Manager → Usuários do sistema
 *   e atualize o Access Token na integração Meta. Tokens CAPI-only (como o
 *   atual) só servem para enviar eventos.
 */
export interface TeachingErrorProps {
  code: string;                  // ex.: "#200" · "TAP-401"
  cause: string;                 // ex.: "Missing Permissions"
  action: string;                // o que fazer, em imperativo
  where: string;                 // onde executar (painel + caminho)
  hint?: string;                 // linha de contexto opcional
  className?: string;
}

export function TeachingError({ code, cause, action, where, hint, className = '' }: TeachingErrorProps) {
  return (
    <div className={`bg-graphite border border-critical/30 rounded-xl p-4 flex items-start gap-3 ${className}`}>
      <AlertCircle className="w-5 h-5 text-critical shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 text-13">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-11 px-2 py-0.5 rounded border border-critical/40 bg-critical/10 text-critical">{code}</span>
          <span className="text-eggshell font-semibold">{cause}</span>
        </div>
        <p className="text-stone mt-2 leading-relaxed">
          <span className="text-eggshell">Ação: </span>{action}
        </p>
        <p className="text-stone mt-1 leading-relaxed">
          <span className="text-eggshell">Onde: </span><span className="font-mono text-eggshell">{where}</span>
        </p>
        {hint && <p className="text-11 text-stone mt-2 italic border-t border-line pt-2">{hint}</p>}
      </div>
    </div>
  );
}
