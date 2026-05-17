'use client';

import React from 'react';

export function StudyInterfaceSection() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
            ✦ The Study Interface
          </p>
          <h2 className="heading-2xl text-2xl md:text-3xl lg:text-4xl">
            Focused, Minimal, Distraction-Free
          </h2>
          <p className="text-sm md:text-base text-text-secondary">
            Focused, high-context, one-question-at-a-time study mode.
          </p>
        </div>

        {/* Study Card Example */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left: Card */}
          <div className="flex-1 w-full">
            <div className="rounded-lg border border-border-default bg-surface-raised p-8 md:p-12 space-y-6 min-h-[400px] flex flex-col justify-between">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>FLASHCARD 3/7</span>
                  <span>Progress</span>
                </div>
                <div className="w-full h-1 bg-surface-void rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 transition-all duration-500"
                    style={{ width: '42%' }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
                    Question
                  </p>
                  <h3 className="heading-xl text-2xl md:text-3xl leading-relaxed max-w-sm mx-auto">
                    Explain the role of the hippocampus in the consolidation of declarative memory, specifically detailing the process of long-term potentiation (LTP).
                  </h3>
                </div>
              </div>

              {/* Answer (Hidden) */}
              <div className="space-y-4">
                <button className="w-full py-3 px-4 rounded-lg border border-border-default text-text-secondary hover:bg-surface-hover transition-colors text-sm font-medium">
                  Reveal Answer
                </button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                One Question Per Page
              </h3>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                No distractions. One card, nothing else. Your brain focuses on retrieval practice, not on navigating UI clutter.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Keyboard-First
              </h3>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex gap-3">
                  <code className="font-mono text-xs bg-surface-raised px-2 py-1 rounded text-brand-400">
                    Space
                  </code>
                  <span>Reveal answer</span>
                </li>
                <li className="flex gap-3">
                  <code className="font-mono text-xs bg-surface-raised px-2 py-1 rounded text-brand-400">
                    1-5
                  </code>
                  <span>Rate confidence</span>
                </li>
                <li className="flex gap-3">
                  <code className="font-mono text-xs bg-surface-raised px-2 py-1 rounded text-brand-400">
                    Enter
                  </code>
                  <span>Next card</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Confidence-Based Scheduling
              </h3>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                Rate how well you knew the answer (1-5). The algorithm uses your confidence to calculate the next review date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
