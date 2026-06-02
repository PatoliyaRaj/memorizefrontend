"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ConceptNodes from '@/components/neural-map/ConceptNode'
import RelationshipEdge from '@/components/neural-map/RelationshipEdge'
import MapToolbar from '@/components/neural-map/MapToolbar'
import MasteryLegend from '@/components/neural-map/MasteryLegend'
import { getNodesByPlaylist, patchNodePosition, VisualNode } from '@/services/nodes-service'
import { getEdgesByPlaylist, createEdge, deleteEdge } from '@/services/edges-service'
import NodeSidebar from '../../../components/neural-map/NodeSidebar'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'

const nodeTypes = { concept: ConceptNodes }
const edgeTypes = { relational: RelationshipEdge }

function mapMasteryToColor(level: VisualNode['mastery_level']) {
  switch (level) {
    case 'unseen': return '#94a3b8' // gray
    case 'weak': return '#fb7185' // coral
    case 'learning': return '#f59e0b' // amber
    case 'strong': return '#0ea5a4' // teal
    case 'mastered': return '#065f46' // dark-teal
    default: return '#ffffff'
  }
}

type SidebarState =
  | { mode: 'view'; nodeId: string }
  | { mode: 'create'; position: { x: number; y: number } }

type ContextMenuState = {
  x: number
  y: number
  flowPosition: { x: number; y: number }
} | null

type NodeDraft = {
  title: string
  nodeType: 'concept' | 'definition' | 'formula' | 'process' | 'example' | 'exception'
  orderIndex: number
  posX: number
  posY: number
}

const initialDraft: NodeDraft = {
  title: '',
  nodeType: 'concept',
  orderIndex: 0,
  posX: 0,
  posY: 0,
}

