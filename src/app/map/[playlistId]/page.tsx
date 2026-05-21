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
import { getNodesByPlaylist, patchNodePosition, VisualNode } from '@/services/nodes-service'
import { getEdgesByPlaylist, createEdge } from '@/services/edges-service'
import NodeSidebar from '../../../components/neural-map/NodeSidebar'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'

const nodeTypes = { concept: ConceptNodes }

function mapMasteryToColor(level: VisualNode['mastery_level']){
  switch(level){
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

function MapCanvas(){
  const params = useParams()
  const playlistId = params?.playlistId as string
  const { screenToFlowPosition, getViewport } = useReactFlow()
  const [sidebarState, setSidebarState] = useState<SidebarState | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [nodeDraft, setNodeDraft] = useState<NodeDraft>(initialDraft)

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([] as Node[])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([] as Edge[])
  const saveTimers = useRef<Record<string, any>>({})

  useEffect(()=>{
    if(!playlistId) return
    let mounted = true
    Promise.all([getNodesByPlaylist(playlistId), getEdgesByPlaylist(playlistId)])
      .then(([nodes, edges]) => {
        if(!mounted) return
        const mapped = nodes.map((n: VisualNode) : Node => ({
          id: n.id,
          type: 'concept',
          position: { x: n.pos_x || 0, y: n.pos_y || 0 },
          data: { label: n.title, masteryLevel: n.mastery_level, isMastered: n.mastery_level==='mastered' }
        }))
        const mappedEdges = edges.map((e:any): Edge => ({ 
          id: e.id, 
          source: e.source, 
          target: e.target, 
          sourceHandle: e.sourceHandle || null,
          targetHandle: e.targetHandle || null,
          animated: true, 
          style: { stroke: 'var(--border-brand)', strokeWidth: 2 } 
        }))
        setRfNodes(mapped)
        setRfEdges(mappedEdges)
      })
      .catch(()=> toastError('Failed to load map data.'))
    return ()=>{
      mounted=false
      Object.values(saveTimers.current).forEach((timer) => {
        if (timer) window.clearTimeout(timer)
      })
    }
  },[playlistId, setRfEdges, setRfNodes])

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

  const onNodeClick = useCallback((evt:any, node:Node)=>{
    setContextMenu(null)
    setSidebarState({ mode: 'view', nodeId: node.id })
  }, [])

  const onConnect = useCallback(async (params: Connection | Edge)=>{
    // optimistic UI add
    const newEdge = addEdge({
      ...params,
      animated: true,
      style: { stroke: 'var(--border-brand)', strokeWidth: 2 }
    } as any, rfEdges)
    setRfEdges(newEdge)
    try{
      const payload = { 
        source: (params as any).source, 
        target: (params as any).target, 
        sourceHandle: (params as any).sourceHandle,
        targetHandle: (params as any).targetHandle,
        edge_type: 'prerequisite_of' 
      }
      const created = await createEdge(payload)
      // replace temp edge id if backend returns id
      setRfEdges((eds)=>eds.map((ed)=> ed.id === (params as any).id ? ({...ed, id: created.id, sourceHandle: created.sourceHandle, targetHandle: created.targetHandle}) : ed))
    }catch(e){
      console.error(e)
    }
  }, [rfEdges])

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
        nodeTypes={nodeTypes}
        fitView
        panOnDrag
      >
        <Panel position="top-left" className="pointer-events-auto">
          <div className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-overlay/90 p-2 shadow-lg backdrop-blur-md">
            <Button type="button" onClick={openCreateAtViewportCenter} className="bg-primary text-on-primary hover:bg-primary-fixed-dim">
              + Add Node
            </Button>
            <Button type="button" variant="outline" onClick={() => setContextMenu(null)} className="border-outline-variant/40 bg-surface-base/70 text-text-primary hover:bg-surface-container">
              Close Menu
            </Button>
          </div>
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
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-container"
            onClick={() => openCreateSidebar(contextMenu.flowPosition)}
          >
            <span className="material-symbols-outlined text-primary">add</span>
            Add node here
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-container"
            onClick={openCreateAtViewportCenter}
          >
            <span className="material-symbols-outlined text-primary">center_focus_strong</span>
            Add node at center
          </button>
        </div>
      )}

      <NodeSidebar
        playlistId={playlistId}
        nodeId={sidebarNodeId}
        createPosition={createPosition}
        mode={sidebarState?.mode ?? null}
        onClose={closeSidebar}
        onCreated={(node: VisualNode) => {
          setRfNodes((current) => [...current, {
            id: node.id,
            type: 'concept',
            position: { x: node.pos_x || 0, y: node.pos_y || 0 },
            data: { label: node.title, masteryLevel: node.mastery_level, isMastered: node.mastery_level === 'mastered' },
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

export default function MapPage(){
  return (
    <ReactFlowProvider>
      <MapCanvas />
    </ReactFlowProvider>
  )
}
