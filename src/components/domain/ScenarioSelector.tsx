import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const SCENARIOS = [
  { key: 'normal', label: 'Normal' },
  { key: 'degraded', label: 'Integração degradada' },
  { key: 'dlq_full', label: 'DLQ cheio' },
  { key: 'divergencias', label: 'Divergências' },
  { key: 'sem_dados', label: 'Sem dados' },
  { key: 'erro_sistema', label: 'Erro sistema' },
];

export function useDemoScenario(): string {
  return localStorage.getItem('ta_scenario') || 'normal';
}

export default function ScenarioSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(() => localStorage.getItem('ta_scenario') || 'normal');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-scenario-selector]')) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (key: string, label: string) => {
    localStorage.setItem('ta_scenario', key);
    setCurrent(key);
    setOpen(false);
    toast(`🎬 Cenário: ${label}`);
  };

  return (
    <div
      data-scenario-selector
      className="fixed bottom-4 right-4 z-50"
    >
      {open && (
        <div className="absolute bottom-10 right-0 mb-2 bg-[var(--graphite)] border border-[var(--line)] rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => select(s.key, s.label)}
              className={`w-full text-left px-4 py-2.5 text-13 transition-colors hover:bg-[var(--zinc)] ${
                current === s.key ? 'text-[var(--proof-blue)] font-medium' : 'text-[var(--eggshell)]'
              }`}
            >
              {current === s.key && <span className="mr-1.5">✓</span>}
              {s.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg bg-[var(--graphite)] border border-[var(--line)] text-12 text-[var(--stone)] hover:text-[var(--eggshell)] hover:border-[var(--stone)] transition-colors shadow-lg"
      >
        🎬 Demo
      </button>
    </div>
  );
}
