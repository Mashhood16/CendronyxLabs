import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Activity, Pause, Play, Trash2 } from 'lucide-react';
import { useTheme } from '../store';

export interface DataPoint {
  t: number;
  values: Record<string, number>;
}

interface SimulationDataChartProps {
  /** Array of data points logged over time */
  data: DataPoint[];
  /** Which variables to display (keys from DataPoint.values) */
  variables: string[];
  /** Color mapping for each variable */
  colors?: Record<string, string>;
  /** Title of the chart */
  title?: string;
  /** Max data points to display */
  maxPoints?: number;
  onClear?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

export default function SimulationDataChart({
  data,
  variables,
  colors: colorMap,
  title = 'Data Log',
  maxPoints = 200,
  onClear,
  isPaused = false,
  onTogglePause,
}: SimulationDataChartProps) {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; variable: string; value: number; t: number } | null>(null);

  // Get color for a variable
  const getColor = (v: string, idx: number) => {
    if (colorMap?.[v]) return colorMap[v];
    return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
  };

  // Compute min/max for auto-scaling
  const yRange = useMemo(() => {
    if (data.length < 2) return { min: 0, max: 10 };

    let min = Infinity;
    let max = -Infinity;
    for (const pt of data) {
      for (const v of variables) {
        const val = pt.values[v];
        if (val !== undefined && isFinite(val)) {
          min = Math.min(min, val);
          max = Math.max(max, val);
        }
      }
    }

    // Add margin
    const margin = (max - min) * 0.1 || 1;
    return {
      min: min - margin,
      max: max + margin,
    };
  }, [data, variables]);

  // Get time range
  const tRange = useMemo(() => {
    if (data.length < 2) return { min: 0, max: 10 };
    return {
      min: data[0]?.t || 0,
      max: data[data.length - 1]?.t || 10,
    };
  }, [data]);

  // SVG → canvas coordinates
  const mapToCanvas = (t: number, val: number, width: number, height: number, padding: number) => {
    const x = padding + ((t - tRange.min) / (tRange.max - tRange.min || 1)) * (width - 2 * padding);
    const y = height - padding - ((val - yRange.min) / (yRange.max - yRange.min || 1)) * (height - 2 * padding);
    return { x, y };
  };

  // Draw chart when data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = Math.max(120, Math.min(250, rect.height));
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = isDark ? '#0a0a0c' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const padding = 40;
    const plotW = width - 2 * padding;
    const plotH = height - 2 * padding;

    // Grid lines
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 0.5;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (plotH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (plotH / gridLines) * i;
      const val = yRange.max - ((yRange.max - yRange.min) / gridLines) * i;
      const label = val >= 1000 ? val.toExponential(1) : val.toFixed(1);
      ctx.fillText(label, padding - 4, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= gridLines; i++) {
      const x = padding + (plotW / gridLines) * i;
      const val = tRange.min + ((tRange.max - tRange.min) / gridLines) * i;
      ctx.fillText(val.toFixed(1) + 's', x, height - 4);
    }

    // Draw data lines
    if (data.length >= 2) {
      variables.forEach((v, idx) => {
        const color = getColor(v, idx);

        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        // Only draw visible points for performance
        const step = Math.max(1, Math.floor(data.length / 200));
        let started = false;

        for (let i = 0; i < data.length; i += step) {
          const pt = data[i];
          const val = pt.values[v];
          if (val === undefined || !isFinite(val)) continue;

          const pos = mapToCanvas(pt.t, val, width, height, padding);
          if (!started) {
            ctx.moveTo(pos.x, pos.y);
            started = true;
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
        }
        ctx.stroke();

        // Draw dots at sample points (sparser)
        const dotStep = Math.max(step * 5, Math.floor(data.length / 30));
        for (let i = 0; i < data.length; i += dotStep) {
          const pt = data[i];
          const val = pt.values[v];
          if (val === undefined || !isFinite(val)) continue;

          const pos = mapToCanvas(pt.t, val, width, height, padding);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      });

      // Draw legend
      const legendX = width - padding;
      let legendY = padding + 4;
      variables.forEach((v, idx) => {
        const color = getColor(v, idx);
        const lastVal = data[data.length - 1]?.values[v];
        const label = lastVal !== undefined ? `${v} = ${lastVal.toFixed(2)}` : v;

        ctx.fillStyle = color;
        ctx.fillRect(legendX - 40, legendY, 8, 8);
        ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, legendX - 28, legendY + 7);
        legendY += 14;
      });
    } else {
      // Empty state
      ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Run the simulation to see data', width / 2, height / 2);
    }

    // Axis labels
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', width / 2, height - 12);
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Value', 0, 0);
    ctx.restore();

  }, [data, variables, yRange, tRange, isDark]);

  // Mouse hover for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const padding = 40;
    const width = rect.width;
    const plotW = width - 2 * padding;

    // Find closest time point
    const tAtMouse = tRange.min + ((mouseX - padding) / plotW) * (tRange.max - tRange.min);

    let closestPt = data[0];
    let closestDist = Infinity;
    for (const pt of data) {
      const dist = Math.abs(pt.t - tAtMouse);
      if (dist < closestDist) {
        closestDist = dist;
        closestPt = pt;
      }
    }

    if (!closestPt || closestDist > (tRange.max - tRange.min) * 0.05) {
      setHoveredPoint(null);
      return;
    }

    // Find closest variable
    let found = null;
    for (const v of variables) {
      const val = closestPt.values[v];
      if (val !== undefined) {
        const pos = mapToCanvas(closestPt.t, val, width, height, padding);
        if (Math.abs(mouseX - pos.x) < 20) {
          found = { x: pos.x, y: pos.y, variable: v, value: val, t: closestPt.t };
          break;
        }
      }
    }
    setHoveredPoint(found);
  };

  // Toggle pause on click
  const handleClick = () => {
    onTogglePause?.();
  };

  return (
    <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-1.5">
          <Activity size={12} className={isDark ? 'text-emerald-400' : 'text-emerald-500'} />
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[9px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            {data.length} pts
          </span>
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              className={`p-1 rounded transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={isPaused ? 'Resume logging' : 'Pause logging'}
            >
              {isPaused ? <Play size={10} /> : <Pause size={10} />}
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className={`p-1 rounded transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
              title="Clear data"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full h-[180px] relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
          onClick={handleClick}
        />

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 px-2 py-1 rounded-lg text-[10px] font-mono font-bold pointer-events-none shadow-lg"
            style={{
              left: hoveredPoint.x + 10,
              top: Math.max(0, hoveredPoint.y - 20),
              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
              color: getColor(hoveredPoint.variable, variables.indexOf(hoveredPoint.variable)),
              border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            }}
          >
            {hoveredPoint.variable} = {hoveredPoint.value.toFixed(3)} @ t = {hoveredPoint.t.toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
}
