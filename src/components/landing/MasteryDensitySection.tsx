'use client';

import React from 'react';

export function MasteryDensitySection() {
  const heatmapCells = [
    // Row 1
    'bg-surface-void', 'bg-mastery-weak', 'bg-mastery-learning', 'bg-mastery-strong', 'bg-mastery-mastered', 'bg-primary/80', 'bg-primary',
    // Row 2
    'bg-mastery-weak', 'bg-surface-void', 'bg-mastery-learning', 'bg-mastery-mastered', 'bg-mastery-strong', 'bg-primary/90', 'bg-mastery-mastered',
    // Row 3
    'bg-mastery-learning', 'bg-mastery-weak', 'bg-mastery-strong', 'bg-primary/60', 'bg-mastery-mastered', 'bg-primary/40', 'bg-surface-void',
  ]

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-surface-base border-t border-b border-outline-variant/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center relative z-10">
        {/* Text side */}
        <div>
          <h3 className="font-data-mono text-xs text-text-secondary uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-outline-variant" />
            Trusted by top cognitive programs
          </h3>
          <div className="opacity-70 hover:opacity-90 transition-opacity duration-300">
            <p className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-primary tracking-tight leading-tight uppercase">
              Proprietary FSRS Algorithms &amp; Neural-Spaced Protocols
            </p>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-surface-raised border border-outline-variant/20 rounded-xl p-4 sm:p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-data-mono text-xs text-text-secondary uppercase tracking-widest">Mastery Heatmap</h4>
            <div className="flex items-center gap-2">
              <span className="font-data-mono text-[10px] text-outline-variant">UP: 99.9%</span>
              <span className="font-data-mono text-[10px] text-primary">Last 30 Days</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {heatmapCells.map((bg, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-[2px] ${bg} hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
