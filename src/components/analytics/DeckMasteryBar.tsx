'use client';

import React from 'react';
import { WeakSpot } from '../../services/stats-service';

type DeckMasteryBarProps = {
  weakSpots: WeakSpot[];
};

export default function DeckMasteryBar({ weakSpots }: DeckMasteryBarProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Leech Detection Alerts</h3>
          <span className="text-[11px] text-slate-500 mt-0.5">Concepts showing repetitive recall failure</span>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-400 border border-rose-500/20 animate-pulse">
          Alert Active
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {weakSpots.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-white/5 bg-[#0b111e]/50 text-slate-500 text-xs">
            Zero leeches detected. Your consolidation pathways are working cleanly!
          </div>
        ) : (
          weakSpots.map((spot) => (
            <div
              key={spot.cardId}
              className="group relative flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0f172a]/60 p-3.5 transition-all hover:border-rose-500/20 hover:bg-[#1e293b]/40"
            >
              {/* Glowing vertical highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-rose-500 to-amber-500 opacity-60" />

              <div className="flex items-start justify-between gap-4 pl-1.5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6bd8cb]">
                    {spot.nodeTitle}
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mt-1 line-clamp-2 leading-relaxed">
                    {spot.question}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Lapses</span>
                  <span className="text-sm font-extrabold text-rose-400 mt-0.5">{spot.lapses} times</span>
                </div>
              </div>

              {/* Card Meta Stats */}
              <div className="flex items-center gap-4 pl-1.5 mt-1 border-t border-white/5 pt-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold uppercase">Difficulty:</span>
                  <span className="font-extrabold text-amber-500">{spot.difficulty}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold uppercase">Reps:</span>
                  <span className="font-extrabold text-slate-300">{spot.reps} reviews</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
