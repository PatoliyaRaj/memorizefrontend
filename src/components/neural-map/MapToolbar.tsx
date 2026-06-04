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
    <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-border-subtle bg-surface-base/95 p-2 md:p-3.5 shadow-lg backdrop-blur-md transition-all hover:border-border-brand/40 w-full max-w-[96vw] md:max-w-none pt-[env(safe-area-inset-top,0.5rem)]">
      {/* Map Stats */}
      <div className="flex items-center gap-2 md:gap-4 border-r border-border-subtle pr-2.5 md:pr-4 shrink-0">
        <div className="flex flex-col">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Mastery</span>
          <div className="flex items-center gap-1 md:gap-2 mt-0.5">
            <span className="text-xs md:text-sm font-extrabold text-primary">{percentMastered}%</span>
            <span className="text-[9px] md:text-[11px] text-text-secondary font-mono">
              ({masteredNodes}/{totalNodes})
            </span>
          </div>
        </div>
        {/* Simple Progress Mini-bar */}
        <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-dim sm:block">
          <div
            className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
            style={{ width: `${percentMastered}%` }}
          />
        </div>
      </div>

      {/* Control Actions (scroll horizontally if very narrow) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
        {/* 1. Add Node */}
        <div className="group relative shrink-0">
          <Button
            type="button"
            onClick={onAddNode}
            className="bg-primary text-on-primary hover:bg-primary/95 transition-all rounded-lg text-xs font-bold p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 shadow-sm"
            aria-label="Add concept node"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[14px]">add</span>
            <span className="hidden md:inline">Add Node</span>
          </Button>
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
            Add Node
          </span>
        </div>

        {/* 2. Grid Layout */}
        <div className="group relative shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onAutoLayout}
            className="border-border-default bg-surface-raised text-text-primary hover:bg-surface-hover hover:text-primary transition-all rounded-lg text-xs p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5"
            aria-label="Align nodes in grid layout"
            title="Auto-organize nodes neatly in rows and columns based on connections"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[14px]">grid_view</span>
            <span className="hidden md:inline">Grid Layout</span>
          </Button>
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
            Grid Layout
          </span>
        </div>

        {/* 3. Tree Layout */}
        <div className="group relative shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onTreeLayout}
            className="border-border-default bg-surface-raised text-text-primary hover:bg-surface-hover hover:text-primary transition-all rounded-lg text-xs p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5"
            aria-label="Align nodes in hierarchical tree layout"
            title="Auto-organize nodes in a hierarchical prerequisite-to-dependent tree layout"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[14px]">schema</span>
            <span className="hidden md:inline">Tree Layout</span>
          </Button>
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
            Tree Layout
          </span>
        </div>

        {/* 4. Reset to Manual */}
        {hasManualHistory && (
          <div className="group relative shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onResetToManual}
              className="border-dashed border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-lg text-xs p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5"
              aria-label="Reset nodes to custom manual positions"
              title="Restore your custom manual drag coordinates"
            >
              <span className="material-symbols-outlined text-[18px] md:text-[14px]">history</span>
              <span className="hidden md:inline">Reset to Manual</span>
            </Button>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
              Reset Layout
            </span>
          </div>
        )}

        {/* 5. Fit View */}
        <div className="group relative shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onFitView}
            className="border-border-default bg-surface-raised text-text-primary hover:bg-surface-hover hover:text-primary transition-all rounded-lg text-xs p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5"
            aria-label="Fit map layout to screen"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[14px]">zoom_out_map</span>
            <span className="hidden md:inline">Fit View</span>
          </Button>
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
            Fit View
          </span>
        </div>

        {/* 6. Toggle Labels */}
        <div className="group relative shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onToggleLabels}
            className={`text-xs p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
              showLabels
                ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                : 'border-border-default bg-surface-raised text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
            aria-label={showLabels ? "Hide relationship labels" : "Show relationship labels"}
          >
            <span className="material-symbols-outlined text-[18px] md:text-[14px]">
              {showLabels ? 'visibility' : 'visibility_off'}
            </span>
            <span className="hidden md:inline">{showLabels ? 'Labels ON' : 'Labels OFF'}</span>
          </Button>
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-inverse-surface border border-outline/20 px-2 py-1 text-[10px] text-inverse-on-surface opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 md:hidden whitespace-nowrap z-50 shadow-md">
            {showLabels ? 'Hide Labels' : 'Show Labels'}
          </span>
        </div>
      </div>
    </div>
  );
}

