import React from 'react';

/**
 * AppIcon — glifo tipado por integração (Fase F.4).
 * Quadrado 42px com radial-gradient sutil no canto superior-esquerdo,
 * borda hairline, cor semântica por adapter.  As iniciais ficam em mono.
 */
export type AppIconKind =
  | 'meta'
  | 'tap'
  | 'telegram'
  | 'whatsapp'
  | 'tiktok'
  | 'kwai'
  | 'google'
  | 'betano'
  | 'cloudflare'
  | 'openai'
  | 'generic';

interface AppIconTheme {
  color: string;         // cor semântica principal (hsl var ou hex)
  glow: string;          // cor do glow (radial-gradient canto)
  initials: string;
}

const THEMES: Record<AppIconKind, AppIconTheme> = {
  meta:       { color: 'hsl(230 100% 74%)', glow: 'hsl(230 100% 74% / 0.28)', initials: 'MC' },
  tap:        { color: 'hsl(148 45% 62%)',  glow: 'hsl(148 45% 62% / 0.30)',  initials: 'TA' },
  telegram:   { color: 'hsl(200 92% 70%)',  glow: 'hsl(200 92% 70% / 0.30)',  initials: 'TG' },
  whatsapp:   { color: 'hsl(148 55% 55%)',  glow: 'hsl(148 55% 55% / 0.30)',  initials: 'WA' },
  tiktok:     { color: 'hsl(40 33% 94%)',   glow: 'hsl(40 33% 94% / 0.24)',   initials: 'TT' },
  kwai:       { color: 'hsl(38 90% 62%)',   glow: 'hsl(38 90% 62% / 0.30)',   initials: 'KW' },
  google:     { color: 'hsl(45 90% 60%)',   glow: 'hsl(45 90% 60% / 0.28)',   initials: 'GA' },
  betano:     { color: 'hsl(15 78% 60%)',   glow: 'hsl(15 78% 60% / 0.28)',   initials: 'BE' },
  cloudflare: { color: 'hsl(28 92% 60%)',   glow: 'hsl(28 92% 60% / 0.28)',   initials: 'CF' },
  openai:     { color: 'hsl(160 45% 60%)',  glow: 'hsl(160 45% 60% / 0.28)',  initials: 'AI' },
  generic:    { color: 'hsl(40 33% 94%)',   glow: 'hsl(40 33% 94% / 0.14)',   initials: '·' },
};

interface AppIconProps {
  kind: AppIconKind;
  initials?: string;
  size?: number; // px, default 42
  className?: string;
  ariaLabel?: string;
}

export function AppIcon({ kind, initials, size = 42, className = '', ariaLabel }: AppIconProps) {
  const theme = THEMES[kind] ?? THEMES.generic;
  const label = initials ?? theme.initials;
  return (
    <span
      role="img"
      aria-label={ariaLabel ?? `${kind} icon`}
      className={`inline-grid place-items-center shrink-0 relative overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: `radial-gradient(circle at 22% 22%, ${theme.glow} 0%, transparent 58%), linear-gradient(180deg, hsl(240 6% 11%) 0%, hsl(240 7% 6%) 100%)`,
        border: '1px solid hsl(var(--eggshell) / 0.08)',
        boxShadow: 'inset 0 1px 0 0 hsl(0 0% 100% / 0.04), 0 2px 6px -2px hsl(0 0% 0% / 0.45)',
        color: theme.color,
      }}
    >
      <span
        className="font-mono tabular-nums"
        style={{ fontSize: Math.round(size * 0.32), fontWeight: 600, letterSpacing: '0.02em' }}
      >
        {label}
      </span>
    </span>
  );
}

export function kindFromIntegrationId(id: string): AppIconKind {
  const map: Record<string, AppIconKind> = {
    tap: 'tap', betano: 'betano', meta: 'meta', tiktok: 'tiktok', kwai: 'kwai',
    google: 'google', telegram: 'telegram', whatsapp: 'whatsapp',
    cloudflare: 'cloudflare', openai: 'openai',
  };
  return map[id] ?? 'generic';
}
