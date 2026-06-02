'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type MapToolbarProps = {
  totalNodes: number;
  masteredNodes: number;
  onAutoLayout: () => void;
  onTreeLayout: () => void;
  onResetToManual: () => void;
  hasManualHistory: boolean;
  onFitView: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onAddNode: () => void;
};

export default function MapToolbar({
  totalNodes,
  masteredNodes,
  onAutoLayout,
  onTreeLayout,
  onResetToManual,
  hasManualHistory,
  onFitView,
  showLabels,
  onToggleLabels,
  onAddNode,
}: MapToolbarProps) {
  const percentMastered = totalNodes > 0 ? Math.round((masteredNodes / totalNodes) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0b111e]/95 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:border-[#6bd8cb]/20 md:flex-nowrap">
      {/* Map Stats */}
      <div className="flex items-center gap-4 border-r border-slate-800 pr-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mastery Progress</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-[#6bd8cb]">{percentMastered}%</span>
            <span className="text-[11px] text-slate-400">
              ({masteredNodes}/{totalNodes} nodes)
            </span>
          </div>
        </div>
        {/* Simple Progress Mini-bar */}
        <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-[#6bd8cb] transition-all duration-500"
            style={{ width: `${percentMastered}%` }}
          />
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={onAddNode}
          className="bg-primary text-on-primary hover:bg-[#6bd8cb] hover:text-[#0b111e] transition-all rounded-lg text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(107,216,203,0.15)]"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Add Node
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onAutoLayout}
          className="border-slate-800 bg-[#0f172a]/60 text-slate-300 hover:bg-[#1e293b] hover:text-white transition-all rounded-lg text-xs px-3 py-1.5 flex items-center gap-1.5"
          title="Auto-organize nodes neatly in rows and columns based on connections"
        >
          <span className="material-symbols-outlined text-[14px]">grid_view</span>
          Grid Layout
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onTreeLayout}
          className="border-slate-800 bg-[#0f172a]/60 text-slate-300 hover:bg-[#1e293b] hover:text-white transition-all rounded-lg text-xs px-3 py-1.5 flex items-center gap-1.5"
          title="Auto-organize nodes in a hierarchical prerequisite-to-dependent tree layout"
        >
          <span className="material-symbols-outlined text-[14px]">schema</span>
          Tree Layout
        </Button>

        {hasManualHistory && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetToManual}
            className="border-dashed border-teal-500/30 bg-teal-950/20 text-[#6bd8cb] hover:bg-teal-950/40 transition-all rounded-lg text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="Restore your custom manual drag coordinates"
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            Reset to Manual
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onFitView}
          className="border-slate-800 bg-[#0f172a]/60 text-slate-300 hover:bg-[#1e293b] hover:text-white transition-all rounded-lg text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[14px]">zoom_out_map</span>
          Fit View
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onToggleLabels}
          className={`border-slate-800 text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg transition-all ${
            showLabels
              ? 'bg-[#6bd8cb]/10 border-[#6bd8cb]/30 text-[#6bd8cb] hover:bg-[#6bd8cb]/20'
              : 'bg-[#0f172a]/60 text-slate-400 hover:bg-[#1e293b] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {showLabels ? 'visibility' : 'visibility_off'}
          </span>
          {showLabels ? 'Labels ON' : 'Labels OFF'}
        </Button>
      </div>
    </div>
  );
}
