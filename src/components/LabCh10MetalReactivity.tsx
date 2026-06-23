import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface LabProps { onExit?: () => void; }

const METALS = [
  { name: 'Magnesium', symbol: 'Mg', reactivity: 4, stripColor: '#c8c8d8', borderColor: '#8888a8', trueRate: 18.0, equation: 'Mg + 2HCl → MgCl₂ + H₂↑', position: 1, description: 'Very high reactivity. Vigorous fizzing. Strong exothermic reaction. Mg is above H in electrochemical series.' },
  { name: 'Zinc', symbol: 'Zn', reactivity: 3, stripColor: '#b0ccd8', borderColor: '#6090a8', trueRate: 9.0, equation: 'Zn + 2HCl → ZnCl₂ + H₂↑', position: 2, description: 'Moderate reactivity. Steady bubbling. Noticeable heat production.' },
  { name: 'Iron', symbol: 'Fe', reactivity: 2, stripColor: '#b09a8a', borderColor: '#806050', trueRate: 3.5, equation: 'Fe + 2HCl → FeCl₂ + H₂↑', position: 3, description: 'Low reactivity. Slow, occasional bubbles. Slight warming observed.' },
  { name: 'Copper', symbol: 'Cu', reactivity: 0, stripColor: '#d49050', borderColor: '#a06020', trueRate: 0, equation: 'Cu + HCl → No Reaction', position: 4, description: 'No reaction. Copper is below H in electrochemical series. No bubbles, no temperature change.' },
];

type DataRow = { metal: string; conc: number; bubbleRate: number; timeTo: number };

function getNoise(seed: number, t: number) {
  return Math.sin(seed * 13.7 + t * 0.3) * 0.02;
}

