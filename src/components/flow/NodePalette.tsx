import React from 'react';
import {
  Zap,
  MessageSquare,
  HelpCircle,
  GitBranch,
  Clock,
  Shuffle,
  Tag,
  TrendingUp,
  Sparkles,
  UserCheck,
  CornerDownRight,
  LucideIcon,
} from 'lucide-react';

// ── Node type colors ──────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  trigger:        '#7C91FF',
  message:        '#4CAF50',
  question:       '#4CAF50',
  condition:      '#F1C778',
  delay:          '#9E9E9E',
  ab_test:        '#E91E63',
  action:         '#FF9800',
  conversion:     '#72E6A6',
  ai:             '#7B1FA2',
  human_transfer: '#EF7D8B',
  jump:           '#607D8B',
};

// ── Palette item definition ───────────────────────────────────────────────────
interface PaletteItem {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface PaletteGroup {
  groupLabel: string;
  items: PaletteItem[];
}

const GROUPS: PaletteGroup[] = [
  {
    groupLabel: 'GATILHO',
    items: [
      { type: 'trigger', label: 'Gatilho', description: 'Inicia por evento', icon: Zap },
    ],
  },
  {
    groupLabel: 'MENSAGENS',
    items: [
      { type: 'message',  label: 'Mensagem', description: 'Texto, mídia, botões', icon: MessageSquare },
      { type: 'question', label: 'Pergunta',  description: 'Coleta resposta',      icon: HelpCircle },
    ],
  },
  {
    groupLabel: 'LÓGICA',
    items: [
      { type: 'condition', label: 'Condição',  description: 'Bifurca por dado',    icon: GitBranch },
      { type: 'delay',     label: 'Espera',    description: 'Pausa entre etapas',  icon: Clock },
      { type: 'ab_test',   label: 'Teste A/B', description: 'Divide tráfego',      icon: Shuffle },
    ],
  },
  {
    groupLabel: 'AÇÕES',
    items: [
      { type: 'action',         label: 'Ação',         description: 'Tag ou atributo',    icon: Tag },
      { type: 'conversion',     label: 'Conversão',    description: 'Evento plataforma',  icon: TrendingUp },
      { type: 'ai',             label: 'IA',           description: 'Processa com LLM',   icon: Sparkles },
      { type: 'human_transfer', label: 'Atendimento',  description: 'Transfere agente',   icon: UserCheck },
      { type: 'jump',           label: 'Saltar',       description: 'Outro fluxo',        icon: CornerDownRight },
    ],
  },
];

// ── Draggable palette item ────────────────────────────────────────────────────
function PaletteItem({ item }: { item: PaletteItem }) {
  const color = TYPE_COLORS[item.type] || '#9E9E9E';
  const Icon = item.icon;

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow-type', item.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 8px',
        borderRadius: 6,
        cursor: 'grab',
        transition: 'background 0.1s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'hsl(var(--zinc))';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* Colored icon box */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: `${color}22`,
          border: `1px solid ${color}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={color} />
      </div>

      {/* Text */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'hsl(var(--eggshell))',
            lineHeight: '16px',
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'hsl(var(--stone))',
            lineHeight: '13px',
          }}
        >
          {item.description}
        </div>
      </div>
    </div>
  );
}

// ── NodePalette ───────────────────────────────────────────────────────────────
export default function NodePalette() {
  return (
    <div
      style={{
        width: 280,
        background: 'hsl(var(--iron))',
        borderRight: '1px solid hsl(var(--line))',
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'hsl(var(--stone))',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Componentes
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'hsl(var(--stone))',
            opacity: 0.7,
          }}
        >
          Arraste para o canvas
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => (
        <div key={group.groupLabel}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'hsl(var(--stone))',
              textTransform: 'uppercase',
              marginBottom: 6,
              paddingLeft: 4,
            }}
          >
            {group.groupLabel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => (
              <PaletteItem key={item.type} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
