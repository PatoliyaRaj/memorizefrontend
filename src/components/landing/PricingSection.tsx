'use client';

import React from 'react';

export function PricingSection() {
  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-void border-t border-outline-variant/10 relative overflow-hidden">
      {/* Subdued glow behind pricing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse,rgba(107,216,203,0.06)_0%,transparent_60%)] pointer-events-none animate-breathe"></div>
      <div className="max-w-7xl mx-auto relative z-10 reveal-target is-revealed">
        <div className="mb-xl text-center">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.TIERS_04</div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">Cognitive Plans</h2>
          <p className="font-body-sm text-body-sm text-text-secondary mt-sm leading-relaxed">Scalable architecture for individual and institutional learning.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-center">
          {/* Core */}
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="font-data-mono text-[10px] text-outline-variant mb-2">TIER_01</div>
            <h3 className="font-display text-xl text-text-primary mb-xs tracking-tight">Core</h3>
            <div className="font-data-mono text-3xl text-primary mb-md">$12<span className="text-text-secondary text-sm">/mo</span></div>
            <ul className="space-y-sm mb-lg font-body-sm text-text-secondary leading-relaxed">
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Standard Retention Engine</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Basic Neural Maps</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> 5,000 Data Points</li>
            </ul>
            <button className="w-full border border-outline-variant/50 text-text-primary px-md py-sm rounded-lg font-body-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300">Start Core</button>
          </div>
          {/* Pro */}
          <div className="bg-surface-raised border border-primary/50 rounded-xl p-lg relative shadow-[0_0_40px_rgba(107,216,203,0.15)] scale-100 md:scale-105 z-10 hover:-translate-y-2 hover:shadow-[0_0_70px_rgba(107,216,203,0.35)] transition-all duration-500 ease-out group">
            <div className="absolute -top-3 right-8 bg-primary text-on-primary px-3 py-1 rounded-full font-data-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(107,216,203,0.3)] border border-primary-fixed group-hover:shadow-[0_0_15px_rgba(107,216,203,0.6)] transition-shadow duration-500">Recommended</div>
            <div className="font-data-mono text-[10px] text-primary mb-2">TIER_02 [OPTIMAL]</div>
            <h3 className="font-display text-xl text-text-primary mb-xs tracking-tight">Pro</h3>
            <div className="font-data-mono text-4xl text-primary mb-md">$29<span className="text-text-secondary text-sm">/mo</span></div>
            <ul className="space-y-sm mb-lg font-body-sm text-text-primary leading-relaxed">
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Advanced Retention Engine</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Infinite Neural Maps</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Isolate Mode (Deep Focus)</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> API Access</li>
            </ul>
            <button className="w-full bg-primary text-on-primary px-md py-sm rounded-lg font-body-sm font-bold hover:bg-primary-fixed transition-all duration-300 shadow-[0_0_20px_rgba(107,216,203,0.3)] hover:shadow-[0_0_30px_rgba(107,216,203,0.6)] hover:scale-[1.02]">Start Pro</button>
          </div>
          {/* Institution */}
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="font-data-mono text-[10px] text-outline-variant mb-2">TIER_03</div>
            <h3 className="font-display text-xl text-text-primary mb-xs tracking-tight">Institution</h3>
            <div className="font-data-mono text-3xl text-primary mb-md">Custom</div>
            <ul className="space-y-sm mb-lg font-body-sm text-text-secondary leading-relaxed">
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Dedicated Clusters</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> Cohort Analytics</li>
              <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm text-primary">check</span> SSO Integration</li>
            </ul>
            <button className="w-full border border-outline-variant/50 text-text-primary px-md py-sm rounded-lg font-body-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
