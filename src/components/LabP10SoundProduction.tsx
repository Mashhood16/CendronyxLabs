import { useState } from 'react';
import {Plus, Trash2, CheckCircle, XCircle, Play } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

interface DataPoint {
 id: string;
 force: number;
 freq: number;
 splash: number;
}

export default function LabP10SoundProduction({ onExit }: LabProps) {

const { recordLabData } = useLab();
 const { t } = useTranslate();
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [force, setForce] = useState<number>(5);
 const [frequency, setFrequency] = useState<number>(256);
 const [fluid, setFluid] = useState<string>('water');
 
 const [data, setData] = useState<DataPoint[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const [isStriking, setIsStriking] = useState<boolean>(false);
 const [splashHeight, setSplashHeight] = useState<number | null>(null);

 const fluids: Record<string, { name: string; density: number; color: string }> = {
 ethanol: { name: 'Ethanol', density: 0.79, color: '#e0f2fe' },
 water: { name: 'Water', density: 1.0, color: '#3b82f6' },
 glycerin: { name: 'Glycerin', density: 1.26, color: '#d8b4fe' },
 unknown: { name: 'Unknown Fluid X', density: 1.5, color: '#10b981' },
 };

 const currentDensity = fluids[fluid].density;

 // Theoretical splash height model: H = k * Force * (f / 256) / density
 const calculateTheoreticalSplash = (f: number, frq: number, d: number) => {
 return (2.0 * f * (frq / 256)) / d;
 };

 const handleStrike = () => {
 if (isStriking) return;
 setIsStriking(true);
 setSplashHeight(null);

 // Simulate animation duration
 setTimeout(() => {
  const theoretical = calculateTheoreticalSplash(force, frequency, currentDensity);
  // Add +/- 5% noise
  const noise = theoretical * (Math.random() * 0.1 - 0.05);
  setSplashHeight(Math.max(0.1, theoretical + noise));
  setIsStriking(false);
 }, 1500);
 };

 const handleRecordData = () => {
 if (splashHeight === null) return;
 const newPoint: DataPoint = {
  id: Math.random().toString(36).substring(2, 9),
  force,
  freq: frequency,
  splash: parseFloat(splashHeight.toFixed(1)),
 };
 setData([...data, newPoint]);
 
  recordLabData({ timestamp: Date.now() });
};

 const handleClearData = () => {
 setData([]);
 };

 const checkAssessment = () => {
 const ans = parseFloat(assessmentAnswer);
 if (!isNaN(ans) && Math.abs(ans - fluids.unknown.density) < 0.15) {
  setAssessmentResult('correct');
 } else {
  setAssessmentResult('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <LabHeader onExit={onExit} title={t('lab.p10soundproduction_production_of_sound')} subtitle={t('lab.subtitle_visualize_mechanical_vibrations')} />

  {/* Main Grid */}
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.p10soundproduction_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.10soundproduction_lab')}</button>
  </div>
  <div className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full lg:overflow-visible">
  
  {/* Column 1: Theory and Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-  ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundproduction_theory_andsetup')}</h2>
   </div>
   <div className={`p-5 flex-1 lg:overflow-y-auto space-y-6 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="space-y-2 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <p>
    
                                 {t('lab.p10soundproduction_sound_is_produced_by_the_mecha')}
                                 </p>
    <p>
    
                                 {t('lab.p10soundproduction_because_the_vibrations_are_oft')}
                                 </p>
    <p>
    
                                 {t('lab.p10soundproduction_the')} <strong>{t('lab.p10soundproduction_splash_height_h')}</strong>  {t('lab.p10soundproduction_is_proportional_to_the_strike_')}
                                 </p>
   </div>

   <div className="border-t border-slate-100 pt-4 space-y-4">
    <div className="space-y-2">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     <span>{t('lab.p10soundproduction_strike_force_n')}</span>
     <span>{force}</span>
    </label>
    <input
     type="range"
     min="1"
     max="10"
     step="1"
     value={force}
     onChange={(e) => setForce(parseFloat(e.target.value))}
     disabled={isStriking}
     className="w-full accent-indigo-600"
    />
    </div>

    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.p10soundproduction_tuning_fork_frequency_hz')}
                                     </label>
    <div className="flex gap-2">
     {[256, 440, 512].map(freq => (
     <button
      key={freq}
      onClick={() => setFrequency(freq)}
      disabled={isStriking}
      className={`flex-1 py-2 text-sm font-medium rounded-md border ${frequency === freq ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
     >
      {freq}
     </button>
     ))}
    </div>
    </div>

    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.p10soundproduction_fluid_medium')}
                                     </label>
    <select
     value={fluid}
     onChange={(e) => setFluid(e.target.value)}
     disabled={isStriking}
     className={`w-full p-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-col `}
    >
     {Object.entries(fluids).map(([key, mat]) => (
     <option key={key} value={key}>
      {mat.name} {key !== 'unknown' && `(ρ = ${mat.density} g/cm³)`}
     </option>
     ))}
    </select>
    </div>
   </div>

   <button
    onClick={handleStrike}
    disabled={isStriking}
    className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <Play className="w-5 h-5 fill-current" />
    {isStriking ? 'Striking & Dipping...' : 'Strike & Dip Fork'}
   </button>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className="bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg:col-span-1 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 justify-between items-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundproduction_simulationview')}</h2>
   </div>
   <div className="p-4 flex-1 flex flex-col items-center justify-end bg-[#000000] dark:bg-[#121212] relative overflow-hidden">
   
   {/* The Setup */}
   <div className="relative w-full h-[400px] flex flex-col items-center justify-end">
    
    {/* Splash Height Marker / Ruler */}
    <div className="absolute left-8 bottom-10 top-10 w-8 border-r-2 border-slate-600 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col justify-between items-end pr-2 py-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {[30, 25, 20, 15, 10, 5, 0].map(val => (
     <div key={val} className="flex items-center gap-1">
     <span className="text-[10px] text-slate-400">{val}</span>
     <div className="w-2 h-px bg-slate-50 dark:bg-[#000000]0 dark:bg-[#121212]"></div>
     </div>
    ))}
    </div>

    {/* Beaker */}
    <div className="w-48 h-40 border-x-4 border-b-4 border-white/20 rounded-b-xl relative flex items-end overflow-hidden z-10 backdrop-blur-sm">
    {/* Fluid */}
    <div 
     className="w-full h-28 border-t border-white/30 transition-colors duration-500"
     style={{ backgroundColor: `${fluids[fluid].color}66` }}
    >
     {/* Ripples / Splashes when dipped */}
     {splashHeight !== null && !isStriking && (
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
      <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 w-2 bg-blue-100 rounded-t-full origin-bottom animate-[splash_0.5s_ease-out_forwards]"
      style={{ height: `${splashHeight * 8}px`, backgroundColor: fluids[fluid].color }}
      />
      {[...Array(4)].map((_,i) => (
       <div 
       key={`drop-${i}`}
       className="absolute bottom-full w-1.5 h-1.5 rounded-full animate-[drop_0.6s_ease-out_forwards]"
       style={{
        left: `${40 + Math.random() * 20}%`,
        backgroundColor: fluids[fluid].color,
        animationDelay: `${Math.random() * 0.2}s`,
        '--drop-height': `-${splashHeight * (4 + Math.random() * 4)}px`
       } as React.CSSProperties}
       />
      ))}
     </div>
     )}
    </div>
    </div>

    {/* Tuning Fork */}
    <div 
    className={`absolute z-20 flex flex-col items-center transition-all ${isStriking ? 'duration-1000 bottom-[60px]' : 'duration-500 bottom-[200px]'}`}
    >
     <div className="relative w-12 h-24">
     <div className="absolute bottom-0 w-full h-4 bg-slate-300 dark:bg-[#121212] rounded-b-md" />
     {/* Left Prong */}
     <div 
      className="absolute left-0 bottom-4 w-3 h-full bg-slate-300 dark:bg-[#121212] rounded-t-xl origin-bottom"
      style={{
      animation: isStriking || splashHeight !== null ? `vibrate ${(1/frequency)*10}s linear infinite alternate` : 'none'
      }}
     />
     {/* Right Prong */}
     <div 
      className="absolute right-0 bottom-4 w-3 h-full bg-slate-300 dark:bg-[#121212] rounded-t-xl origin-bottom"
      style={{
      animation: isStriking || splashHeight !== null ? `vibrate ${(1/frequency)*10}s linear infinite alternate-reverse` : 'none'
      }}
     />
     </div>
     <div className="w-3 h-16 bg-slate-400 dark:bg-[#121212] rounded-b-xl" />
     
     {/* Vibration Rings (Sound Waves in Air) */}
     {(isStriking || splashHeight !== null) && (
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
      <div className="absolute inset-0 border-2 border-slate-400 dark:border-[#1c1b1b]/30 rounded-full animate-ping" style={{ animationDuration: '1s' }}/>
      <div className="absolute inset-2 border-2 border-slate-400 dark:border-[#1c1b1b]/20 rounded-full animate-ping" style={{ animationDuration: '1s', animationDelay: '0.3s' }}/>
     </div>
     )}
    </div>
    
    <style>{`
    @keyframes vibrate {
     0% { transform: rotate(-2deg); }
     100% { transform: rotate(2deg); }
    }
    @keyframes splash {
     0% { transform: translateX(-50%) scaleY(0); opacity: 1; }
     50% { transform: translateX(-50%) scaleY(1); opacity: 1; }
     100% { transform: translateX(-50%) scaleY(0.2); opacity: 0; }
    }
    @keyframes drop {
     0% { transform: translateY(0); opacity: 1; }
     50% { transform: translateY(var(--drop-height)); opacity: 1; }
     100% { transform: translateY(0); opacity: 0; }
    }
    `}</style>
   </div>

   {/* Readout */}
   <div className="mt-4 w-full bg-[#121212] dark:bg-[#121212] p-3 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] flex items-center justify-between px-6">
    <span className="text-slate-400 text-sm font-medium">{t('lab.10soundproduction_splashheight')}</span>
    <span className="text-2xl font-mono text-emerald-400">
    {splashHeight !== null ? `${splashHeight.toFixed(1)} cm` : '--'}
    </span>
   </div>

   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
   <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 justify-between items-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundproduction_data_andanalysis')}</h2>
   <div className="flex gap-2">
    <button
    onClick={handleRecordData}
    disabled={splashHeight === null || isStriking}
    className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 disabled:bg-slate-300 transition-colors text-sm font-medium dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <Plus className="w-4 h-4" />  {t('lab.p10soundproduction_record')}
                                 </button>
    <button
    onClick={handleClearData}
    className="flex items-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-3 py-1.5 rounded-md hover:bg-slate-300 dark:bg-[#121212] transition-colors text-sm font-medium"
    >
    <Trash2 className="w-4 h-4" />  {t('lab.p10soundproduction_clear')}
                                 </button>
   </div>
   </div>
   
   <div className="p-4 flex-1 lg:overflow-y-auto space-y-6">
   
   {/* Data Table */}
   <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] font-medium border-b border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="px-3 py-2 text-center">{t('lab.p10soundproduction_force_n')}</th>
     <th className="px-3 py-2 text-center">{t('lab.p10soundproduction_freq_hz')}</th>
     <th className="px-3 py-2 text-center">{t('lab.p10soundproduction_height_cm')}</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {data.length === 0 ? (
     <tr>
      <td colSpan={3} className="px-3 py-6 text-center text-slate-400 italic">
      
                                                   {t('lab.p10soundproduction_no_data_recorded_yet')}
                                                   </td>
     </tr>
     ) : (
     data.map((point) => (
      <tr key={point.id} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="px-3 py-2 text-center">{point.force}</td>
      <td className="px-3 py-2 text-center">{point.freq}</td>
      <td className="px-3 py-2 text-center font-semibold text-emerald-600">{point.splash}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>

   {/* Graph */}
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2 text-center">{t('lab.10soundproduction_graphofforcevssplashheight')}</h3>
    <div className="relative w-full aspect-square max-w-[250px] mx-auto bg-slate-50 dark:bg-[#121212] border-l-2 border-b-2 border-slate-600 dark:border-[#1c1b1b]">
    {/* Grid lines */}
    {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
     <div key={`grid-${val}`}>
     <div className="absolute left-0 right-0 border-t border-slate-100" style={{ bottom: `${val * 100}%` }} />
     <div className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${val * 100}%` }} />
     </div>
    ))}
    
    {/* Axis Labels */}
    <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-slate-500 dark:text-[#71717a] font-medium">{t('lab.p10soundproduction_force_n')}</div>
    <div className="absolute top-0 bottom-0 -left-6 flex items-center">
     <div className="transform -rotate-90 text-[10px] text-slate-500 dark:text-[#71717a] font-medium whitespace-nowrap">{t('lab.p10soundproduction_height_cm')}</div>
    </div>

    {/* Data Points */}
    {data.map((point) => (
     <div
     key={`pt-${point.id}`}
     className="absolute w-2 h-2 bg-indigo-600 rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-sm"
     style={{
      left: `${(point.force / 10.0) * 100}%`,
      bottom: `${(point.splash / 40.0) * 100}%`, // Assuming max height ~40cm
     }}
     />
    ))}
    </div>
   </div>

   {/* Assessment */}
   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.10soundproduction_analysis')}</h3>
    <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    
                                 {t('lab.p10soundproduction_based_on_your_measurements_wit')} <strong>{t('lab.10soundproduction_unknownfluid')}</strong>{t('lab.p10soundproduction_compare_its_splash_height_to_w')}
                                 </p>
    <div className="flex gap-2 items-center">
    <input
     type="number"
     step="0.1"
     placeholder={t('lab.p10soundproduction_t_lab_10soundproduction_estima')}
     value={assessmentAnswer}
     onChange={(e) => setAssessmentAnswer(e.target.value)}
     className="w-full p-2 rounded border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500"
    />
    <button
     onClick={checkAssessment}
     className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors whitespace-nowrap dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     
                                      {t('lab.p10soundproduction_check')}
                                     </button>
    </div>
    
    {assessmentResult === 'correct' && (
    <div className="mt-3 flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200">
     <CheckCircle className="w-5 h-5" />
     <span className="text-sm font-medium">{t('lab.10soundproduction_correctthedensityis15gcm')}</span>
    </div>
    )}
    {assessmentResult === 'incorrect' && (
    <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded border border-rose-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <XCircle className="w-5 h-5" />
     <span className="text-sm font-medium">{t('lab.p10soundproduction_incorrect_remember_higher_dens')}</span>
    </div>
    )}
   </div>

   </div>
  </div>

  </div>
 </div>
 );
}
