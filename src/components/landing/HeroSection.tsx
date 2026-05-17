'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/form/Button';

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-block">
          <div className="px-3 py-1.5 rounded-full border border-border-default bg-surface-raised flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            <span className="text-xs uppercase tracking-wider text-text-secondary font-mono">
              Introduced to zfert
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl leading-tight">
            Memory, <span className="text-brand-400">Engineered</span>.
          </h1>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            A scientific approach to spaced repetition. We use your forgetting curve
            and neural-inspired algorithms to optimize study intervals, ensuring knowledge becomes permanent.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="primary"
            size="lg"
            asChild
          >
            <Link href="/study">Start Session</Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            asChild
          >
            <Link href="#science">Explore Science</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
