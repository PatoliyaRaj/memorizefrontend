'use client';

import React from 'react';

export function MasteryDensitySection() {
  const colors = [
    { label: 'Unseen', color: 'bg-mastery-unseen', hex: '#2A3530' },
    { label: 'Weak', color: 'bg-mastery-weak', hex: '#4A1A1A' },
    { label: 'Learning', color: 'bg-mastery-learning', hex: '#3A2A0A' },
    { label: 'Strong', color: 'bg-mastery-strong', hex: '#0A2A20' },
    { label: 'Mastered', color: 'bg-mastery-mastered', hex: '#134E4A' },
  ];

  // Create a 5x4 grid of mastery states for visual representation
  const masteryStates = Array.from({ length: 20 }, (_, i) => {
    const state = Math.floor(i / 4) % 5;
    return state;
  });

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
            ✦ Mastery Density
          </p>
          <h2 className="heading-2xl text-2xl md:text-3xl lg:text-4xl">
            Visual Mastery Tracking
          </h2>
          <p className="text-sm md:text-base text-text-secondary">
            Color-coded mastery levels provide instant visual feedback on knowledge acquisition across all domains.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Legend */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Mastery Levels</h3>
            <div className="space-y-3">
              {colors.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle hover:border-border-default transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-md ${item.color} border border-border-default`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-tertiary font-mono">
                      {item.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Grid */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Sample Map Density</h3>
            <div className="grid grid-cols-5 gap-2">
              {masteryStates.map((state, idx) => {
                const colorMap = [
                  'bg-mastery-unseen',
                  'bg-mastery-weak',
                  'bg-mastery-learning',
                  'bg-mastery-strong',
                  'bg-mastery-mastered',
                ];

                return (
                  <div
                    key={idx}
                    className={`
                      aspect-square rounded-md
                      ${colorMap[state]}
                      border border-border-subtle
                      hover:shadow-md
                      transition-all duration-200
                      cursor-pointer
                    `}
                    title={colors[state].label}
                  ></div>
                );
              })}
            </div>

            <p className="text-xs text-text-tertiary">
              Hover over any node in your Neural Map to see detailed mastery metrics.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Concepts Mapped', value: '247' },
            { label: 'Avg Mastery', value: '64%' },
            { label: 'Cards Due', value: '12' },
            { label: 'Mastered', value: '158' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border-default bg-surface-raised p-4 text-center"
            >
              <p className="text-sm md:text-lg font-semibold text-brand-400">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-text-secondary mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
