import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, PlayCircle } from 'lucide-react';
import { SavedSimulation } from '../services/customSimService';
import { evaluateEquation } from '../utils/equationEvaluator';
import { theme } from '../utils/labTheme';

interface CustomSimulationRendererProps {
  sim: SavedSimulation;
  initialValues?: Record<string, number>;
  isDark?: boolean;
}

export function evaluateText(expr: string, evalVars: Record<string, number>): string {
  if (!expr) return '';
  try {
    let sanitized = expr;
    // Replace Math constants & functions
    sanitized = sanitized.replace(/\bpi\b/gi, String(Math.PI));
    sanitized = sanitized.replace(/\be\b/gi, String(Math.E));
    
    // Sort variables by length descending to prevent partial replacements
    const varNames = Object.keys(evalVars).sort((a, b) => b.length - a.length);
    for (const name of varNames) {
      const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
      sanitized = sanitized.replace(regex, String(evalVars[name] ?? 0));
    }

    // Safely evaluate as string
    const evaluated = new Function(`try { return (${sanitized}); } catch(e) { return "${expr}"; }`)();
    return String(evaluated);
  } catch (e) {
    return expr;
  }
}

export const CustomSimulationRenderer: React.FC<CustomSimulationRendererProps> = ({
  sim,
  initialValues,
  isDark = true,
}) => {
  // 1. Sliders variable state
  const [variablesState, setVariablesState] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    sim.variables.forEach((v) => {
      defaults[v.name] = initialValues?.[v.name] ?? v.value;
    });
    return defaults;
  });

  // 2. Playback state
  const [isRunning, setIsRunning] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Synchronize initial values if they change
  useEffect(() => {
    if (initialValues) {
      setVariablesState((prev) => {
        const next = { ...prev };
        Object.keys(initialValues).forEach((key) => {
          next[key] = initialValues[key];
        });
        return next;
      });
    }
  }, [initialValues]);

  // Animation Loop
  const animate = (timestamp: number) => {
    if (lastTimeRef.current !== null) {
      const delta = (timestamp - lastTimeRef.current) / 1000; // in seconds
      // Cap delta to prevent massive jumps when switching tabs
      const cappedDelta = Math.min(delta, 0.1);
      setT((prevT) => prevT + cappedDelta * speed);
    }
    lastTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, speed]);

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setT(0);
  };

  // Evaluate all equations sequentially
  const evalVars: Record<string, number> = { t, ...variablesState };
  sim.equations.forEach((eq) => {
    evalVars[eq.name] = evaluateEquation(eq.expression, evalVars, 0);
  });

  // Evaluate shapes dynamically
  const renderedShapes = sim.shapes.map((shape) => {
    const x = evaluateEquation(shape.xExpr || '0', evalVars, 300);
    const y = evaluateEquation(shape.yExpr || '0', evalVars, 200);
    const x2 = evaluateEquation(shape.x2Expr || '0', evalVars, 0);
    const y2 = evaluateEquation(shape.y2Expr || '0', evalVars, 0);
    const x3 = evaluateEquation(shape.x3Expr || '0', evalVars, 0);
    const y3 = evaluateEquation(shape.y3Expr || '0', evalVars, 0);
    const radius = evaluateEquation(shape.radiusExpr || '0', evalVars, 10);
    const width = evaluateEquation(shape.widthExpr || '0', evalVars, 20);
    const height = evaluateEquation(shape.heightExpr || '0', evalVars, 20);
    const angle = evaluateEquation(shape.angleExpr || '0', evalVars, 0);
    const strokeWidth = evaluateEquation(shape.strokeWidth || '2', evalVars, 2);
    const textContent = evaluateText(shape.textExpr || '', evalVars);
    const fontSize = evaluateEquation(shape.fontSizeExpr || '12', evalVars, 12);

    return {
      ...shape,
      x,
      y,
      x2,
      y2,
      x3,
      y3,
      radius,
      width,
      height,
      angle,
      strokeWidth,
      textContent,
      fontSize,
    };
  });

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-slate-50 border-slate-200'} overflow-hidden shadow-sm`}>
      {/* Simulation Screen */}
      <div className="relative flex-1 bg-slate-950 dark:bg-black overflow-hidden flex items-center justify-center min-h-[300px]">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="sim-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sim-grid)" />
          </svg>
        </div>

        {/* SVG Drawing Canvas */}
        <svg viewBox="0 0 600 400" className="w-full h-full max-h-[450px] relative z-10 select-none">
          {renderedShapes.map((shape) => {
            switch (shape.type) {
              case 'circle':
                return (
                  <circle
                    key={shape.id}
                    cx={shape.x}
                    cy={shape.y}
                    r={Math.max(1, shape.radius)}
                    fill={shape.color}
                    className="transition-all duration-75"
                  />
                );
              case 'rectangle':
                return (
                  <rect
                    key={shape.id}
                    x={shape.x - shape.width / 2}
                    y={shape.y - shape.height / 2}
                    width={Math.max(1, shape.width)}
                    height={Math.max(1, shape.height)}
                    fill={shape.color}
                    transform={shape.angle ? `rotate(${shape.angle} ${shape.x} ${shape.y})` : undefined}
                    className="transition-all duration-75"
                  />
                );
              case 'line':
                return (
                  <line
                    key={shape.id}
                    x1={shape.x}
                    y1={shape.y}
                    x2={shape.x2}
                    y2={shape.y2}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                );
              case 'triangle':
                return (
                  <polygon
                    key={shape.id}
                    points={`${shape.x},${shape.y} ${shape.x2},${shape.y2} ${shape.x3},${shape.y3}`}
                    fill={shape.color}
                    className="transition-all duration-75"
                  />
                );
              case 'text':
                return (
                  <text
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    fill={shape.color}
                    fontSize={shape.fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono font-semibold"
                  >
                    {shape.textContent}
                  </text>
                );
              default:
                return null;
            }
          })}
        </svg>

        {/* Time HUD overlay */}
        <div className="absolute top-3 left-4 px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-emerald-400 font-bold z-20 flex items-center gap-1.5 shadow">
          <PlayCircle size={13} className="text-emerald-500 animate-pulse" />
          t = {t.toFixed(2)}s
        </div>
      </div>

      {/* Control Panel Area */}
      <div className={`p-4 border-t ${isDark ? 'bg-[#0f0f12] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'} space-y-4`}>
        {/* Sliders for custom variables */}
        {sim.variables.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-800/40">
            {sim.variables.map((v) => (
              <div key={v.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {v.label} <code className="ml-1 px-1 bg-slate-900 rounded text-indigo-400">{v.name}</code>
                  </span>
                  <span className="font-mono text-indigo-500 font-bold">
                    {variablesState[v.name]?.toFixed(2) ?? v.value}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-semibold">{v.min}</span>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    step={v.step}
                    value={variablesState[v.name] ?? v.value}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVariablesState((prev) => ({ ...prev, [v.name]: val }));
                    }}
                    className="flex-1 accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-semibold">{v.max}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={15} /> Pause
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" /> Run Simulation
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              title="Reset Time"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 font-bold outline-none cursor-pointer"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1">1.0x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
