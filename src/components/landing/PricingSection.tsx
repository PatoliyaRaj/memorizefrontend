'use client';

import React from 'react';

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-surface-void border-t border-outline-variant/10 relative overflow-hidden">
      {/* Subdued glow behind pricing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1000px,100vw)] h-[min(500px,60vw)] bg-[radial-gradient(ellipse,rgba(107,216,203,0.06)_0%,transparent_60%)] pointer-events-none animate-breathe" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 sm:mb-14 text-center">
          <div className="font-data-mono text-primary text-xs tracking-widest mb-2">SYS.TIERS_04</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary tracking-tight">Cognitive Plans</h2>
          <p className="font-body-sm text-sm text-text-secondary mt-3 leading-relaxed">Scalable architecture for individual and institutional learning.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-center">
          {/* Core */}
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-5 sm:p-6 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
            <div className="font-data-mono text-[10px] text-outline-variant mb-2">TIER_01</div>
            <h3 className="font-display text-xl text-text-primary mb-1 tracking-tight">Core</h3>
            <div className="font-data-mono text-3xl text-primary mb-5">$12<span className="text-text-secondary text-sm">/mo</span></div>
            <ul className="space-y-3 mb-6 font-body-sm text-sm text-text-secondary leading-relaxed">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Standard Retention Engine</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Basic Neural Maps</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>5,000 Data Points</li>
            </ul>
            <button className="w-full border border-outline-variant/50 text-text-primary px-4 py-2.5 rounded-xl font-body-sm text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300">
              Start Core
            </button>
          </div>

          {/* Pro — featured */}
          <div className="bg-surface-raised border border-primary/50 rounded-xl p-5 sm:p-6 relative shadow-[0_0_40px_rgba(107,216,203,0.15)] z-10 hover:-translate-y-2 hover:shadow-[0_0_70px_rgba(107,216,203,0.35)] transition-all duration-500 ease-out group sm:scale-105">
            <div className="absolute -top-3 right-6 bg-primary text-on-primary px-3 py-1 rounded-full font-data-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(107,216,203,0.3)] border border-primary-fixed">
              Recommended
            </div>
            <div className="font-data-mono text-[10px] text-primary mb-2">TIER_02 [OPTIMAL]</div>
            <h3 className="font-display text-xl text-text-primary mb-1 tracking-tight">Pro</h3>
            <div className="font-data-mono text-4xl text-primary mb-5">$29<span className="text-text-secondary text-sm">/mo</span></div>
            <ul className="space-y-3 mb-6 font-body-sm text-sm text-text-primary leading-relaxed">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Advanced Retention Engine</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Infinite Neural Maps</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Isolate Mode (Deep Focus)</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>API Access</li>
            </ul>
            <button className="w-full bg-primary text-on-primary px-4 py-2.5 rounded-xl font-body-sm text-sm font-bold hover:bg-primary-fixed transition-all duration-300 shadow-[0_0_20px_rgba(107,216,203,0.3)] hover:shadow-[0_0_30px_rgba(107,216,203,0.6)] hover:scale-[1.02]">
              Start Pro
            </button>
          </div>

          {/* Institution */}
          <div className="bg-surface-base border border-outline-variant/30 rounded-xl p-5 sm:p-6 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 sm:col-span-2 md:col-span-1">
            <div className="font-data-mono text-[10px] text-outline-variant mb-2">TIER_03</div>
            <h3 className="font-display text-xl text-text-primary mb-1 tracking-tight">Institution</h3>
            <div className="font-data-mono text-3xl text-primary mb-5">Custom</div>
            <ul className="space-y-3 mb-6 font-body-sm text-sm text-text-secondary leading-relaxed">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Dedicated Clusters</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>Cohort Analytics</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span>SSO Integration</li>
            </ul>
            <button className="w-full border border-outline-variant/50 text-text-primary px-4 py-2.5 rounded-xl font-body-sm text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
