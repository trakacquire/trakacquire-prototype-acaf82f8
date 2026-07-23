import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/fake/db';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { Link } from 'wouter';
import type { SignalEvent, EventStatus } from '@/lib/fake/db';

const EVENT_TYPES = ['all', 'click', 'register', 'ftd', 'deposit', 'withdrawal', 'postback', 'capi', 'webhook'];

function typeColor(type: string) {
  switch (type) {
    case 'click': return 'bg-[var(--proof-blue)]/10 text-[var(--proof-blue)]';
    case 'register': return 'bg-[var(--verified)]/10 text-[var(--verified)]';
    case 'ftd': return 'bg-[var(--warning)]/10 text-[var(--warning)]';
    case 'deposit': return 'bg-[var(--verified)]/10 text-[var(--verified)]';
    case 'withdrawal': return 'bg-[var(--critical)]/10 text-[var(--critical)]';
    case 'postback': return 'bg-[var(--proof-blue)]/10 text-[var(--proof-blue)]';
    case 'capi': return 'bg-[var(--stone)]/10 text-[var(--stone)]';
    case 'webhook': return 'bg-[var(--stone)]/10 text-[var(--stone)]';
    default: return 'bg-[var(--zinc)] text-[var(--stone)]';
  }
}

function relativeTime(isoStr: string): string {
  const now = new Date('2026-07-23T12:00:00.000Z').getTime();
  const then = new Date(isoStr).getTime();
  const diff = Math.abs(now - then);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `há ${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `há ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

export default function LiveEvents() {
  const [evts, setEvts] = useState<(SignalEvent & { _key: string })[]>(() =>
    db.events.slice(0, 40).map((e, i) => ({ ...e, _key: e.id + '_' + i }))
  );
  const [paused, setPaused] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [count, setCount] = useState(db.events.length);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const randomEvt = db.events[Math.floor(Math.random() * db.events.length)];
      const key = randomEvt.id + '_' + Date.now();
      setEvts(prev => [{ ...randomEvt, _key: key }, ...prev].slice(0, 80));
      setCount(c => c + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = typeFilter === 'all' ? evts : evts.filter(e => e.type === typeFilter);

  return (
    <AppShell breadcrumb={[{ label: 'Eventos ao Vivo' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-24 font-bold text-eggshell">Eventos ao Vivo</h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--verified)]/10 border border-[var(--verified)]/20">
                <span className="w-2 h-2 rounded-full bg-[var(--verified)] animate-pulse" />
                <span className="text-11 text-[var(--verified)] font-medium">Conectado</span>
              </div>
            </div>
            <p className="text-13 text-stone font-mono">{count.toLocaleString('pt-BR')} eventos hoje</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-[var(--zinc)] border border-[var(--line)] text-[var(--eggshell)] text-13 rounded-md px-3 py-1.5 focus:outline-none focus:border-[var(--proof-blue)]"
            >
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t === 'all' ? 'Todos os tipos' : t}</option>
              ))}
            </select>

            {/* Pause/Resume */}
            <button
              onClick={() => setPaused(p => !p)}
              className={`px-4 py-1.5 rounded-md text-13 font-medium transition-colors ${
                paused
                  ? 'bg-[var(--proof-blue)] text-white hover:opacity-90'
                  : 'bg-[var(--zinc)] text-[var(--stone)] hover:text-[var(--eggshell)]'
              }`}
            >
              {paused ? 'Retomar' : 'Pausar'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Pessoa</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Latência</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Quando</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.slice(0, 50).map((evt) => (
                    <motion.tr
                      key={evt._key}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-b border-line hover:bg-[var(--zinc)]/30 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-11 font-medium uppercase ${typeColor(evt.type)}`}>
                          {evt.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <Link href={`/players/${evt.person_id}`} className="font-mono text-12 text-[var(--proof-blue)] hover:underline">
                          {evt.person_id}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusChip status={evt.status as EventStatus} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {evt.value != null ? (
                          <span className="font-mono text-12 text-[var(--eggshell)]">
                            R${evt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-stone text-12">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`font-mono text-12 ${evt.latency_ms > 500 ? 'text-[var(--warning)]' : 'text-[var(--stone)]'}`}>
                          {evt.latency_ms}ms
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-12 text-stone">{relativeTime(evt.timestamp)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
