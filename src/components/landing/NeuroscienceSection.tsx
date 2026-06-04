'use client';

import React from 'react';

export function NeuroscienceSection() {
  return (
    <section id="science" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-surface-void relative border-t border-outline-variant/10 bg-grid-schematic overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-void via-transparent to-surface-void pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 sm:mb-14 text-center">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.METRICS_01</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary tracking-tight">Validated by Neuroscience</h2>
          <p className="font-body-sm text-sm text-text-secondary mt-3 leading-relaxed max-w-2xl mx-auto">Empirical metrics from continuous cognitive trials.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8">
          {[
            { value: '94%', label: 'Retention Rate', desc: 'Average long-term recall after 6 months of spaced repetition protocols.', tag: 'Data set: N=14,204' },
            { value: '3.2x', label: 'Efficiency Gain', desc: 'Faster acquisition of complex semantic networks compared to linear study.', tag: 'Benchmark: Ctrl Group' },
            { value: '98.9%', label: 'Active Recall Accuracy', desc: 'Peak accuracy achieved during high-density cognitive retrieval sessions.', tag: 'Metric: T-90 Peak' },
          ].map(({ value, label, desc, tag }) => (
            <div key={label} className="bg-surface-base border border-outline-variant/30 rounded-xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
              <div className="font-data-mono text-4xl sm:text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform">{value}</div>
              <h3 className="font-display text-base sm:text-lg text-text-primary mb-2 tracking-tight">{label}</h3>
              <p className="font-body-sm text-sm text-text-secondary leading-relaxed">{desc}</p>
              <div className="mt-4 font-data-mono text-[10px] text-outline-variant uppercase">{tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
