'use client';

import React, { useState, useRef } from 'react';
import { RetentionCurvePoint } from '../../services/stats-service';

type RetentionCurveProps = {
  data: RetentionCurvePoint[];
  averageStability: number;
};

export default function RetentionCurve({ data, averageStability }: RetentionCurveProps) {
  const [hoveredPoint, setHoveredPoint] = useState<RetentionCurvePoint | null>(null);
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
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/5 bg-[#0b111e]/50 text-slate-500 text-xs">
        No active recall reviews logged yet.
      </div>
    );
  }

  // Map points to SVG coordinates
  const getCoordinates = (point: RetentionCurvePoint) => {
    const x = paddingLeft + (point.day / 30) * chartWidth;
    // Y-axis inverted (100% retention -> top, 0% -> bottom)
    const y = paddingTop + (1 - point.retention / 100) * chartHeight;
    return { x, y };
  };

  // Build the SVG path string
  let pathD = '';
  let areaD = '';

  data.forEach((p, idx) => {
    const { x, y } = getCoordinates(p);
    if (idx === 0) {
      pathD = `M ${x} ${y}`;
      areaD = `M ${x} ${paddingTop + chartHeight} L ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    }
    if (idx === data.length - 1) {
      areaD += ` L ${x} ${paddingTop + chartHeight} Z`;
    }
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - paddingLeft;
    
    // Find closest day [0 - 30]
    const pct = mouseX / (rect.width - paddingLeft - paddingRight);
    const day = Math.min(30, Math.max(0, Math.round(pct * 30)));
    
    const point = data.find((p) => p.day === day);
    if (point) {
      setHoveredPoint(point);
      const coords = getCoordinates(point);
      
      // Calculate screen absolute position inside parent container
      const screenX = (coords.x / svgWidth) * rect.width;
      const screenY = (coords.y / svgHeight) * rect.height;
      setTooltipPos({ x: screenX, y: screenY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-white/5 bg-[#0b111e]/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Projected Retention Curve</h3>
          <span className="text-[11px] text-slate-500 mt-0.5">30-day cognitive recall probability projection</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Average Stability</span>
          <span className="text-sm font-extrabold text-[#6bd8cb] mt-0.5">{averageStability} days</span>
        </div>
      </div>

      <div className="mt-4 relative select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Smooth glowing gradient */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6bd8cb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6bd8cb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
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

          {/* Day X-axis labels */}
          {[0, 7, 14, 21, 30].map((d) => {
            const x = paddingLeft + (d / 30) * chartWidth;
            return (
              <text
                key={d}
                x={x}
                y={svgHeight - 15}
                fill="#64748b"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-70"
              >
                Day {d}
              </text>
            );
          })}

          {/* Fill Area */}
          <path d={areaD} fill="url(#areaGrad)" />

          {/* Trend Line */}
          <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* Hover highlight line */}
          {hoveredPoint && (
            <line
              x1={getCoordinates(hoveredPoint).x}
              y1={paddingTop}
              x2={getCoordinates(hoveredPoint).x}
              y2={paddingTop + chartHeight}
              stroke="#6bd8cb"
              strokeOpacity="0.3"
              strokeDasharray="2 2"
            />
          )}

          {/* Hover Marker Dot */}
          {hoveredPoint && (
            <circle
              cx={getCoordinates(hoveredPoint).x}
              cy={getCoordinates(hoveredPoint).y}
              r="5"
              fill="#6bd8cb"
              stroke="#0f172a"
              strokeWidth="2"
              className="shadow-[0_0_10px_#6bd8cb]"
            />
          )}
        </svg>

        {/* Hover glassmorphic tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y - 50,
              transform: 'translateX(-50%)',
            }}
            className="pointer-events-none z-30 rounded-lg border border-teal-500/20 bg-[#0f172a]/95 px-2.5 py-1.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col text-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Day {hoveredPoint.day}</span>
              <span className="text-xs font-black text-[#6bd8cb] mt-0.5">{hoveredPoint.retention.toFixed(1)}% Retention</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
