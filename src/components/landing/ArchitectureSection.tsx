'use client';

import React from 'react';

export function ArchitectureSection() {
  return (
    <section id="product" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-surface-base relative border-t border-outline-variant/10 bg-grid-schematic overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-base via-transparent to-surface-base pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section header */}
        <div className="mb-10 sm:mb-14 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.ARCH_02</div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary tracking-tight">The Architecture of Learning</h2>
            <p className="font-body-sm text-sm text-text-secondary mt-2 leading-relaxed">Precision tools designed for high-density cognitive tasks.</p>
          </div>
          <div className="hidden sm:block font-data-mono text-[10px] text-outline-variant text-right shrink-0">
            VER: 2.4.1<br />STATUS: OPTIMAL
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {/* Neural Maps — full width on mobile, 8-col on desktop */}
          <div className="md:col-span-8 md:row-span-2 bg-surface-raised border border-outline-variant/30 rounded-xl p-5 sm:p-6 md:p-8 flex flex-col hover:border-primary/50 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-display text-text-primary text-lg sm:text-xl tracking-tight">Neural Maps</h3>
              <div className="flex items-center gap-2">
                <span className="font-data-mono text-[10px] text-outline-variant border border-outline-variant/50 px-2 py-0.5 rounded">ID: MAP-01</span>
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl group-hover:rotate-12 transition-transform duration-500">hub</span>
              </div>
            </div>
            <p className="font-body-base text-sm sm:text-base text-text-secondary mb-6 relative z-10 leading-relaxed">
              Visualizing connections between disparate concepts to build robust semantic networks and identify knowledge gaps in real-time.
            </p>
            {/* Abstract visual */}
            <div className="mt-auto h-44 sm:h-56 md:h-64 relative border border-outline-variant/20 rounded-lg bg-surface-void flex items-center justify-center overflow-hidden">
              <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface-void to-surface-void" />
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/4 animate-float-1"><div className="w-3 h-3 bg-mastery-mastered rounded-full shadow-[0_0_12px_#134E4A]" /></div>
                <div className="absolute top-1/2 left-1/2 animate-float-2 z-10"><div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_16px_#6bd8cb] animate-pulse" /></div>
                <div className="absolute bottom-1/3 right-1/4 animate-float-3"><div className="w-3 h-3 bg-mastery-strong rounded-full shadow-[0_0_12px_#0A2A20]" /></div>
                <div className="absolute top-2/3 left-1/3 animate-float-4"><div className="w-2 h-2 bg-mastery-learning rounded-full" /></div>
                <div className="absolute top-1/3 right-1/3 animate-float-5"><div className="w-2 h-2 bg-mastery-weak rounded-full" /></div>
                <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
                  <line className="animate-data-stream" stroke="#6bd8cb" strokeWidth="1" x1="25%" x2="50%" y1="25%" y2="50%" />
                  <line className="animate-data-stream" stroke="#6bd8cb" strokeWidth="1" x1="50%" x2="75%" y1="50%" y2="66%" />
                  <line stroke="#3d4947" strokeWidth="1" x1="25%" x2="33%" y1="25%" y2="66%" />
                  <line stroke="#6bd8cb" strokeWidth="0.5" x1="50%" x2="33%" y1="50%" y2="66%" />
                  <line stroke="#3d4947" strokeWidth="1" x1="50%" x2="66%" y1="50%" y2="33%" />
                </svg>
              </div>
            </div>
          </div>

          {/* Retention Engine — full width on mobile, 4-col on desktop */}
          <div className="md:col-span-4 bg-surface-raised border border-outline-variant/30 rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-primary/50 transition-colors duration-300 relative group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base sm:text-lg text-text-primary tracking-tight">Retention Engine</h3>
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <p className="font-body-sm text-sm text-text-secondary leading-relaxed">Spaced repetition precision.</p>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center py-4 border border-outline-variant/20 rounded-lg bg-surface-base group-hover:border-primary/30 transition-colors duration-300">
              <div className="font-data-mono text-3xl font-bold text-primary mb-1">98.4%</div>
              <div className="font-data-mono text-[10px] text-text-secondary uppercase tracking-widest">Recall Rate</div>
            </div>
            <div className="mt-3 w-full bg-surface-container rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-full w-[98.4%] rounded-full shadow-[0_0_8px_#6bd8cb] origin-left group-hover:scale-x-[1.01] transition-transform duration-500" />
            </div>
          </div>

          {/* Deep Focus */}
          <div className="md:col-span-4 bg-surface-raised border border-outline-variant/30 rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-primary/50 transition-colors duration-300 relative group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base sm:text-lg text-text-primary tracking-tight">Deep Focus</h3>
                <span className="material-symbols-outlined text-primary">target</span>
              </div>
              <p className="font-body-sm text-sm text-text-secondary leading-relaxed">Distraction-free environment.</p>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center py-6 border border-outline-variant/20 rounded-lg bg-surface-base relative overflow-hidden group-hover:border-primary/30 transition-colors duration-300">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-outline-variant text-3xl mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300">visibility_off</span>
              <div className="font-data-mono text-[10px] text-text-secondary uppercase tracking-widest text-center group-hover:text-primary/80 transition-colors duration-300">Isolate Mode<br />Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
