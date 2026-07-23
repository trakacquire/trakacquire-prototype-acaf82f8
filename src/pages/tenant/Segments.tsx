import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { Plus, Filter } from 'lucide-react';

export default function SegmentsPage() {
  const { state, dispatch } = useAppState();
  const [queryResult, setQueryResult] = useState<number | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSegName, setNewSegName] = useState('');
  const [andFilter, setAndFilter] = useState(true);

  const allSegments = [
    ...db.segments,
    ...state.customSegments.map(s => ({ id: s.id, name: s.name, rule_summary: s.rule, count: s.count, created_at: new Date().toISOString(), is_dynamic: true })),
  ];

  const handleVisualize = () => {
    setQueryResult(10 + Math.floor(Math.random() * 41));
  };

  const handleSave = () => {
    if (!newSegName.trim()) return;
    dispatch({
      type: 'ADD_SEGMENT',
      seg: {
        id: `seg_custom_${Date.now()}`,
        name: newSegName.trim(),
        rule: `FTD = sim ${andFilter ? 'AND' : 'OR'} origem = Meta`,
        count: queryResult ?? 0,
      },
    });
    setNewSegName('');
    setShowSaveDialog(false);
    setQueryResult(null);
  };

  return (
    <AppShell breadcrumb={[{ label: 'Segments' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-24 font-bold text-eggshell mb-1">Segmentos</h1>
            <p className="text-13 text-stone">Grupos dinâmicos de jogadores baseados em critérios comportamentais</p>
          </div>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Segmento
          </button>
        </div>

        {/* Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allSegments.map(seg => (
            <div key={seg.id} className="bg-graphite border border-line rounded-xl p-5 flex flex-col gap-3 hover:border-stone transition-colors">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-14 font-semibold text-eggshell">{seg.name}</h3>
                {seg.is_dynamic && (
                  <span className="px-2 py-0.5 rounded text-11 font-medium bg-proof-blue/10 text-proof-blue border border-proof-blue/20">
                    Dinâmico
                  </span>
                )}
              </div>
              <div className="text-24 font-bold font-mono text-eggshell tabular-nums">{seg.count.toLocaleString('pt-BR')}</div>
              <div className="text-12 text-stone">{seg.rule_summary}</div>
              <div className="flex items-center gap-2 pt-2 border-t border-line">
                <button className="text-12 text-proof-blue hover:underline">Usar em Broadcast</button>
                <span className="text-stone">·</span>
                <button className="text-12 text-stone hover:text-eggshell">Ver Players</button>
                <span className="text-stone">·</span>
                <button className="text-12 text-stone hover:text-eggshell">Editar</button>
              </div>
            </div>
          ))}
        </div>

        {/* QueryBuilder section */}
        <div className="bg-graphite border border-line rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-stone" />
            <h3 className="text-14 font-semibold text-eggshell">Query Builder</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1.5 rounded-lg bg-proof-blue/10 text-proof-blue border border-proof-blue/20 text-13 font-medium">
              FTD = sim
            </span>
            <button
              onClick={() => setAndFilter(v => !v)}
              className={`px-3 py-1.5 rounded-lg border text-13 font-mono font-bold transition-colors ${andFilter ? 'bg-zinc text-eggshell border-line' : 'bg-proof-blue/20 text-proof-blue border-proof-blue/30'}`}
            >
              {andFilter ? 'AND' : 'OR'}
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning border border-warning/20 text-13 font-medium">
              origem = Meta
            </span>
            <button className="px-3 py-1.5 rounded-lg bg-zinc border border-line text-stone text-13 hover:text-eggshell hover:border-stone transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Filtro
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleVisualize}
              className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md font-medium text-14 hover:border-stone transition-colors"
            >
              Visualizar resultado
            </button>
            <button
              onClick={() => { if (queryResult !== null) setShowSaveDialog(true); else handleVisualize(); }}
              className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
            >
              Salvar segmento
            </button>
            {queryResult !== null && (
              <span className="text-13 font-mono text-eggshell">
                Resultado: <span className="text-proof-blue font-bold">{queryResult}</span> jogadores
              </span>
            )}
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
            <div className="bg-graphite border border-line rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-16 font-semibold text-eggshell mb-4">Salvar Segmento</h3>
              <input
                type="text"
                value={newSegName}
                onChange={e => setNewSegName(e.target.value)}
                placeholder="Nome do segmento..."
                className="w-full bg-zinc border border-line text-eggshell rounded-md px-3 py-2 text-14 outline-none focus:border-proof-blue mb-4"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-stone hover:text-eggshell text-14 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