export default function LabCh10MetalReactivity({ onExit }: LabProps) {
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);
  const [concentration, setConcentration] = useState(1.0);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [tick, setTick] = useState(0);
  const [noiseSeed] = useState(() => Math.random() * 100);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => setTick(t => t + 1), 200);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, []);

  const getMeasuredRate = (metal: typeof METALS[0], conc: number) => {
    const trueRate = metal.trueRate * (conc / 1.0);
    if (trueRate === 0) return 0;
    const noise = 1 + getNoise(noiseSeed + metal.reactivity, tick);
    return Math.max(0, trueRate * noise);
  };

  const currentRate = getMeasuredRate(selectedMetal, concentration);
  const timeToComplete = selectedMetal.reactivity === 0 ? Infinity : Math.max(5, 80 / currentRate);

  const recordData = () => {
    const rate = getMeasuredRate(selectedMetal, concentration);
    const timeTo = selectedMetal.reactivity === 0 ? 999 : Math.max(5, 80 / rate + (Math.random() - 0.5) * 2);
    const exists = dataRows.find(r => r.metal === selectedMetal.name && Math.abs(r.conc - concentration) < 0.05);
    if (exists) return;
    setDataRows(prev => [...prev, { metal: selectedMetal.name, conc: concentration, bubbleRate: parseFloat(rate.toFixed(2)), timeTo: parseFloat(timeTo.toFixed(1)) }]);
  };

  const checkAnswer = () => {
    const normalized = answer.trim().toLowerCase().replace(/\s+/g, '');
    const acceptable = ['magnesium,zinc,iron,copper', 'mg,zn,fe,cu'];
    if (acceptable.includes(normalized)) {
      setFeedback({ type: 'success', message: '✓ Correct! Mg > Zn > Fe > Cu. This matches the standard electrochemical series. Metals above hydrogen react with dilute acids; copper does not.' });
    } else {
      setFeedback({ type: 'error', message: '✗ Incorrect. Check your bubble rate data: higher rate = higher reactivity. Remember copper showed no reaction at all.' });
    }
  };

  const reset = () => { setDataRows([]); setAnswer(''); setFeedback({ type: '', message: '' }); };

  const getBubbles = (metal: typeof METALS[0], conc: number) => {
    if (metal.reactivity === 0) return [];
    const rate = metal.trueRate * (conc / 1.0);
    const count = Math.round(rate * 0.8);
    return Array.from({ length: Math.min(count, 14) }, (_, i) => {
      const phase = (tick * 0.5 + i * 1.3 + metal.reactivity) % 8;
      const xOff = (i % 5) * 8 + Math.sin(i * 2.1) * 4;
      const y = 210 - phase * 20;
      const opacity = phase < 7 ? 0.8 : 0;
      const r = 2.5 + (i % 3);
      return { xOff, y, r, opacity };
    });
  };

  const sortedByRate = [...dataRows].sort((a, b) => b.bubbleRate - a.bubbleRate);
  const maxRate = Math.max(1, ...dataRows.map(r => r.bubbleRate));
  const tempIndicator = selectedMetal.reactivity === 0 ? '20.0' : (20 + currentRate * 0.4).toFixed(1);

  const barColors = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-3 flex items-center justify-between sticky top-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {onExit && <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>}
          <div>
            <h1 className="text-lg font-bold text-slate-800">Activity 7.1 — Metal Reactivity Series</h1>
            <p className="text-xs text-slate-500">Investigate reaction rates of metals with hydrochloric acid (HCl)</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto w-full">

        {/* Column 1: Theory & Setup */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Theory</h2>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Metals above hydrogen in the <strong>electrochemical (reactivity) series</strong> displace H⁺ from dilute acids, producing hydrogen gas (H₂).</p>
              <div className="bg-green-50 border border-green-200 p-2 rounded font-mono text-xs text-center text-green-800">
                Metal + HCl → Metal Chloride + H₂↑
              </div>
              <p>Bubble rate ∝ reaction rate ∝ metal reactivity. Higher concentration of HCl also increases rate (collision theory).</p>
              <div className="bg-slate-100 rounded p-3 space-y-1 text-xs font-mono">
                <div className="text-green-700 font-bold">↑ More Reactive</div>
                {['Magnesium (Mg)', 'Zinc (Zn)', 'Iron (Fe)', '── Hydrogen (H₂) ──', 'Copper (Cu)'].map((m, i) => (
                  <div key={i} className={`${m.includes('Hydrogen') ? 'text-slate-400 border-y border-dashed border-slate-300 py-0.5 text-center' : m.includes('Magnesium') ? 'text-green-700 font-bold' : m.includes('Copper') ? 'text-red-500' : 'text-slate-700'}`}>{m}</div>
                ))}
                <div className="text-red-500 font-bold">↓ Less Reactive</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Metal</label>
                <div className="grid grid-cols-2 gap-2">
                  {METALS.map(m => (
                    <button key={m.name} onClick={() => setSelectedMetal(m)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${selectedMetal.name === m.name ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                      {m.symbol} — {m.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>HCl Concentration</span>
                  <span className="font-bold text-green-700">{concentration.toFixed(1)} mol/dm³</span>
                </label>
                <input type="range" min="0.1" max="2.0" step="0.1" value={concentration}
                  onChange={e => setConcentration(Number(e.target.value))}
                  className="w-full accent-green-600 cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.1</span><span>2.0 mol/dm³</span></div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-800">{selectedMetal.name} ({selectedMetal.symbol})</div>
                <p>{selectedMetal.description}</p>
                <div className="font-mono bg-white border rounded p-1.5 text-green-800 text-[11px]">{selectedMetal.equation}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                  <div className="text-xs text-blue-600 font-medium">Bubble Rate</div>
                  <div className="text-xl font-bold font-mono text-blue-800">{currentRate.toFixed(1)}</div>
                  <div className="text-xs text-blue-500">bubbles/s</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                  <div className="text-xs text-orange-600 font-medium">Temperature</div>
                  <div className="text-xl font-bold font-mono text-orange-800">{tempIndicator}</div>
                  <div className="text-xs text-orange-500">°C</div>
                </div>
              </div>
              <div className="bg-slate-100 rounded p-2 text-center text-xs text-slate-500">
                Est. reaction time: <span className="font-bold text-slate-700">{selectedMetal.reactivity === 0 ? 'No reaction' : `${timeToComplete.toFixed(0)} s`}</span>
              </div>
              <button onClick={recordData}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors shadow">
                ⊕ Record Data Point
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: SVG Simulation */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1">
            <h2 className="text-base font-bold text-slate-800 mb-1 border-b pb-2">Simulation — Test Tubes in HCl</h2>
            <div className="text-xs text-slate-500 mb-2 text-center">
              Viewing: <span className="font-bold text-green-700">{selectedMetal.name}</span> in {concentration.toFixed(1)} mol/dm³ HCl
            </div>
            <svg viewBox="0 0 420 310" className="w-full">
              <defs>
                <linearGradient id="mr-acidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d1fae5" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
                <linearGradient id="mr-acidHot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef9c3" />
                  <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
                <linearGradient id="mr-glass" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(200,230,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(200,230,255,0.2)" />
                </linearGradient>
                <filter id="mr-glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Title */}
              <text x={210} y={18} textAnchor="middle" fontSize={11} fill="#475569" fontWeight="bold">HCl (aq) — {concentration.toFixed(1)} mol/dm³</text>

              {METALS.map((metal, idx) => {
                const isSelected = metal.name === selectedMetal.name;
                const cx = 55 + idx * 82;
                const bubbles = getBubbles(metal, concentration);
                const liquidColor = (metal.reactivity > 0 && isSelected) ? 'url(#mr-acidHot)' : 'url(#mr-acidGrad)';
                const heatGlow = isSelected && metal.reactivity > 0 ? Math.min(1, currentRate / 20) : 0;

                return (
                  <g key={metal.name} onClick={() => setSelectedMetal(metal)} style={{ cursor: 'pointer' }}>
                    {/* Selection ring */}
                    {isSelected && (
                      <ellipse cx={cx} cy={150} rx={24} ry={105} fill="none" stroke="#16a34a" strokeWidth={2.5} strokeDasharray="6 3" opacity={0.7} />
                    )}

                    {/* Test tube body */}
                    <rect x={cx - 20} y={35} width={40} height={200} rx={20} fill="url(#mr-glass)" stroke={isSelected ? '#16a34a' : '#94a3b8'} strokeWidth={isSelected ? 2 : 1.5} />

                    {/* Liquid */}
                    <clipPath id={`mr-clip-${idx}`}><rect x={cx - 18} y={100} width={36} height={130} rx={16} /></clipPath>
                    <rect x={cx - 18} y={100} width={36} height={130} rx={16} fill={liquidColor} opacity={0.88} clipPath={`url(#mr-clip-${idx})`} />

                    {/* Heat shimmer overlay */}
                    {heatGlow > 0 && (
                      <rect x={cx - 18} y={100} width={36} height={130} rx={16} fill={`rgba(255,200,0,${heatGlow * 0.15})`} clipPath={`url(#mr-clip-${idx})`} />
                    )}

                    {/* Bubbles */}
                    {bubbles.map((b, bi) => (
                      <circle key={bi} cx={cx - 8 + b.xOff % 16} cy={b.y} r={b.r} fill="rgba(255,255,255,0.75)" stroke="rgba(100,200,150,0.5)" strokeWidth={0.5} opacity={b.opacity} />
                    ))}

                    {/* Metal strip */}
                    <rect x={cx - 5} y={80} width={10} height={80} rx={2} fill={metal.stripColor} stroke={metal.borderColor} strokeWidth={1.5} />
                    {[0, 1, 2, 3].map(i => (
                      <line key={i} x1={cx - 4} y1={90 + i * 18} x2={cx + 4} y2={90 + i * 18} stroke={metal.borderColor} strokeWidth={0.8} opacity={0.5} />
                    ))}

                    {/* Reaction cross for Cu */}
                    {metal.reactivity === 0 && (
                      <g>
                        <line x1={cx - 10} y1={145} x2={cx + 10} y2={165} stroke="#ef4444" strokeWidth={2.5} opacity={0.85} />
                        <line x1={cx + 10} y1={145} x2={cx - 10} y2={165} stroke="#ef4444" strokeWidth={2.5} opacity={0.85} />
                        <text x={cx} y={185} textAnchor="middle" fontSize={7} fill="#ef4444" fontWeight="bold">NO REACTION</text>
                      </g>
                    )}

                    {/* H₂ gas label for reactive metals */}
                    {metal.reactivity > 0 && isSelected && currentRate > 0.5 && (
                      <text x={cx + 14} y={70 - (tick % 4) * 6} textAnchor="start" fontSize={7.5} fill="#16a34a" fontWeight="bold" opacity={0.8}>H₂↑</text>
                    )}

                    {/* Temperature dot */}
                    {metal.reactivity > 0 && isSelected && (
                      <circle cx={cx + 18} cy={115} r={5} fill={`rgb(255,${Math.max(0, 220 - heatGlow * 180)},0)`} opacity={0.8} filter="url(#mr-glow)" />
                    )}

                    {/* Metal label */}
                    <text x={cx} y={250} textAnchor="middle" fontSize={11} fontWeight={isSelected ? 'bold' : 'normal'} fill={isSelected ? '#16a34a' : '#475569'}>{metal.symbol}</text>
                    <text x={cx} y={263} textAnchor="middle" fontSize={8} fill="#94a3b8">{metal.name}</text>
                    <text x={cx} y={278} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="bold">
                      {metal.reactivity === 0 ? 'No Rxn' : `~${(metal.trueRate * (concentration / 1.0)).toFixed(1)}/s`}
                    </text>
                  </g>
                );
              })}

              {/* Warning banner */}
              {selectedMetal.name === 'Magnesium' && concentration > 1.4 && (
                <g>
                  <rect x={5} y={292} width={410} height={16} rx={4} fill="#fef2f2" stroke="#fca5a5" />
                  <text x={210} y={303} textAnchor="middle" fontSize={8.5} fill="#dc2626" fontWeight="bold">⚠ High concentration + Mg: vigorous exothermic reaction — use fume hood!</text>
                </g>
              )}
            </svg>

            {/* Reactivity bar scale */}
            <div className="mt-2 bg-slate-50 rounded-lg p-2">
              <div className="text-xs text-center text-slate-500 mb-1 font-medium">Relative Reactivity (visual guide)</div>
              <div className="flex items-end gap-1 h-10">
                {METALS.map((m, i) => (
                  <div key={m.name} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t" style={{ height: `${m.reactivity * 9 + 4}px`, backgroundColor: barColors[i], opacity: selectedMetal.name === m.name ? 1 : 0.5 }} />
                    <span className="text-[9px] text-slate-500">{m.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Data + Graph + Assessment */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Data Log</h2>
            <div className="overflow-auto max-h-44 rounded border border-slate-100">
              <table className="w-full text-xs text-center">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-2 font-semibold text-slate-600">Metal</th>
                    <th className="py-2 px-2 font-semibold text-slate-600">[HCl]</th>
                    <th className="py-2 px-2 font-semibold text-slate-600">Rate (bbl/s)</th>
                    <th className="py-2 px-2 font-semibold text-slate-600">t-cmplt (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByRate.map((row, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-1.5 px-2 font-medium text-slate-800">{row.metal}</td>
                      <td className="py-1.5 px-2 font-mono">{row.conc.toFixed(1)}</td>
                      <td className="py-1.5 px-2 font-mono font-bold text-blue-700">{row.bubbleRate}</td>
                      <td className="py-1.5 px-2 font-mono text-orange-700">{row.timeTo === 999 ? '∞' : row.timeTo}</td>
                    </tr>
                  ))}
                  {dataRows.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-slate-400">No data yet — record observations</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-1">* Sorted by rate (desc). ±2% random noise applied.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Reaction Rate Bar Chart</h2>
            {dataRows.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8">Record data to see chart</div>
            ) : (
              <svg viewBox="0 0 300 180" className="w-full">
                <line x1={38} y1={10} x2={38} y2={150} stroke="#94a3b8" strokeWidth={1} />
                <line x1={38} y1={150} x2={290} y2={150} stroke="#94a3b8" strokeWidth={1} />
                <text x={10} y={85} textAnchor="middle" fontSize={8} fill="#64748b" transform="rotate(-90,10,85)">Rate (bbl/s)</text>
                {[0.25, 0.5, 0.75, 1.0].map(f => (
                  <g key={f}>
                    <line x1={38} y1={150 - f * 140} x2={290} y2={150 - f * 140} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3" />
                    <text x={34} y={154 - f * 140} textAnchor="end" fontSize={7} fill="#94a3b8">{(maxRate * f).toFixed(1)}</text>
                  </g>
                ))}
                {METALS.filter(m => dataRows.some(r => r.metal === m.name)).map((metal, idx) => {
                  const row = dataRows.find(r => r.metal === metal.name);
                  if (!row) return null;
                  const bH = (row.bubbleRate / maxRate) * 140;
                  const bx = 48 + idx * 62;
                  return (
                    <g key={metal.name}>
                      <rect x={bx} y={150 - bH} width={44} height={bH} fill={barColors[idx]} rx={3} opacity={0.85} />
                      <text x={bx + 22} y={150 - bH - 4} textAnchor="middle" fontSize={8} fill={barColors[idx]} fontWeight="bold">{row.bubbleRate}</text>
                      <text x={bx + 22} y={164} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="bold">{metal.symbol}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4">
            <h2 className="text-base font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">📋 Assessment</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-amber-50 rounded-lg p-3 text-slate-700 space-y-2">
                <p className="font-semibold text-sm">Q1 — Reactivity Order:</p>
                <p className="text-xs">Based on your bubble rate data, list the 4 metals in <strong>decreasing order of reactivity</strong>.</p>
                <p className="text-xs text-slate-500">Format: comma-separated, e.g.: Magnesium, Zinc, Iron, Copper</p>
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                  placeholder="Metal1, Metal2, Metal3, Metal4" />
                <button onClick={checkAnswer} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                  Check Answer
                </button>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-slate-700 space-y-1">
                <p className="font-semibold text-xs">Q2 — Mystery Metal X:</p>
                <p className="text-xs">Metal X has a bubble rate of <strong>6.0 bbl/s</strong> at 1.0 mol/dm³ HCl.</p>
                <p className="text-xs text-slate-500">Where does it fit? Compare with your Zn (9.0/s) and Fe (3.5/s) data.</p>
                <div className="text-xs font-mono bg-white border rounded p-1.5 text-purple-800">Answer: X sits between <strong>Zinc</strong> and <strong>Iron</strong> (Zn &gt; X &gt; Fe)</div>
              </div>
              {feedback.type && (
                <div className={`p-3 rounded-lg text-xs ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                  {feedback.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
