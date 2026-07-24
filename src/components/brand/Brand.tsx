import React from 'react';
import { cn } from '@/lib/utils';

interface BrandProps {
  size?: 'sm' | 'md';
  wordmark?: boolean;
  className?: string;
}

/**
 * Brand — glifo Proofline em CSS puro conforme referência TrakPro.
 * Quadrado com gradient #1E1E21→#0E0E10, borda #3B3B40; olho eggshell + risco
 * proof-blue em 35° construídos como pseudo-elementos posicionados.
 *
 * A única presença de tipografia serif no chrome fica AQUI (wordmark), por
 * DECISIONS D1 · "sans no produto; serif só na marca e em hero narrativo".
 */
export function Brand({ size = 'md', wordmark = true, className }: BrandProps) {
  const glyphSize = size === 'md' ? 'brand-glyph' : 'brand-glyph-sm';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className={cn(glyphSize, 'relative')} aria-hidden>
        {/* Olho eggshell */}
        <span
          className="absolute rounded-full bg-eggshell"
          style={{
            width: size === 'md' ? 9 : 6,
            height: size === 'md' ? 9 : 6,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 6px hsl(45 42% 90% / 0.55)',
          }}
        />
        {/* Risco proof-blue em 35° */}
        <span
          className="absolute bg-proof-blue"
          style={{
            width: size === 'md' ? 22 : 14,
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
        <span
          className={cn(
            'text-eggshell tracking-tight leading-none',
            size === 'md' ? 'text-16' : 'text-13',
          )}
          style={{ fontFamily: 'var(--font-serif-family), Georgia, serif', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Proofline
        </span>
      ) : null}
    </div>
  );
}
