'use client';

import React from 'react';
import { EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

export default function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeType = (data?.edgeType || 'prerequisite_of') as string;
  
  // Format labels nicely
  const getReadableLabel = (type: string) => {
    switch (type) {
      case 'prerequisite_of':
        return 'Prerequisite';
      case 'leads_to':
        return 'Leads To';
      case 'related_to':
        return 'Related';
      case 'part_of':
        return 'Part Of';
      default:
        return 'Connects';
    }
  };

  const labelText = getReadableLabel(edgeType);

  // Map label styles
  const getLabelColors = (type: string) => {
    switch (type) {
      case 'prerequisite_of':
        return 'bg-[#0f172a]/95 text-[#6bd8cb] border-[#6bd8cb]/30 shadow-[0_0_10px_rgba(107,216,203,0.15)]';
      case 'leads_to':
        return 'bg-[#0f172a]/95 text-amber-400 border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      default:
        return 'bg-[#0f172a]/95 text-slate-300 border-slate-700/50';
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeType === 'prerequisite_of' ? 'rgba(107, 216, 203, 0.65)' : 'rgba(148, 163, 184, 0.4)',
          strokeWidth: 2.5,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105 ${getLabelColors(
              edgeType
            )}`}
          >
            <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
            {labelText}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
