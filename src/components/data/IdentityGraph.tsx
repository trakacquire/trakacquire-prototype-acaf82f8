import React, { useMemo, useState } from 'react';
import { Person } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import { MicroStat } from '@/components/ui/proofline';

interface IdentityGraphProps { person: Person; }

type NodeKind = 'click' | 'tg' | 'ph' | 'cu' | 'em';
interface GraphNode {
  key: NodeKind;
  label: string;
  abbrev: string;
  value: string;
  method: string;
  confidence: number;
  observedAt: string;
  tone: 'proof' | 'warning' | 'verified' | 'critical';
}

const TONE_STROKE: Record<GraphNode['tone'], string> = {
  proof:    'stroke-proof-blue',
  verified: 'stroke-verified',
  warning:  'stroke-warning',
  critical: 'stroke-critical',
};
const TONE_TEXT: Record<GraphNode['tone'], string> = {
  proof:    'text-proof-blue',
  verified: 'text-verified',
  warning:  'text-warning',
  critical: 'text-critical',
};

/**
 * Identity Graph — Fase D · recalibragem.
 *
 * • Nó canônico (Person) com glow sutil azul.
 * • Nós periféricos hairline · sem fill saturado · texto mono tabular.
 * • Timeline de proveniência abaixo do grafo, cronológica decrescente.
 * • Zero hex literal — tudo em tokens semânticos.
 */
