import React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditRefProps {
  id: string;
  className?: string;
  /** Prefixo curto (ex: "audit", "plan", "corr"). */
  kind?: string;
}

/**
 * AuditRef — referência curta de auditoria exibida após sucesso de escrita.
 * Sempre mono, copiável, nunca camuflada.
 */
export function AuditRef({ id, className, kind = 'audit' }: AuditRefProps) {
  const [copied, setCopied] = React.useState(false);
  const short = id.length > 12 ? `${id.slice(0, 4)}…${id.slice(-6)}` : id;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard may be blocked in some contexts */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border border-line bg-iron/60 px-2 py-0.5 text-11 font-mono text-stone hover:text-eggshell hover:border-line/80 transition-colors',
        className,
      )}
      title={`${kind}:${id} (clique para copiar)`}
    >
      <span className="text-[10px] uppercase tracking-wider text-stone/70">{kind}</span>
      <span className="tabular-nums">{short}</span>
      {copied ? <Check className="h-3 w-3 text-verified" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
