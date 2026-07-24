import React from 'react';
import { PreviewBadge } from '@/components/data/PreviewBadge';

interface Props {
  kicker: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PlatformPageHeader — cabeçalho editorial padrão do Super Admin.
 * Fase F: kicker agora é eyebrow sans (9px uppercase 1.5px), não mais serifa
 * italic. A serifa fica reservada à marca e ao hero-serif (Reports).
 */
export function PlatformPageHeader({ kicker, title, description, actions }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2">
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="kicker">{kicker}</span>
          <PreviewBadge />
        </div>
        <h1 className="page-title">{title}</h1>
        {description ? (
          <p className="text-14 text-stone mt-1.5 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
    </header>
  );
}
