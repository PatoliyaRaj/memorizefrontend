'use client'

import { useState, useCallback, use } from 'react';
import {
    ReactFlow,
    Background,
    Connection,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Edge,
    Node,
    
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import  ConceptNodes  from '@/components/neural-map/ConceptNode';

const nodeTypes = {
    concept: ConceptNodes,
}

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'concept',
        data: { label: 'Concept 1', color: '#FFCC00', isMastered: true },
        position: { x: 100, y: 100 },

    },
    {
        id: '2',
        type: 'concept',
        data: { label: 'Concept 2', color: '#FF6600', isMastered: false },
        position: { x: 300, y: 100 },
    }
]

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
]


const NeuralMap = () => {
    const [nodes,setNodes,onNodesChange] = useNodesState(initialNodes);
    const [edges,setEdges,onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params:Connection | Edge)=>(
        setEdges((eds)=>addEdge(params, eds))
    ), [setEdges]);

  return (
    <div className="w-full h-[100vh] bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView 
      >
        <Background gap={16} size={1} /> 
        <Controls /> 
        <MiniMap /> 
      </ReactFlow>
    </div>
  )
}

export default NeuralMap