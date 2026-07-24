import '@xyflow/react/dist/style.css';
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import { nodeTypes } from './FlowNodeTypes';
import type { Flow } from '@/lib/fake/db';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FlowCanvasProps {
  flowObj: Flow;
  onNodeSelect: (node: Node | null) => void;
  onDeleteNode?: (nodeId: string) => void;
  onNodesUpdate?: (nodes: Node[]) => void;
}

// ── UUID-ish ID generator ────────────────────────────────────────────────────
function genId() {
  return `node_${Math.random().toString(36).slice(2, 9)}`;
}

// ── FlowCanvas ────────────────────────────────────────────────────────────────
export default function FlowCanvas({ flowObj, onNodeSelect, onDeleteNode, onNodesUpdate }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // ── Convert db nodes → ReactFlow nodes ─────────────────────────────────────
  const initialNodes: Node[] = flowObj.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: { x: n.x, y: n.y },
    data: {
      ...n.data,
      label: n.label,
      metrics: n.metrics,
    },
  }));

  // ── Convert db edges → ReactFlow edges ─────────────────────────────────────
  // Edges com gradiente proof-blue → eggshell (F.5 · connector-flow).
  const isActive = flowObj.status === 'active';
  const EDGE_STROKE = 'url(#flow-connector-gradient)';
  const initialEdges: Edge[] = flowObj.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: isActive,
    type: 'smoothstep',
    style: { stroke: isActive ? EDGE_STROKE : 'hsl(var(--eggshell) / 0.10)', strokeWidth: 2 },
    labelStyle: {
      fill: 'hsl(var(--stone))',
      fontSize: 11,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: 'hsl(var(--graphite))',
      fillOpacity: 0.95,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ── Connect handler ─────────────────────────────────────────────────────────
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: isActive,
            style: { stroke: 'hsl(var(--line))', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges, isActive]
  );

  // ── Drop: create new node ───────────────────────────────────────────────────
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow-type');
      if (!nodeType || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      // Convert screen position to flow coordinates
      const position = {
        x: event.clientX - bounds.left - 120,
        y: event.clientY - bounds.top - 40,
      };

      const newNode: Node = {
        id: genId(),
        type: nodeType,
        position,
        data: {
          label: nodeType.replace('_', ' '),
          metrics: { entered: 0, exited: 0, converted: 0, revenue: 0 },
        },
      };

      setNodes((nds) => {
        const updated = [...nds, newNode];
        onNodesUpdate?.(updated);
        return updated;
      });
    },
    [setNodes, onNodesUpdate]
  );

  // ── Node & pane click ───────────────────────────────────────────────────────
  const onNodeClick = useCallback(
    (_evt: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // ── Delete node (called from PropertiesPanel) ───────────────────────────────
  // Expose current nodes via ref so parent can delete
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Handle external delete
  React.useEffect(() => {
    if (!onDeleteNode) return;
    // Attach delete handler to window for cross-component communication
    (window as any).__flowDeleteNode = (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    };
    return () => {
      delete (window as any).__flowDeleteNode;
    };
  }, [setNodes, setEdges, onDeleteNode]);

  return (
    <div ref={reactFlowWrapper} className="canvas-dot-grid" style={{ width: '100%', height: '100%' }}>
      {/* Gradient defs para os edges — proof-blue → eggshell */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <linearGradient id="flow-connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="hsl(var(--proof-blue))" />
            <stop offset="100%" stopColor="hsl(var(--eggshell))" />
          </linearGradient>
        </defs>
      </svg>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        style={{ background: 'transparent' }}
        deleteKeyCode="Delete"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="hsl(var(--eggshell) / 0.14)"
          gap={23}
          size={1}
        />
        <MiniMap
          style={{ background: 'hsl(var(--graphite))' }}
          maskColor="rgba(0,0,0,0.3)"
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
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
            return colorMap[node.type ?? ''] || '#9E9E9E';
          }}
        />
        <Controls
          style={{
            background: 'hsl(var(--iron))',
            border: '1px solid hsl(var(--line))',
          }}
        />
      </ReactFlow>
    </div>
  );
}
