'use client';

import React, { useState } from 'react';
import { HeatmapPoint } from '../../services/stats-service';

type StudyHeatmapProps = {
  data: HeatmapPoint[];
};

export default function StudyHeatmap({ data }: StudyHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map data to a date lookup table
  const countLookup = new Map<string, number>();
  data.forEach((p) => {
    // dates are formatted as YYYY-MM-DD
    const dateStr = p.date.split('T')[0];
    countLookup.set(dateStr, p.count);
  });

  // Calculate past 365 days grouped by weeks
  const today = new Date();
  const startDay = new Date();
  startDay.setDate(today.getDate() - 364); // past 52 weeks (364 days)

  // Align startDay to previous Sunday to make a neat grid
  const startDayOfWeek = startDay.getDay(); // 0 is Sunday
  startDay.setDate(startDay.getDate() - startDayOfWeek);

  // Generate grid weeks
  const weeks = [];
  const currentDate = new Date(startDay);

  for (let w = 0; w < 53; w++) {
    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = countLookup.get(dateStr) || 0;
      weekDays.push({ date: dateStr, count });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(weekDays);
  }

  // Get color scale based on counts
  const getColorClass = (count: number) => {
    if (count === 0) return 'fill-slate-800/40 stroke-slate-900/40';
    if (count <= 3) return 'fill-teal-950 stroke-teal-900/60';
    if (count <= 8) return 'fill-teal-800/80 stroke-teal-700/60 shadow-[0_0_4px_#14b8a6]';
    if (count <= 15) return 'fill-teal-500 stroke-teal-400/50';
    return 'fill-[#6bd8cb] stroke-teal-300/30';
  };

  const handleMouseEnter = (
    e: React.MouseEvent<SVGRectElement>,
    day: { date: string; count: number }
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (parentRect) {
      setHoveredDay(day);
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 38,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Study Consistency Grid</h3>
          <span className="text-[11px] text-slate-500 mt-0.5">Reviews submitted over the past 12 months</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-800/40 border border-slate-900/40" />
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-950 border border-teal-900/60" />
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-800/80 border border-teal-700/60" />
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-500 border border-teal-400/50" />
          <span className="h-2.5 w-2.5 rounded-sm bg-[#6bd8cb] border border-teal-300/30" />
          <span>More</span>
        </div>
      </div>

      <div className="mt-5 relative overflow-x-auto select-none no-scrollbar">
        <svg viewBox="0 0 710 110" className="w-full min-w-[650px] h-auto overflow-visible">
          {weeks.map((week, wIdx) => (
            <g key={wIdx} transform={`translate(${wIdx * 13 + 20}, 0)`}>
              {week.map((day, dIdx) => (
                <rect
                  key={dIdx}
                  y={dIdx * 13 + 12}
                  width="10"
                  height="10"
                  rx="2"
                  className={`transition-colors duration-150 cursor-pointer ${getColorClass(day.count)}`}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </g>
          ))}

          {/* Month labels at top */}
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
            (m, idx) => (
              <text
                key={m}
                x={idx * 58 + 35}
                y="6"
                fill="#64748b"
                fontSize="8"
                fontWeight="bold"
                className="opacity-70"
              >
                {m}
              </text>
            )
          )}

          {/* Days of week labels at left */}
          {['Sun', 'Wed', 'Fri'].map((day, idx) => {
            const yPositions = [20, 46, 72];
            return (
              <text
                key={day}
                x="0"
                y={yPositions[idx]}
                fill="#64748b"
                fontSize="8"
                fontWeight="bold"
                className="opacity-60"
              >
                {day}
              </text>
            );
          })}
        </svg>

        {/* Hover glassmorphic tooltip */}
        {hoveredDay && (
          <div
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translateX(-50%)',
            }}
            className="pointer-events-none z-30 rounded-lg border border-teal-500/20 bg-[#0f172a]/95 px-2 py-1 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col text-center min-w-28">
              <span className="text-[10px] font-black text-slate-100">{hoveredDay.count} reviews</span>
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
