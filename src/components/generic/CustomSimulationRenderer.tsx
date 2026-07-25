import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, PlayCircle } from 'lucide-react';
import { SavedSimulation } from '../../services/customSimService';
import { evaluateEquation } from '../../utils/equationEvaluator';
import { theme } from '../../utils/labTheme';

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
  if (sim.equations && Array.isArray(sim.equations)) {
    sim.equations.forEach((eq) => {
      if (eq.enabled !== false && eq.name && eq.expression) {
        evalVars[eq.name] = evaluateEquation(eq.expression, evalVars, 0);
      }
    });
  }

  // Calculate top-level formula result if present
  let formulaResult: number | null = null;
  if (sim.formula) {
    formulaResult = evaluateEquation(sim.formula, evalVars, 0);
    if (sim.resultName) {
      evalVars[sim.resultName] = formulaResult;
    }
  }

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

  // Map of rendered shapes by id for connectors
  const shapeMap = new Map(renderedShapes.map(s => [s.id, s]));

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
          {/* Render Connectors first (behind objects) */}
          {sim.connectors?.map((conn) => {
            const from = shapeMap.get(conn.fromId);
            const to = shapeMap.get(conn.toId);
            if (!from || !to) return null;
            const cColor = conn.color || '#a855f7';
            if (conn.type === 'spring') {
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const len = Math.hypot(dx, dy) || 1;
              const coils = 8;
              let pathStr = `M ${from.x} ${from.y}`;
              for (let i = 1; i <= coils; i++) {
                const frac = i / coils;
                const px = from.x + dx * frac;
                const py = from.y + dy * frac;
                const perpX = (-dy / len) * (i % 2 === 0 ? 8 : -8);
                const perpY = (dx / len) * (i % 2 === 0 ? 8 : -8);
                pathStr += ` L ${px + perpX} ${py + perpY}`;
              }
              pathStr += ` L ${to.x} ${to.y}`;
              return <path key={conn.id} d={pathStr} fill="none" stroke={cColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />;
            }
            if (conn.type === 'wire') {
              return <path key={conn.id} d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 + 20} ${to.x} ${to.y}`} fill="none" stroke={cColor} strokeWidth={3} strokeDasharray="6,4" />;
            }
            if (conn.type === 'ray') {
              return <line key={conn.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={cColor} strokeWidth={2} strokeDasharray="4,2" />;
            }
            return <line key={conn.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={cColor} strokeWidth={2} />;
          })}

          {/* Render Shapes */}
          {renderedShapes.map((shape) => {
            const rot = shape.angle ? `rotate(${shape.angle} ${shape.x} ${shape.y})` : undefined;
            switch (shape.type) {
              // ── Dynamic STEM Canvas Renderers ──
              case 'wave-fourier': {
                const A1 = evalVars['A1'] ?? 2;
                const f1 = evalVars['f1'] ?? 1;
                const A2 = evalVars['A2'] ?? 1;
                const f2 = evalVars['f2'] ?? 3;
                const time = evalVars['t'] ?? t;

                // Build points for wave 1, wave 2, and superposition
                let pathRes = '';
                let pathH1 = '';
                let pathH2 = '';
                const width = 500;
                const startX = 50;
                const centerY = 200;
                const ampScale = 20;

                for (let i = 0; i <= 100; i++) {
                  const xRel = (i / 100) * 10; // 10 units wide
                  const canvasX = startX + (i / 100) * width;
                  const y1 = A1 * Math.sin(2 * Math.PI * (f1 * time - xRel * 0.2));
                  const y2 = A2 * Math.sin(2 * Math.PI * (f2 * time - xRel * 0.2));
                  const ySum = y1 + y2;

                  const cyRes = centerY - ySum * ampScale;
                  const cyH1 = centerY - y1 * ampScale;
                  const cyH2 = centerY - y2 * ampScale;

                  pathRes += (i === 0 ? `M ${canvasX} ${cyRes}` : ` L ${canvasX} ${cyRes}`);
                  pathH1 += (i === 0 ? `M ${canvasX} ${cyH1}` : ` L ${canvasX} ${cyH1}`);
                  pathH2 += (i === 0 ? `M ${canvasX} ${cyH2}` : ` L ${canvasX} ${cyH2}`);
                }

                return (
                  <g key={shape.id}>
                    {/* Baseline axis */}
                    <line x1={startX} y1={centerY} x2={startX + width} y2={centerY} stroke="#475569" strokeWidth={1} strokeDasharray="4 4" />

                    {/* Component Waves (Subtle) */}
                    <path d={pathH1} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />
                    <path d={pathH2} fill="none" stroke="#ec4899" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />

                    {/* Superposition Result Wave (Bright Solid) */}
                    <path d={pathRes} fill="none" stroke="#a855f7" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />

                    {/* Spectrum Bar Indicators */}
                    <g transform="translate(60, 310)">
                      <rect x={0} y={-A1 * 10} width={25} height={A1 * 10} fill="#3b82f6" rx={3} opacity={0.85} />
                      <text x={12} y={15} fill="#94a3b8" fontSize={9} textAnchor="middle" className="font-mono">f1={f1}Hz</text>

                      <rect x={40} y={-A2 * 10} width={25} height={A2 * 10} fill="#ec4899" rx={3} opacity={0.85} />
                      <text x={52} y={15} fill="#94a3b8" fontSize={9} textAnchor="middle" className="font-mono">f2={f2}Hz</text>

                      <text x={26} y={-50} fill="#a855f7" fontSize={10} className="font-bold">Fourier Spectrum</text>
                    </g>

                    {/* Legend */}
                    <g transform="translate(380, 50)" className="text-[10px] font-mono">
                      <line x1={0} y1={0} x2={20} y2={0} stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" />
                      <text x={25} y={3} fill="#94a3b8">H1 ({A1}m, {f1}Hz)</text>
                      <line x1={0} y1={18} x2={20} y2={18} stroke="#ec4899" strokeWidth={2} strokeDasharray="3 3" />
                      <text x={25} y={21} fill="#94a3b8">H2 ({A2}m, {f2}Hz)</text>
                      <line x1={0} y1={36} x2={20} y2={36} stroke="#a855f7" strokeWidth={3.5} />
                      <text x={25} y={39} fill="#a855f7" className="font-bold">Result Superposition</text>
                    </g>
                  </g>
                );
              }

              case 'projectile-path': {
                const v0 = evalVars['v0'] ?? 25;
                const thetaDeg = evalVars['theta'] ?? 45;
                const g = evalVars['g'] ?? 9.81;
                const theta = (thetaDeg * Math.PI) / 180;
                const time = evalVars['t'] ?? t;

                const vx = v0 * Math.cos(theta);
                const vy0 = v0 * Math.sin(theta);
                const totalT = (2 * vy0) / g;
                const maxRange = (v0 * v0 * Math.sin(2 * theta)) / g;
                const maxHeight = (vy0 * vy0) / (2 * g);

                // Current projectile position
                const currentT = time % (totalT + 1);
                const projX = 80 + (currentT <= totalT ? (vx * currentT) / maxRange : 1) * 440;
                const vyT = vy0 - g * Math.min(currentT, totalT);
                const currentY = vy0 * Math.min(currentT, totalT) - 0.5 * g * Math.min(currentT, totalT) ** 2;
                const projY = 320 - (currentY / Math.max(1, maxHeight)) * 180;

                // Parabolic Arc Path
                let arcD = '';
                for (let i = 0; i <= 50; i++) {
                  const frac = i / 50;
                  const px = 80 + frac * 440;
                  const tFrac = frac * totalT;
                  const pyVal = vy0 * tFrac - 0.5 * g * tFrac ** 2;
                  const py = 320 - (pyVal / Math.max(1, maxHeight)) * 180;
                  arcD += (i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
                }

                return (
                  <g key={shape.id}>
                    {/* Ground line */}
                    <line x1={50} y1={320} x2={550} y2={320} stroke="#64748b" strokeWidth={3} />

                    {/* Parabolic Path */}
                    <path d={arcD} fill="none" stroke="#38bdf8" strokeWidth={2.5} strokeDasharray="6 4" />

                    {/* Cannon / Launcher */}
                    <g transform="translate(80, 320)">
                      <line x1={0} y1={0} x2={30 * Math.cos(-theta)} y2={30 * Math.sin(-theta)} stroke="#94a3b8" strokeWidth={6} strokeLinecap="round" />
                      <circle cx={0} cy={0} r={10} fill="#475569" />
                    </g>

                    {/* Animated Projectile Ball */}
                    <circle cx={projX} cy={projY} r={8} fill="#ef4444" className="shadow-lg" />

                    {/* Velocity Vectors on Projectile */}
                    <line x1={projX} y1={projY} x2={projX + vx * 0.8} y2={projY} stroke="#22c55e" strokeWidth={2} strokeLinecap="round" />
                    <line x1={projX} y1={projY} x2={projX} y2={projY - vyT * 0.8} stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />

                    {/* Readout labels */}
                    <text x={300} y={345} fill="#94a3b8" fontSize={10} textAnchor="middle" className="font-mono">
                      Max Range R = {maxRange.toFixed(1)}m | Max Height H = {maxHeight.toFixed(1)}m
                    </text>
                  </g>
                );
              }

              case 'circuit-loop': {
                const V0 = evalVars['V0'] ?? 120;
                const R = evalVars['R'] ?? 50;
                const I0 = evalVars['I0'] ?? (V0 / R);
                const time = evalVars['t'] ?? t;

                // Bulb brightness proportional to I0^2 * R
                const brightness = Math.min(1, (I0 ** 2 * R) / 200);

                return (
                  <g key={shape.id}>
                    {/* Main Circuit Wires */}
                    <rect x={120} y={100} width={360} height={200} fill="none" stroke="#64748b" strokeWidth={4} rx={16} />

                    {/* AC Power Source */}
                    <g transform="translate(120, 200)">
                      <circle cx={0} cy={0} r={20} fill="#1e293b" stroke="#ef4444" strokeWidth={3} />
                      <path d={`M -10 0 Q -5 -8 0 0 T 10 0`} fill="none" stroke="#ef4444" strokeWidth={2.5} />
                      <text x={-25} y={35} fill="#ef4444" fontSize={10} className="font-bold">AC Source ({V0}V)</text>
                    </g>

                    {/* Resistor Component */}
                    <g transform="translate(300, 100)">
                      <rect x={-30} y={-12} width={60} height={24} fill="#1e293b" stroke="#f59e0b" strokeWidth={2.5} rx={4} />
                      <text x={0} y={4} fill="#f59e0b" fontSize={10} textAnchor="middle" className="font-bold">R = {R}Ω</text>
                    </g>

                    {/* Light Bulb Output */}
                    <g transform="translate(480, 200)">
                      <circle cx={0} cy={0} r={22} fill={brightness > 0.1 ? `rgba(251, 191, 36, ${0.3 + brightness * 0.7})` : '#1e293b'} stroke="#fbbf24" strokeWidth={3} />
                      <path d="M -8 8 L 0 -8 L 8 8" fill="none" stroke="#fbbf24" strokeWidth={2} />
                      <text x={30} y={4} fill="#fbbf24" fontSize={10} className="font-bold">Current I = {I0.toFixed(2)}A</text>
                    </g>

                    {/* Moving Electron Dots */}
                    {[0, 0.25, 0.5, 0.75].map((frac, idx) => {
                      const posFrac = (frac + time * I0 * 0.2) % 1;
                      let ex = 120, ey = 100;
                      if (posFrac < 0.35) { ex = 120 + (posFrac / 0.35) * 360; ey = 100; }
                      else if (posFrac < 0.5) { ex = 480; ey = 100 + ((posFrac - 0.35) / 0.15) * 200; }
                      else if (posFrac < 0.85) { ex = 480 - ((posFrac - 0.5) / 0.35) * 360; ey = 300; }
                      else { ex = 120; ey = 300 - ((posFrac - 0.85) / 0.15) * 200; }
                      return <circle key={idx} cx={ex} cy={ey} r={4} fill="#38bdf8" className="shadow-sm" />;
                    })}
                  </g>
                );
              }

              case 'titration-flask': {
                const pH = evalVars['pH'] ?? 7;
                const time = evalVars['t'] ?? t;

                let fluidColor = '#38bdf8';
                if (pH < 4) fluidColor = '#ef4444';
                else if (pH < 6) fluidColor = '#f59e0b';
                else if (pH < 8) fluidColor = '#22c55e';
                else if (pH < 11) fluidColor = '#a855f7';
                else fluidColor = '#3b82f6';

                return (
                  <g key={shape.id}>
                    <g transform="translate(300, 60)">
                      <rect x={-6} y={0} width={12} height={120} fill="#1e293b" stroke="#94a3b8" strokeWidth={2} />
                      <line x1={0} y1={120} x2={0} y2={145} stroke="#94a3b8" strokeWidth={3} />
                      <circle cx={0} cy={145 + ((time * 40) % 35)} r={3} fill="#ec4899" />
                      <text x={15} y={60} fill="#94a3b8" fontSize={9} className="font-mono">Burette (Titrant)</text>
                    </g>
                    <g transform="translate(300, 270)">
                      <path d="M -15 -50 L 15 -50 L 50 30 C 50 40 -50 40 -50 30 Z" fill={fluidColor} opacity={0.75} stroke="#cbd5e1" strokeWidth={3} />
                      <text x={0} y={60} fill={fluidColor} fontSize={14} textAnchor="middle" className="font-bold">
                        Calculated pH = {pH.toFixed(2)}
                      </text>
                    </g>
                  </g>
                );
              }

              case 'pendulum-arm': {
                const A = evalVars['A'] ?? 20;
                const L = evalVars['L'] ?? 2;
                const gVal = evalVars['g'] ?? 9.81;
                const omega = Math.sqrt(gVal / Math.max(0.1, L));
                const thetaDeg = A * Math.cos(omega * (evalVars['t'] ?? t));
                const thetaRad = (thetaDeg * Math.PI) / 180;

                const armLen = 160;
                const bobX = 300 + armLen * Math.sin(thetaRad);
                const bobY = 80 + armLen * Math.cos(thetaRad);

                return (
                  <g key={shape.id}>
                    <rect x={220} y={75} width={160} height={8} fill="#475569" rx={3} />
                    <circle cx={300} cy={80} r={5} fill="#94a3b8" />
                    <line x1={300} y1={80} x2={bobX} y2={bobY} stroke="#cbd5e1" strokeWidth={3} />
                    <circle cx={bobX} cy={bobY} r={18} fill="#a855f7" className="shadow-lg" />
                    <text x={300} y={280} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-mono">
                      Angle θ = {thetaDeg.toFixed(1)}° | Period T = {(2 * Math.PI / omega).toFixed(2)}s
                    </text>
                  </g>
                );
              }

              case 'optics-lens': {
                const u = evalVars['u'] ?? 30;
                const fVal = evalVars['f'] ?? 15;
                const vVal = (u * fVal) / Math.max(0.1, u - fVal);

                return (
                  <g key={shape.id}>
                    <line x1={50} y1={200} x2={550} y2={200} stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" />
                    <path d="M 300 100 Q 320 200 300 300 Q 280 200 300 100 Z" fill="#06b6d4" opacity={0.4} stroke="#06b6d4" strokeWidth={2.5} />
                    <line x1={300 - u * 4} y1={200} x2={300 - u * 4} y2={140} stroke="#22c55e" strokeWidth={3.5} />
                    <line x1={300 + vVal * 4} y1={200} x2={300 + vVal * 4} y2={200 + 60 * (vVal / Math.max(1, u))} stroke="#ef4444" strokeWidth={3.5} />
                    <line x1={300 - u * 4} y1={140} x2={300} y2={140} stroke="#f59e0b" strokeWidth={2} />
                    <line x1={300} y1={140} x2={300 + vVal * 4} y2={200 + 60 * (vVal / Math.max(1, u))} stroke="#f59e0b" strokeWidth={2} />
                    <text x={300} y={330} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-mono">
                      Object u = {u}cm | Focal f = {fVal}cm | Image v = {vVal.toFixed(1)}cm
                    </text>
                  </g>
                );
              }

              case 'gas-piston': {
                const P = evalVars['P'] ?? 2;
                const V = evalVars['V'] ?? (10 / Math.max(0.1, P));
                const pistonY = 300 - V * 15;

                return (
                  <g key={shape.id}>
                    <rect x={240} y={100} width={120} height={200} fill="none" stroke="#64748b" strokeWidth={4} rx={6} />
                    <rect x={242} y={pistonY} width={116} height={16} fill="#f59e0b" rx={3} />
                    <line x1={300} y1={pistonY} x2={300} y2={60} stroke="#f59e0b" strokeWidth={6} />
                    <rect x={242} y={pistonY + 16} width={116} height={300 - (pistonY + 16)} fill="#38bdf8" opacity={0.3} />
                    <text x={300} y={335} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-mono">
                      Pressure P = {P.toFixed(1)} atm | Volume V = {V.toFixed(1)} L
                    </text>
                  </g>
                );
              }

              case 'atom-molecule': {
                const time = evalVars['t'] ?? t;
                return (
                  <g key={shape.id} transform="translate(300, 200)">
                    <circle cx={0} cy={0} r={18} fill="#ef4444" className="shadow-md" />
                    <ellipse cx={0} cy={0} rx={60} ry={24} fill="none" stroke="#38bdf8" strokeWidth={1.5} transform="rotate(30)" />
                    <ellipse cx={0} cy={0} rx={60} ry={24} fill="none" stroke="#38bdf8" strokeWidth={1.5} transform="rotate(-30)" />
                    <circle cx={60 * Math.cos(time * 3)} cy={24 * Math.sin(time * 3)} r={5} fill="#38bdf8" />
                    <text x={0} y={90} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-bold">Atomic Model</text>
                  </g>
                );
              }

              case 'heart-pump':
              case 'heart-rate': {
                const bpm = evalVars['bpm'] ?? 72;
                const time = evalVars['t'] ?? t;
                const pulse = 1 + 0.18 * Math.sin(2 * Math.PI * (bpm / 60) * time);
                let ecgD = 'M -90 0 L -50 0 L -40 -15 L -30 25 L -15 -45 L 0 50 L 15 -10 L 25 0 L 90 0';

                return (
                  <g key={shape.id} transform={`translate(${shape.x}, ${shape.y})`}>
                    <g transform={`scale(${pulse})`}>
                      <path d="M 0 -20 C -25 -50 -60 -10 -30 20 L 0 50 L 30 20 C 60 -10 25 -50 0 -20 Z" fill={shape.color || '#ef4444'} opacity={0.9} stroke="#dc2626" strokeWidth={3} />
                    </g>
                    <path d={ecgD} fill="none" stroke="#22c55e" strokeWidth={3} strokeLinecap="round" transform="translate(0, 75)" />
                    <text x={0} y={105} fill="#22c55e" fontSize={12} textAnchor="middle" className="font-mono font-extrabold">
                      Heart Beat ({bpm} BPM)
                    </text>
                  </g>
                );
              }

              case 'atom-molecule':
              case 'atom': {
                const time = evalVars['t'] ?? t;
                const eAngle1 = time * 3;
                const eAngle2 = time * 2.5 + 1;
                const eAngle3 = time * 4 + 2;

                return (
                  <g key={shape.id} transform={`translate(${shape.x}, ${shape.y})`}>
                    <ellipse rx={60} ry={20} fill="none" stroke="#06b6d4" strokeWidth={2} opacity={0.6} />
                    <ellipse rx={60} ry={20} fill="none" stroke="#a855f7" strokeWidth={2} opacity={0.6} transform="rotate(60)" />
                    <ellipse rx={60} ry={20} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.6} transform="rotate(120)" />

                    <circle cx={-5} cy={-5} r={8} fill="#ef4444" />
                    <circle cx={5} cy={-2} r={8} fill="#3b82f6" />
                    <circle cx={-2} cy={6} r={8} fill="#ef4444" />
                    <circle cx={4} cy={4} r={8} fill="#3b82f6" />

                    <circle cx={Math.cos(eAngle1) * 60} cy={Math.sin(eAngle1) * 20} r={5} fill="#38bdf8" />
                    <g transform="rotate(60)">
                      <circle cx={Math.cos(eAngle2) * 60} cy={Math.sin(eAngle2) * 20} r={5} fill="#c084fc" />
                    </g>
                    <g transform="rotate(120)">
                      <circle cx={Math.cos(eAngle3) * 60} cy={Math.sin(eAngle3) * 20} r={5} fill="#60a5fa" />
                    </g>
                    <text x={0} y={80} fill="#38bdf8" fontSize={11} textAnchor="middle" className="font-bold font-mono">
                      Rutherford-Bohr Atom Model
                    </text>
                  </g>
                );
              }

              case 'optics-lens':
              case 'lens-convex':
              case 'lens-concave': {
                const f = evalVars['f'] ?? 150;
                return (
                  <g key={shape.id} transform={`translate(${shape.x}, ${shape.y})`}>
                    <line x1={-250} y1={0} x2={250} y2={0} stroke="#64748b" strokeWidth={2} strokeDasharray="6 4" />
                    <path d="M 0 -110 C 35 -40 35 40 0 110 C -35 40 -35 -40 0 -110 Z" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth={3} />
                    <circle cx={-f} cy={0} r={4} fill="#f59e0b" />
                    <circle cx={f} cy={0} r={4} fill="#f59e0b" />
                    <line x1={-250} y1={-50} x2={0} y2={-50} stroke="#ef4444" strokeWidth={2.5} />
                    <line x1={0} y1={-50} x2={f} y2={0} stroke="#ef4444" strokeWidth={2.5} />
                    <line x1={-250} y1={50} x2={0} y2={50} stroke="#ef4444" strokeWidth={2.5} />
                    <line x1={0} y1={50} x2={f} y2={0} stroke="#ef4444" strokeWidth={2.5} />
                  </g>
                );
              }

              case 'logic-gate': {
                const inA = (evalVars['A'] ?? 1) > 0 ? 1 : 0;
                const inB = (evalVars['B'] ?? 1) > 0 ? 1 : 0;
                const outVal = (inA && inB) ? 1 : 0;

                return (
                  <g key={shape.id} transform={`translate(${shape.x}, ${shape.y})`}>
                    <line x1={-120} y1={-30} x2={-50} y2={-30} stroke={inA ? '#22c55e' : '#64748b'} strokeWidth={4} />
                    <line x1={-120} y1={30} x2={-50} y2={30} stroke={inB ? '#22c55e' : '#64748b'} strokeWidth={4} />
                    <path d="M -50 -50 L 0 -50 A 50 50 0 0 1 0 50 L -50 50 Z" fill="#1e293b" stroke="#a855f7" strokeWidth={3.5} />
                    <line x1={50} y1={0} x2={120} y2={0} stroke={outVal ? '#22c55e' : '#64748b'} strokeWidth={4} />
                    <circle cx={135} cy={0} r={14} fill={outVal ? '#22c55e' : '#1e293b'} stroke="#22c55e" strokeWidth={3} />
                    <text x={-20} y={6} fill="#a855f7" fontSize={16} textAnchor="middle" className="font-black">AND</text>
                  </g>
                );
              }
              case 'spring': {
                const startX = 100;
                const endX = Math.max(startX + 40, shape.x);
                const coils = 12;
                const step = (endX - startX) / coils;
                let pathD = `M ${startX} ${shape.y}`;
                for (let i = 1; i <= coils; i++) {
                  const px = startX + i * step - step / 2;
                  const py = i % 2 === 1 ? shape.y - 18 : shape.y + 18;
                  pathD += ` L ${px} ${py}`;
                }
                pathD += ` L ${endX} ${shape.y}`;
                return (
                  <path key={shape.id} d={pathD} fill="none" stroke={shape.color || '#8b5cf6'} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                );
              }

              case 'wall': {
                return (
                  <g key={shape.id}>
                    <rect x={shape.x - 15} y={shape.y - 120} width={20} height={240} fill="#334155" stroke="#64748b" strokeWidth={2} />
                    {[...Array(8)].map((_, i) => (
                      <line key={i} x1={shape.x - 15} y1={shape.y - 110 + i * 30} x2={shape.x - 30} y2={shape.y - 95 + i * 30} stroke="#64748b" strokeWidth={2} />
                    ))}
                  </g>
                );
              }

              case 'ground': {
                return (
                  <g key={shape.id}>
                    <line x1={80} y1={shape.y} x2={720} y2={shape.y} stroke="#64748b" strokeWidth={4} />
                    {[...Array(20)].map((_, i) => (
                      <line key={i} x1={90 + i * 30} y1={shape.y} x2={75 + i * 30} y2={shape.y + 15} stroke="#475569" strokeWidth={2} />
                    ))}
                  </g>
                );
              }

              case 'wave': {
                let waveD = '';
                for (let i = 0; i <= 100; i++) {
                  const px = 100 + i * 6;
                  const py = shape.y + Math.sin(i * 0.15 - t * 6) * 18;
                  waveD += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
                }
                return (
                  <path key={shape.id} d={waveD} fill="none" stroke={shape.color || '#06b6d4'} strokeWidth={3.5} strokeLinecap="round" />
                );
              }

              case 'pendulum': {
                const angle = Math.sin(t * 3) * 0.4;
                const len = 180;
                const bobX = shape.x + Math.sin(angle) * len;
                const bobY = shape.y + Math.cos(angle) * len;
                return (
                  <g key={shape.id}>
                    <circle cx={shape.x} cy={shape.y} r={6} fill="#94a3b8" />
                    <line x1={shape.x} y1={shape.y} x2={bobX} y2={bobY} stroke="#94a3b8" strokeWidth={3} />
                    <circle cx={bobX} cy={bobY} r={18} fill={shape.color || '#f59e0b'} stroke="#cbd5e1" strokeWidth={2} />
                  </g>
                );
              }

              case 'circle':
              case 'ball':
                return (
                  <circle
                    key={shape.id}
                    cx={shape.x}
                    cy={shape.y}
                    r={Math.max(1, shape.radius || shape.width || 12)}
                    fill={shape.color}
                    className="transition-all duration-75"
                  />
                );
              case 'rectangle':
              case 'block':
                return (
                  <rect
                    key={shape.id}
                    x={shape.x - shape.width / 2}
                    y={shape.y - shape.height / 2}
                    width={Math.max(1, shape.width)}
                    height={Math.max(1, shape.height)}
                    fill={shape.color}
                    transform={rot}
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
                    points={`${shape.x},${shape.y} ${shape.x2 || (shape.x - 15)},${shape.y2 || (shape.y + 25)} ${shape.x3 || (shape.x + 15)},${shape.y3 || (shape.y + 25)}`}
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
                    {shape.textContent || shape.label}
                  </text>
                );
              default:
                return (
                  <g key={shape.id} transform={rot}>
                    <circle cx={shape.x} cy={shape.y} r={Math.max(8, shape.width / 2 || 12)} fill={shape.color} opacity={0.85} />
                    <text x={shape.x} y={shape.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize={10} className="font-bold">
                      {shape.label ? shape.label.slice(0, 3) : shape.type.slice(0, 3)}
                    </text>
                  </g>
                );
            }
          })}

          {/* Render Vector Overlays */}
          {sim.vectors?.map((v) => {
            const tgt = shapeMap.get(v.targetObjectId);
            if (!tgt) return null;
            const mag = evaluateEquation(v.magExpr || '30', evalVars, 30);
            const ang = evaluateEquation(v.angleExpr || '0', evalVars, 0) * (Math.PI / 180);
            const vx = tgt.x + mag * Math.cos(ang);
            const vy = tgt.y + mag * Math.sin(ang);
            return (
              <g key={v.id}>
                <line x1={tgt.x} y1={tgt.y} x2={vx} y2={vy} stroke={v.color || '#ef4444'} strokeWidth={3} strokeLinecap="round" />
                <polygon points={`${vx},${vy} ${vx - 6 * Math.cos(ang - 0.4)},${vy - 6 * Math.sin(ang - 0.4)} ${vx - 6 * Math.cos(ang + 0.4)},${vy - 6 * Math.sin(ang + 0.4)}`} fill={v.color || '#ef4444'} />
                <text x={vx + 10} y={vy} fill={v.color || '#ef4444'} fontSize={10} className="font-bold">{v.label || v.vectorType}</text>
              </g>
            );
          })}
        </svg>

        {/* Time & Result HUD overlay */}
        <div className="absolute top-3 left-4 flex flex-col gap-1.5 z-20">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow">
            <PlayCircle size={13} className="text-emerald-500 animate-pulse" />
            t = {t.toFixed(2)}s
          </div>
          {formulaResult !== null && sim.resultName && (
            <div className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-xs font-mono text-indigo-300 font-bold shadow">
              {sim.resultName} = {formulaResult.toFixed(2)} {sim.resultUnit || ''}
            </div>
          )}
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
