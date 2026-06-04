'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-10 min-h-[600px] sm:min-h-[700px] md:min-h-[820px] flex items-center justify-center bg-grid-pattern overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-[radial-gradient(circle,rgba(107,216,203,0.12)_0%,transparent_70%)] rounded-full pointer-events-none animate-breathe" />

      <div className="max-w-4xl mx-auto text-center z-10 w-full px-2">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-outline-variant mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="font-data-mono text-[10px] sm:text-xs text-primary uppercase tracking-widest">NeuroLearn V2 Live</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-bold text-text-primary mb-4 sm:mb-5 md:mb-6 leading-[1.1] tracking-tight">
          Memory,{' '}
          <span className="inline md:hidden"><br /></span>
          Engineered.
        </h1>

        {/* Subtext */}
        <p className="font-body-base text-sm sm:text-base md:text-xl text-text-secondary max-w-2xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
          A scientific approach to cognitive retention. We map your learning patterns using neural-inspired algorithms to optimize study intervals, ensuring knowledge becomes permanent.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 max-w-2xs sm:max-w-none mx-auto">
          <Link
            href="/study"
            className="bg-primary text-on-primary px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-body-base text-sm sm:text-base font-bold transition-all duration-300 hover:bg-primary-fixed hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(107,216,203,0.5)] active:scale-95 text-center"
          >
            Start Session
          </Link>
          <Link
            href="#science"
            className="border border-outline-variant text-text-primary px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-body-base text-sm sm:text-base font-medium transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-1 active:scale-95 text-center"
          >
            Explore Science
          </Link>
        </div>
      </div>
    </section>
  );
}
