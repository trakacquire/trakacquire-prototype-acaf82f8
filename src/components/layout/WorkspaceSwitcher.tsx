import React from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { workspaces } from '@/lib/fake';

/**
 * WorkspaceSwitcher — card interno recartonado.
 * Nome SEM truncar, linha secundária "cidade · moeda", badge LIVE à direita
 * quando a operação está ativa (Onda H1 — sidebar calibration).
 */
export function WorkspaceSwitcher() {
  const current = workspaces[0];
  return (
    <div className="relative group cursor-pointer">
      <div
        className="rounded-[11px] px-3 py-2.5 flex items-center gap-2.5 border transition-colors"
        style={{
          background: '#161618',
          borderColor: 'hsl(var(--eggshell) / 0.10)',
          boxShadow: 'inset 0 1px 0 0 hsl(0 0% 100% / 0.025)',
        }}
      >
        <div className="w-7 h-7 rounded-[8px] bg-proof-blue/15 text-proof-blue grid place-items-center text-11 font-mono font-bold shrink-0 border border-proof-blue/25">
          {current?.name.slice(0, 2).toUpperCase() ?? 'OB'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-13 font-medium text-eggshell leading-tight">
              {current?.name ?? 'Operação Brasil'}
            </div>
            {current?.live && (
              <span className="inline-flex items-center gap-1 rounded-[4px] border border-verified/30 bg-verified/8 px-1 py-[1px] text-[8.5px] font-mono uppercase tracking-[0.16em] text-verified">
                <span className="w-1 h-1 rounded-full bg-verified dot-glow-verified" />
                Live
              </span>
            )}
          </div>
          <div className="text-[10.5px] text-stone mt-0.5 leading-none">
            {current?.location ?? 'São Paulo'} <span className="text-stone/50">·</span>{' '}
            <span className="font-mono">{current?.currency ?? 'BRL'}</span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone group-hover:text-eggshell transition-colors shrink-0" />
      </div>

      <div className="absolute top-full left-0 w-full mt-1.5 surface-floating rounded-[11px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1.5">
          {workspaces.map((ws, i) => (
            <div
              key={ws.id}
              className="flex items-center justify-between px-2.5 py-2 hover:bg-white/[0.03] rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {i === 0 ? (
                  <Check className="w-3 h-3 text-proof-blue shrink-0" />
                ) : (
                  <span className="w-3 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-13 text-eggshell truncate">{ws.name}</div>
                  <div className="text-[10px] text-stone leading-none mt-0.5">
                    {ws.location} · <span className="font-mono">{ws.currency}</span>
                  </div>
                </div>
              </div>
              <span className="text-[9px] uppercase font-mono font-semibold text-stone bg-iron px-1.5 py-0.5 rounded border border-line shrink-0 tracking-wider">
                {ws.plan}
              </span>
            </div>
          ))}
          <div className="h-px bg-line my-1.5 mx-1.5" />
          <div className="flex items-center gap-2 px-2.5 py-2 hover:bg-white/[0.03] rounded-md cursor-pointer text-stone hover:text-eggshell">
            <Plus className="w-3.5 h-3.5" />
            <span className="text-13">Criar workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
