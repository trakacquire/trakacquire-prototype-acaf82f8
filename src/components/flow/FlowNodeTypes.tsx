import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Zap,
  MessageSquare,
  GitBranch,
  Clock,
  Tag,
  Shuffle,
  TrendingUp,
  Sparkles,
  UserCheck,
  CornerDownRight,
} from 'lucide-react';

// ── Color strip per node type ─────────────────────────────────────────────────
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

const TYPE_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  trigger:        Zap,
  message:        MessageSquare,
  condition:      GitBranch,
  delay:          Clock,
  action:         Tag,
  ab_test:        Shuffle,
  conversion:     TrendingUp,
  ai:             Sparkles,
  human_transfer: UserCheck,
  jump:           CornerDownRight,
};

// ── Base node component ───────────────────────────────────────────────────────
interface NodeData {
  label?: string;
  metrics?: { entered: number; exited: number; converted: number; revenue: number };
  [key: string]: unknown;
}

interface FlowNodeProps {
  data: NodeData;
  selected?: boolean;
  type: string;
}

function BaseFlowNode({ data, selected, type }: FlowNodeProps) {
  const color = TYPE_COLORS[type] || '#9E9E9E';
  const typeLabel = TYPE_LABELS[type] || type;
  const Icon = TYPE_ICONS[type] || Zap;
  const entered = data.metrics?.entered ?? 0;
  const converted = data.metrics?.converted ?? 0;

  return (
    <div
      style={{
        width: 240,
        background: 'hsl(var(--graphite))',
        border: `1px solid ${selected ? color : 'hsl(var(--line))'}`,
        borderRadius: 8,
        boxShadow: selected
          ? `0 0 0 2px ${color}33, 0 4px 24px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Handle: target (top) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: color,
          border: '2px solid hsl(var(--graphite))',
          width: 10,
          height: 10,
          top: -5,
        }}
      />

      {/* Colored top strip */}
      <div style={{ height: 6, background: color }} />

      {/* Icon row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px 4px',
        }}
      >
        <Icon size={14} color={color} />
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'hsl(var(--stone))',
            fontWeight: 600,
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'hsl(var(--eggshell))',
          lineHeight: 1.35,
          padding: '0 12px 6px',
          wordBreak: 'break-word',
        }}
      >
        {data.label || typeLabel}
      </div>

      {/* Metrics row */}
      <div
        style={{
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'hsl(var(--stone))',
          padding: '0 12px 8px',
          borderTop: '1px solid hsl(var(--line))',
          paddingTop: 5,
          marginTop: 2,
        }}
      >
        {entered.toLocaleString('pt-BR')} entradas · {converted.toLocaleString('pt-BR')} conv.
      </div>

      {/* Handle: source (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: color,
          border: '2px solid hsl(var(--graphite))',
          width: 10,
          height: 10,
          bottom: -5,
        }}
      />
    </div>
  );
}

// ── Individual node wrappers ──────────────────────────────────────────────────
export function TriggerNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="trigger" />;
}
export function MessageNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="message" />;
}
export function ConditionNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="condition" />;
}
export function DelayNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="delay" />;
}
export function ActionNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="action" />;
}
export function ABTestNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="ab_test" />;
}
export function ConversionNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="conversion" />;
}
export function AINode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="ai" />;
}
export function HumanTransferNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="human_transfer" />;
}
export function JumpNode(props: { data: NodeData; selected?: boolean }) {
  return <BaseFlowNode {...props} type="jump" />;
}

// ── Exported nodeTypes map ────────────────────────────────────────────────────
export const nodeTypes = {
  trigger:        TriggerNode,
  message:        MessageNode,
  condition:      ConditionNode,
  delay:          DelayNode,
  action:         ActionNode,
  ab_test:        ABTestNode,
  conversion:     ConversionNode,
  ai:             AINode,
  human_transfer: HumanTransferNode,
  jump:           JumpNode,
};
