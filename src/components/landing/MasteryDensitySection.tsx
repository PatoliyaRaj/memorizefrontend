'use client';

import React from 'react';

export function MasteryDensitySection() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-base border-t border-b border-outline-variant/10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-xl items-center relative z-10 reveal-target is-revealed">
        {/* Logos */}
        <div>
          <h3 className="font-data-mono text-xs text-text-secondary uppercase tracking-widest mb-md flex items-center gap-2">
            <span className="w-8 h-px bg-outline-variant"></span>
            Trusted by top cognitive programs
          </h3>
          <div className="flex flex-wrap gap-lg opacity-60 mix-blend-screen hover:opacity-80 transition-opacity duration-300">
            <div className="font-display font-bold text-xl md:text-2xl text-primary tracking-tight leading-tight uppercase">
              Proprietary FSRS Algorithms & Neural-Spaced Protocols
            </div>
          </div>
        </div>
        {/* Heatmap Visualization */}
        <div className="bg-surface-raised border border-outline-variant/20 rounded-xl p-md hover:border-primary/30 hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-sm">
            <h4 className="font-data-mono text-xs text-text-secondary uppercase tracking-widest">Mastery Heatmap</h4>
            <div className="flex items-center gap-2">
              <span className="font-data-mono text-[10px] text-outline-variant">UP: 99.9%</span>
              <span className="font-data-mono text-[10px] text-primary">Last 30 Days</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Row 1 */}
            <div className="w-full aspect-square rounded-[2px] bg-surface-void hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-weak hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-learning hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-strong hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-mastered hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-primary/80 hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-primary hover:shadow-[0_0_12px_#6bd8cb] hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            {/* Row 2 */}
            <div className="w-full aspect-square rounded-[2px] bg-mastery-weak hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-surface-void hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-learning hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-mastered hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-strong hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-primary/90 hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-mastered hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            {/* Row 3 */}
            <div className="w-full aspect-square rounded-[2px] bg-mastery-learning hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-weak hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-strong hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-primary/60 hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-mastery-mastered hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-primary/40 hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
            <div className="w-full aspect-square rounded-[2px] bg-surface-void hover:border hover:border-primary/50 hover:scale-110 transition-transform duration-200 cursor-crosshair"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
