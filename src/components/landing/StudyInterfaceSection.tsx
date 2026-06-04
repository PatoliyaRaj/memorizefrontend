'use client';

import React from 'react';

export function StudyInterfaceSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-surface-void relative border-t border-outline-variant/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,90vw)] h-[min(600px,90vw)] bg-[radial-gradient(circle,rgba(107,216,203,0.08)_0%,transparent_60%)] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.UI_03</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary tracking-tight">The Study Interface</h2>
          <p className="font-body-sm text-sm text-text-secondary mt-3 leading-relaxed">Focused, high-contrast, zero distractions.</p>
        </div>

        {/* Study card mockup */}
        <div className="w-full max-w-3xl bg-surface-base rounded-2xl border border-outline-variant/40 shadow-[0_0_40px_rgba(107,216,203,0.05)] overflow-hidden relative group transition-all duration-500 hover:shadow-[0_0_60px_rgba(107,216,203,0.15)] hover:border-primary/40 hover:-translate-y-1">
          {/* Card top bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-raised">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="font-data-mono text-[10px] sm:text-xs text-text-secondary uppercase tracking-widest">Neuroscience 301</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-data-mono text-[10px] text-outline-variant hidden sm:inline-block">CARD 42/108</span>
              <div className="flex gap-1">
                <span className="w-6 sm:w-8 h-1 bg-mastery-weak rounded-full" />
                <span className="w-6 sm:w-8 h-1 bg-mastery-learning rounded-full" />
                <span className="w-6 sm:w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_#6bd8cb]" />
              </div>
            </div>
          </div>

          {/* Card content */}
          <div className="px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-16 min-h-[200px] sm:min-h-[260px] flex items-center justify-center text-center relative z-10 bg-gradient-to-b from-transparent to-surface-void/50">
            <p className="font-body-base text-base sm:text-lg md:text-xl text-text-primary leading-relaxed">
              Explain the role of the{' '}
              <span className="text-primary font-medium">hippocampus</span>{' '}
              in the consolidation of declarative memory, specifically detailing the process of long-term potentiation (LTP).
            </p>
          </div>

          {/* Card bottom bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface-raised">
            <div className="font-data-mono text-xs text-text-secondary text-center sm:text-left">
              Press{' '}
              <span className="bg-surface border border-outline-variant/50 rounded px-1.5 py-0.5 text-on-surface mx-1">Space</span>{' '}
              to reveal answer
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface border border-outline-variant/50 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300">
                <span className="material-symbols-outlined text-[1.1rem] sm:text-[1.2rem]">edit</span>
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface border border-outline-variant/50 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300">
                <span className="material-symbols-outlined text-[1.1rem] sm:text-[1.2rem]">flag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
