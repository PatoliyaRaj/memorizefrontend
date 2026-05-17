'use client';

import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  description: string;
}

function StatCard({ value, label, description }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="text-4xl md:text-5xl font-display font-bold text-brand-400">
        {value}
      </div>
      <h3 className="text-sm md:text-base font-semibold text-text-primary uppercase tracking-wide">
        {label}
      </h3>
      <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-sm">
        {description}
      </p>
    </div>
  );
}

export function NeuroscienceSection() {
  const stats = [
    {
      value: '94%',
      label: 'Retention Rate',
      description: 'Average long-term recall after 6 months of spaced repetition protocol.',
    },
    {
      value: '3.2x',
      label: 'Efficiency Gain',
      description: 'Faster acquisition of complex semantic networks compared to linear study.',
    },
    {
      value: '98.9%',
      label: 'Advice Recall Accuracy',
      description: 'Peak accuracy achieved during high-difficulty cognitive load sessions.',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
            ✦ Research AI
          </p>
          <h2 className="heading-2xl text-2xl md:text-3xl lg:text-4xl">
            Validated by Neuroscience
          </h2>
          <p className="text-sm md:text-base text-text-secondary">
            Empirical evidence from neuroscience research labs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
