import React from 'react';
import { cn } from '@/lib/utils';

interface BrandProps {
  size?: 'sm' | 'md';
  wordmark?: boolean;
  className?: string;
}

/**
 * Brand — TrakAcquire (produto). Glifo Proofline em CSS puro + wordmark
 * "TRAK" forte com sufixo "ACQUIRE" pequeno. Proofline é o design system,
 * não o produto — assina discretamente no rodapé da Sidebar, nunca aqui.
 */
export function Brand({ size = 'md', wordmark = true, className }: BrandProps) {
  const glyphSize = size === 'md' ? 'brand-glyph' : 'brand-glyph-sm';
  const eyeSize = size === 'md' ? 9 : 6;
  const dashLen = size === 'md' ? 22 : 14;
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className={cn(glyphSize, 'relative')} aria-hidden>
        <span
          className="absolute rounded-full bg-eggshell"
          style={{
            width: eyeSize,
            height: eyeSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 6px hsl(45 42% 90% / 0.55)',
          }}
        />
        <span
          className="absolute bg-proof-blue"
          style={{
            width: dashLen,
            height: 1.5,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(35deg)',
            transformOrigin: 'center',
            opacity: 0.9,
            borderRadius: 2,
          }}
        />
      </span>
      {wordmark ? (
        <span className="inline-flex items-baseline gap-1 leading-none">
          <span
            className={cn(
              'text-eggshell font-semibold tracking-tight',
              size === 'md' ? 'text-[17px]' : 'text-[14px]',
            )}
            style={{ letterSpacing: '-0.01em' }}
          >
            TRAK
          </span>
          <span
            className={cn(
              'font-mono text-stone uppercase',
              size === 'md' ? 'text-[10px]' : 'text-[9px]',
            )}
            style={{ letterSpacing: '0.18em' }}
          >
            Acquire
          </span>
        </span>
      ) : null}
    </div>
  );
}
