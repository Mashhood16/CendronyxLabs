import { useState, useEffect, useMemo } from 'react';
import {
  Sun, Activity, CheckCircle, Zap, Thermometer, 
  Droplets, BarChart3, Lightbulb, BookOpen, ArrowRight
} from 'lucide-react';
import LabHeader from './LabHeader';
import DeepDivePanel from './DeepDivePanel';
import FrontierApplicationsPanel from './FrontierApplicationsPanel';
import type { FrontierTopic } from './FrontierApplicationsPanel';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';

// Semiconductor band gap data (eV)
const MATERIALS = [
  { name: 'Silicon (c-Si)', bandGap: 1.12, type: 'Indirect', efficiency: 27.6, cost: 'Low', color: '#3b82f6' },
  { name: 'GaAs', bandGap: 1.43, type: 'Direct', efficiency: 31.1, cost: 'High', color: '#8b5cf6' },
  { name: 'Perovskite', bandGap: 1.55, type: 'Direct', efficiency: 26.1, cost: 'Low', color: '#f59e0b' },
  { name: 'CdTe', bandGap: 1.45, type: 'Direct', efficiency: 22.1, cost: 'Medium', color: '#10b981' },
  { name: 'CIGS', bandGap: 1.15, type: 'Direct', efficiency: 23.6, cost: 'Medium', color: '#ef4444' },
];

const SHOCKLEY_QUEISSER_LIMIT = 33.7; // Single-junction max efficiency %

