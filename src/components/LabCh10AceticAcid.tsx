import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface LabProps { onExit?: () => void; }

// Molar masses
const M_ACETIC = 60.05; // g/mol CH3COOH
const M_NA = 22.99;     // g/mol Na
const M_NA2CO3 = 106.0; // g/mol Na2CO3
const DENSITY_VINEGAR = 1.005; // g/mL
const PERCENT_ACETIC = 0.05;   // 5% acetic acid in vinegar
const MOLAR_VOLUME_STP = 22.4; // L/mol at STP

// Reactions:
// Rxn 1: 2 CH3COOH + 2 Na → 2 CH3COONa + H2   (H2 produced)
// Rxn 2: 2 CH3COOH + Na2CO3 → 2 CH3COONa + H2O + CO2  (CO2 produced)

type DataRow = {
  reaction: number;
  reagentMass: number;
  volumeVinegar: number;
  molesAcid: number;
  molesReagent: number;
  gasType: string;
  volumeGasSTP: number;
  limitingReagent: string;
};

type Reaction = 1 | 2;

export default function LabCh10AceticAcid({ onExit }: LabProps) {
  const [activeRxn, setActiveRxn] = useState<Reaction>(1);
  const [volumeVinegar, setVolumeVinegar] = useState(15); // mL
  const [massNa, setMassNa] = useState(0.5); // g
  const [massNa2CO3, setMassNa2CO3] = useState(5.0); // g
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [rxnActive, setRxnActive] = useState(false);
  const [tick, setTick] = useState(0);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rxnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => setTick(t => t + 1), 120);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, []);

  // Moles calculations
  const molesAcid = (volumeVinegar * DENSITY_VINEGAR * PERCENT_ACETIC) / M_ACETIC;
  const massReagent = activeRxn === 1 ? massNa : massNa2CO3;
  const molesReagent = activeRxn === 1 ? massNa / M_NA : massNa2CO3 / M_NA2CO3;

  // Stoichiometry: ratio is 2:2 for rxn1, 2:1 for rxn2
  const molesAcidNeededForReagent = activeRxn === 1 ? molesReagent * 1.0 : molesReagent * 2.0;
  const limitingReagent = molesAcid < molesAcidNeededForReagent ? 'Acetic Acid' : (activeRxn === 1 ? 'Na' : 'Na₂CO₃');

  // Moles of gas produced (based on limiting reagent)
  const molesGasProduced = activeRxn === 1
    ? Math.min(molesAcid / 2, molesReagent / 2) // H2: ratio 1:1 with pairs
    : Math.min(molesAcid / 2, molesReagent);     // CO2: ratio 1:1 with Na2CO3

  const volumeGasSTP = molesGasProduced * MOLAR_VOLUME_STP;

  const triggerReaction = () => {
    setRxnActive(true);
    if (rxnTimerRef.current) clearTimeout(rxnTimerRef.current);
    rxnTimerRef.current = setTimeout(() => setRxnActive(false), 3000);
  };

  const recordData = () => {
    triggerReaction();
    setDataRows(prev => [...prev, {
      reaction: activeRxn,
      reagentMass: parseFloat(massReagent.toFixed(2)),
      volumeVinegar,
      molesAcid: parseFloat(molesAcid.toFixed(4)),
      molesReagent: parseFloat(molesReagent.toFixed(4)),
      gasType: activeRxn === 1 ? 'H₂' : 'CO₂',
      volumeGasSTP: parseFloat(volumeGasSTP.toFixed(3)),
      limitingReagent,
    }]);
  };

  const checkAnswer = () => {
    const a1 = answer1.trim().toLowerCase();
    const a2 = answer2.trim();
    let ok1 = a1.includes('reaction 1') || a1.includes('rxn 1') || a1.includes('sodium metal') || a1.includes('na metal') || a1.includes('1') && a1.includes('danger');
    let ok1b = a1.includes('vigorous') || a1.includes('dangerous') || a1.includes('h₂') || a1.includes('h2') || a1.includes('burns') || a1.includes('flame');
    const calcMolesGas = parseFloat(a2);
    // Assessment answer: moles CO2 for rxn2 with 15mL vinegar and 5g Na2CO3
    const refAcid = (15 * DENSITY_VINEGAR * PERCENT_ACETIC) / M_ACETIC;
    const refNa2CO3 = 5.0 / M_NA2CO3;
    const refGas = Math.min(refAcid / 2, refNa2CO3);
    const ok2 = !isNaN(calcMolesGas) && Math.abs(calcMolesGas - refGas) < 0.01;

    if ((ok1 && ok1b) && ok2) {
      setFeedback({ type: 'success', message: `✓ Both correct! Reaction 1 (Na metal) is far more vigorous and dangerous — Na reacts with water too, H₂ produced can ignite. Calculated CO₂ ≈ ${refGas.toFixed(4)} mol — well done!` });
    } else if (ok1 && ok1b) {
      setFeedback({ type: 'error', message: `✓ Q1 correct! But Q2 moles of gas: check your calculation. Hint: n(CO₂) = min(n(CH₃COOH)/2, n(Na₂CO₃)) = ${refGas.toFixed(4)} mol for 15 mL vinegar + 5 g Na₂CO₃.` });
    } else if (ok2) {
      setFeedback({ type: 'error', message: `✓ Q2 moles correct (${refGas.toFixed(4)} mol)! But Q1: Reaction 1 with Na metal is far more vigorous. Na reacts violently, producing H₂ gas which is flammable.` });
    } else {
      setFeedback({ type: 'error', message: `✗ Review both answers. Q1: Which reaction produces H₂? Na reacts more vigorously and dangerously. Q2: n(CO₂) = min(n(acid)/2, n(Na₂CO₃)). For 15 mL + 5 g: ≈ ${refGas.toFixed(4)} mol.` });
    }
  };

  const reset = () => { setDataRows([]); setAnswer1(''); setAnswer2(''); setFeedback({ type: '', message: '' }); setRxnActive(false); };

  // SVG animation helpers
  const bubbleCount = rxnActive ? (activeRxn === 1 ? 22 : 10) : 0;
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => {
    const phase = (tick * 0.6 + i * 1.1) % 10;
    const x = 100 + (i % 8) * 18 + Math.sin(i * 2.3) * 8;
    const y = 200 - phase * 18;
    const r = activeRxn === 1 ? 3.5 + (i % 4) : 3 + (i % 3);
    const opacity = phase < 9 ? 0.75 : 0;
    return { x, y, r, opacity };
  });

  // Flame for Na rxn
  const flameOpacity = rxnActive && activeRxn === 1 ? 0.85 + Math.sin(tick * 0.8) * 0.15 : 0;
  const sparkPositions = Array.from({ length: 6 }, (_, i) => ({
    x: 160 + Math.sin(tick * 0.4 + i * 1.5) * 25,
    y: 120 - Math.abs(Math.sin(tick * 0.6 + i * 2)) * 40,
    r: 2 + Math.random() * 2,
    opacity: rxnActive && activeRxn === 1 ? 0.8 : 0,
  }));

  // Powder dissolving for Na2CO3
  const powderDissolved = rxnActive && activeRxn === 2;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-3 flex items-center justify-between sticky top-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {onExit && <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>}
          <div>
            <h1 className="text-lg font-bold text-slate-800">Activity 11.1 — Reactions of Vinegar (Ethanoic Acid)</h1>
            <p className="text-xs text-slate-500">CH₃COOH + Na metal | CH₃COOH + Na₂CO₃ — stoichiometry &amp; gas production</p>
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
              <p><strong>Ethanoic acid (CH₃COOH)</strong> in vinegar is a weak organic acid that reacts with both metals and carbonates.</p>
              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs font-mono text-red-900 space-y-1">
                <div className="font-bold">Reaction 1 — Na metal (DANGEROUS):</div>
                <div>2CH₃COOH + 2Na →</div>
                <div>2CH₃COONa + H₂↑</div>
                <div className="text-red-500">⚠ Vigorous, exothermic, H₂ ignites!</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs font-mono text-blue-900 space-y-1">
                <div className="font-bold">Reaction 2 — Na₂CO₃ (gentle):</div>
                <div>2CH₃COOH + Na₂CO₃ →</div>
                <div>2CH₃COONa + H₂O + CO₂↑</div>
                <div className="text-blue-600">Gentle fizzing, safe to handle.</div>
              </div>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-bold text-slate-700">Moles Calculation:</div>
                <div className="font-mono">n(CH₃COOH) = (V × ρ × %)/M</div>
                <div className="text-slate-500">V = volume (mL), ρ = 1.005 g/mL</div>
                <div className="text-slate-500">% = 0.05 (5% vinegar), M = 60.05 g/mol</div>
              </div>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-bold text-slate-700">Gas volume at STP:</div>
                <div className="font-mono">V(gas) = n × 22.4 L/mol</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Controls</h2>
            <div className="space-y-4">
              {/* Reaction toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Reaction</label>
                <div className="flex gap-2">
                  <button onClick={() => setActiveRxn(1)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border ${activeRxn === 1 ? 'bg-red-600 text-white border-red-600 shadow' : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50'}`}>
                    Rxn 1: +Na
                  </button>
                  <button onClick={() => setActiveRxn(2)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border ${activeRxn === 2 ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'}`}>
                    Rxn 2: +Na₂CO₃
                  </button>
                </div>
              </div>

              {/* Vinegar slider */}
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Volume of Vinegar</span>
                  <span className="font-bold text-teal-700">{volumeVinegar} mL</span>
                </label>
                <input type="range" min="5" max="30" step="1" value={volumeVinegar}
                  onChange={e => setVolumeVinegar(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5 mL</span><span>30 mL</span></div>
              </div>

              {/* Reagent slider */}
              {activeRxn === 1 ? (
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Mass of Na metal</span>
                    <span className="font-bold text-red-700">{massNa.toFixed(2)} g</span>
                  </label>
                  <input type="range" min="0.1" max="1.0" step="0.05" value={massNa}
                    onChange={e => setMassNa(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.1 g</span><span>1.0 g</span></div>
                </div>
              ) : (
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Mass of Na₂CO₃</span>
                    <span className="font-bold text-blue-700">{massNa2CO3.toFixed(1)} g</span>
                  </label>
                  <input type="range" min="1" max="10" step="0.5" value={massNa2CO3}
                    onChange={e => setMassNa2CO3(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 g</span><span>10 g</span></div>
                </div>
              )}

              {/* Live moles display */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-slate-700 text-[11px] mb-1">Live Stoichiometry:</div>
                <div className="flex justify-between"><span className="text-slate-600">n(CH₃COOH):</span><span className="text-teal-700 font-bold">{molesAcid.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-600">n({activeRxn === 1 ? 'Na' : 'Na₂CO₃'}):</span><span className={`font-bold ${activeRxn === 1 ? 'text-red-700' : 'text-blue-700'}`}>{molesReagent.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Limiting reagent:</span><span className="text-amber-700 font-bold">{limitingReagent}</span></div>
                <div className="border-t border-slate-200 pt-1 flex justify-between"><span className="text-slate-600">n({activeRxn === 1 ? 'H₂' : 'CO₂'}):</span><span className="text-purple-700 font-bold">{molesGasProduced.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-600">V(gas) @ STP:</span><span className="text-purple-700 font-bold">{(volumeGasSTP * 1000).toFixed(1)} mL</span></div>
              </div>

              <button onClick={recordData}
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors shadow text-white ${activeRxn === 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                ▶ Run Reaction &amp; Record
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: SVG Simulation */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1">
            <h2 className="text-base font-bold text-slate-800 mb-1 border-b pb-2">
              Simulation — {activeRxn === 1 ? 'CH₃COOH + Na (⚠ Dangerous!)' : 'CH₃COOH + Na₂CO₃'}
            </h2>
            <svg viewBox="0 0 400 360" className="w-full">
              <defs>
                <linearGradient id="aa-vinegar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef9c3" />
                  <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
                <linearGradient id="aa-beaker" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(200,230,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(200,230,255,0.25)" />
                </linearGradient>
                <filter id="aa-glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="aa-blur">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
              </defs>

              {/* Lab bench */}
              <rect x={0} y={325} width={400} height={35} fill="#cbd5e1" />
              <rect x={0} y={320} width={400} height={8} fill="#94a3b8" />

              {/* Beaker */}
              <path d="M90,80 L90,290 Q90,310 110,310 L290,310 Q310,310 310,290 L310,80 Z"
                fill="url(#aa-beaker)" stroke="#94a3b8" strokeWidth={2.5} />

              {/* Vinegar liquid */}
              <clipPath id="aa-liqClip">
                <path d="M92,200 L92,290 Q92,308 110,308 L290,308 Q308,308 308,290 L308,200 Z" />
              </clipPath>
              <path d="M92,200 L92,290 Q92,308 110,308 L290,308 Q308,308 308,290 L308,200 Z"
                fill="url(#aa-vinegar)" opacity={0.9} clipPath="url(#aa-liqClip)" />

              {/* Liquid surface ripple when reacting */}
              {rxnActive && (
                <ellipse cx={200} cy={200} rx={100 + Math.sin(tick * 0.8) * 5} ry={6}
                  fill="none" stroke="rgba(200,200,100,0.5)" strokeWidth={2} />
              )}

              {/* Bubbles */}
              {bubbles.map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={b.r}
                  fill={activeRxn === 1 ? 'rgba(255,255,255,0.8)' : 'rgba(220,240,255,0.8)'}
                  stroke={activeRxn === 1 ? 'rgba(200,200,255,0.5)' : 'rgba(100,180,255,0.4)'}
                  strokeWidth={0.5} opacity={b.opacity} />
              ))}

              {/* Gas label */}
              {rxnActive && (
                <text x={200} y={60 - (tick % 5) * 6} textAnchor="middle" fontSize={14} fontWeight="bold"
                  fill={activeRxn === 1 ? '#dc2626' : '#2563eb'} opacity={0.9} filter="url(#aa-glow)">
                  {activeRxn === 1 ? 'H₂ ↑' : 'CO₂ ↑'}
                </text>
              )}

              {/* Reagent: Na metal chunk or Na2CO3 powder */}
              {activeRxn === 1 ? (
                <g>
                  {/* Na metal chunk */}
                  <rect x={170} y={rxnActive ? 175 + Math.sin(tick * 0.3) * 3 : 170} width={30} height={22} rx={4}
                    fill="#e5e7eb" stroke="#9ca3af" strokeWidth={2} />
                  <text x={185} y={rxnActive ? 188 + Math.sin(tick * 0.3) * 3 : 183} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">Na</text>

                  {/* Yellow flame on Na */}
                  {rxnActive && (
                    <g opacity={flameOpacity} filter="url(#aa-glow)">
                      <ellipse cx={185} cy={168} rx={14} ry={20} fill="#fbbf24" />
                      <ellipse cx={185} cy={160} rx={8} ry={14} fill="#f97316" />
                      <ellipse cx={185} cy={155} rx={5} ry={8} fill="#ef4444" />
                    </g>
                  )}

                  {/* Sparks */}
                  {sparkPositions.map((sp, i) => (
                    <circle key={i} cx={sp.x} cy={sp.y} r={sp.r}
                      fill="#fbbf24" opacity={sp.opacity} filter="url(#aa-glow)" />
                  ))}

                  {/* H2 gas arrows */}
                  {rxnActive && [0,1,2].map(i => (
                    <text key={i} x={120 + i * 50} y={40 + (tick * 4 + i * 20) % 50 - 50}
                      fontSize={10} fill="#6366f1" opacity={0.7} fontWeight="bold">H₂</text>
                  ))}

                  {/* Danger label */}
                  <rect x={100} y={335} width={200} height={18} rx={4} fill="#fef2f2" stroke="#fca5a5" />
                  <text x={200} y={347} textAnchor="middle" fontSize={9} fill="#dc2626" fontWeight="bold">⚠ DANGER: Na + water/acid → fire hazard!</text>
                </g>
              ) : (
                <g>
                  {/* Na2CO3 powder pile */}
                  {!powderDissolved ? (
                    <g>
                      <ellipse cx={200} cy={210} rx={45} ry={12} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.5} />
                      <ellipse cx={200} cy={205} rx={38} ry={9} fill="white" opacity={0.9} />
                      <text x={200} y={208} textAnchor="middle" fontSize={8} fill="#64748b" fontWeight="bold">Na₂CO₃</text>
                    </g>
                  ) : (
                    <g opacity={0.4}>
                      {[0,1,2,3,4].map(i => (
                        <ellipse key={i} cx={170 + i * 15} cy={210 + Math.sin(i * 0.9) * 5} rx={6} ry={3}
                          fill="white" stroke="#e2e8f0" strokeWidth={1} />
                      ))}
                    </g>
                  )}

                  {/* CO2 bubbles - gentler */}
                  {rxnActive && [0,1,2].map(i => (
                    <circle key={i} cx={160 + i * 40} cy={160 + (tick * 3 + i * 15) % 50 - 50}
                      r={5} fill="rgba(219,234,254,0.7)" stroke="rgba(147,197,253,0.5)" strokeWidth={1} opacity={0.8} />
                  ))}

                  <rect x={100} y={335} width={200} height={18} rx={4} fill="#eff6ff" stroke="#bfdbfe" />
                  <text x={200} y={347} textAnchor="middle" fontSize={9} fill="#1d4ed8" fontWeight="bold">Gentle fizzing — CO₂ produced safely</text>
                </g>
              )}

              {/* Beaker labels */}
              <text x={200} y={230} textAnchor="middle" fontSize={11} fill="#a16207" opacity={0.7}>Vinegar (CH₃COOH aq)</text>
              <text x={200} y={244} textAnchor="middle" fontSize={9} fill="#a16207" opacity={0.5}>{volumeVinegar} mL · 5% solution</text>

              {/* Volume marker lines */}
              {[0.25, 0.5, 0.75].map(f => (
                <g key={f}>
                  <line x1={92} y1={290 - f * 90} x2={104} y2={290 - f * 90} stroke="#94a3b8" strokeWidth={1} />
                  <text x={106} y={294 - f * 90} fontSize={8} fill="#94a3b8">{(volumeVinegar * f).toFixed(0)} mL</text>
                </g>
              ))}

              {/* Glass highlight */}
              <rect x={96} y={85} width={12} height={220} rx={6} fill="rgba(255,255,255,0.25)" />

              {/* Reaction status */}
              <rect x={100} y={10} width={200} height={26} rx={6}
                fill={rxnActive ? (activeRxn === 1 ? '#fef2f2' : '#eff6ff') : '#f8fafc'}
                stroke={rxnActive ? (activeRxn === 1 ? '#fca5a5' : '#bfdbfe') : '#e2e8f0'} />
              <text x={200} y={27} textAnchor="middle" fontSize={10} fontWeight="bold"
                fill={rxnActive ? (activeRxn === 1 ? '#dc2626' : '#2563eb') : '#94a3b8'}>
                {rxnActive ? (activeRxn === 1 ? '⚡ REACTING — Vigorous!' : '🫧 Reacting — Gentle CO₂') : '● Awaiting reaction...'}
              </text>
            </svg>
          </div>
        </div>

        {/* Column 3: Data + Assessment */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Data Log</h2>
            <div className="overflow-auto max-h-56 rounded border border-slate-100">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-1 font-semibold text-slate-600">Rxn</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">V(mL)</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">m(g)</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">n(acid)</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">n(reagent)</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">Gas</th>
                    <th className="py-2 px-1 font-semibold text-slate-600">V(L)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, i) => (
                    <tr key={i} className={`border-t border-slate-100 hover:bg-slate-50 ${row.reaction === 1 ? 'bg-red-50' : 'bg-blue-50'}`}>
                      <td className="py-1.5 px-1 text-center font-bold">{row.reaction}</td>
                      <td className="py-1.5 px-1 text-center font-mono">{row.volumeVinegar}</td>
                      <td className="py-1.5 px-1 text-center font-mono">{row.reagentMass}</td>
                      <td className="py-1.5 px-1 text-center font-mono text-teal-700">{row.molesAcid.toFixed(4)}</td>
                      <td className="py-1.5 px-1 text-center font-mono text-purple-700">{row.molesReagent.toFixed(4)}</td>
                      <td className="py-1.5 px-1 text-center font-bold">{row.gasType}</td>
                      <td className="py-1.5 px-1 text-center font-mono text-slate-700">{row.volumeGasSTP.toFixed(3)}</td>
                    </tr>
                  ))}
                  {dataRows.length === 0 && (
                    <tr><td colSpan={7} className="py-6 text-slate-400 text-center">Run a reaction to record data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-1">* V(L) = volume of gas at STP (22.4 L/mol). Rows coloured: red = Rxn 1, blue = Rxn 2.</p>
          </div>

          {/* Moles Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-2 border-b pb-2">Gas Production Comparison</h2>
            {dataRows.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-6">Run reactions to see comparison</div>
            ) : (
              <svg viewBox="0 0 280 150" className="w-full">
                <line x1={40} y1={10} x2={40} y2={120} stroke="#94a3b8" strokeWidth={1} />
                <line x1={40} y1={120} x2={270} y2={120} stroke="#94a3b8" strokeWidth={1} />
                <text x={10} y={70} textAnchor="middle" fontSize={7} fill="#64748b" transform="rotate(-90,10,70)">n(gas) mol</text>
                {[0.25, 0.5, 0.75, 1.0].map(f => {
                  const maxN = Math.max(0.001, ...dataRows.map(r => r.molesGasProduced || r.volumeGasSTP / MOLAR_VOLUME_STP));
                  return (
                    <g key={f}>
                      <line x1={40} y1={120 - f * 110} x2={270} y2={120 - f * 110} stroke="#f1f5f9" strokeWidth={1} />
                      <text x={34} y={124 - f * 110} textAnchor="end" fontSize={6} fill="#94a3b8">{(maxN * f).toFixed(3)}</text>
                    </g>
                  );
                })}
                {dataRows.slice(-6).map((row, idx) => {
                  const n = row.volumeGasSTP / MOLAR_VOLUME_STP;
                  const maxN = Math.max(0.001, ...dataRows.map(r => r.volumeGasSTP / MOLAR_VOLUME_STP));
                  const bH = (n / maxN) * 110;
                  const bx = 50 + idx * 36;
                  const col = row.reaction === 1 ? '#dc2626' : '#2563eb';
                  return (
                    <g key={idx}>
                      <rect x={bx} y={120 - bH} width={26} height={bH} fill={col} rx={2} opacity={0.8} />
                      <text x={bx + 13} y={120 - bH - 3} textAnchor="middle" fontSize={6} fill={col} fontWeight="bold">{n.toFixed(3)}</text>
                      <text x={bx + 13} y={134} textAnchor="middle" fontSize={6} fill="#64748b">{row.gasType}</text>
                      <text x={bx + 13} y={143} textAnchor="middle" fontSize={5} fill="#94a3b8">R{row.reaction}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Assessment */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4">
            <h2 className="text-base font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">📋 Assessment</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-amber-50 rounded-lg p-3 text-slate-700 space-y-2">
                <p className="font-semibold text-xs">Q1: Which reaction is MORE vigorous and dangerous? Why?</p>
                <textarea value={answer1} onChange={e => setAnswer1(e.target.value)} rows={2}
                  className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="e.g. Reaction 1 with Na metal is more dangerous because..." />
              </div>

              <div className="bg-amber-50 rounded-lg p-3 text-slate-700 space-y-2">
                <p className="font-semibold text-xs">Q2 — Calculation:</p>
                <div className="text-xs bg-white border rounded p-2 space-y-0.5">
                  <p>Using <strong>15 mL vinegar</strong> + <strong>5 g Na₂CO₃</strong> (Reaction 2):</p>
                  <p>Calculate moles of CO₂ produced.</p>
                  <p className="text-slate-400 text-[10px]">Hint: n(CO₂) = min(n(CH₃COOH)/2, n(Na₂CO₃)). Answer within ±0.01 mol accepted.</p>
                </div>
                <input type="number" step="0.0001" value={answer2} onChange={e => setAnswer2(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                  placeholder="Moles of CO₂ (e.g. 0.0625)" />
                <button onClick={checkAnswer} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                  Check Both Answers
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 space-y-1">
                <p className="font-semibold">Reference data:</p>
                <div className="font-mono grid grid-cols-2 gap-1">
                  <span>M(CH₃COOH) = 60.05 g/mol</span>
                  <span>M(Na) = 22.99 g/mol</span>
                  <span>M(Na₂CO₃) = 106.0 g/mol</span>
                  <span>Molar vol = 22.4 L/mol</span>
                </div>
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
