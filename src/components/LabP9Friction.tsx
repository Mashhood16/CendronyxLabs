import { useState, useEffect, useRef } from 'react';
import { Info, Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import LabHeader from './LabHeader';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import PredictionChallenge from './PredictionChallenge';
import { useTranslate } from '../i18n';

export default function LabP9Friction({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [mass, setMass] = useState<number>(2);
 const [mode, setMode] = useState<'sliding' | 'rolling' | 'unknown'>('sliding');
 const [pulling, setPulling] = useState<boolean>(false);
 const [time, setTime] = useState<number>(0);
 const [unknownMuS, setUnknownMuS] = useState<number>(0.5);
 const [logs, setLogs] = useState<{ mode: string, mass: number, peak: string, kinetic: string }[]>([]);

 const [userMu, setUserMu] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<'none' | 'correct' | 'incorrect'>('none');

 const noise = useRef<number>(1);

 useEffect(() => {
  setUnknownMuS(0.3 + Math.random() * 0.5); // 0.3 to 0.8
  noise.current = 1 + (Math.random() * 0.04 - 0.02);
 }, []);

 const mu_s = mode === 'sliding' ? 0.4 : mode === 'rolling' ? 0.08 : unknownMuS;
 const mu_k = mode === 'sliding' ? 0.3 : mode === 'rolling' ? 0.05 : unknownMuS * 0.75;

 const F_max = mu_s * mass * 9.8 * noise.current;
 const F_k = mu_k * mass * 9.8 * noise.current;

 const pullRate = 5; // N/s
 const t_break = F_max / pullRate;

 useEffect(() => {
  let timer: number;
  if (pulling) {
   timer = window.setInterval(() => {
    setTime(t => {
     if (t > t_break + 4) {
      setPulling(false);
      return t;
     }
     return t + 0.05;
    });
   }, 50);
  }
  return () => clearInterval(timer);
 }, [pulling, t_break]);

 const handleReset = () => {
  setPulling(false);
  setTime(0);
  noise.current = 1 + (Math.random() * 0.04 - 0.02);
 };

 const handleRecord = () => {
  setLogs(prev => [...prev, {
   mode,
   mass,
   peak: F_max.toFixed(2),
   kinetic: F_k.toFixed(2)
  }]);
 };

 const checkMu = () => {
  const mu = parseFloat(userMu);
  if (!isNaN(mu) && Math.abs(mu - unknownMuS) < 0.05) {
   setAssessmentResult('correct');
  } else {
   setAssessmentResult('incorrect');
  }
 };

 const currentForce = time === 0 ? 0 : (time < t_break ? time * pullRate : F_k);
 const blockX = time < t_break ? 0 : 50 * (time - t_break);

 const drawPath = () => {
  let path = `M 0,0 `;
  if (time < t_break) {
   path += `L ${time * 30},${-(time * pullRate) * 7}`;
  } else {
   path += `L ${t_break * 30},${-F_max * 7} `;
   path += `L ${(t_break + 0.1) * 30},${-F_k * 7} `;
   path += `L ${Math.min(time, t_break + 4) * 30},${-F_k * 7}`;
  }
  return path;
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.p9friction_friction_lab')} subtitle={t('lab.subtitle_investigate_static_kinetic')} />

   <div className="px-4 pt-2 lg:pt-0">
    
   </div>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.tab.theory')}</button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.tab.lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
    {/* Column 1: Setup */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
          <div className={`flex items-center gap-2 mb-4 mt-2 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
      <Info className="w-5 h-5 text-blue-600" />
      <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.p9_friction_section1')}</h2>
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
      {t('lab.p9_friction_theory')}
     </p>

     <div className="space-y-6">
      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p9friction_block_mass')} {mass} kg</label>
       <input
        type="range"
        min="1" max="5" step="0.5"
        value={mass}
        onChange={(e) => { setMass(parseFloat(e.target.value)); handleReset(); }}
        className="w-full"
        disabled={pulling}
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p9friction_surface_mode')}</label>
       <select
        value={mode}
        onChange={(e) => { setMode(e.target.value as any); handleReset(); }}
        className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-blue-500"
        disabled={pulling}
       >
        <option value="sliding">{t('lab.p9friction_wood_on_wood_sliding')}</option>
        <option value="rolling">{t('lab.p9friction_wood_on_pencils_rolling')}</option>
        <option value="unknown">{t('lab.p9friction_unknown_material_sliding')}</option>
       </select>
      </div>

      <div className="flex gap-2">
       <button
        onClick={() => setPulling(true)}
        disabled={pulling || time > 0}
        className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 `}
       >
        <Play className="w-4 h-4" />  {t('lab.p9friction_start_pulling')}
                                    </button>
       <button
        onClick={handleReset}
        className={`px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-md hover:bg-slate-300 dark:bg-[#121212] flex items-center justify-center flex-col `}
       >
        <RotateCcw className="w-4 h-4" />
       </button>
      </div>
      <button
       onClick={handleRecord}
       disabled={time < t_break + 1}
       className={`w-full border-2 border-emerald-500 text-emerald-600 py-2 rounded-md hover:bg-emerald-50 disabled:opacity-50 font-medium flex-col `}
      >
       
                                {t('lab.p9friction_record_max_kinetic_forces')}
                               </button>
     </div>
    </div>

    {/* Column 2: Simulation */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     {config.showHints && (
      <div className="w-full mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-2 text-sm text-blue-700 dark:text-blue-300">
       <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
       <span><strong>{t('lab.p9friction_hint')}</strong>  {t('lab.p9friction_f_max_s_m_g_kinetic_friction_i')}</span>
      </div>
     )}
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p9friction_2_interactive_simulation')}</h2>
     <div className={`flex-1 border rounded-lg bg-slate-50 dark:bg-[#121212] relative flex flex-col justify-between lg:overflow- `}>
      <svg viewBox="0 0 400 450" className="w-full h-full">
       {/* Table */}
       <rect x="0" y="150" width="400" height="50" fill="#d97706" />
       
       {/* Block */}
       <rect x={50 + blockX} y="110" width="80" height="40" fill="#3b82f6" rx="4" />
       
       {/* Rollers */}
       {mode === 'rolling' && (
        <>
         <circle cx={70 + blockX} cy="145" r="5" fill="#64748b" />
         <circle cx={110 + blockX} cy="145" r="5" fill="#64748b" />
        </>
       )}
       
       {/* Spring Balance */}
       <line x1={130 + blockX} y1="130" x2={200 + blockX} y2="130" stroke="#475569" strokeWidth="3" />
       <rect x={200 + blockX} y="120" width="60" height="20" fill="#e2e8f0" stroke="#64748b" rx="2" />
       <text x={230 + blockX} y="134" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
        {currentForce.toFixed(1)} N
       </text>

       {/* Graph Area */}
       <g transform="translate(40, 400)">
        {/* Axes */}
        <line x1="0" y1="0" x2="340" y2="0" stroke="black" strokeWidth="2" />
        <text x="310" y="-10" fontSize="12" fill="#475569">{t('lab.p9friction_time_s')}</text>
        <line x1="0" y1="0" x2="0" y2="-180" stroke="black" strokeWidth="2" />
        <text x="10" y="-170" fontSize="12" fill="#475569">{t('lab.p9friction_force_n')}</text>

        {/* Y-axis ticks */}
        <line x1="-3" y1="-70" x2="0" y2="-70" stroke="black" />
        <text x="-20" y="-66" fontSize="10">10</text>
        <line x1="-3" y1="-140" x2="0" y2="-140" stroke="black" />
        <text x="-20" y="-136" fontSize="10">20</text>

        {/* X-axis ticks */}
        <line x1="150" y1="0" x2="150" y2="3" stroke="black" />
        <text x="148" y="15" fontSize="10">5.0</text>
        <line x1="300" y1="0" x2="300" y2="3" stroke="black" />
        <text x="295" y="15" fontSize="10">10.0</text>

        {/* Dynamic Force Path */}
        <path d={drawPath()} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Current Indicator */}
        {time > 0 && (
         <circle cx={Math.min(time, t_break + 4) * 30} cy={-currentForce * 7} r="4" fill="#ef4444" />
        )}
       </g>
      </svg>
     </div>
    </div>

    {/* Column 3: Analysis */}
    <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg: border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     {config.predictionPhase && (
      <div className="mb-4">
       <PredictionChallenge
        challenge={{
         question: "Will static friction or kinetic friction be greater for the wooden block on a wooden surface?",
         options: ["Static friction will be greater", "Kinetic friction will be greater", "They will be equal", "It depends on the mass only"],
         correctOption: 0,
         explanation: "Static friction (μs = 0.4) is always greater than kinetic friction (μk = 0.3) for the same surfaces. You need more force to start moving than to keep moving."
        }}
        onComplete={() => {}}
       />
      </div>
     )}
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p9friction_3_data_analysis')}</h2>
     
     <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
        <tr>
         <th className="p-2 border">{t('lab.p9friction_mode')}</th>
         <th className="p-2 border">{t('lab.p9friction_mass_kg')}</th>
         <th className="p-2 border">{t('lab.p9friction_peak_n')}</th>
         <th className="p-2 border">{t('lab.p9friction_kinetic_n')}</th>
        </tr>
       </thead>
       <tbody>
        {logs.length === 0 ? (
         <tr><td colSpan={4} className="p-4 text-center text-slate-500 dark:text-[#71717a]">{t('lab.p9friction_no_data_recorded_yet')}</td></tr>
        ) : (
         logs.map((log, i) => (
          <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
           <td className="p-2 border capitalize">{log.mode}</td>
           <td className="p-2 border">{log.mass}</td>
           <td className="p-2 border">{log.peak}</td>
           <td className="p-2 border">{log.kinetic}</td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
      <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">{t('lab.p9friction_assessment')}</h3>
      <p className="text-sm text-blue-800 mb-4 dark:text-[#ffffff]">
       
                                {t('lab.p9friction_select_the_unknown_material_mo')}<span className="italic">μ<sub>s</sub></span>). 
       <br/><span className="text-xs">{t('lab.p9friction_assume_g_9_8_m_s')}</span>
      </p>
      
      <div className="flex gap-2 mb-2">
       <input 
        type="number" 
        placeholder={t('lab.p9friction_enter_s')}
        value={userMu}
        onChange={(e) => setUserMu(e.target.value)}
        className="flex-1 p-2 border rounded-md"
       />
       <button 
        onClick={checkMu}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
       >
        
                                     {t('lab.p9friction_check')}
                                    </button>
      </div>
      
      {assessmentResult === 'correct' && (
       <div className="flex items-center gap-2 text-emerald-600 text-sm mt-2">
        <CheckCircle className="w-4 h-4" />  {t('lab.p9friction_correct_excellent_calculation')}
                                    </div>
      )}
      {assessmentResult === 'incorrect' && (
       <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
        <XCircle className="w-4 h-4" />  {t('lab.p9friction_incorrect_use_formula_s_peak_f')}
                                    </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
