'use client';

import React from 'react';

export function NeuroscienceSection() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-void relative border-t border-outline-variant/10 bg-grid-schematic">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-void via-transparent to-surface-void pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10 reveal-target is-revealed">
        <div className="mb-xl text-center">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.METRICS_01</div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">Validated by Neuroscience</h2>
          <p className="font-body-sm text-body-sm text-text-secondary mt-sm leading-relaxed">Empirical metrics from continuous cognitive trials.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-lg flex flex-col items-center text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="font-data-mono text-[3rem] font-bold text-primary mb-sm group-hover:scale-105 transition-transform">94%</div>
            <h3 className="font-display text-lg text-text-primary mb-xs tracking-tight">Retention Rate</h3>
            <p className="font-body-sm text-text-secondary leading-relaxed">Average long-term recall after 6 months of spaced repetition protocols.</p>
            <div className="mt-4 font-data-mono text-[10px] text-outline-variant uppercase">Data set: N=14,204</div>
          </div>
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-lg flex flex-col items-center text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="font-data-mono text-[3rem] font-bold text-primary mb-sm group-hover:scale-105 transition-transform">3.2x</div>
            <h3 className="font-display text-lg text-text-primary mb-xs tracking-tight">Efficiency Gain</h3>
            <p className="font-body-sm text-text-secondary leading-relaxed">Faster acquisition of complex semantic networks compared to linear study.</p>
            <div className="mt-4 font-data-mono text-[10px] text-outline-variant uppercase">Benchmark: Ctrl Group</div>
          </div>
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-lg flex flex-col items-center text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="font-data-mono text-[3rem] font-bold text-primary mb-sm group-hover:scale-105 transition-transform">98.9%</div>
            <h3 className="font-display text-lg text-text-primary mb-xs tracking-tight">Active Recall Accuracy</h3>
            <p className="font-body-sm text-text-secondary leading-relaxed">Peak accuracy achieved during high-density cognitive retrieval sessions.</p>
            <div className="mt-4 font-data-mono text-[10px] text-outline-variant uppercase">Metric: T-90 Peak</div>
          </div>
        </div>
      </div>
    </section>
  );
}
