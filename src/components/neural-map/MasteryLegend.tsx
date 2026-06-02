'use client';

import React from 'react';

const legendItems = [
  { level: 'unseen', label: 'Unseen', color: 'bg-slate-400 border-slate-300/40', desc: 'No active recall cards studied yet.' },
  { level: 'weak', label: 'Weak', color: 'bg-rose-400 border-rose-300/40 animate-pulse', desc: 'Needs prompt remedial rehearsal (error rate > 40%).' },
  { level: 'learning', label: 'Learning', color: 'bg-amber-400 border-amber-300/40', desc: 'Undergoing initial FSRS spacing intervals.' },
  { level: 'strong', label: 'Strong', color: 'bg-teal-400 border-teal-300/40', desc: 'Solid recall stability (retention probability ~85%).' },
  { level: 'mastered', label: 'Mastered', color: 'bg-emerald-500 border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]', desc: 'Hippocampus-to-neocortex consolidation achieved.' },
];

export default function MasteryLegend() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#0b111e]/90 p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md max-w-2xl transition-all hover:border-teal-500/20">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mastery Levels</h4>
      <div className="flex flex-col gap-2.5 mt-1">
        {legendItems.map((item) => (
          <div key={item.level} className="group relative flex items-start gap-2.5 cursor-help">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full border ${item.color}`} />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-[#6bd8cb] transition-colors">{item.label}</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
