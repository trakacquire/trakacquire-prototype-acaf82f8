import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import type { Flow } from '@/lib/fake/db';
import { X } from 'lucide-react';

// ── Type labels ───────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  trigger:        'Gatilho',
  message:        'Mensagem',
  condition:      'Condição',
  delay:          'Espera',
  action:         'Ação',
  ab_test:        'Teste A/B',
  conversion:     'Conversão',
  ai:             'IA',
  human_transfer: 'Atendimento',
  jump:           'Saltar',
};

const TYPE_COLORS: Record<string, string> = {
  trigger:        '#7C91FF',
  message:        '#4CAF50',
  condition:      '#F1C778',
  delay:          '#9E9E9E',
  action:         '#FF9800',
  ab_test:        '#E91E63',
  conversion:     '#72E6A6',
  ai:             '#7B1FA2',
  human_transfer: '#EF7D8B',
  jump:           '#607D8B',
};

// ── Flow stats panel (no node selected) ──────────────────────────────────────
function FlowStats({ flowObj }: { flowObj: Flow }) {
  const statusColors = {
    active: '#72E6A6',
    draft:  '#F1C778',
    paused: '#9E9E9E',
  };
  const statusLabel = {
    active: 'Ativo',
    draft:  'Rascunho',
    paused: 'Pausado',
  };
  const color = statusColors[flowObj.status] || '#9E9E9E';

  const formatRevenue = (v: number) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Flow name */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'hsl(var(--stone))',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Visão Geral do Fluxo
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'hsl(var(--eggshell))' }}>
          {flowObj.name}
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: color,
            }}
          />
          <span style={{ fontSize: 12, color, fontWeight: 500 }}>
            {statusLabel[flowObj.status]}
          </span>
          <span style={{ fontSize: 12, color: 'hsl(var(--stone))' }}>
            · {flowObj.channel === 'both' ? 'Telegram + WhatsApp' : flowObj.channel === 'telegram' ? 'Telegram' : 'WhatsApp'}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Pessoas Ativas', value: flowObj.persons_active.toLocaleString('pt-BR') },
          { label: 'Total Entradas', value: flowObj.persons_total.toLocaleString('pt-BR') },
          { label: 'FTDs Gerados',   value: flowObj.ftds_generated.toLocaleString('pt-BR') },
          { label: 'Receita',        value: formatRevenue(flowObj.revenue) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'hsl(var(--graphite))',
              border: '1px solid hsl(var(--line))',
              borderRadius: 8,
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 10, color: 'hsl(var(--stone))', marginBottom: 4 }}>
              {label}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'hsl(var(--eggshell))',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Trigger */}
      <div
        style={{
          background: 'hsl(var(--graphite))',
          border: '1px solid hsl(var(--line))',
          borderRadius: 8,
          padding: '10px 12px',
        }}
      >
        <div style={{ fontSize: 10, color: 'hsl(var(--stone))', marginBottom: 3 }}>
          Gatilho
        </div>
        <div style={{ fontSize: 12, color: 'hsl(var(--eggshell))' }}>
          {flowObj.trigger}
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          fontSize: 11,
          color: 'hsl(var(--stone))',
          textAlign: 'center',
          opacity: 0.7,
          paddingTop: 4,
        }}
      >
        Clique em um nó para editar suas propriedades
      </div>
    </div>
  );
}

// ── Type-specific field editor ────────────────────────────────────────────────
function NodeFields({ node }: { node: Node }) {
  const data = node.data as Record<string, unknown>;
  const type = node.type ?? '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: 6,
    padding: '7px 10px',
    fontSize: 12,
    color: 'hsl(var(--eggshell))',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 500,
    color: 'hsl(var(--stone))',
    marginBottom: 5,
  };

  if (type === 'message') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Texto da Mensagem</label>
          <textarea
            rows={4}
            defaultValue={data.text as string ?? ''}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Canal</label>
          <select defaultValue="telegram" style={inputStyle}>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>
    );
  }

  if (type === 'condition') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Campo</label>
          <input type="text" defaultValue={data.field as string ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Operador</label>
          <select defaultValue={data.operator as string ?? 'eq'} style={inputStyle}>
            <option value="eq">Igual a</option>
            <option value="neq">Diferente de</option>
            <option value="gt">Maior que</option>
            <option value="lt">Menor que</option>
            <option value="contains">Contém</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Valor</label>
          <input type="text" defaultValue={String(data.value ?? '')} style={inputStyle} />
        </div>
      </div>
    );
  }

  if (type === 'delay') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Duração</label>
          <input type="number" defaultValue={data.duration as number ?? 60} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Unidade</label>
          <select defaultValue={data.unit as string ?? 'minutes'} style={inputStyle}>
            <option value="minutes">Minutos</option>
            <option value="hours">Horas</option>
            <option value="days">Dias</option>
          </select>
        </div>
      </div>
    );
  }

  if (type === 'ai') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Modelo</label>
          <select defaultValue={data.model as string ?? 'gpt-4o-mini'} style={inputStyle}>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Prompt</label>
          <textarea
            rows={4}
            defaultValue={data.prompt as string ?? ''}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      </div>
    );
  }

  if (type === 'conversion') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Evento</label>
          <input type="text" defaultValue={data.event as string ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Plataforma</label>
          <select defaultValue={data.platform as string ?? 'meta'} style={inputStyle}>
            <option value="meta">Meta CAPI</option>
            <option value="tiktok">TikTok Events</option>
            <option value="google">Google Ads</option>
          </select>
        </div>
      </div>
    );
  }

  if (type === 'ab_test') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Divisão A (%) </label>
          <input
            type="number"
            min={1}
            max={99}
            defaultValue={data.split as number ?? 50}
            style={inputStyle}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'hsl(var(--stone))',
          }}
        >
          B receberá {100 - ((data.split as number) ?? 50)}% do tráfego
        </div>
      </div>
    );
  }

  if (type === 'human_transfer') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Fila</label>
          <select defaultValue={data.queue as string ?? 'Geral'} style={inputStyle}>
            <option value="Geral">Geral</option>
            <option value="VIP">VIP</option>
            <option value="Suporte">Suporte</option>
            <option value="Vendas">Vendas</option>
          </select>
        </div>
      </div>
    );
  }

  if (type === 'trigger') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelStyle}>Evento</label>
          <select defaultValue={data.event as string ?? 'registration'} style={inputStyle}>
            <option value="registration">Registro confirmado</option>
            <option value="ftd">Primeiro depósito</option>
            <option value="inactivity">Inatividade</option>
            <option value="deposit">Depósito</option>
            <option value="manual">Manual / API</option>
          </select>
        </div>
      </div>
    );
  }

  // Generic fallback
  return (
    <div style={{ fontSize: 12, color: 'hsl(var(--stone))' }}>
      Nenhuma propriedade editável para este tipo.
    </div>
  );
}

