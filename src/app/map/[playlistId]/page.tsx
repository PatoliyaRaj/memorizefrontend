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
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell'
import { getNodesByPlaylist, patchNodePosition, VisualNode } from '@/services/nodes-service'
import { getEdgesByPlaylist, createEdge, deleteEdge, updateEdge } from '@/services/edges-service'
import NodeSidebar from '../../../components/neural-map/NodeSidebar'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [editingEdge, setEditingEdge] = useState<{ id: string; edgeType: string; label: string } | null>(null)

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
          label: e.label || undefined,
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
      type: showLabels ? 'relational' : 'default',
      data: { edgeType: 'prerequisite_of' },
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
          type: showLabels ? 'relational' : 'default',
          label: created.label || undefined,
          data: { edgeType: created.edge_type || 'prerequisite_of' },
        }) : ed))
      }
    } catch (e) {
      console.error(e)
    }
  }, [rfEdges, showLabels])

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

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    event.stopPropagation();
    const type = (edge.data?.edgeType || 'prerequisite_of') as string;
    const label = (edge.label || '') as string;
    setEditingEdge({
      id: edge.id,
      edgeType: type,
      label: label,
    });
  }, []);

  const handleUpdateEdge = async () => {
    if (!editingEdge) return;
    try {
      const updated = await updateEdge(editingEdge.id, {
        edge_type: editingEdge.edgeType,
        label: editingEdge.label.trim(),
      });

      setRfEdges((eds) =>
        eds.map((ed) =>
          ed.id === editingEdge.id
            ? {
                ...ed,
                label: updated.label || undefined,
                data: { edgeType: updated.edge_type || 'prerequisite_of' },
              }
            : ed
        )
      );

      toastSuccess('Connection updated.');
      setEditingEdge(null);
    } catch (err) {
      toastError('Failed to update connection.');
    }
  };

  const handleDeleteEdge = async () => {
    if (!editingEdge) return;
    if (window.confirm("Remove this connection wire?")) {
      try {
        await deleteEdge(editingEdge.id);
        setRfEdges((eds) => eds.filter((e) => e.id !== editingEdge.id));
        toastSuccess("Connection removed.");
        setEditingEdge(null);
      } catch (err) {
        toastError("Failed to remove connection.");
      }
    }
  };

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
    <div
      className="h-[calc(100%+2rem)] md:h-[calc(100%+2.5rem)] lg:h-[calc(100%+3rem)] w-[calc(100%+2rem)] md:w-[calc(100%+2.5rem)] lg:w-[calc(100%+3rem)] -m-4 md:-m-5 lg:-m-6 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <div className="relative h-full w-full">
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
          panOnDrag={true}
          panOnScroll={false}
          zoomOnPinch={true}
          preventScrolling={true}
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
          <Controls className="!hidden md:!flex" />
          <MiniMap
            className="!hidden md:!block"
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

        {editingEdge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border-default bg-[#0B1210]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-text-primary space-y-5 flex flex-col font-body transform animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-border-default pb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">Edit Connection Wire</h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-text-secondary mt-0.5">Configure Neural Relationship</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingEdge(null)}
                  className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Connection Type</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'prerequisite_of', label: 'Prerequisite', color: 'border-teal-500/20 text-teal-300 bg-teal-500/10' },
                      { type: 'leads_to', label: 'Leads To', color: 'border-amber-500/20 text-amber-300 bg-amber-500/10' },
                      { type: 'related_to', label: 'Related To', color: 'border-indigo-500/20 text-indigo-300 bg-indigo-500/10' },
                      { type: 'example_of', label: 'Example Of', color: 'border-emerald-500/20 text-emerald-300 bg-emerald-500/10' },
                      { type: 'exception_to', label: 'Exception To', color: 'border-rose-500/20 text-rose-300 bg-rose-500/10' },
                      { type: 'part_of', label: 'Part Of', color: 'border-sky-500/20 text-sky-300 bg-sky-500/10' },
                    ].map((opt) => {
                      const isSelected = editingEdge.edgeType === opt.type;
                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setEditingEdge(prev => prev ? { ...prev, edgeType: opt.type } : null)}
                          className={cn(
                            'px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all outline-none focus:ring-1 focus:ring-teal-500/30',
                            isSelected
                              ? `${opt.color} border-current shadow-[0_0_10px_rgba(20,184,166,0.1)] scale-102 font-bold`
                              : 'bg-[#060A09] border-border-default text-text-secondary hover:text-text-primary hover:border-border-subtle'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="grid gap-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#9BBFBB]">Custom Label (Optional)</span>
                  <input
                    type="text"
                    value={editingEdge.label}
                    onChange={(e) => setEditingEdge(prev => prev ? { ...prev, label: e.target.value } : null)}
                    placeholder="E.g. exception details, strength note..."
                    className="w-full h-10 px-3 rounded-xl border border-border-default bg-[#060A09] text-sm text-text-primary outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 placeholder:text-text-tertiary/60"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleDeleteEdge}
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10 h-10 rounded-xl"
                >
                  Delete Connection
                </Button>
                <Button
                  onClick={handleUpdateEdge}
                  className="flex-1 bg-[#14B8A6] text-black hover:bg-[#2DD4BF] font-bold h-10 rounded-xl"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <ReactFlowProvider>
      <DashboardShell>
        <MapCanvas />
      </DashboardShell>
    </ReactFlowProvider>
  )
}