export default function LabP12SolarCell({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Solar Cell Design Parameters
  const [material, setMaterial] = useState(0);
  const [thickness, setThickness] = useState(200); // μm
  const [temperature, setTemperature] = useState(25); // °C
  const [irradiance, setIrradiance] = useState(1000); // W/m²
  const [recombinationRate, setRecombinationRate] = useState(50); // %

  // Simulation
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [power, setPower] = useState(0);

  // Assessment
  const [ansWavelength, setAnsWavelength] = useState('');
  const [ansEfficiency, setAnsEfficiency] = useState('');
  const [feedback, setFeedback] = useState<{ q1: string; q2: string }>({ q1: '', q2: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Solar cell physics calculation
  const materialData = useMemo(() => MATERIALS[material], [material]);
  
  // Temperature effect on band gap
  const tempCoeff = -0.0003; // eV/K for Si
  const effectiveBandGap = materialData.bandGap + tempCoeff * (temperature - 25);
  
  // Wavelength threshold (photon must have E >= bandgap)
  const lambdaThreshold = 1240 / effectiveBandGap; // nm
  
  // Absorption efficiency based on thickness (Beer-Lambert)
  const absorptionCoeff = materialData.type === 'Direct' ? 10 : 1; // cm⁻¹
  const absorption = 1 - Math.exp(-absorptionCoeff * thickness / 10000); // convert μm to cm
  
  // Temperature effect on voltage
  const vt = 0.02585 * (temperature + 273.15) / 300; // thermal voltage
  const vOC = effectiveBandGap - 0.4 + vt * Math.log(irradiance / 1000); // approx Voc
  const effectiveVoc = Math.max(0, vOC);
  
  // Recombination reduces current
  const recombinationFactor = 1 - recombinationRate / 200;
  const iSC = irradiance / 1000 * absorption * recombinationFactor * 0.035;
  const fillFactor = 0.75 * (1 - 0.05 * (temperature - 25) / 25);
  
  const vMax = effectiveVoc * 0.8;
  const iMax = iSC * 0.9;
  const maxPower = vMax * iMax * fillFactor * 1000; // mW
  const efficiency = Math.min(SHOCKLEY_QUEISSER_LIMIT, maxPower / irradiance * 100 * (effectiveBandGap / 1.12));

  // IV curve calculation
  const ivCurve = useMemo(() => {
    const points = [];
    for (let v = 0; v <= effectiveVoc; v += effectiveVoc / 50) {
      const i = iSC * (1 - Math.exp(v / vt)) / (1 - Math.exp(effectiveVoc / vt));
      points.push({ v, i: Math.max(0, i) });
    }
    return points;
  }, [effectiveVoc, iSC, vt]);

  const checkAnswers = () => {
    // Q1: Calculate threshold wavelength for the selected material
    const trueLambda = 1240 / effectiveBandGap;
    const userLambda = parseFloat(ansWavelength);
    const q1Correct = !isNaN(userLambda) && Math.abs(userLambda - trueLambda) < 50;
    
    // Q2: Calculate maximum theoretical efficiency for band gap using simplified SQ limit
    const trueEfficiency = Math.min(SHOCKLEY_QUEISSER_LIMIT, effectiveBandGap * 24);
    const userEff = parseFloat(ansEfficiency);
    const q2Correct = !isNaN(userEff) && Math.abs(userEff - trueEfficiency) < 3;

    setFeedback({
      q1: q1Correct ? '✓ Correct!' : `✗ Incorrect. Hint: λ = 1240 / Eg (Eg = ${effectiveBandGap.toFixed(2)} eV)`,
      q2: q2Correct ? '✓ Correct! Excellent photovoltaic analysis.' : `✗ Incorrect. Consider the Shockley-Queisser limit for Eg = ${effectiveBandGap.toFixed(2)} eV.`
    });
  };

  const frontierTopics: FrontierTopic[] = [
    {
      id: 'nanotech',
      icon: 'nanotech',
      title: 'Nanostructured Solar Cells',
      summary: 'Nanotechnology is revolutionizing photovoltaics through quantum dots, nanowires, and plasmonic nanoparticles that can capture light more efficiently than traditional bulk materials.',
      connectionToLab: 'The absorption and band gap calculations in this lab are directly enhanced by quantum confinement effects — at nanoscale, the band gap of materials like silicon can be tuned by changing particle size, enabling multi-junction-like performance from a single material.',
      currentResearch: 'Oxford PV achieved 29.5% efficiency with perovskite-silicon tandem cells in 2024. Quantum dot solar cells have reached 18.1% efficiency and can be printed like ink — potentially reducing manufacturing costs by 10x.',
      careerPath: 'Photovoltaics Engineer, Nanomaterials Scientist, Renewable Energy Researcher',
      keyConcept: 'Quantum confinement — when semiconductor particles are smaller than the exciton Bohr radius, their electronic and optical properties become size-dependent. Smaller quantum dots = larger band gap = bluer light absorption.'
    },
    {
      id: 'greenchem',
      icon: 'greenchem',
      title: 'Green Chemistry in Solar Manufacturing',
      summary: 'The solar industry is adopting green chemistry principles to reduce toxic chemicals (like cadmium and lead) and energy-intensive processes in panel manufacturing.',
      connectionToLab: 'The material selection in this lab involves trade-offs between efficiency (GaAs: 31.1%) and environmental impact (CdTe contains toxic cadmium). Green chemistry aims to develop high-efficiency cells using Earth-abundant, non-toxic materials.',
      currentResearch: 'Perovskite solar cells are being reformulated with lead-free alternatives (tin, bismuth). MIT researchers developed a fully recyclable solar cell using cellulose substrates that dissolves in water at end of life.',
      careerPath: 'Green Chemistry Engineer, Sustainable Manufacturing Specialist, Environmental Materials Scientist',
      keyConcept: 'Life Cycle Assessment (LCA) — evaluating the environmental impact of a solar cell from raw material extraction through manufacturing, operation, and end-of-life recycling/reuse.'
    }
  ];

  return (
    <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Capstone: Design a Solar Cell" />

      <div className="px-4 pt-2">
        
      </div>

      <div className="w-full px-4 py-2 md:px-6 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
              </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
        <button
          onClick={() => setActiveMobileTab('theory')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
        >
          Design Brief
        </button>
        <button
          onClick={() => setActiveMobileTab('lab')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
        >
          Lab Bench
        </button>
      </div>

      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
        {/* Column 1: Design Brief & Theory */}
        <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Solar Cell Design Brief
          </h2>

          <div className="space-y-4 text-sm">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-700 dark:text-[#ffffff]">
                  <strong>Your Mission:</strong> Design a solar cell that maximizes efficiency while considering cost, temperature stability, and environmental impact. Balance the physics of photon absorption with real-world engineering constraints.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] text-sm mb-2">The Physics of Solar Cells</h3>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 dark:text-[#a1a1aa]">
                <li><strong>Photon Absorption:</strong> A photon with energy E ≥ E<sub>g</sub> (band gap) is absorbed, exciting an electron from the valence to conduction band. E = hc/λ, so λ ≤ 1240/E<sub>g</sub> nm.</li>
                <li><strong>Charge Separation:</strong> The built-in electric field at the p-n junction separates the electron-hole pair before they recombine.</li>
                <li><strong>Current Collection:</strong> Electrons flow through the external circuit, doing electrical work. The voltage is limited by the band gap.</li>
              </ol>
            </div>

            <div className={`bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/30 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
              <p className="text-xs font-mono text-blue-800 dark:text-blue-300">
                Shockley-Queisser Limit: η<sub>max</sub> ≈ E<sub>g</sub> × 24%<br />
                Fill Factor: FF = P<sub>max</sub> / (V<sub>OC</sub> × I<sub>SC</sub>)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Band Gap (E<sub>g</sub>)</span>
                <span className="font-mono font-bold text-indigo-600">{effectiveBandGap.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">λ Threshold</span>
                <span className="font-mono font-bold text-indigo-600">{lambdaThreshold.toFixed(0)} nm</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">V<sub>OC</sub></span>
                <span className="font-mono font-bold text-indigo-600">{effectiveVoc.toFixed(3)} V</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">I<sub>SC</sub></span>
                <span className="font-mono font-bold text-indigo-600">{(iSC * 1000).toFixed(1)} mA</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Efficiency</span>
                <span className="font-mono font-bold text-emerald-600">{efficiency.toFixed(1)}%</span>
              </div>
            </div>

            {config.showDerivations && (
              <>
                <DeepDivePanel
                  derivation={{
                    title: 'Why λ = 1240 / E<sub>g</sub>? — Photon Absorption Threshold',
                    question: 'Why can only photons with wavelength shorter than a specific threshold be absorbed by a solar cell material? Where does the 1240 come from?',
                    steps: [
                      {
                        label: 'Start with E = hc/λ for a photon',
                        latex: 'E_photon = h × f = h × c / λ\n\nh = 6.626 × 10⁻³⁴ J·s\nc = 3.0 × 10⁸ m/s',
                        explanation: 'Every photon carries energy proportional to its frequency. The constant of proportionality is Planck\'s constant h, one of the most fundamental constants in quantum mechanics.'
                      },
                      {
                        label: 'Set minimum photon energy = band gap',
                        latex: 'E_photon ≥ E_gap\n\nAt threshold:\nE_photon = E_gap\n\nSo:\nhc / λ_threshold = E_gap\nλ_threshold = hc / E_gap',
                        explanation: 'A photon can only excite an electron across the band gap if its energy is at least as large as the gap. If the photon has less energy, it passes right through the material — the solar cell is transparent to those wavelengths.'
                      },
                      {
                        label: 'Convert to convenient units (eV and nm)',
                        latex: 'hc = 1.986 × 10⁻²⁵ J·m\n   = 1240 eV·nm\n\nTherefore:\nλ_threshold (nm) = 1240 / E_gap (eV)\n\nExample — Silicon (E_g = 1.12 eV):\nλ_max = 1240 / 1.12 = 1107 nm',
                        explanation: 'This is why silicon solar cells can absorb infrared light up to ~1100 nm, but are transparent to longer infrared wavelengths. GaAs (E_g = 1.43 eV) can only absorb up to ~867 nm — it misses some infrared but captures more energy per photon.'
                      }
                    ],
                    conclusion: 'The absorption threshold is a direct consequence of quantum mechanics — the band gap energy sets a strict cutoff for which photons can contribute to electricity generation. Photons with E < E_g are wasted, while photons with E > E_g generate heat (the excess energy above the band gap is lost as heat, not electricity). This is the fundamental trade-off in solar cell design.',
                    realWorldApplication: 'Tandem (multi-junction) solar cells solve this by stacking materials with different band gaps. The top layer (high band gap, e.g., 1.9 eV) absorbs blue photons, the middle layer (1.4 eV) absorbs green, and the bottom layer (1.0 eV) absorbs red/infrared. This is how efficiencies exceeding 47% have been achieved in concentrator photovoltaics.'
                  }}
                />
                <FrontierApplicationsPanel topics={frontierTopics} />
              </>
            )}
          </div>
        </div>

        {/* Column 2: Interactive Lab Bench */}
        <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            Photovoltaic Lab Bench
          </h2>

          {/* Material Selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider block mb-2">
              Semiconductor Material
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {MATERIALS.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => setMaterial(i)}
                  className={`text-[10px] font-bold py-2 px-1 rounded-lg border-2 transition-all ${
                    material === i
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] hover:border-slate-300'
                  }`}
                >
                  {m.name.split(' ')[0]}
                  <div className="text-[8px] font-normal mt-0.5">{m.bandGap.toFixed(2)} eV</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-xs">
                <label className="text-slate-600 dark:text-[#a1a1aa]">Thickness</label>
                <span className="font-mono text-indigo-600">{thickness} μm</span>
              </div>
              <input type="range" min="10" max="500" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="text-slate-600 dark:text-[#a1a1aa]">Temperature</label>
                <span className="font-mono text-red-500">{temperature}°C</span>
              </div>
              <input type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="text-slate-600 dark:text-[#a1a1aa]">Irradiance</label>
                <span className="font-mono text-yellow-500">{irradiance} W/m²</span>
              </div>
              <input type="range" min="100" max="1500" value={irradiance} onChange={e => setIrradiance(Number(e.target.value))} className="w-full accent-yellow-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="text-slate-600 dark:text-[#a1a1aa]">Recombination</label>
                <span className="font-mono text-rose-500">{recombinationRate}%</span>
              </div>
              <input type="range" min="0" max="100" value={recombinationRate} onChange={e => setRecombinationRate(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
          </div>

          {/* I-V Curve Visualization */}
          <div className="flex-1 bg-[#000000] dark:bg-[#000000] rounded-lg border border-[#1c1b1b] p-3 mb-2">
            <svg viewBox="0 0 200 150" className="w-full h-full">
              {/* Axes */}
              <line x1="20" y1="130" x2="190" y2="130" stroke="#334155" strokeWidth="1.5" />
              <line x1="20" y1="10" x2="20" y2="130" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="140" fontSize="6" fill="#64748b">V</text>
              <text x="5" y="15" fontSize="6" fill="#64748b">I</text>
              
              {/* I-V Curve */}
              {ivCurve.length > 1 && (
                <path
                  d={`M ${ivCurve.map((p, i) => {
                    const x = 20 + (p.v / effectiveVoc) * 165;
                    const y = 130 - (p.i / iSC) * 110;
                    return `${i === 0 ? '' : ' L'} ${x},${y}`;
                  }).join('')}`}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              )}
              
              {/* Max Power Point */}
              <circle cx={20 + (vMax / effectiveVoc) * 165} cy={130 - (iMax / iSC) * 110} r="3" fill="#facc15" />
              <text x="150" y="25" fontSize="6" fill="#facc15">MPP</text>
              
              {/* Fill Factor Box */}
              <rect
                x={20}
                y={130 - (iSC / iSC) * 110}
                width={(effectiveVoc / effectiveVoc) * 165}
                height={(iSC / iSC) * 110}
                fill="none"
                stroke="#64748b"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-100 dark:bg-[#121212] rounded-lg p-2">
              <div className="text-[18px] font-bold text-emerald-500">{efficiency.toFixed(1)}%</div>
              <div className="text-[8px] text-slate-500">Efficiency</div>
            </div>
            <div className="bg-slate-100 dark:bg-[#121212] rounded-lg p-2">
              <div className="text-[18px] font-bold text-blue-500">{maxPower.toFixed(0)}</div>
              <div className="text-[8px] text-slate-500">mW/cm²</div>
            </div>
            <div className="bg-slate-100 dark:bg-[#121212] rounded-lg p-2">
              <div className="text-[18px] font-bold text-amber-500">{absorption.toFixed(0)}%</div>
              <div className="text-[8px] text-slate-500">Absorption</div>
            </div>
            <div className="bg-slate-100 dark:bg-[#121212] rounded-lg p-2">
              <div className="text-[18px] font-bold text-rose-500">{recombinationRate}%</div>
              <div className="text-[8px] text-slate-500">Recomb.</div>
            </div>
          </div>
        </div>

        {/* Column 3: Assessment & Analysis */}
        <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Design Analysis
          </h2>

          <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800/30">
              <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">Material Properties</h3>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">
                <p>{materialData.name} | Type: {materialData.type} Band Gap | Cost: {materialData.cost}</p>
                <p>Record efficiency: {materialData.efficiency}% | SQ Limit: {SHOCKLEY_QUEISSER_LIMIT}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
                  Q1: Calculate the maximum wavelength (nm) this solar cell can absorb.
                </label>
                <input
                  type="number"
                  value={ansWavelength}
                  onChange={e => setAnsWavelength(e.target.value)}
                  placeholder="e.g. 1100"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {feedback.q1 && (
                  <p className={`text-xs mt-1 ${feedback.q1.includes('Correct') ? 'text-emerald-600' : 'text-red-500'}`}>
                    {feedback.q1}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
                  Q2: Estimate the maximum theoretical efficiency (%) for your chosen material.
                </label>
                <input
                  type="number"
                  value={ansEfficiency}
                  onChange={e => setAnsEfficiency(e.target.value)}
                  placeholder="e.g. 26.9"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {feedback.q2 && (
                  <p className={`text-xs mt-1 ${feedback.q2.includes('Correct') ? 'text-emerald-600' : 'text-red-500'}`}>
                    {feedback.q2}
                  </p>
                )}
              </div>

              <button
                onClick={checkAnswers}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Verify Calculations
              </button>
            </div>

            {/* Research Challenge */}
            {config.showDerivations && (
              <div className="border-t border-slate-200 dark:border-[#1c1b1b] pt-4 mt-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Research Challenge
                </h3>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                  <p className="text-xs text-slate-700 dark:text-[#ffffff] mb-2">
                    <strong>Design Challenge:</strong> Your solar cell company needs to choose ONE material for mass production. 
                    Consider efficiency, cost, temperature stability, and environmental impact.
                  </p>
                  <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
                    Which material would you choose, and what optimizations would you apply (thickness, anti-reflective coating, tandem structure)?
                  </p>
                  <textarea
                    className="w-full text-xs p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md bg-white dark:bg-[#121212] min-h-[80px] resize-none"
                    placeholder="Write your design proposal..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    In deep-dive mode, consider real research papers on perovskite-silicon tandems or thin-film CIGS optimization.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
