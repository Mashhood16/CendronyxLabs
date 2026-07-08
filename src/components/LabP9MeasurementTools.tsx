import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

type Instrument = 'caliper' | 'screw_gauge';
type CaliperMode = 'outside' | 'inside';

export default function LabP9MeasurementTools({ onExit }: { onExit?: () => void }) {
  const { t } = useTranslate();
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [instrument, setInstrument] = useState<Instrument>('caliper');
  
  // Caliper states
  const [caliperWidth, setCaliperWidth] = useState<number>(0);
  const [caliperJawX, setCaliperJawX] = useState<number>(50); // 0 to 50 mm
  const [caliperPlaced, setCaliperPlaced] = useState<boolean>(false);
  const [caliperInput, setCaliperInput] = useState<string>('');
  const [caliperFeedback, setCaliperFeedback] = useState<string | null>(null);
  const [caliperMode, setCaliperMode] = useState<CaliperMode>('outside');

  // Screw gauge states
  const [screwWidth, setScrewWidth] = useState<number>(0);
  const [screwThimbleX, setScrewThimbleX] = useState<number>(10); // 0 to 10 mm
  const [screwPlaced, setScrewPlaced] = useState<boolean>(false);
  const [screwInput, setScrewInput] = useState<string>('');
  const [screwFeedback, setScrewFeedback] = useState<string | null>(null);

  useEffect(() => {
    generateNewCaliperObject();
    generateNewScrewObject();
  }, [caliperMode]);

  const generateNewCaliperObject = () => {
    const newWidth = Math.floor(Math.random() * 300 + 105) / 10; // 10.5 to 40.4 mm
    setCaliperWidth(newWidth);
    setCaliperJawX(caliperMode === 'inside' ? 0 : 50);
    setCaliperPlaced(false);
    setCaliperInput('');
    setCaliperFeedback(null);
  };

  const generateNewScrewObject = () => {
    const newWidth = Math.floor(Math.random() * 550 + 150) / 100; // 1.50 to 7.00 mm (realistic range for wire/sheet)
    setScrewWidth(newWidth);
    setScrewThimbleX(10);
    setScrewPlaced(false);
    setScrewInput('');
    setScrewFeedback(null);
  };

  const handleCaliperSlider = (val: number) => {
    if (caliperPlaced) {
      if (caliperMode === 'outside') {
        if (val < caliperWidth) {
          setCaliperJawX(caliperWidth);
        } else {
          setCaliperJawX(val);
        }
      } else {
        if (val > caliperWidth) {
          setCaliperJawX(caliperWidth);
        } else {
          setCaliperJawX(val);
        }
      }
    } else {
      setCaliperJawX(val);
    }
  };

  const handleScrewSlider = (val: number) => {
    if (screwPlaced && val < screwWidth) {
      setScrewThimbleX(screwWidth);
    } else {
      setScrewThimbleX(val);
    }
  };

  const checkCaliperAnswer = () => {
    const inputNum = parseFloat(caliperInput);
    if (!isNaN(inputNum) && Math.abs(inputNum - caliperWidth) < 0.05) {
      setCaliperFeedback('correct');
    } else {
      setCaliperFeedback('incorrect');
    }
  };

  const checkScrewAnswer = () => {
    const inputNum = parseFloat(screwInput);
    if (!isNaN(inputNum) && Math.abs(inputNum - screwWidth) < 0.005) {
      setScrewFeedback('correct');
    } else {
      setScrewFeedback('incorrect');
    }
  };

  // SVG rendering constants for Caliper
  const caliperPixelsPerMm = 8;
  const caliperZeroOffset = 80;

  const caliperMainTicks = [];
  for (let i = 0; i <= 60; i++) caliperMainTicks.push(i);

  const caliperVernierTicks = [];
  for (let i = 0; i <= 10; i++) caliperVernierTicks.push(i);

  // SVG rendering constants for Screw Gauge
  const screwPixelsPerMm = 15; // 1 mm = 15 px
  const screwZeroOffset = 220; // 0 mm on Sleeve scale

  const screwSleeveTicks = [];
  for (let i = 0; i <= 10; i++) screwSleeveTicks.push(i); // Max 10 mm scale

  // Circular scale divisions (0 to 49)
  const getScrewCircularTicks = () => {
    const ticks = [];
    const currentCR = (screwThimbleX / 0.5) * 50; // exact divisions rotated
    const roundedCR = Math.round(currentCR);
    for (let i = roundedCR - 10; i <= roundedCR + 10; i++) {
      ticks.push(i);
    }
    return { ticks, currentCR };
  };

  const { ticks: screwCircularTicks, currentCR: screwCR } = getScrewCircularTicks();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title={t('lab.p9measurementtools_physics_grade_9_vernier_calipe')} />

      {/* Top Instrument Switcher */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-4 flex gap-4">
        <button
          onClick={() => setInstrument('caliper')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-sm border ${
            instrument === 'caliper'
              ? 'bg-[#4158D1] text-white border-transparent'
              : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          📏 {t('lab.p9measurementtools_vernier_caliper_tab')}
        </button>
        <button
          onClick={() => setInstrument('screw_gauge')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-sm border ${
            instrument === 'screw_gauge'
              ? 'bg-[#4158D1] text-white border-transparent'
              : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          ⚙️ {t('lab.p9measurementtools_screw_gauge_tab')}
        </button>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
        <button
          onClick={() => setActiveMobileTab('theory')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${
            activeMobileTab === 'theory'
              ? 'bg-[#4158D1] text-white shadow-md'
              : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'
          }`}
        >
          {t('lab.tab.theory')}
        </button>
        <button
          onClick={() => setActiveMobileTab('lab')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${
            activeMobileTab === 'lab'
              ? 'bg-[#4158D1] text-white shadow-md'
              : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'
          }`}
        >
          {t('lab.tab.lab')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 p-6 lg:overflow-visible">
        {/* Column 1: Theory */}
        <div
          className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 ${
            activeMobileTab === 'theory' ? 'flex' : 'hidden'
          } lg:flex`}
        >
          {instrument === 'caliper' ? (
            <>
              <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">
                {t('lab.p9measurementtools_theory_measurement')}
              </h2>
              <div className="prose prose-sm dark:prose-invert">
                <p>
                  A <strong>{t('lab.p9measurementtools_vernier_caliper')}</strong>{' '}
                  {t('lab.p9measurementtools_is_an_instrument_used_to_measu')}
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>
                    <strong>{t('lab.p9measurementtools_main_scale')}</strong>{' '}
                    {t('lab.p9measurementtools_reads_in_millimeters_mm_read_t')}
                  </li>
                  <li>
                    <strong>{t('lab.p9measurementtools_vernier_scale')}</strong>{' '}
                    {t('lab.p9measurementtools_provides_precision_up_to_0_1_m')}
                  </li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4 text-blue-900 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex flex-col">
                  <strong>{t('lab.p9measurementtools_formula')}</strong>
                  <span>{t('lab.p9measurementtools_total_reading_main_scale_readi')}</span>
                  <em className="text-xs mt-1">{t('lab.p9measurementtools_here_least_count_0_1_mm')}</em>
                </div>
                <h3 className="font-semibold mt-4">{t('lab.p9measurementtools_instructions')}</h3>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    {t('lab.p9measurementtools_instruction_caliper_1')}
                  </li>
                  <li>
                    {t('lab.p9measurementtools_click')}{' '}
                    <strong>{t('lab.p9measurementtools_place_object')}</strong>.
                  </li>
                  <li>
                    {t('lab.p9measurementtools_instruction_caliper_3')}
                  </li>
                  <li>{t('lab.p9measurementtools_enter_your_reading_and_check')}</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">
                {t('lab.p9measurementtools_theory_screw_gauge')}
              </h2>
              <div className="prose prose-sm dark:prose-invert">
                <p>{t('lab.p9measurementtools_screw_gauge_desc')}</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>{t('lab.p9measurementtools_sleeve_scale')}</li>
                  <li>{t('lab.p9measurementtools_thimble_scale')}</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4 text-blue-900 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex flex-col">
                  <strong>{t('lab.p9measurementtools_formula')}</strong>
                  <span className="text-xs">{t('lab.p9measurementtools_screw_gauge_formula')}</span>
                  <em className="text-xs mt-1">{t('lab.p9measurementtools_screw_gauge_lc')}</em>
                </div>
                <h3 className="font-semibold mt-4">{t('lab.p9measurementtools_instructions')}</h3>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    {t('lab.p9measurementtools_click')}{' '}
                    <strong>{t('lab.p9measurementtools_place_object')}</strong>.
                  </li>
                  <li>{t('lab.p9measurementtools_instruction_screw_2')}</li>
                  <li>{t('lab.p9measurementtools_instruction_screw_3')}</li>
                  <li>{t('lab.p9measurementtools_instruction_screw_4')}</li>
                </ol>
              </div>
            </>
          )}
        </div>

        {/* Column 2: Simulator */}
        <div
          className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-6 flex flex-col items-center ${
            activeMobileTab === 'lab' ? 'flex' : 'hidden'
          } lg:flex`}
        >
          <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 w-full mb-4">
            {t('lab.p9measurementtools_interactive_simulator')}
          </h2>

          {instrument === 'caliper' ? (
            <>
              {/* Caliper Mode Selector */}
              <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg w-full">
                <button
                  onClick={() => setCaliperMode('outside')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    caliperMode === 'outside'
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t('lab.p9measurementtools_measure_outside')}
                </button>
                <button
                  onClick={() => setCaliperMode('inside')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    caliperMode === 'inside'
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t('lab.p9measurementtools_measure_inside')}
                </button>
              </div>

              {/* Vernier Caliper controls */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => {
                    setCaliperPlaced(true);
                    if (caliperMode === 'outside') {
                      if (caliperJawX < caliperWidth) setCaliperJawX(caliperWidth);
                    } else {
                      if (caliperJawX > caliperWidth) setCaliperJawX(caliperWidth);
                    }
                  }}
                  disabled={caliperPlaced}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  <Target size={18} /> {t('lab.p9measurementtools_place_object')}
                </button>
                <button
                  onClick={generateNewCaliperObject}
                  className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} /> {t('lab.p9measurementtools_new_object')}
                </button>
              </div>

              {/* Vernier Caliper Visualizer */}
              <div className="relative w-full max-w-lg bg-slate-100 dark:bg-zinc-950 rounded-lg p-4 border border-slate-200 dark:border-zinc-800 overflow-hidden flex justify-center mb-6">
                <svg width="100%" viewBox="0 0 600 300" className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-inner rounded">
                  {/* Main Scale Beam */}
                  <rect x="20" y="100" width="560" height="60" fill="#e2e8f0" stroke="#94a3b8" />
                  {caliperMainTicks.map((tick) => (
                    <g key={tick} transform={`translate(${caliperZeroOffset + tick * caliperPixelsPerMm}, 100)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={tick % 10 === 0 ? '20' : tick % 5 === 0 ? '15' : '10'}
                        stroke="#334155"
                        strokeWidth="1.5"
                      />
                      {tick % 10 === 0 && (
                        <text x="0" y="35" textAnchor="middle" fontSize="12" fill="#334155" className="font-bold">
                          {tick / 10}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Fixed Lower Jaw (Outside) */}
                  <path
                    d={`M 20 100 L ${caliperZeroOffset} 100 L ${caliperZeroOffset} 220 L ${caliperZeroOffset - 20} 220 L ${caliperZeroOffset - 20} 160 L 20 160 Z`}
                    fill="#cbd5e1"
                    stroke="#94a3b8"
                  />
                  <line x1={caliperZeroOffset} y1="100" x2={caliperZeroOffset} y2="220" stroke="#475569" strokeWidth="2" />

                  {/* Fixed Upper Jaw (Inside) */}
                  <path
                    d={`M 20 100 L ${caliperZeroOffset} 100 L ${caliperZeroOffset} 30 L ${caliperZeroOffset - 12} 30 C ${caliperZeroOffset - 12} 55, ${caliperZeroOffset - 20} 65, ${caliperZeroOffset - 20} 100 Z`}
                    fill="#cbd5e1"
                    stroke="#94a3b8"
                  />
                  <line x1={caliperZeroOffset} y1="30" x2={caliperZeroOffset} y2="100" stroke="#475569" strokeWidth="1.5" />

                  {/* Hollow Pipe Object (Inside Mode) */}
                  {caliperPlaced && caliperMode === 'inside' && (
                    <path
                      d={`M ${caliperZeroOffset - 15} 55 
                          A 35 35 0 1 1 ${caliperZeroOffset + caliperWidth * caliperPixelsPerMm + 15} 55
                          L ${caliperZeroOffset + caliperWidth * caliperPixelsPerMm} 55
                          A 20 20 0 1 0 ${caliperZeroOffset} 55
                          Z`}
                      fill="#cbd5e1"
                      stroke="#94a3b8"
                      strokeWidth="1"
                      fillRule="evenodd"
                      opacity="0.9"
                      className="drop-shadow-sm"
                    />
                  )}

                  {/* Solid Cylinder Object (Outside Mode) */}
                  {caliperPlaced && caliperMode === 'outside' && (
                    <rect
                      x={caliperZeroOffset}
                      y="160"
                      width={caliperWidth * caliperPixelsPerMm}
                      height="60"
                      fill="#f59e0b"
                      stroke="#d97706"
                      rx="4"
                    />
                  )}

                  {/* Sliding Jaw & Vernier Scale */}
                  <g transform={`translate(${caliperJawX * caliperPixelsPerMm}, 0)`}>
                    {/* Sliding Lower Jaw (Outside) */}
                    <path
                      d={`M ${caliperZeroOffset} 160 L ${caliperZeroOffset} 220 L ${caliperZeroOffset + 20} 220 L ${caliperZeroOffset + 20} 180 L ${caliperZeroOffset + 120} 180 L ${caliperZeroOffset + 120} 100 L ${caliperZeroOffset} 100 Z`}
                      fill="#cbd5e1"
                      stroke="#94a3b8"
                    />
                    {/* Sliding Upper Jaw (Inside) */}
                    <path
                      d={`M ${caliperZeroOffset} 100 L ${caliperZeroOffset} 30 L ${caliperZeroOffset + 12} 30 C ${caliperZeroOffset + 12} 55, ${caliperZeroOffset + 20} 65, ${caliperZeroOffset + 20} 100 Z`}
                      fill="#cbd5e1"
                      stroke="#94a3b8"
                    />
                    <line x1={caliperZeroOffset} y1="30" x2={caliperZeroOffset} y2="220" stroke="#475569" strokeWidth="2" />

                    {/* Vernier scale window */}
                    <rect x={caliperZeroOffset + 5} y="100" width="90" height="25" fill="#f8fafc" stroke="#94a3b8" />
                    {caliperVernierTicks.map((tick) => (
                      <g key={tick} transform={`translate(${caliperZeroOffset + 10 + tick * (0.9 * caliperPixelsPerMm)}, 100)`}>
                        <line x1="0" y1="0" x2="0" y2={tick % 5 === 0 ? '15' : '10'} stroke="#b91c1c" strokeWidth="1.5" />
                        {tick % 5 === 0 && (
                          <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#b91c1c" className="font-bold">
                            {tick}
                          </text>
                        )}
                      </g>
                    ))}
                  </g>
                </svg>
              </div>

              {/* Slider controls */}
              <div className="w-full max-w-lg space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
                  <span>{t('lab.p9measurementtools_adjust_jaw_position')}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{caliperJawX.toFixed(1)} mm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.1"
                  value={caliperJawX}
                  onChange={(e) => handleCaliperSlider(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Screw Gauge controls */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => {
                    setScrewPlaced(true);
                    if (screwThimbleX < screwWidth) setScrewThimbleX(screwWidth);
                  }}
                  disabled={screwPlaced}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  <Target size={18} /> {t('lab.p9measurementtools_place_object')}
                </button>
                <button
                  onClick={generateNewScrewObject}
                  className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} /> {t('lab.p9measurementtools_new_object')}
                </button>
              </div>

              {/* Screw Gauge Visualizer */}
              <div className="relative w-full max-w-lg bg-slate-100 dark:bg-zinc-950 rounded-lg p-4 border border-slate-200 dark:border-zinc-800 overflow-hidden flex justify-center mb-6">
                <svg width="100%" viewBox="0 0 600 300" className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-inner rounded">
                  {/* Definition definitions for gradients */}
                  <defs>
                    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="35%" stopColor="#cbd5e1" />
                      <stop offset="65%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="thimbleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="30%" stopColor="#cbd5e1" />
                      <stop offset="70%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#312e81" />
                      <stop offset="50%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    {/* Brass/Gold wire gradient */}
                    <linearGradient id="wireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="50%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                  </defs>

                  {/* U-Shaped Frame */}
                  <path d="M 60 150 C 60 260, 240 260, 240 150" fill="none" stroke="url(#frameGrad)" strokeWidth="32" strokeLinecap="round" />
                  
                  {/* Anvil (fixed stud on left) */}
                  <rect x="76" y="130" width="24" height="40" fill="url(#metalGrad)" stroke="#475569" />
                  <line x1="100" y1="130" x2="100" y2="170" stroke="#1e293b" strokeWidth="2" />

                  {/* Spindle (moving cylinder) - Fixed width of 220px to prevent negative width rendering issues */}
                  <rect x={100 + screwThimbleX * screwPixelsPerMm} y="138" width="220" height="24" fill="url(#metalGrad)" stroke="#475569" />
                  <line x1={100 + screwThimbleX * screwPixelsPerMm} y1="138" x2={100 + screwThimbleX * screwPixelsPerMm} y2="162" stroke="#1e293b" strokeWidth="2" />

                  {/* Clamped vertical wire object */}
                  {screwPlaced && (
                    <rect
                      x="100"
                      y="110"
                      width={screwWidth * screwPixelsPerMm}
                      height="80"
                      fill="url(#wireGrad)"
                      stroke="#92400e"
                      strokeWidth="1.5"
                      rx="3"
                    />
                  )}

                  {/* Fixed Sleeve (Barrel) */}
                  <rect x="220" y="115" width="200" height="70" fill="url(#metalGrad)" stroke="#64748b" />
                  
                  {/* Datum line */}
                  <line x1="220" y1="150" x2="420" y2="150" stroke="#0f172a" strokeWidth="2" />
                  
                  {/* Sleeve Ticks (pitch scale) */}
                  {screwSleeveTicks.map((i) => {
                    const tickX = screwZeroOffset + i * screwPixelsPerMm;
                    return (
                      <g key={i}>
                        {/* Upper integer mm ticks */}
                        <line x1={tickX} y1="150" x2={tickX} y2="135" stroke="#0f172a" strokeWidth="1.5" />
                        {i % 5 === 0 && (
                          <text x={tickX} y="128" textAnchor="middle" fontSize="10" fill="#0f172a" className="font-bold">
                            {i}
                          </text>
                        )}
                        {/* Lower half-mm ticks */}
                        {i < 10 && (
                          <line x1={tickX + 7.5} y1="150" x2={tickX + 7.5} y2="162" stroke="#0f172a" strokeWidth="1" />
                        )}
                      </g>
                    );
                  })}

                  {/* Sliding Thimble */}
                  <g transform={`translate(${screwThimbleX * screwPixelsPerMm}, 0)`}>
                    {/* Thimble Body */}
                    <rect x="220" y="105" width="130" height="90" fill="url(#thimbleGrad)" stroke="#64748b" rx="2" />
                    
                    {/* Bevelled edge marker */}
                    <line x1="220" y1="105" x2="220" y2="195" stroke="#b91c1c" strokeWidth="3" />
                    
                    {/* Circular Scale Ticks */}
                    {screwCircularTicks.map((tick) => {
                      const div = (tick + 50) % 50;
                      // Vertical spacing of ticks: 1 division = 3.5 px
                      const tickY = 150 - (tick - screwCR) * 3.5;
                      // Only render visible ticks within thimble vertical span (y=110 to y=190)
                      if (tickY >= 110 && tickY <= 190) {
                        const isMajor = div % 5 === 0;
                        return (
                          <g key={tick}>
                            <line
                              x1="220"
                              y1={tickY}
                              x2={isMajor ? '236' : '228'}
                              y2={tickY}
                              stroke="#0f172a"
                              strokeWidth={isMajor ? '1.8' : '1'}
                            />
                            {isMajor && (
                              <text x="242" y={tickY + 3.5} textAnchor="start" fontSize="9" fill="#0f172a" className="font-mono font-bold">
                                {div}
                              </text>
                            )}
                          </g>
                        );
                      }
                      return null;
                    })}

                    {/* Ratchet Knob */}
                    <rect x="350" y="125" width="30" height="50" fill="url(#metalGrad)" stroke="#475569" />
                    <line x1="365" y1="125" x2="365" y2="175" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                  </g>
                </svg>
              </div>

              {/* Slider controls */}
              <div className="w-full max-w-lg space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
                  <span>{t('lab.p9measurementtools_adjust_thimble')}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{screwThimbleX.toFixed(2)} mm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.01"
                  value={screwThimbleX}
                  onChange={(e) => handleScrewSlider(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Column 3: Analysis */}
        <div
          className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${
            activeMobileTab === 'lab' ? 'flex' : 'hidden'
          } lg:flex`}
        >
          <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">
            {t('lab.p9measurementtools_analysis_record')}
          </h2>

          {instrument === 'caliper' ? (
            <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">
                  {t('lab.p9measurementtools_enter_reading_caliper')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={t('lab.p9measurementtools_e_g_15_3')}
                  value={caliperInput}
                  onChange={(e) => setCaliperInput(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
              </div>

              <button
                onClick={checkCaliperAnswer}
                disabled={!caliperInput || !caliperPlaced || caliperJawX !== caliperWidth}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors dark:bg-green-500 dark:hover:bg-green-400"
              >
                {t('lab.p9measurementtools_check_answer')}
              </button>

              {(!caliperPlaced || caliperJawX !== caliperWidth) && caliperInput && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Target size={14} /> {t('lab.p9measurementtools_please_clamp_the_object_tightl')}
                </p>
              )}

              {caliperFeedback === 'correct' && (
                <div className="p-3 bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-900/50">
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <span className="text-xs">{t('lab.p9measurementtools_correct_caliper', { width: caliperWidth.toFixed(1) })}</span>
                </div>
              )}

              {caliperFeedback === 'incorrect' && (
                <div className="p-3 bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-900/50">
                  <XCircle size={20} className="flex-shrink-0" />
                  <span className="text-xs">{t('lab.p9measurementtools_incorrect_caliper')}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-1">
                  {t('lab.p9measurementtools_enter_reading_screw')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 4.32"
                  value={screwInput}
                  onChange={(e) => setScrewInput(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
              </div>

              <button
                onClick={checkScrewAnswer}
                disabled={!screwInput || !screwPlaced || screwThimbleX !== screwWidth}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors dark:bg-green-500 dark:hover:bg-green-400"
              >
                {t('lab.p9measurementtools_check_answer')}
              </button>

              {(!screwPlaced || screwThimbleX !== screwWidth) && screwInput && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Target size={14} /> {t('lab.p9measurementtools_clamp_tightly')}
                </p>
              )}

              {screwFeedback === 'correct' && (
                <div className="p-3 bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-900/50">
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <span className="text-xs">{t('lab.p9measurementtools_correct_screw', { width: screwWidth.toFixed(2) })}</span>
                </div>
              )}

              {screwFeedback === 'incorrect' && (
                <div className="p-3 bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-900/50">
                  <XCircle size={20} className="flex-shrink-0" />
                  <span className="text-xs">{t('lab.p9measurementtools_incorrect_screw')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
