'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const legendItems = [
  { level: 'unseen', label: 'Unseen', color: 'bg-mastery-unseen border-border-default', desc: 'No active recall cards studied yet.' },
  { level: 'weak', label: 'Weak', color: 'bg-mastery-weak border-border-strong animate-pulse', desc: 'Needs prompt remedial rehearsal (error rate > 40%).' },
  { level: 'learning', label: 'Learning', color: 'bg-mastery-learning border-border-default', desc: 'Undergoing initial FSRS spacing intervals.' },
  { level: 'strong', label: 'Strong', color: 'bg-mastery-strong border-border-default', desc: 'Solid recall stability (retention probability ~85%).' },
  { level: 'mastered', label: 'Mastered', color: 'bg-mastery-mastered border-border-brand/40 shadow-glow', desc: 'Hippocampus-to-neocortex consolidation achieved.' },
];

export default function MasteryLegend() {
  const [isOpen, setIsOpen] = useState(true); // Desktop state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Mobile state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('memorize-legend-expanded');
    if (stored !== null) {
      setIsOpen(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem('memorize-legend-expanded', String(next));
  };

  if (!mounted) {
    return (
      <div className="h-10 w-24 rounded-full bg-surface-base/90 border border-border-subtle" />
    );
  }

  return (
    <>
      {/* 📱 Mobile Mastery Legend: Bottom Sheet / Drawer */}
      <div className="md:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-base/95 px-3 py-1.5 text-xs font-bold text-text-primary shadow-lg backdrop-blur-md min-w-[44px] min-h-[44px] pb-[env(safe-area-inset-bottom,0.5rem)]"
              aria-label="Open mastery legend drawer"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Legend</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-surface-base border-t border-border-strong p-4 max-h-[60vh] overflow-y-auto rounded-t-2xl pb-[calc(env(safe-area-inset-bottom,1rem)+1.5rem)] z-50">
            <DrawerHeader className="text-left border-b border-border-subtle pb-3 mb-3">
              <DrawerTitle className="font-display text-sm font-bold text-text-primary uppercase tracking-wider">
                Mastery Levels
              </DrawerTitle>
              <DrawerDescription className="text-[10px] text-text-secondary">
                Spaced repetition progress levels for your concepts.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-3">
              {legendItems.map((item) => (
                <div key={item.level} className="flex items-start gap-3">
                  <span className={`mt-1 h-3 w-3 shrink-0 rounded-full border ${item.color}`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-primary">{item.label}</span>
                    <span className="text-[10px] text-text-secondary leading-tight mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* 💻 Desktop Mastery Legend: Collapsible inline card */}
      <div className="hidden md:block">
        {isOpen ? (
          <div
            id="legend-panel"
            className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface-base/90 p-4 shadow-lg backdrop-blur-md max-w-2xl transition-all hover:border-border-brand/40"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
                Mastery Levels
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="h-6 w-6 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                aria-label="Collapse mastery legend"
                aria-expanded={isOpen}
                aria-controls="legend-panel"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2.5">
              {legendItems.map((item) => (
                <div key={item.level} className="group relative flex items-start gap-2.5 cursor-help">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ${item.color}`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-text-secondary leading-tight mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-base/90 px-3.5 py-2 text-xs font-bold text-text-primary shadow-md backdrop-blur-md hover:border-border-brand/40 hover:bg-surface-hover transition-all"
            aria-label="Expand mastery legend"
            aria-expanded={isOpen}
            aria-controls="legend-panel"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Legend</span>
            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
          </Button>
        )}
      </div>
    </>
  );
}