function MapCanvas() {
  const params = useParams()
  const playlistId = params?.playlistId as string
  const { screenToFlowPosition, getViewport, fitView } = useReactFlow()
  const [sidebarState, setSidebarState] = useState<SidebarState | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [nodeDraft, setNodeDraft] = useState<NodeDraft>(initialDraft)
  const [showLabels, setShowLabels] = useState(true)

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([] as Node[])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([] as Edge[])
  const saveTimers = useRef<Record<string, any>>({})

  useEffect(() => {
    if (!playlistId) return
    let mounted = true
    Promise.all([getNodesByPlaylist(playlistId), getEdgesByPlaylist(playlistId)])
      .then(([nodes, edges]) => {
        if (!mounted) return
        const mapped = nodes.map((n: VisualNode): Node => {
          const mastery = n.masteryLevel ?? n.mastery_level ?? 'unseen'
          return {
            id: n.id,
            type: 'concept',
            position: {
              x: n.posX !== undefined ? n.posX : (n.pos_x !== undefined ? n.pos_x : 0),
              y: n.posY !== undefined ? n.posY : (n.pos_y !== undefined ? n.pos_y : 0)
            },
            data: {
              label: n.title,
              masteryLevel: mastery,
              isMastered: mastery === 'mastered'
            }
          }
        })
        const mappedEdges = edges.map((e: any): Edge => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || null,
          targetHandle: e.targetHandle || null,
          animated: true,
          type: showLabels ? 'relational' : 'default',
          data: { edgeType: e.edgeType || e.edge_type || 'prerequisite_of' },
          style: { stroke: 'var(--border-brand)', strokeWidth: 2.5 }
        }))
        setRfNodes(mapped)
        setRfEdges(mappedEdges)
      })
      .catch(() => toastError('Failed to load map data.'))
    return () => {
      mounted = false
      Object.values(saveTimers.current).forEach((timer) => {
        if (timer) window.clearTimeout(timer)
      })
    }
  }, [playlistId, setRfEdges, setRfNodes, showLabels])

  const openCreateSidebar = useCallback((position: { x: number; y: number }) => {
    setNodeDraft((current) => ({
      ...current,
      posX: Math.round(position.x),
      posY: Math.round(position.y),
    }))
    setSidebarState({ mode: 'create', position })
    setContextMenu(null)
  }, [])

  const openCreateAtViewportCenter = useCallback(() => {
    const viewport = getViewport()
    const position = { x: Math.round(-viewport.x / viewport.zoom + 220), y: Math.round(-viewport.y / viewport.zoom + 140) }
    openCreateSidebar(position)
  }, [getViewport, openCreateSidebar])

  const closeSidebar = useCallback(() => {
    setSidebarState(null)
    setNodeDraft(initialDraft)
  }, [])

  const onPaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault()
    const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    setContextMenu({ x: event.clientX, y: event.clientY, flowPosition })
  }, [screenToFlowPosition])

  const onPaneClick = useCallback(() => {
    setContextMenu(null)
  }, [])

  const onNodeDragStop = useCallback(async (_: any, node: Node) => {
    const { x, y } = node.position

    if (saveTimers.current[node.id]) {
      window.clearTimeout(saveTimers.current[node.id])
    }

    saveTimers.current[node.id] = window.setTimeout(() => {
      patchNodePosition(node.id, Math.round(x), Math.round(y)).catch(() => {
        toastError('Failed to save node position.')
      })
    }, 1000)
  }, [])

  const onNodeClick = useCallback((evt: any, node: Node) => {
    setContextMenu(null)
    setSidebarState({ mode: 'view', nodeId: node.id })
  }, [])

  const onConnect = useCallback(async (params: Connection | Edge) => {
    // optimistic UI add
    const newEdge = addEdge({
      ...params,
      animated: true,
      style: { stroke: 'var(--border-brand)', strokeWidth: 2 }
    } as any, rfEdges)
    const tempEdgeId = newEdge[newEdge.length - 1]?.id
    setRfEdges(newEdge)
    try {
      const payload = {
        source: (params as any).source,
        target: (params as any).target,
        sourceHandle: (params as any).sourceHandle,
        targetHandle: (params as any).targetHandle,
        edge_type: 'prerequisite_of'
      }
      const created = await createEdge(payload)
      // replace the optimistic React Flow edge id with the database UUID
      if (tempEdgeId) {
        setRfEdges((eds) => eds.map((ed) => ed.id === tempEdgeId ? ({
          ...ed,
          id: created.id,
          sourceHandle: created.sourceHandle,
          targetHandle: created.targetHandle,
        }) : ed))
      }
    } catch (e) {
      console.error(e)
    }
  }, [rfEdges])

  const onEdgesDelete = useCallback(async (edgesToDelete: Edge[]) => {
    for (const edge of edgesToDelete) {
      try {
        await deleteEdge(edge.id)
        toastSuccess('Connection removed.')
      } catch (error) {
        toastError('Failed to remove connection from database.')
      }
    }
  }, [])

  const onEdgeClick = useCallback(async (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    if (window.confirm("Remove this connection wire?")) {
      try {
        await deleteEdge(edge.id)
        setRfEdges((eds) => eds.filter((e) => e.id !== edge.id))
        toastSuccess("Connection removed.")
      } catch (e) {
        toastError("Failed to remove connection.")
      }
    }
  }, [setRfEdges])

  const [manualPositions, setManualPositions] = useState<Record<string, { x: number; y: number }> | null>(null);

  const cacheManualPositions = useCallback((nodes: Node[]) => {
    setManualPositions((current) => {
      if (current) return current;
      const cache: Record<string, { x: number; y: number }> = {};
      nodes.forEach((n) => {
        cache[n.id] = { ...n.position };
      });
      return cache;
    });
  }, []);

  const handleAutoLayout = useCallback(() => {
    const cols = 4;
    const xSpacing = 280;
    const ySpacing = 180;
    
    setRfNodes((nodes) => {
      if (nodes.length === 0) return nodes;
      cacheManualPositions(nodes);
      
      const sortedNodes = [...nodes].sort((a, b) => {
        const idxA = Number(a.data?.orderIndex ?? 0);
        const idxB = Number(b.data?.orderIndex ?? 0);
        return idxA - idxB;
      });
      
      const updated = sortedNodes.map((n, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const newX = col * xSpacing;
        const newY = row * ySpacing;
        
        patchNodePosition(n.id, newX, newY).catch(() => {});
        
        return {
          ...n,
          position: { x: newX, y: newY },
        };
      });
      
      toastSuccess('Nodes aligned neatly in grid layout.');
      return updated;
    });
  }, [setRfNodes, cacheManualPositions]);

  const handleTreeLayout = useCallback(() => {
    const xSpacing = 320;
    const ySpacing = 200;

    setRfNodes((nodes) => {
      if (nodes.length === 0) return nodes;
      cacheManualPositions(nodes);

      const allNodeIds = nodes.map(n => n.id);

      // Compute depths recursively based on prerequisite connections (source -> target)
      const depthMap: Record<string, number> = {};
      
      const computeDepth = (id: string, visited: Set<string>): number => {
        if (depthMap[id] !== undefined) return depthMap[id];
        if (visited.has(id)) return 0; // Avoid cyclic loops

        visited.add(id);
        
        const prereqs = rfEdges.filter(e => e.target === id && allNodeIds.includes(e.source));
        if (prereqs.length === 0) {
          depthMap[id] = 0;
        } else {
          let maxPrereqDepth = 0;
          prereqs.forEach(e => {
            maxPrereqDepth = Math.max(maxPrereqDepth, computeDepth(e.source, new Set(visited)));
          });
          depthMap[id] = 1 + maxPrereqDepth;
        }
        
        return depthMap[id];
      };

      allNodeIds.forEach(id => {
        computeDepth(id, new Set());
      });

      // Group nodes by depth column
      const depthGroups: Record<number, string[]> = {};
      allNodeIds.forEach(id => {
        const d = depthMap[id] || 0;
        if (!depthGroups[d]) depthGroups[d] = [];
        depthGroups[d].push(id);
      });

      // Align nodes in columns from left to right
      const updated = nodes.map(n => {
        const d = depthMap[n.id] || 0;
        const group = depthGroups[d];
        const idx = group.indexOf(n.id);
        const N = group.length;

        const newX = d * xSpacing;
        const newY = (idx - (N - 1) / 2) * ySpacing;

        patchNodePosition(n.id, newX, Math.round(newY)).catch(() => {});

        return {
          ...n,
          position: { x: newX, y: Math.round(newY) },
        };
      });

      toastSuccess('Prerequisite dependency tree auto-layout applied.');
      return updated;
    });
  }, [rfEdges, setRfNodes, cacheManualPositions]);

  const handleResetToManual = useCallback(() => {
    if (!manualPositions) return;

    setRfNodes((nodes) => {
      const updated = nodes.map(n => {
        const pos = manualPositions[n.id];
        if (pos) {
          patchNodePosition(n.id, pos.x, pos.y).catch(() => {});
          return {
            ...n,
            position: { x: pos.x, y: pos.y }
          };
        }
        return n;
      });

      toastSuccess('Manual node layout restored.');
      return updated;
    });

    setManualPositions(null);
  }, [manualPositions, setRfNodes]);

  const sidebarNodeId = sidebarState?.mode === 'view' ? sidebarState.nodeId : null
  const createPosition = sidebarState?.mode === 'create' ? sidebarState.position : null

  return (
    <div className="relative h-[calc(100vh-64px)] w-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onEdgesDelete={onEdgesDelete}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        panOnDrag
      >
        <Panel position="top-center" className="pointer-events-auto">
          <MapToolbar
            totalNodes={rfNodes.length}
            masteredNodes={rfNodes.filter(n => n.data?.masteryLevel === 'mastered').length}
            onAutoLayout={handleAutoLayout}
            onTreeLayout={handleTreeLayout}
            onResetToManual={handleResetToManual}
            hasManualHistory={manualPositions !== null}
            onFitView={() => fitView({ duration: 800 })}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(prev => !prev)}
            onAddNode={openCreateAtViewportCenter}
          />
        </Panel>
        <Panel position="bottom-left" className="pointer-events-auto select-none">
          <MasteryLegend />
        </Panel>
        <Background gap={16} size={1} color="var(--border-default)" />
        <Controls />
        <MiniMap
          nodeColor={(n: any) => {
            const mastery = n.data?.masteryLevel || 'unseen';
            return `var(--mastery-${mastery}-text)`;
          }}
          bgColor="var(--surface-base)"
          maskColor="var(--surface-void)"
        />
      </ReactFlow>

      {contextMenu && (
        <div
          className="fixed z-60 min-w-48 rounded-xl border border-outline-variant/40 bg-surface-base/95 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <Button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-container"
            onClick={() => openCreateSidebar(contextMenu.flowPosition)}
          >
            <span className="material-symbols-outlined text-primary">add</span>
            Add node here
          </Button>
          <Button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-container"
            onClick={openCreateAtViewportCenter}
          >
            <span className="material-symbols-outlined text-primary">center_focus_strong</span>
            Add node at center
          </Button>
        </div>
      )}

      <NodeSidebar
        playlistId={playlistId}
        nodeId={sidebarNodeId}
        createPosition={createPosition}
        mode={sidebarState?.mode ?? null}
        onClose={closeSidebar}
        onCreated={(node: VisualNode) => {
          const mastery = node.masteryLevel ?? node.mastery_level ?? 'unseen'
          setRfNodes((current) => [...current, {
            id: node.id,
            type: 'concept',
            position: {
              x: node.posX !== undefined ? node.posX : (node.pos_x !== undefined ? node.pos_x : 0),
              y: node.posY !== undefined ? node.posY : (node.pos_y !== undefined ? node.pos_y : 0)
            },
            data: {
              label: node.title,
              masteryLevel: mastery,
              isMastered: mastery === 'mastered'
            },
          }])
          setSidebarState({ mode: 'view', nodeId: node.id })
        }}
        onUpdated={(id, updates) => {
          setRfNodes((nodes) =>
            nodes.map((n) =>
              n.id === id
                ? {
                  ...n,
                  data: {
                    ...n.data,
                    label: updates.title ?? n.data.label,
                    masteryLevel: updates.mastery_level ?? n.data.masteryLevel,
                    isMastered: updates.mastery_level === 'mastered',
                  },
                }
                : n
            )
          )
        }}
        onDeleted={(id) => {
          setRfNodes((nodes) => nodes.filter((n) => n.id !== id))
          setRfEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id))
          closeSidebar()
        }}
      />
    </div>
  )
}

export default function MapPage() {
  return (
    <ReactFlowProvider>
      <MapCanvas />
    </ReactFlowProvider>
  )
}
