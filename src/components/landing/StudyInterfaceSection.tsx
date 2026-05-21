'use client';

import React from 'react';

export function StudyInterfaceSection() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-void relative border-t border-outline-variant/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(107,216,203,0.08)_0%,transparent_60%)] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10 reveal-target is-revealed">
        <div className="text-center mb-xl">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.UI_03</div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">The Study Interface</h2>
          <p className="font-body-sm text-body-sm text-text-secondary mt-sm leading-relaxed">Focused, high-contrast, zero distractions.</p>
        </div>
        <div className="w-full max-w-3xl bg-surface-base rounded-2xl border border-outline-variant/40 shadow-[0_0_40px_rgba(107,216,203,0.05)] overflow-hidden relative group transition-all duration-500 hover:shadow-[0_0_60px_rgba(107,216,203,0.15)] hover:border-primary/40 hover:-translate-y-1">
          <div className="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-raised">
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-data-mono text-[11px] text-text-secondary uppercase tracking-widest">Neuroscience 301</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-[10px] text-outline-variant hidden sm:inline-block">CARD 42/108</span>
              <div className="flex gap-xs">
                <span className="w-8 h-1 bg-mastery-weak rounded-full"></span>
                <span className="w-8 h-1 bg-mastery-learning rounded-full"></span>
                <span className="w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_#6bd8cb]"></span>
              </div>
            </div>
          </div>
          <div className="p-xl md:p-[4rem] min-h-[300px] flex items-center justify-center text-center relative z-10 bg-gradient-to-b from-transparent to-surface-void/50">
            <p className="font-body-base text-lg md:text-xl text-text-primary leading-relaxed ">
              Explain the role of the <span className="text-primary font-medium">hippocampus</span> in the consolidation of declarative memory, specifically detailing the process of long-term potentiation (LTP).
            </p>
          </div>
          <div className="px-lg py-md border-t border-outline-variant/20 flex justify-between items-center bg-surface-raised">
            <div className="font-data-mono text-xs text-text-secondary">
              Press <span className="bg-surface border border-outline-variant/50 rounded px-1.5 py-0.5 text-on-surface mx-1">Space</span> to reveal answer
            </div>
            <div className="flex gap-sm">
              <button className="w-10 h-10 rounded-full bg-surface border border-outline-variant/50 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300">
                <span className="material-symbols-outlined text-[1.2rem]">edit</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-surface border border-outline-variant/50 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300">
                <span className="material-symbols-outlined text-[1.2rem]">flag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