export function IdentityGraph({ person }: IdentityGraphProps) {
  const { dispatch } = useAppState();
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [reprocessed, setReprocessed] = useState(false);
  const [showFusion, setShowFusion] = useState(false);
  const [fusionEmail, setFusionEmail] = useState('');

  const nodes: GraphNode[] = useMemo(() => {
    const list: GraphNode[] = [];
    const baseTs = new Date(person.clicked_at ?? new Date().toISOString()).getTime();
    let off = 0;
    const push = (n: Omit<GraphNode, 'observedAt'> & { deltaSec?: number }) => {
      off += n.deltaSec ?? 60;
      list.push({ ...n, observedAt: new Date(baseTs + off * 1000).toISOString() });
    };
    if (person.click_id)    push({ key: 'click', label: person.click_id.slice(-6),    abbrev: 'CK', value: person.click_id,    method: 'UTM · fbclid',     confidence: 100,                                tone: 'proof',    deltaSec: 0 });
    if (person.telegram_id) push({ key: 'tg',    label: person.telegram_id.slice(-6), abbrev: 'TG', value: person.telegram_id, method: 'Deep-link ?start=', confidence: 100,                                tone: 'proof',    deltaSec: 45 });
    if (person.phone_token) push({ key: 'ph',    label: person.phone_token.slice(-6), abbrev: 'PH', value: person.phone_token, method: 'Phone SHA-256',    confidence: 90,                                 tone: 'verified', deltaSec: 120 });
    if (person.customer_id) push({ key: 'cu',    label: person.customer_id.slice(-6), abbrev: 'CU', value: person.customer_id, method: 'TAP · Postback',    confidence: person.identity_confidence,        tone: 'verified', deltaSec: 300 });
    if (person.email)       push({ key: 'em',    label: person.email.slice(0, 6),     abbrev: 'EM', value: person.email,       method: 'Registro',         confidence: 85,                                 tone: 'warning',  deltaSec: 240 });
    return list;
  }, [person]);

  if (nodes.length === 0) {
    return <div className="flex items-center justify-center py-8 text-stone text-13">Sem identificadores</div>;
  }

  const cx = 280;
  const cy = 190;
  const radius = 138;
  const angleStep = (2 * Math.PI) / nodes.length;
  const confidence = person.identity_confidence;
  const lineStroke = Math.max(1, Math.min(2.4, confidence / 40));

  function handleReprocess() {
    setLoading(true); setReprocessed(false);
    setTimeout(() => { setLoading(false); setReprocessed(true); }, 1200);
  }

  function handleConfirmFusion() {
    if (!fusionEmail.includes('@')) return;
    dispatch({
      type: 'APPEND_AUDIT',
      entry: { action: 'Fusão de identidade proposta', object: person.id, detail: `Alvo: ${fusionEmail}`, user: 'Usuário atual', timestamp: new Date().toISOString() },
    });
    toast(`Fusão proposta entre ${person.id} e ${fusionEmail} enviada para a fila de aprovações.`);
    setFusionEmail(''); setShowFusion(false);
  }

  const timeline = [...nodes].sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime());

  return (
    <div className="space-y-6">
      {/* Meta acima do grafo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3">
        <MicroStat label="Person ID" value={person.id.slice(-8)} />
        <MicroStat label="Identificadores" value={nodes.length} />
        <MicroStat label="Confiança" value={`${confidence}%`} tone={confidence >= 95 ? 'verified' : confidence >= 80 ? 'proof' : 'warning'} />
        <MicroStat label="Primeiro contato" value={new Date(person.clicked_at ?? Date.now()).toLocaleDateString('pt-BR')} />
      </div>

      <svg viewBox="0 0 560 380" className="w-full" style={{ maxHeight: 380 }} role="img" aria-label="Identity graph">
        <defs>
          <radialGradient id="canon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="hsl(var(--proof-blue))" stopOpacity="0.28" />
            <stop offset="60%" stopColor="hsl(var(--proof-blue))" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(var(--proof-blue))" stopOpacity="0" />
          </radialGradient>
          {/* Wire-fade — fade nas duas pontas para dar profundidade ao grafo (F.5). */}
          <linearGradient id="wire-fade-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="hsl(var(--proof-blue))" stopOpacity="0" />
            <stop offset="45%"  stopColor="hsl(var(--proof-blue))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--proof-blue))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* connectors — wire-fade (F.5) */}
        {nodes.map((n, i) => {
          const a = i * angleStep - Math.PI / 2;
          const nx = cx + radius * Math.cos(a);
          const ny = cy + radius * Math.sin(a);
          return (
            <line
              key={n.key + '-l'}
              x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="url(#wire-fade-h)"
              strokeWidth={lineStroke}
              strokeLinecap="round"
              className={TONE_STROKE[n.tone]}
              strokeOpacity={0.9}
            />
          );
        })}

        {/* canonical node — glow + disco liso */}
        <circle cx={cx} cy={cy} r={88} fill="url(#canon-glow)" />
        <circle cx={cx} cy={cy} r={40} className="fill-[hsl(var(--surface-raised))] stroke-proof-blue" strokeWidth={1.2} strokeOpacity={0.6} />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-[hsl(var(--stone))]" fontSize={9} fontFamily="var(--font-mono-family)" style={{ letterSpacing: '0.14em' }}>PERSON</text>
        <text x={cx} y={cy + 6} textAnchor="middle" className="fill-eggshell" fontSize={11} fontFamily="var(--font-mono-family)" fontWeight={600}>{person.id.slice(-8)}</text>
        <text x={cx} y={cy + 22} textAnchor="middle" className="fill-proof-blue" fontSize={10} fontFamily="var(--font-mono-family)">{confidence}%</text>

        {/* peripheral nodes */}
        {nodes.map((n, i) => {
          const a = i * angleStep - Math.PI / 2;
          const nx = cx + radius * Math.cos(a);
          const ny = cy + radius * Math.sin(a);
          const isSel = selected?.key === n.key;
          return (
            <g key={n.key} onClick={() => setSelected(isSel ? null : n)} style={{ cursor: 'pointer' }}>
              <circle
                cx={nx} cy={ny} r={24}
                className={`fill-[hsl(var(--surface-raised))] ${TONE_STROKE[n.tone]}`}
                strokeWidth={isSel ? 2 : 1}
                strokeOpacity={isSel ? 0.9 : 0.55}
              />
              <text x={nx} y={ny - 3} textAnchor="middle" className={TONE_TEXT[n.tone]} fontSize={10} fontFamily="var(--font-mono-family)" fontWeight={600}>{n.abbrev}</text>
              <text x={nx} y={ny + 9} textAnchor="middle" className="fill-stone" fontSize={8} fontFamily="var(--font-mono-family)">{n.label}</text>
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="surface-flat rounded-[10px] p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-11 font-mono px-1.5 py-0.5 rounded border ${TONE_TEXT[selected.tone]} border-current`}>
              {selected.abbrev}
            </span>
            <span className="text-13 font-medium text-eggshell">
              {selected.key === 'click' ? 'Click ID' : selected.key === 'tg' ? 'Telegram ID' : selected.key === 'ph' ? 'Phone Token' : selected.key === 'cu' ? 'Customer ID' : 'Email'}
            </span>
          </div>
          <div className="text-12 font-mono text-stone break-all">{selected.value}</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-11 text-stone">
            <div>Método: <span className="text-eggshell">{selected.method}</span></div>
            <div>Confiança: <span className={`font-mono ${selected.confidence >= 95 ? 'text-verified' : selected.confidence >= 80 ? 'text-proof-blue' : 'text-warning'}`}>{selected.confidence}%</span></div>
            <div className="col-span-2">Observado em: <span className="font-mono text-eggshell">{new Date(selected.observedAt).toLocaleString('pt-BR')}</span></div>
          </div>
        </div>
      )}

      {/* Timeline de proveniência */}
      <div>
        <div className="kicker mb-3">Proveniência · cronológica decrescente</div>
        <ol className="relative">
          {timeline.map((n, i) => {
            const isLast = i === timeline.length - 1;
            return (
              <li key={n.key} className="relative pl-10 pb-4 last:pb-0">
                {!isLast && <span aria-hidden className="absolute left-[11px] top-6 bottom-0 w-px bg-eggshell/[0.06]" />}
                <span className={`absolute left-0 top-0 w-6 h-6 rounded-full border grid place-items-center text-10 font-mono ${TONE_TEXT[n.tone]} border-current`}>
                  {n.abbrev}
                </span>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-baseline">
                  <div className="min-w-0">
                    <div className="text-13 text-eggshell">{n.method}</div>
                    <div className="text-11 font-mono text-stone truncate">{n.value}</div>
                  </div>
                  <div className="text-11 font-mono text-stone tabular-nums shrink-0">{new Date(n.observedAt).toLocaleTimeString('pt-BR')}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleReprocess}
          disabled={loading}
          className={`px-3 py-1.5 rounded-md text-13 font-medium transition-colors border ${loading ? 'bg-surface-inset text-stone border-eggshell/10 cursor-wait' : reprocessed ? 'bg-verified/10 text-verified border-verified/30' : 'surface-flat text-eggshell hover:ring-hairline-strong'}`}
        >
          {loading ? '⟳ Reprocessando…' : reprocessed ? '✓ Costura atualizada' : 'Reprocessar costura'}
        </button>
        <button
          onClick={() => setShowFusion((v) => !v)}
          className="px-3 py-1.5 rounded-md text-13 font-medium surface-flat text-eggshell hover:ring-hairline-strong transition-colors"
        >
          Propor fusão
        </button>
      </div>

      {showFusion && (
        <div className="surface-flat rounded-[10px] p-4 space-y-3 ring-hairline-strong">
          <div className="text-12 text-warning font-medium">Propor fusão com outro perfil</div>
          <input
            type="email"
            placeholder="Email do perfil a fundir..."
            value={fusionEmail}
            onChange={(e) => setFusionEmail(e.target.value)}
            className="w-full surface-inset rounded px-2 py-1.5 text-13 text-eggshell placeholder:text-stone focus:outline-none focus:ring-proof"
          />
          <div className="flex gap-2">
            <button onClick={() => { setShowFusion(false); setFusionEmail(''); }} className="px-3 py-1.5 rounded text-12 text-stone hover:text-eggshell surface-inset transition-colors">Cancelar</button>
            <button
              onClick={handleConfirmFusion}
              disabled={!fusionEmail.includes('@')}
              className="px-3 py-1.5 rounded text-12 font-medium bg-warning/10 text-warning border border-warning/30 hover:bg-warning/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar fusão
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
