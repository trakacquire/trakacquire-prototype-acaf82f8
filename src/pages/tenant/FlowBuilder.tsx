import React, { useState, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { db, FLOWS } from '@/lib/fake/db';
import FlowCanvas from '@/components/flow/FlowCanvas';
import NodePalette from '@/components/flow/NodePalette';
import PropertiesPanel from '@/components/flow/PropertiesPanel';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Play,
  History,
  Radio,
  X,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  User,
  MessageSquare,
  GitBranch,
  Timer,
  Zap,
  ArrowRightLeft,
  BarChart2,
  Cpu,
  SkipForward,
  RotateCcw,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FlowBuilderPageProps {
  params: { id: string };
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'active' | 'draft' | 'paused' }) {
  const cfg = {
    active: { color: '#72E6A6', label: 'Ativo',     dot: true },
    draft:  { color: '#F1C778', label: 'Rascunho',  dot: false },
    paused: { color: '#9E9E9E', label: 'Pausado',   dot: false },
  }[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: `${cfg.color}18`,
        border: `1px solid ${cfg.color}55`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: cfg.color,
      }}
    >
      {cfg.dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: cfg.color,
            flexShrink: 0,
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

// ── Node type icon ─────────────────────────────────────────────────────────────
function nodeTypeIcon(type: string) {
  const size = 12;
  switch (type) {
    case 'trigger':        return <Zap size={size} color="#7C91FF" />;
    case 'message':        return <MessageSquare size={size} color="#4CAF50" />;
    case 'condition':      return <GitBranch size={size} color="#F1C778" />;
    case 'delay':          return <Timer size={size} color="#9E9E9E" />;
    case 'action':         return <ArrowRightLeft size={size} color="#FF9800" />;
    case 'ab_test':        return <BarChart2 size={size} color="#E91E63" />;
    case 'conversion':     return <CheckCircle size={size} color="#72E6A6" />;
    case 'ai':             return <Cpu size={size} color="#7B1FA2" />;
    case 'human_transfer': return <User size={size} color="#EF7D8B" />;
    case 'jump':           return <SkipForward size={size} color="#607D8B" />;
    default:               return <MessageSquare size={size} color="#9E9E9E" />;
  }
}

// ── Test mode step description ─────────────────────────────────────────────────
function getStepDescription(node: { type: string; label: string }, personName: string, hasFtd: boolean): string {
  switch (node.type) {
    case 'trigger':        return 'Gatilho disparado: Registro confirmado';
    case 'message':        return `Mensagem enviada para ${personName} via Telegram`;
    case 'condition':      return `Condição avaliada: Fez depósito? → ${hasFtd ? 'SIM ✓' : 'NÃO ✗'}`;
    case 'delay':          return 'Aguardando 2h...';
    case 'conversion':     return 'Evento FTD enviado → Meta CAPI ✓';
    case 'ab_test':        return 'Usuário alocado no grupo A (50%)';
    case 'action':         return "Tag 'FTD_confirmado' adicionada";
    default:               return `${node.label} executado`;
  }
}

// ── Test mode overlay ─────────────────────────────────────────────────────────
function TestModePanel({
  flowObj,
  onClose,
}: {
  flowObj: (typeof FLOWS)[number];
  onClose: () => void;
}) {
  const testPerson = db.persons.find(p => p.ftd_at) || db.persons[0];
  const flowNodes = flowObj.nodes.slice(0, 6);

  const [testStep, setTestStep] = useState(-1);
  const [testRunning, setTestRunning] = useState(false);

  const hasFtd = !!testPerson?.ftd_at;
  const personName = testPerson?.name || 'Usuário';
  const personInitials = personName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();

  const handleStart = () => {
    setTestStep(0);
    setTestRunning(true);
  };

  const handleNext = () => {
    if (testStep < flowNodes.length - 1) {
      setTestStep(prev => prev + 1);
    } else {
      setTestStep(flowNodes.length); // completed
    }
  };

  const handleReset = () => {
    setTestStep(-1);
    setTestRunning(false);
  };

  const progress = flowNodes.length > 0 ? Math.min(((testStep + 1) / flowNodes.length) * 100, 100) : 0;
  const completed = testStep >= flowNodes.length;

  return (
    <div
      style={{
        position: 'fixed',
        top: 48,
        right: 0,
        bottom: 0,
        width: 360,
        background: 'hsl(var(--iron))',
        borderLeft: '1px solid hsl(var(--line))',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid hsl(var(--line))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio size={14} color="#7C91FF" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--eggshell))' }}>
            Simular Jornada
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--stone))' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Person card */}
      <div
        style={{
          margin: 16,
          marginBottom: 8,
          background: 'hsl(var(--graphite))',
          border: '1px solid hsl(var(--line))',
          borderRadius: 8,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#7C91FF22',
            border: '1px solid #7C91FF55',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#7C91FF',
            flexShrink: 0,
          }}
        >
          {personInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--eggshell))', marginBottom: 3 }}>
            {personName}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 3,
                background: hasFtd ? '#72E6A620' : '#9E9E9E20',
                color: hasFtd ? '#72E6A6' : '#9E9E9E',
                border: `1px solid ${hasFtd ? '#72E6A640' : '#9E9E9E40'}`,
              }}
            >
              {hasFtd ? 'Ativo pós-FTD' : 'Lead'}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 3,
                background: '#7C91FF20',
                color: '#7C91FF',
                border: '1px solid #7C91FF40',
              }}
            >
              {testPerson?.source || 'meta'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {testRunning && (
        <div style={{ margin: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'hsl(var(--stone))' }}>
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, background: 'hsl(var(--line))', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#7C91FF',
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'hsl(var(--stone))', textTransform: 'uppercase', marginBottom: 12 }}>
          Execução Simulada
        </div>

        {!testRunning && testStep === -1 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'hsl(var(--stone))', fontSize: 12 }}>
            Clique em "Iniciar simulação" para começar
          </div>
        )}

        {completed && (
          <div
            style={{
              background: '#72E6A618',
              border: '1px solid #72E6A640',
              borderRadius: 8,
              padding: '14px 16px',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#72E6A6', marginBottom: 4 }}>
              Jornada concluída!
            </div>
            <div style={{ fontSize: 12, color: '#72E6A6' }}>
              Resultado: Convertido ✓
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {flowNodes.map((node, idx) => {
            const status = idx < testStep ? 'done' : idx === testStep ? 'active' : 'pending';
            return (
              <div
                key={node.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background:
                    status === 'active'
                      ? '#7C91FF18'
                      : status === 'done'
                      ? 'hsl(var(--graphite))'
                      : 'transparent',
                  border:
                    status === 'active'
                      ? '1px solid #7C91FF44'
                      : '1px solid transparent',
                  opacity: status === 'pending' ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {/* Status icon */}
                <div style={{ flexShrink: 0, marginTop: 1 }}>
                  {status === 'done' ? (
                    <CheckCircle size={14} color="#72E6A6" />
                  ) : status === 'active' ? (
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: '2px solid #7C91FF',
                        borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                  ) : (
                    <Clock size={14} color="hsl(var(--stone))" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    {nodeTypeIcon(node.type)}
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--eggshell))' }}>
                      {node.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'hsl(var(--stone))' }}>
                    {getStepDescription(node, personName, hasFtd)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid hsl(var(--line))',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {!testRunning ? (
          <button
            onClick={handleStart}
            style={{
              width: '100%',
              background: '#7C91FF',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '9px 0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Radio size={13} />
            Iniciar simulação
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                background: 'hsl(var(--graphite))',
                color: 'hsl(var(--stone))',
                border: '1px solid hsl(var(--line))',
                borderRadius: 6,
                padding: '8px 0',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <RotateCcw size={11} />
              Reiniciar
            </button>
            <button
              onClick={handleNext}
              disabled={completed}
              style={{
                flex: 2,
                background: completed ? 'hsl(var(--graphite))' : '#7C91FF',
                color: completed ? 'hsl(var(--stone))' : '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 0',
                fontSize: 12,
                fontWeight: 600,
                cursor: completed ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: completed ? 0.5 : 1,
              }}
            >
              Próximo passo <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FlowBuilder page ──────────────────────────────────────────────────────────
export default function FlowBuilderPage({ params }: FlowBuilderPageProps) {
  const flowId = params?.id;
  const flowObj = db.getFlow(flowId) ?? FLOWS[0];

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const versionsRef = useRef<HTMLDivElement>(null);

  // Close versions dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (versionsRef.current && !versionsRef.current.contains(e.target as HTMLElement)) {
        setShowVersions(false);
      }
    };
    if (showVersions) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVersions]);

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
    if (node) setTestMode(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    // Use the window callback set by FlowCanvas
    if ((window as any).__flowDeleteNode) {
      (window as any).__flowDeleteNode(nodeId);
    }
    setSelectedNode(null);
    toast('Nó excluído.');
  };

  const handleNavigateBack = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'hsl(var(--ink))',
      }}
    >
      {/* ── Header bar (48px) ── */}
      <div
        style={{
          height: 48,
          minHeight: 48,
          background: 'hsl(var(--graphite))',
          borderBottom: '1px solid hsl(var(--line))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: back + name + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleNavigateBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'hsl(var(--stone))',
              fontSize: 12,
              padding: '4px 6px',
              borderRadius: 4,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--eggshell))';
              (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--zinc))';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--stone))';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            <ArrowLeft size={14} />
            Automações
          </button>

          <span style={{ color: 'hsl(var(--line))', fontSize: 14 }}>/</span>

          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'hsl(var(--eggshell))',
            }}
          >
            {flowObj.name}
          </span>

          <StatusBadge status={flowObj.status} />
        </div>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => {
              setTestMode((v) => !v);
              if (testMode) setSelectedNode(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: testMode ? '#7C91FF22' : 'hsl(var(--zinc))',
              color: testMode ? '#7C91FF' : 'hsl(var(--stone))',
              border: testMode ? '1px solid #7C91FF55' : '1px solid hsl(var(--line))',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Radio size={13} />
            Testar
          </button>

          {/* Versões dropdown */}
          <div ref={versionsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowVersions(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: showVersions ? 'hsl(var(--zinc))' : 'hsl(var(--zinc))',
                color: 'hsl(var(--stone))',
                border: '1px solid hsl(var(--line))',
                borderRadius: 6,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <History size={13} />
              Versões
              <ChevronDown size={11} style={{ marginLeft: 2, transform: showVersions ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {showVersions && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: 'hsl(var(--graphite))',
                  border: '1px solid hsl(var(--line))',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  width: 264,
                  padding: 8,
                  zIndex: 50,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'hsl(var(--stone))', textTransform: 'uppercase', padding: '4px 8px 8px' }}>
                  Histórico de versões
                </div>

                {[
                  { name: 'v2 (atual)', date: '23/07/2026', status: 'Publicado', statusColor: 'var(--verified)', isActual: true },
                  { name: 'v1', date: '15/07/2026', status: 'Publicado', statusColor: 'var(--stone)', isActual: false },
                  { name: 'Rascunho', date: '23/07/2026', status: 'Não publicado', statusColor: 'var(--stone)', isActual: false },
                ].map((v) => (
                  <div
                    key={v.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: v.isActual ? '#7C91FF10' : 'transparent',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'hsl(var(--eggshell))' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'hsl(var(--stone))', marginTop: 1 }}>
                        {v.date} ·{' '}
                        <span style={{ color: `hsl(${v.statusColor})` }}>{v.status}</span>
                      </div>
                    </div>
                    <button
                      disabled={v.isActual}
                      onClick={() => {
                        toast(`Versão ${v.name} restaurada como rascunho.`);
                        setShowVersions(false);
                      }}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 8px',
                        borderRadius: 5,
                        background: v.isActual ? 'transparent' : 'hsl(var(--zinc))',
                        color: v.isActual ? 'hsl(var(--stone))' : 'hsl(var(--eggshell))',
                        border: v.isActual ? '1px solid transparent' : '1px solid hsl(var(--line))',
                        cursor: v.isActual ? 'default' : 'pointer',
                        opacity: v.isActual ? 0.5 : 1,
                      }}
                    >
                      {v.isActual ? 'Atual' : 'Restaurar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'hsl(var(--eggshell))',
              color: 'hsl(var(--ink))',
              border: 'none',
              borderRadius: 6,
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Play size={13} />
            Publicar
          </button>
        </div>
      </div>

      {/* ── Body (canvas area) ── */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 48px)',
          overflow: 'hidden',
        }}
      >
        {/* Node palette (280px) */}
        <NodePalette />

        {/* ReactFlow canvas */}
        <div
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <FlowCanvas
            flowObj={flowObj}
            onNodeSelect={handleNodeSelect}
            onDeleteNode={handleDeleteNode}
          />
        </div>

        {/* Properties panel (320px, visible when no test mode) */}
        {!testMode && (
          <PropertiesPanel
            selectedNode={selectedNode}
            flowObj={flowObj}
            onClose={() => setSelectedNode(null)}
            onDeleteNode={handleDeleteNode}
          />
        )}
      </div>

      {/* Test mode slide-in panel */}
      {testMode && (
        <TestModePanel
          flowObj={flowObj}
          onClose={() => setTestMode(false)}
        />
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .react-flow__controls button {
          background: hsl(var(--iron)) !important;
          border-color: hsl(var(--line)) !important;
          color: hsl(var(--stone)) !important;
          fill: hsl(var(--stone)) !important;
        }
        .react-flow__controls button:hover {
          background: hsl(var(--zinc)) !important;
          color: hsl(var(--eggshell)) !important;
          fill: hsl(var(--eggshell)) !important;
        }
        .react-flow__minimap {
          border: 1px solid hsl(var(--line)) !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        .react-flow__edge-path {
          stroke: hsl(var(--line));
        }
        .react-flow__handle {
          border-radius: 50% !important;
        }
        .react-flow__node.selected > div {
          border-color: var(--node-accent, hsl(var(--proof-blue))) !important;
        }
      `}</style>
    </div>
  );
}
