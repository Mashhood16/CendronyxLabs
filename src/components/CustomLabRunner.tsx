import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslate } from '../i18n';
import { theme } from '../utils/labTheme';
import LabHeader from './LabHeader';
import { customLabService, type CustomLab } from '../services/customLabService';
import DataChart from './DataChart';
import { evaluateEquation } from '../utils/equationEvaluator';
import { CustomSimulationRenderer } from './CustomSimulationRenderer';

interface CustomLabRunnerProps {
  moduleId: string;
  onExit?: () => void;
}

export default function CustomLabRunner({ moduleId, onExit }: CustomLabRunnerProps) {
  const { t } = useTranslate();
  const [lab, setLab] = useState<CustomLab | null>(null);
  const [loading, setLoading] = useState(true);
  const [simState, setSimState] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<any[]>([]);

  // Interactive Pendulum Variables
  const pendulumAngleRef = useRef(0.5); // Initial angle in radians
  const pendulumVelRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Custom Physics Sandbox Variables
  const customCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const customAnimationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!lab) return;

    const hasCustomSim = lab.layout.some(w => w.props?.simType === 'custom');
    if (!hasCustomSim) return;

    const canvas = customCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const loop = (now: number) => {
      const timeVal = (now - startTime) / 1000.0; // t in seconds

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const customWidget = lab.layout.find(w => w.props?.simType === 'custom');
      const shapes = customWidget?.props?.shapes || [];

      // Evaluation variables context: time t, and current controls state bindings
      const evalContext: Record<string, number> = { t: timeVal };
      Object.keys(simState).forEach(key => {
        const val = Number(simState[key]);
        if (!isNaN(val)) {
          evalContext[key] = val;
        }
      });

      shapes.forEach((shape: any) => {
        ctx.save();

        const x = evaluateEquation(shape.xExpr, evalContext, 200);
        const y = evaluateEquation(shape.yExpr, evalContext, 130);
        const w = evaluateEquation(shape.wExpr, evalContext, 30);
        const h = evaluateEquation(shape.hExpr, evalContext, 30);
        const angle = evaluateEquation(shape.angleExpr, evalContext, 0);

        ctx.fillStyle = shape.color || '#4f46e5';
        ctx.strokeStyle = shape.color || '#4f46e5';
        ctx.lineWidth = 3;

        // Center transformation
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);

        if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, w), 0, Math.PI * 2);
          ctx.fill();
        } else if (shape.type === 'rect') {
          ctx.fillRect(-w / 2, -h / 2, Math.max(1, w), Math.max(1, h));
        } else if (shape.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(w - x, h - y);
          ctx.stroke();
        }

        ctx.restore();
      });

      customAnimationFrameId.current = requestAnimationFrame(loop);
    };

    customAnimationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (customAnimationFrameId.current) {
        cancelAnimationFrame(customAnimationFrameId.current);
      }
    };
  }, [lab, simState]);

  // Load Custom Lab
  useEffect(() => {
    customLabService.getLab(moduleId).then((loadedLab) => {
      if (loadedLab) {
        setLab(loadedLab);
        // Initialize state variables from widgets
        const initialState: Record<string, any> = {};
        loadedLab.layout.forEach((widget: any) => {
          if (widget.props?.stateKey !== undefined) {
            initialState[widget.props.stateKey] = widget.props.defaultValue ?? 0;
          }
        });
        setSimState(initialState);
      }
      setLoading(false);
    });
  }, [moduleId]);

  // Real-time Physics Simulator Loop for Pendulum / Animation
  useEffect(() => {
    if (!lab) return;

    const hasPendulum = lab.layout.some(w => w.props?.simType === 'pendulum');
    if (!hasPendulum) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt at 100ms
      lastTime = time;

      // Physics settings
      const lengthVal = Number(simState.pendulumLength || 1.5); // in meters
      const gravityVal = Number(simState.pendulumGravity || 9.8); // m/s^2
      const damping = 0.992; // air resistance

      // Pendulum equations: theta'' = -(g/L) * sin(theta)
      const accel = -(gravityVal / lengthVal) * Math.sin(pendulumAngleRef.current);
      pendulumVelRef.current = (pendulumVelRef.current + accel * dt) * damping;
      pendulumAngleRef.current += pendulumVelRef.current * dt;

      // Draw Pendulum
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = 40;
      const pixelLength = lengthVal * 80; // scale factor

      const bobX = centerX + pixelLength * Math.sin(pendulumAngleRef.current);
      const bobY = centerY + pixelLength * Math.cos(pendulumAngleRef.current);

      // Draw support stand
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY);
      ctx.lineTo(centerX + 40, centerY);
      ctx.stroke();

      // Draw wire string
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Draw anchor point
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw bob weight
      const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, 15);
      bobGrad.addColorStop(0, '#60a5fa');
      bobGrad.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = bobGrad;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Text status display
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`Period: ${(2 * Math.PI * Math.sqrt(lengthVal / gravityVal)).toFixed(2)}s`, 15, 30);
      ctx.fillText(`Angle: ${(pendulumAngleRef.current * (180 / Math.PI)).toFixed(1)}°`, 15, 50);

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [lab, simState.pendulumLength, simState.pendulumGravity]);

  // Logging simulation data periodically for charts
  useEffect(() => {
    if (!lab) return;
    const hasChart = lab.layout.some(w => w.type === 'chart');
    if (!hasChart) return;

    const interval = setInterval(() => {
      setChartData(prev => {
        const nextTime = prev.length * 0.5;
        const entry = {
          time: `${nextTime.toFixed(1)}s`,
          Value: simState.circuitVoltage || simState.pendulumLength || 10,
          Reference: simState.circuitResistance || simState.pendulumGravity || 5
        };
        // keep last 20 data points
        const updated = [...prev, entry];
        return updated.slice(-20);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [lab, simState]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium">{t("Loading your custom lab...")}</p>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Lab Not Found</h3>
        <p className="text-slate-500 mb-6">The requested custom simulation could not be loaded.</p>
        <button onClick={onExit} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md">
          Back to Selection
        </button>
      </div>
    );
  }

  // Render Widgets
  const renderWidget = (widget: any) => {
    const { id, type, title, props } = widget;

    switch (type) {
      case 'instruction':
        return (
          <div key={id} className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 mb-4">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2 text-indigo-500" />
              {title || 'Objective / Procedure'}
            </h3>
            <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed whitespace-pre-line">
              {props.content || 'Follow instructions to complete simulation.'}
            </p>
          </div>
        );

      case 'slider':
        return (
          <div key={id} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</label>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-bold">
                {simState[props.stateKey] ?? props.defaultValue} {props.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={props.min ?? 0}
              max={props.max ?? 100}
              step={props.step ?? 1}
              value={simState[props.stateKey] ?? props.defaultValue}
              onChange={(e) => setSimState(prev => ({ ...prev, [props.stateKey]: Number(e.target.value) }))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme.slider.track}`}
            />
          </div>
        );

      case 'toggle':
        return (
          <div key={id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
            <button
              onClick={() => setSimState(prev => ({ ...prev, [props.stateKey]: !prev[props.stateKey] }))}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                simState[props.stateKey] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  simState[props.stateKey] ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</label>
            <select
              value={simState[props.stateKey] ?? ''}
              onChange={(e) => setSimState(prev => ({ ...prev, [props.stateKey]: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
            >
              {(props.options || '').split(',').map((opt: string) => (
                <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
              ))}
            </select>
          </div>
        );

      case 'button':
        return (
          <button
            key={id}
            onClick={() => {
              // Custom simple check mechanism
              if (props.actionType === 'verify') {
                alert('Success! System parameters verified successfully.');
              } else {
                setSimState(prev => ({ ...prev, [props.stateKey]: props.defaultValue }));
              }
            }}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors flex items-center justify-center gap-2 mb-4 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Play size={18} />
            {title}
          </button>
        );

      case 'chart':
        return (
          <div key={id} className="mb-6 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-2xl">
            <DataChart
              title={title || 'Simulation Real-Time Plot'}
              xAxisKey="time"
              xAxisLabel="Time"
              series={[
                { key: 'Value', name: 'Primary Parameter', color: '#4f46e5' },
                { key: 'Reference', name: 'Secondary Parameter', color: '#10b981' }
              ]}
              data={chartData}
              onRecord={() => {}}
              onReset={() => setChartData([])}
            />
          </div>
        );

      case 'simulation':
        if (props.simType === 'custom') {
          return (
            <div key={id} className="flex flex-col items-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{title || 'Custom Physics Sandbox'}</h4>
              <canvas ref={customCanvasRef} width={400} height={260} className="w-full bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800" />
            </div>
          );
        }

        if (props.simType === 'pendulum') {
          return (
            <div key={id} className="flex flex-col items-center p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Interactive Pendulum Sim</h4>
              <canvas ref={canvasRef} width={400} height={260} className="w-full bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800" />
            </div>
          );
        }

        if (props.simType === 'circuit') {
          const voltage = Number(simState.circuitVoltage || 6);
          const resistance = Number(simState.circuitResistance || 10);
          const isOpen = !simState.circuitSwitch;
          const current = isOpen ? 0 : voltage / resistance;
          const brightness = isOpen ? 0 : Math.min(current * 1.5, 3); // cap brightness at 3

          return (
            <div key={id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Interactive Electrical Circuit</h4>
              <div className="relative w-full h-48 bg-white dark:bg-black rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Circuit wire diagram */}
                <svg className="absolute inset-0 w-full h-full stroke-slate-400 dark:stroke-slate-700 fill-none" strokeWidth="4">
                  <path d="M 60 40 L 340 40 L 340 160 L 60 160 Z" />
                </svg>

                {/* Battery Block */}
                <div className="absolute left-[30px] top-[70px] w-[60px] h-[60px] bg-indigo-600 text-white rounded-lg flex flex-col items-center justify-center font-bold text-xs shadow-md">
                  <div>🔋</div>
                  <div>{voltage.toFixed(1)}V</div>
                </div>

                {/* Light Bulb Block */}
                <div className="absolute right-[30px] top-[70px] w-[60px] h-[60px] bg-slate-200 dark:bg-slate-800 rounded-full flex flex-col items-center justify-center font-bold text-xs border border-slate-300 transition-shadow duration-300" style={{
                  boxShadow: brightness > 0 ? `0 0 ${brightness * 15}px ${brightness * 8}px rgba(253, 224, 71, 0.7)` : 'none',
                  backgroundColor: brightness > 0 ? '#fef08a' : undefined
                }}>
                  <div className="text-lg">💡</div>
                  <div className={brightness > 0 ? 'text-yellow-800' : 'text-slate-400'}>
                    {brightness > 0 ? 'ON' : 'OFF'}
                  </div>
                </div>

                {/* Switch Block */}
                <div className="absolute bottom-[20px] left-[150px] w-[100px] h-[36px] bg-slate-800 dark:bg-slate-700 text-white rounded-md flex items-center justify-center font-semibold text-xs cursor-pointer shadow-sm" onClick={() => setSimState(prev => ({ ...prev, circuitSwitch: !prev.circuitSwitch }))}>
                  {isOpen ? '🚫 Switch: OPEN' : '⚡ Switch: CLOSED'}
                </div>

                {/* Current Display */}
                <div className="absolute top-[8px] left-[130px] text-[11px] font-mono text-slate-500 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded border">
                  Current: {current.toFixed(2)} A
                </div>
              </div>
            </div>
          );
        }

        if (props.simType === 'titration') {
          const drops = Number(simState.titrationDrops || 0);
          const acidConcentration = Number(simState.acidConcentration || 0.1);
          const baseConcentration = Number(simState.baseConcentration || 0.1);

          // pH calculation: start with base pH = 13, adding drops reduces pH
          // pH = 13 - (drops * 0.2 * (acidConcentration/baseConcentration))
          const ph = Math.max(1, 13 - (drops * 0.15 * (acidConcentration / baseConcentration)));

          // Indicator color based on pH (phenolphthalein: pink > 8.2, clear < 8.2)
          const isPink = ph > 8.2;
          const flaskBg = isPink 
            ? `rgba(236, 72, 153, ${Math.min(1, (ph - 8) / 3)})` 
            : 'rgba(219, 234, 254, 0.4)'; // clear blue/water

          return (
            <div key={id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Acid-Base Titration Mixer</h4>
              <div className="flex gap-4 items-center justify-center bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                
                {/* Burette Graphic */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-24 bg-slate-200 border-l border-r border-slate-400 relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-300" style={{ height: `${Math.max(0, 100 - drops * 4)}%` }}></div>
                  </div>
                  <div className="w-8 h-4 bg-slate-600 rounded flex items-center justify-center text-[10px] text-white font-bold font-mono">
                    VALVE
                  </div>
                  <div className="h-12 w-0.5 bg-blue-400 border-dashed border"></div>
                </div>

                {/* Beaker / Flask Graphic */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-8 bg-slate-200 border-l border-r border-t border-slate-400 rounded-t-md"></div>
                  <div className="w-24 h-20 border-l border-r border-b border-slate-400 rounded-b-3xl relative overflow-hidden transition-colors duration-500" style={{
                    backgroundColor: flaskBg
                  }}>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-slate-800 dark:text-white">
                      pH: {ph.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setSimState(prev => ({ ...prev, titrationDrops: Math.min(25, (prev.titrationDrops || 0) + 1) }))} className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shadow">
                      💧 Add Drop
                    </button>
                    <button onClick={() => setSimState(prev => ({ ...prev, titrationDrops: 0 }))} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        if (props.simType === 'dna') {
          const bases = ['A', 'T', 'C', 'G'];
          const pairs: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
          const activeBase = simState.dnaActiveBase || 'A';
          const pairedBase = simState.dnaPairedBase || '';
          const isMatch = pairs[activeBase] === pairedBase;

          return (
            <div key={id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">🧬 DNA Helix Base Pairing</h4>
              <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-center items-center gap-6 h-36">
                  {/* Left Strand (Active Base) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow">
                      {activeBase}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase font-sans">Template</span>
                  </div>

                  {/* Hydrogen bonds connection */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-1.5 border-t-2 border-b-2 border-dashed border-slate-200 dark:border-slate-800 h-10 px-4">
                    {pairedBase ? (
                      isMatch ? (
                        <span className="text-emerald-500 text-xs font-bold animate-pulse">
                          🟢 Correct ({activeBase === 'A' || activeBase === 'T' ? '2' : '3'} H-Bonds)
                        </span>
                      ) : (
                        <span className="text-rose-500 text-xs font-bold">🔴 Mismatch!</span>
                      )
                    ) : (
                      <span className="text-slate-400 text-[10px] italic">Select pairing base</span>
                    )}
                  </div>

                  {/* Right Strand (Paired Base Choice) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${
                      pairedBase 
                        ? isMatch ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600'
                        : 'border-dashed border-slate-300 text-slate-400 dark:border-slate-700'
                    }`}>
                      {pairedBase || '?'}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase font-sans">Complement</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  {bases.map(b => (
                    <button
                      key={b}
                      onClick={() => setSimState(prev => ({ ...prev, dnaPairedBase: b }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        pairedBase === b 
                          ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      Pair {b}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const nextBase = bases[(bases.indexOf(activeBase) + 1) % bases.length];
                      setSimState(prev => ({ ...prev, dnaActiveBase: nextBase, dnaPairedBase: '' }));
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all dark:bg-slate-800 dark:text-slate-300"
                  >
                    Next Base 🔄
                  </button>
                </div>
              </div>
            </div>
          );
        }

        if (props.simType === 'fraction') {
          const numerator = Math.max(0, Math.min(12, Number(simState.fractionNumerator ?? 3)));
          const denominator = Math.max(1, Math.min(12, Number(simState.fractionDenominator ?? 8)));
          const actualNumerator = Math.min(numerator, denominator); // cap numerator at denominator value
          
          // Generates SVG slices for pie visualizer
          const slices = [];
          for (let i = 0; i < denominator; i++) {
            const angle = 360 / denominator;
            const startAngle = i * angle - 90;
            const endAngle = (i + 1) * angle - 90;
            
            // convert to radians
            const radStart = (startAngle * Math.PI) / 180;
            const radEnd = (endAngle * Math.PI) / 180;
            
            // coords
            const x1 = 100 + 80 * Math.cos(radStart);
            const y1 = 100 + 80 * Math.sin(radStart);
            const x2 = 100 + 80 * Math.cos(radEnd);
            const y2 = 100 + 80 * Math.sin(radEnd);
            
            const largeArc = angle > 180 ? 1 : 0;
            const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            const isFilled = i < actualNumerator;
            slices.push(
              <path
                key={i}
                d={pathData}
                className={`${
                  isFilled 
                    ? 'fill-indigo-600 stroke-white dark:stroke-black dark:fill-indigo-500' 
                    : 'fill-slate-100 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-800'
                }`}
                strokeWidth="1.5"
              />
            );
          }

          return (
            <div key={id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">📐 Fraction Visualizer</h4>
              <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-around gap-4">
                <svg className="w-52 h-52 drop-shadow-md">
                  <circle cx="100" cy="100" r="80" className="fill-none stroke-slate-200 dark:stroke-slate-800" strokeWidth="2" />
                  {slices}
                </svg>
                <div className="text-center md:text-left space-y-2">
                  <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit font-sans">
                    {actualNumerator} / {denominator}
                  </div>
                  <div className="text-sm font-semibold text-slate-500">
                    Percentage: {((actualNumerator / denominator) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-slate-400 max-w-[180px] leading-relaxed">
                    Adjust numerator and denominator using the controls.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (props.simType === 'binary') {
          const binaryString = simState.binaryByte || '00000000';
          const bits = binaryString.split('').map((c: string) => c === '1' ? 1 : 0);
          
          const handleToggleBit = (idx: number) => {
            const newBits = [...bits];
            newBits[idx] = newBits[idx] === 1 ? 0 : 1;
            setSimState(prev => ({ ...prev, binaryByte: newBits.join('') }));
          };

          const decimalValue = bits.reduce((acc: number, bit: number, idx: number) => acc + bit * Math.pow(2, 7 - idx), 0);

          return (
            <div key={id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">💻 Binary-to-Decimal Converter</h4>
              <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                
                <div className="flex gap-2 justify-center">
                  {bits.map((bit: number, idx: number) => {
                    const weight = Math.pow(2, 7 - idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleBit(idx)}
                        className={`w-9 h-14 rounded-lg flex flex-col justify-around items-center border font-bold transition-all ${
                          bit === 1
                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-500/10'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-[9px] font-semibold text-slate-400">{weight}</span>
                        <span className="text-sm font-extrabold">{bit}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-left bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[10px] space-y-1 text-slate-500 dark:text-slate-400 max-h-24 overflow-y-auto">
                  {bits.map((bit: number, idx: number) => {
                    const weight = Math.pow(2, 7 - idx);
                    if (bit === 0) return null;
                    return (
                      <div key={idx}>
                        Bit {7 - idx}: <span className="text-indigo-600 dark:text-indigo-400">1</span> × {weight} = {weight}
                      </div>
                    );
                  })}
                  {decimalValue === 0 && <div className="text-center italic">All bits are off (0)</div>}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Decimal Result:</span>
                  <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-outfit">
                    {decimalValue}
                  </span>
                </div>
              </div>
            </div>
          );
        }

        return null;

      default:
        return null;
    }
  };

  const leftWidgets = lab.layout.filter((w: any) => w.type !== 'simulation' && w.type !== 'chart');
  const rightWidgets = lab.layout.filter((w: any) => w.type === 'simulation' || w.type === 'chart');

  const leftColumn = (
    <div className="space-y-4 flex-1 flex flex-col">
      {leftWidgets.map(w => renderWidget(w))}
      {leftWidgets.length === 0 && (
        <p className="text-slate-400 italic text-sm text-center py-10">Configure control widgets in the editor sidebar.</p>
      )}
    </div>
  );

  const rightColumn = (
    <div className="space-y-4 flex-1 flex flex-col justify-center">
      {rightWidgets.map(w => renderWidget(w))}
      {rightWidgets.length === 0 && (
        <p className="text-slate-400 italic text-sm text-center py-10">Configure simulation widgets in the editor sidebar.</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      {/* Dynamic Header */}
      <LabHeader
        onExit={onExit}
        title={lab.title}
        subtitle={lab.desc}
        rightContent={
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 bg-white/20 text-white rounded-full font-bold uppercase tracking-wider">
              {lab.subject} - Class {lab.classLevel}
            </span>
            <span className="text-xs px-3 py-1 bg-black/20 text-white/95 rounded-full font-semibold">
              Credits: {lab.creatorName || 'Anonymous'}
            </span>
          </div>
        }
      />

      {/* Lab Main View */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className={`p-6 ${theme.card.bg} border ${theme.card.border} rounded-3xl shadow-sm flex flex-col h-full min-h-[500px]`}>
          {leftColumn}
        </div>
        <div className={`p-6 ${theme.card.bg} border ${theme.card.border} rounded-3xl shadow-sm flex flex-col h-full min-h-[500px]`}>
          {rightColumn}
        </div>
      </main>
    </div>
  );
}
