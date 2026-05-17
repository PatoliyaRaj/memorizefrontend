'use client';

import React from 'react';

interface ArchitectureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
}

function ArchitectureCard({
  icon,
  title,
  description,
  details,
}: ArchitectureCardProps) {
  return (
    <div className="group rounded-lg border border-border-default bg-surface-raised p-6 md:p-8 hover:border-border-strong hover:bg-surface-hover transition-all duration-300">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-base">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>

      <p className="text-sm md:text-base text-text-secondary mb-4 leading-relaxed">
        {description}
      </p>

      <p className="text-xs md:text-sm text-text-tertiary uppercase tracking-wide">
        {details}
      </p>
    </div>
  );
}

export function ArchitectureSection() {
  const cards = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Neural Maps',
      description:
        'Visualizing connections between disparate concepts to build robust semantic networks and identify knowledge gaps in real-time.',
      details: 'Spatial node representation',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'Retention Engine',
      description:
        'Spaced repetition protocol.',
      details: 'Optimal review timing',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: 'Deep Focus',
      description:
        'Distraction-free study environment.',
      details: 'Single card immersion',
    },
  ];

  return (
    <section
      id="product"
      className="py-20 md:py-32 px-4 md:px-6 lg:px-8 border-t border-border-subtle"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
            ✦ About AI
          </p>
          <h2 className="heading-2xl text-2xl md:text-3xl lg:text-4xl">
            The Architecture of Learning
          </h2>
          <p className="text-sm md:text-base text-text-secondary">
            Precision tools designed for high-density cognitive work.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <ArchitectureCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              details={card.details}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
