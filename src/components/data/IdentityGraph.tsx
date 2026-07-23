import React, { useState } from 'react';
import { Person } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';

interface IdentityGraphProps {
  person: Person;
}

interface GraphNode {
  key: string;
  label: string;
  abbrev: string;
  color: string;
  value: string;
  method?: string;
  confidence?: number;
}

export function IdentityGraph({ person }: IdentityGraphProps) {
  const { dispatch } = useAppState();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showFusion, setShowFusion] = useState(false);
  const [fusionEmail, setFusionEmail] = useState('');

  const idNodes: GraphNode[] = [
    { key: 'id', label: person.id.slice(-6), abbrev: 'ID', color: '#7C91FF', value: person.id, method: 'Interno', confidence: 100 },
  ];
  if (person.click_id) idNodes.push({ key: 'click', label: person.click_id.slice(-6), abbrev: 'CK', color: '#FF9800', value: person.click_id, method: 'fbclid', confidence: 100 });
  if (person.telegram_id) idNodes.push({ key: 'tg', label: person.telegram_id.slice(-6), abbrev: 'TG', color: '#7C91FF', value: person.telegram_id, method: 'telegram_start', confidence: 100 });
  if (person.phone_token) idNodes.push({ key: 'ph', label: person.phone_token.slice(-6), abbrev: 'PH', color: '#4CAF50', value: person.phone_token, method: 'Phone hash', confidence: 90 });
  if (person.customer_id) idNodes.push({ key: 'cu', label: person.customer_id.slice(-6), abbrev: 'CU', color: '#9C27B0', value: person.customer_id, method: 'TAP Postback', confidence: person.identity_confidence });
  if (person.email) idNodes.push({ key: 'em', label: person.email.slice(0, 6), abbrev: 'EM', color: '#E91E63', value: person.email, method: 'Registro', confidence: 85 });

  // Guard: no identifiers
  if (idNodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-[var(--stone)] text-13">
        Sem identificadores
      </div>
    );
  }

  const cx = 280;
  const cy = 190;
  const radius = 150;
  const angleStep = (2 * Math.PI) / Math.max(idNodes.length, 1);
  const lineWidth = Math.max(1, person.identity_confidence / 25);

  function handleReprocess() {
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  }

  function handleConfirmFusion() {
    if (!fusionEmail.includes('@')) return;
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        action: 'Fusão de identidade proposta',
        object: person.id,
        detail: `Alvo: ${fusionEmail}`,
        user: 'Usuário atual',
        timestamp: new Date().toISOString(),
      },
    });
    toast(`Fusão proposta entre ${person.id} e ${fusionEmail} enviada para a fila de aprovações.`);
    setFusionEmail('');
    setShowFusion(false);
  }

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 560 380" className="w-full" style={{ maxHeight: 380 }}>
        {/* Lines from center to nodes */}
        {idNodes.map((node, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const nx = cx + radius * Math.cos(angle);
          const ny = cy + radius * Math.sin(angle);
          return (
            <line
              key={node.key + '-line'}
              x1={cx}
              y1={cy}
              x2={nx}
              y2={ny}
              stroke={node.color}
              strokeWidth={lineWidth}
              strokeOpacity={0.6}
            />
          );
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={36} fill="#7C91FF" fillOpacity={0.9} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize={10} fontFamily="monospace" fontWeight="bold">ID</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="white" fontSize={9} fontFamily="monospace">{person.id.slice(-6)}</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="white" fontSize={8} fontFamily="monospace">{person.identity_confidence}%</text>

        {/* Identifier nodes */}
        {idNodes.map((node, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const nx = cx + radius * Math.cos(angle);
          const ny = cy + radius * Math.sin(angle);
          const isSelected = selectedNode?.key === node.key;
          return (
            <g
              key={node.key}
              onClick={() => setSelectedNode(isSelected ? null : node)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={nx}
                cy={ny}
                r={26}
                fill={node.color + '33'}
                stroke={node.color}
                strokeWidth={isSelected ? 3.5 : 2.5}
              />
              <text x={nx} y={ny - 4} textAnchor="middle" fill={node.color} fontSize={10} fontFamily="monospace" fontWeight="bold">
                {node.abbrev}
              </text>
              <text x={nx} y={ny + 9} textAnchor="middle" fill={node.color} fontSize={7} fontFamily="monospace">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected node info card */}
      {selectedNode && (
        <div className="bg-zinc border border-line rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-11 font-mono px-1.5 py-0.5 rounded" style={{ background: selectedNode.color + '22', color: selectedNode.color }}>
              {selectedNode.abbrev}
            </span>
            <span className="text-13 font-medium text-eggshell">{selectedNode.key === 'id' ? 'Person ID' : selectedNode.key === 'click' ? 'Click ID' : selectedNode.key === 'tg' ? 'Telegram ID' : selectedNode.key === 'ph' ? 'Phone Token' : selectedNode.key === 'cu' ? 'Customer ID' : 'Email'}</span>
          </div>
          <div className="text-12 font-mono text-[var(--stone)] break-all">{selectedNode.value}</div>
          {selectedNode.method && (
            <div className="text-11 text-[var(--stone)]">Método: <span className="text-eggshell">{selectedNode.method}</span></div>
          )}
          {selectedNode.confidence !== undefined && (
            <div className="text-11 text-[var(--stone)]">Confiança: <span className="text-verified font-mono">{selectedNode.confidence}%</span></div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleReprocess}
          disabled={loading}
          className={`px-3 py-1.5 rounded-md text-13 font-medium transition-colors border ${loading ? 'bg-zinc text-[var(--stone)] border-line cursor-wait' : success ? 'bg-verified/10 text-verified border-verified/30' : 'bg-zinc text-eggshell border-line hover:bg-iron'}`}
        >
          {loading ? '⟳ Reprocessando…' : success ? '✓ Costura atualizada' : 'Reprocessar costura'}
        </button>
        <button
          onClick={() => setShowFusion(!showFusion)}
          className="px-3 py-1.5 rounded-md text-13 font-medium bg-zinc text-eggshell border border-line hover:bg-iron transition-colors"
        >
          Propor fusão
        </button>
      </div>

      {showFusion && (
        <div className="bg-zinc border border-warning/30 rounded-lg p-3 space-y-2">
          <div className="text-12 text-warning font-medium">Propor fusão com outro perfil</div>
          <input
            type="email"
            placeholder="Email do perfil a fundir..."
            value={fusionEmail}
            onChange={e => setFusionEmail(e.target.value)}
            className="w-full bg-iron border border-line rounded px-2 py-1.5 text-13 text-eggshell placeholder:text-[var(--stone)] focus:outline-none focus:border-warning/50"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowFusion(false); setFusionEmail(''); }}
              className="px-3 py-1.5 rounded text-12 text-[var(--stone)] hover:text-eggshell border border-line bg-iron transition-colors"
            >
              Cancelar
            </button>
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