// ── PropertiesPanel ───────────────────────────────────────────────────────────
interface PropertiesPanelProps {
  selectedNode: Node | null;
  flowObj: Flow;
  onClose?: () => void;
  onDeleteNode?: (nodeId: string) => void;
}

export default function PropertiesPanel({
  selectedNode,
  flowObj,
  onClose,
  onDeleteNode,
}: PropertiesPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const color = selectedNode
    ? TYPE_COLORS[selectedNode.type ?? ''] || '#9E9E9E'
    : undefined;
  const typeLabel = selectedNode
    ? TYPE_LABELS[selectedNode.type ?? ''] || selectedNode.type
    : null;

  const data = selectedNode?.data as Record<string, unknown> | undefined;
  const metrics = data?.metrics as
    | { entered: number; exited: number; converted: number; revenue: number }
    | undefined;

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedNode && onDeleteNode) {
      onDeleteNode(selectedNode.id);
    }
    setConfirmDelete(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  return (
    <div
      style={{
        width: 320,
        background: 'hsl(var(--iron))',
        borderLeft: '1px solid hsl(var(--line))',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid hsl(var(--line))',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'hsl(var(--stone))',
          }}
        >
          {selectedNode ? 'Propriedades' : 'Fluxo'}
        </span>
        {selectedNode && onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'hsl(var(--stone))',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Panel body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        {selectedNode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Node header */}
            <div
              style={{
                borderLeft: `3px solid ${color}`,
                paddingLeft: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: color,
                  marginBottom: 3,
                }}
              >
                {typeLabel}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'hsl(var(--eggshell))',
                }}
              >
                {(data?.label as string) || typeLabel}
              </div>
            </div>

            {/* Metrics */}
            {metrics && (
              <div
                style={{
                  background: 'hsl(var(--graphite))',
                  border: '1px solid hsl(var(--line))',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {[
                  { label: 'Entradas',   value: metrics.entered },
                  { label: 'Saídas',     value: metrics.exited },
                  { label: 'Convertidos', value: metrics.converted },
                  { label: 'Receita',    value: `R$${metrics.revenue.toLocaleString('pt-BR')}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: 'hsl(var(--stone))', marginBottom: 2 }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'hsl(var(--eggshell))',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Label field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'hsl(var(--stone))',
                  marginBottom: 5,
                }}
              >
                Rótulo do nó
              </label>
              <input
                type="text"
                defaultValue={(data?.label as string) ?? ''}
                style={{
                  width: '100%',
                  background: 'hsl(var(--zinc))',
                  border: '1px solid hsl(var(--line))',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 12,
                  color: 'hsl(var(--eggshell))',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Type-specific fields */}
            <NodeFields node={selectedNode} />
          </div>
        ) : (
          <FlowStats flowObj={flowObj} />
        )}
      </div>

      {/* Footer actions (only when node selected) */}
      {selectedNode && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid hsl(var(--line))',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Confirm delete inline */}
          {confirmDelete ? (
            <div
              style={{
                background: 'hsl(var(--critical))/10',
                border: '1px solid hsl(var(--critical))',
                borderRadius: 8,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 12, color: 'hsl(var(--critical))', fontWeight: 500 }}>
                Excluir este nó?
              </div>
              <div style={{ fontSize: 11, color: 'hsl(var(--stone))' }}>
                Esta ação não pode ser desfeita.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleDeleteCancel}
                  style={{
                    flex: 1,
                    background: 'hsl(var(--zinc))',
                    color: 'hsl(var(--eggshell))',
                    border: '1px solid hsl(var(--line))',
                    borderRadius: 6,
                    padding: '7px 0',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  style={{
                    flex: 1,
                    background: 'hsl(var(--critical))',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '7px 0',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Confirmar exclusão
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  flex: 1,
                  background: 'hsl(var(--eggshell))',
                  color: 'hsl(var(--ink))',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 0',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Salvar
              </button>
              <button
                onClick={handleDeleteClick}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: 'hsl(var(--critical))',
                  border: '1px solid hsl(var(--critical))',
                  borderRadius: 6,
                  padding: '8px 0',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Excluir nó
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
