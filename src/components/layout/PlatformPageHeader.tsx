import React from 'react';
import { PreviewBadge } from '@/components/data/PreviewBadge';

interface Props {
  kicker: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PlatformPageHeader — cabeçalho editorial padrão do Super Admin (Fase P8).
 * Kicker em serifa italic + título sans bold + PreviewBadge obrigatório.
 * Mantém a barra de qualidade Proofline no ambiente da plataforma sem
 * reestruturar nenhuma página existente.
 */
export function PlatformPageHeader({ kicker, title, description, actions }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2">
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <span className="font-serif italic text-13 text-stone tracking-wide">{kicker}</span>
          <PreviewBadge />
        </div>
        <h1 className="text-24 md:text-28 font-bold text-eggshell tracking-tight leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-14 text-stone mt-1 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
    </header>
  );
}
