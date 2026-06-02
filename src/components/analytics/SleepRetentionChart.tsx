'use client';

import React, { useState, useRef } from 'react';
import { SleepCorrelationPoint } from '../../services/stats-service';

type SleepRetentionChartProps = {
  data: SleepCorrelationPoint[];
};

export default function SleepRetentionChart({ data }: SleepRetentionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<SleepCorrelationPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG Coordinates constants
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-white/5 bg-[#0b111e]/50 text-slate-500 text-xs">
        Log sleep records and complete the next day's study sessions to map cognitive correlation curves here.
      </div>
    );
  }

  // Map coordinates
  // X-axis: Sleep Consolidation Score [0 - 100]
  // Y-axis: Recall Accuracy [0% - 100%]
  const getCoordinates = (point: SleepCorrelationPoint) => {
    const x = paddingLeft + (point.sleepScore / 100) * chartWidth;
    const y = paddingTop + (1 - point.recallAccuracy / 100) * chartHeight;
    return { x, y };
  };

  const handleMouseEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    point: SleepCorrelationPoint
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = containerRef.current?.getBoundingClientRect();
    if (parentRect) {
      setHoveredPoint(point);
      
      const coords = getCoordinates(point);
      const screenX = (coords.x / svgWidth) * parentRect.width;
      const screenY = (coords.y / svgHeight) * parentRect.height;

      setTooltipPos({
        x: screenX,
        y: screenY - 50,
      });
    }
  };

  // Find a trendline (Linear regression simple approximation: y = mx + c)
  // To draw a simple visual slope guide!
  let trendLine = null;
  if (data.length >= 2) {
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    data.forEach((p) => {
      sumX += p.sleepScore;
      sumY += p.recallAccuracy;
      sumXY += p.sleepScore * p.recallAccuracy;
      sumXX += p.sleepScore * p.sleepScore;
    });
    const n = data.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Build trend line coordinate endpoints (from X=30 to X=100)
    const y1 = Math.min(100, Math.max(0, slope * 30 + intercept));
    const y2 = Math.min(100, Math.max(0, slope * 100 + intercept));

    const p1 = { sleepScore: 30, recallAccuracy: y1 };
    const p2 = { sleepScore: 100, recallAccuracy: y2 };

    const c1 = getCoordinates(p1 as any);
    const c2 = getCoordinates(p2 as any);
    trendLine = { x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y };
  }

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-white/5 bg-[#0b111e]/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
      <div className="flex flex-col">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Sleep-Memory Correlation Grid</h3>
        <span className="text-[11px] text-slate-500 mt-0.5">Sleep consolidation score (X) vs. next-day recall accuracy (Y)</span>
      </div>

      <div className="mt-4 relative select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          {/* Y Axis Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = 100 - i * 25;
            const y = paddingTop + (i / 4) * chartHeight;
            return (
              <g key={i} className="opacity-20">
                <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#374151" strokeDasharray="3 3" />
                <text x={paddingLeft - 10} y={y + 3} fill="#9ca3af" fontSize="9" fontWeight="bold" textAnchor="end">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* X Axis Grid lines */}
          {[20, 40, 60, 80, 100].map((val) => {
            const x = paddingLeft + (val / 100) * chartWidth;
            return (
              <g key={val} className="opacity-25">
                <line x1={x} y1={paddingTop} x2={x} y2={svgHeight - paddingBottom} stroke="#374151" strokeDasharray="3 3" />
                <text x={x} y={svgHeight - 15} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Trendline guideline showing positive sleep impact */}
          {trendLine && (
            <line
              x1={trendLine.x1}
              y1={trendLine.y1}
              x2={trendLine.x2}
              y2={trendLine.y2}
              stroke="#6bd8cb"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />
          )}

          {/* Correlation Points Scatter Dots */}
          {data.map((point, idx) => {
            const { x, y } = getCoordinates(point);
            const isHighQuality = point.sleepScore >= 80;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="6"
                className={`cursor-pointer transition-all duration-150 hover:scale-125 ${
                  isHighQuality
                    ? 'fill-[#6bd8cb] stroke-[#0b111e] hover:shadow-[0_0_12px_#6bd8cb]'
                    : 'fill-amber-500 stroke-[#0b111e]'
                }`}
                strokeWidth="2"
                onMouseEnter={(e) => handleMouseEnter(e, point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translateX(-50%)',
            }}
            className="pointer-events-none z-30 rounded-xl border border-teal-500/20 bg-[#0f172a]/95 p-3 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col text-xs min-w-40 gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Study Date:{' '}
                {new Date(hoveredPoint.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <div className="flex justify-between border-b border-white/5 pb-1 mt-0.5">
                <span className="text-slate-400">Sleep Score:</span>
                <span className="font-extrabold text-[#6bd8cb]">{hoveredPoint.sleepScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recall Accuracy:</span>
                <span className="font-extrabold text-amber-400">{hoveredPoint.recallAccuracy}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Duration: {hoveredPoint.sleepDurationH}h</span>
                <span>Quality: {hoveredPoint.sleepQuality}/5</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
