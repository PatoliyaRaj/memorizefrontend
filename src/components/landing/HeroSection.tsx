'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-xl px-margin-mobile md:px-margin-desktop min-h-[921px] flex items-center justify-center bg-grid-pattern overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(107,216,203,0.12)_0%,transparent_70%)] rounded-full pointer-events-none animate-breathe"></div>
      
      <div className="max-w-4xl mx-auto text-center z-10 reveal-target is-revealed">
        <div className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-surface-raised border border-outline-variant mb-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-data-mono text-data-mono text-primary uppercase tracking-widest">NeuroLearn V2 Live</span>
        </div>
        
        <h1 className="font-display text-display md:text-[5rem] font-bold text-text-primary mb-md leading-tight tracking-tight">
          Memory, <br className="md:hidden"/> Engineered.
        </h1>
        
        <p className="font-body-base text-body-base md:text-xl text-text-secondary max-w-2xl mx-auto mb-xl leading-relaxed">
          A scientific approach to cognitive retention. We map your learning patterns using neural-inspired algorithms to optimize study intervals, ensuring knowledge becomes permanent.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
          <Link href="/study" className="w-full sm:w-auto bg-primary text-on-primary px-xl py-md rounded-lg font-body-base text-body-base font-bold transition-all duration-300 hover:bg-primary-fixed hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(107,216,203,0.5)] active:scale-95 text-center">
            Start Session
          </Link>
          <Link href="#science" className="w-full sm:w-auto border border-outline-variant text-text-primary px-xl py-md rounded-lg font-body-base text-body-base font-medium transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-1 active:scale-95 text-center">
            Explore Science
          </Link>
        </div>
      </div>
    </section>
  );
}
