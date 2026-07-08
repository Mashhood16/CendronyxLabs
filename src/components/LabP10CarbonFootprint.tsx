import { useState, useEffect } from 'react';
import {Play, Plus, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps { onExit?: () => void; }

export default function LabP10CarbonFootprint({ onExit }: LabProps) {
 const { t } = useTranslate();
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // State
 const [mode, setMode] = useState<string>('Car');
 const [distance, setDistance] = useState<number>(10);
 const [passengers, setPassengers] = useState<number>(1);
 
 const [isDriving, setIsDriving] = useState(false);
 const [driveProgress, setDriveProgress] = useState(0);
 
 const [dataLog, setDataLog] = useState<{id: number, mode: string, dist: number, pax: number, totalCO2: number, perPaxCO2: number}[]>([]);
 
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const modes: Record<string, { factor: number, maxPax: number, emoji: string, name: string }> = {
 'Bike': { factor: 0, maxPax: 1, emoji: '🚲', name: 'Bicycle / Walk' },
 'Car': { factor: 0.2, maxPax: 5, emoji: '🚗', name: 'Standard Car' },
 'SUV': { factor: 0.35, maxPax: 7, emoji: '🚙', name: 'Large SUV' },
 'Bus': { factor: 0.8, maxPax: 50, emoji: '🚌', name: 'City Bus' },
 };

 // Clamp passengers when mode changes
 useEffect(() => {
 if (passengers > modes[mode].maxPax) {
  setPassengers(modes[mode].maxPax);
 }
 }, [mode, passengers, modes]);

 useEffect(() => {
 let timer: ReturnType<typeof setTimeout>;
 if (isDriving) {
  timer = setInterval(() => {
  setDriveProgress(p => {
   if (p >= 100) {
   setIsDriving(false);
   return 100;
   }
   return p + 2;
  });
  }, 30);
 }
 return () => clearInterval(timer);
 }, [isDriving]);

 const handleDrive = () => {
 if (isDriving) return;
 setDriveProgress(0);
 setIsDriving(true);
 };

 const handleRecord = () => {
 const totalCO2 = distance * modes[mode].factor;
 const perPaxCO2 = totalCO2 / passengers;
 setDataLog(prev => [...prev, { id: Date.now(), mode, dist: distance, pax: passengers, totalCO2, perPaxCO2 }]);
 };

 const checkAnswer = () => {
 // Question: What is the per-passenger CO2 footprint (in kg) for a 15 km trip in an SUV (0.35 kg/km) carrying 3 passengers?
 const expected = (15 * 0.35) / 3; // 1.75
 const ans = parseFloat(studentAnswer);
 if (!isNaN(ans) && Math.abs(ans - expected) < 0.05) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
    setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 const currentTotal = distance * modes[mode].factor;
 const simulatedEmissions = (driveProgress / 100) * currentTotal;

 // Max for graph
 const maxPerPax = Math.max(0.5, ...dataLog.map(d => d.perPaxCO2));

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p10carbonfootprint_carbon_footprint_of_transport')} subtitle={t('lab.subtitle_investigate_environmental_impact')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.p10carbonfootprint_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.10carbonfootprint_lab')}</button>
  </div>
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 max-w-7xl mx-auto w-full lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <div className={`${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10carbonfootprint_theory_andsetup')}</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    
                             {t('lab.p10carbonfootprint_combustion_of_fossil_fuels_in_')} 
                             <strong>{t('lab.10carbonfootprint_percapitaemissions')}</strong>  {t('lab.p10carbonfootprint_are_found_by_dividing_the_tota')}
                            </p>
   <div className={`bg-emerald-50 p-3 rounded-lg flex items-start gap-2 border border-emerald-100 `}>
    <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
    <p className="text-xs text-emerald-800">
    
                                 {t('lab.p10carbonfootprint_formula')} <br />
    <code className="bg-emerald-100 px-1 rounded">{t('lab.10carbonfootprint_totalcodistanceemissionfactor')}</code><br />
    <code className="bg-emerald-100 px-1 rounded mt-1 inline-block">{t('lab.10carbonfootprint_perpassengertotalcopassengers')}</code>
    </p>
   </div>
   </div>

   <div className="space-y-5">
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.10carbonfootprint_transportmode')}</label>
    <select 
    value={mode} 
    onChange={(e) => { setMode(e.target.value); setDriveProgress(0); }}
    className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg bg-slate-50 dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 flex-col `}
    >
    {Object.entries(modes).map(([key, m]) => (
     <option key={key} value={key}>{m.name} ({m.factor}  {t('lab.p10carbonfootprint_kg_km')}</option>
    ))}
    </select>
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>{t('lab.10carbonfootprint_tripdistance')}</span>
    <span className="text-emerald-700">{distance} km</span>
    </label>
    <input 
    type="range" min="1" max="50" step="1" 
    value={distance} 
    onChange={(e) => { setDistance(Number(e.target.value)); setDriveProgress(0); }}
    className="w-full accent-emerald-600"
    />
   </div>

   <div>
    <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    <span>{t('lab.10carbonfootprint_numberofpassengers')}</span>
    <span className="text-emerald-700">{passengers}</span>
    </label>
    <input 
    type="range" min="1" max={modes[mode].maxPax} step="1" 
    value={passengers} 
    onChange={(e) => { setPassengers(Number(e.target.value)); setDriveProgress(0); }}
    className="w-full accent-emerald-600"
    />
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-1">{t('lab.p10carbonfootprint_max_capacity_for')} {modes[mode].name} is {modes[mode].maxPax}.</p>
   </div>
   </div>
   
   <div className="mt-auto">
   <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10carbonfootprint_assessment')}</h3>
   <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                             {t('lab.p10carbonfootprint_calculate_the_per_passenger_co')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.01"
    placeholder={t('lab.p10carbonfootprint_t_lab_10carbonfootprint_eg125')}
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-sm"
    />
    <button 
    onClick={checkAnswer}
    className={`px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg text-sm font-medium hover:bg-slate-700 dark:bg-[#121212] flex-col `}
    >
    
                                 {t('lab.p10carbonfootprint_check')}
                                 </button>
   </div>
   {isCorrect === true && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>{t('lab.10carbonfootprint_correctexcellent')}</p>}
   {isCorrect === false && <p className="text-red-500 text-xs mt-2">{t('lab.p10carbonfootprint_incorrect_check_your_math_dist')}</p>}
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col items-center justify-between '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="w-full flex justify-between gap-4 mb-4">
    <div className={`flex-1 text-center bg-slate-100 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <p className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold tracking-wider">{t('lab.10carbonfootprint_totalemitted')}</p>
    <p className="text-2xl font-mono text-slate-800 dark:text-[#ffffff]">{simulatedEmissions.toFixed(2)} <span className="text-sm">{t('lab.10carbonfootprint_kg')}</span></p>
    </div>
    <div className="flex-1 text-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
    <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider">{t('lab.10carbonfootprint_perpassenger')}</p>
    <p className="text-2xl font-mono text-emerald-700">{((simulatedEmissions) / passengers).toFixed(2)} <span className="text-sm">{t('lab.10carbonfootprint_kg')}</span></p>
    </div>
   </div>

   <div className="relative flex-1 w-full bg-sky-100 rounded-xl overflow-hidden border border-sky-200 min-h-[250px] flex items-end">
   {/* Background elements */}
   <div className="absolute top-10 left-10 text-4xl opacity-50 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">{t('lab.10carbonfootprint_label')}</div>
   <div className="absolute top-20 right-20 text-4xl opacity-50">{t('lab.10carbonfootprint_label')}</div>
   <div className="absolute top-5 right-5 text-yellow-400 text-5xl">{t('lab.10carbonfootprint_label')}</div>
   
   {/* Road */}
   <div className="w-full h-1/3 bg-slate-700 dark:bg-[#121212] relative">
    {/* Road lines */}
    <div className="absolute top-1/2 w-full flex justify-around">
    {[...Array(10)].map((_, i) => (
     <div key={i} className="w-8 h-2 bg-slate-50 dark:bg-[#121212] opacity-50 rounded-sm"></div>
    ))}
    </div>

    {/* Vehicle & Exhaust */}
    <div 
    className="absolute bottom-4 text-6xl transition-all duration-75"
    style={{ left: `${-10 + driveProgress}%` }}
    >
    {modes[mode].emoji}
    
    {/* Exhaust clouds */}
    {mode !== 'Bike' && isDriving && driveProgress > 5 && driveProgress % 4 < 2 && (
     <div className="absolute -left-8 bottom-0 text-3xl animate-ping opacity-60">
     💨
     </div>
    )}
    {/* Visual CO2 accumulation representation */}
    {mode !== 'Bike' && (
     <div 
     className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#121212] dark:bg-[#121212] text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-80"
     >
     +{(simulatedEmissions).toFixed(1)}  {t('lab.p10carbonfootprint_kg_co')}
                                          </div>
    )}
    </div>
   </div>
   
   {/* Distance Marker */}
   <div className="absolute bottom-2 right-4 text-white text-sm font-bold opacity-80">
    {distance} km
   </div>
   </div>

   <div className="flex gap-4 mt-4 w-full justify-center">
   <button 
    onClick={handleDrive}
    disabled={isDriving}
    className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${ isDriving ? 'bg-slate-400 dark:bg-[#121212]' : 'bg-emerald-600 hover:bg-emerald-700' } disabled:opacity-50`}
   >
    <Play className="w-5 h-5"/>  {t('lab.p10carbonfootprint_drive')}
                            </button>
   <button 
    onClick={handleRecord}
    disabled={isDriving || driveProgress < 100}
    className="flex flex-1 items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all disabled:opacity-50"
   >
    <Plus className="w-5 h-5"/>  {t('lab.p10carbonfootprint_record')}
                            </button>
   </div>
  </div>

  {/* Right Column: Data & Graph */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10carbonfootprint_results_andcomparison')}</h2>
   
   <div className="h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0 shadow-sm z-10">
    <tr>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.10carbonfootprint_mode')}</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.10carbonfootprint_pax')}</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p10carbonfootprint_total_kg')}</th>
     <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p10carbonfootprint_per_pax_kg')}</th>
    </tr>
    </thead>
    <tbody>
    {dataLog.length === 0 ? (
     <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">{t('lab.10carbonfootprint_noscenariosrecordeddriveandrecordto')}</td></tr>
    ) : (
     dataLog.map((row) => (
     <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-100 dark:bg-[#121212] transition-colors">
      <td className="px-3 py-1.5">{modes[row.mode].emoji} {row.mode}</td>
      <td className="px-3 py-1.5">{row.pax}</td>
      <td className="px-3 py-1.5 font-mono text-slate-600 dark:text-[#a1a1aa]">{row.totalCO2.toFixed(2)}</td>
      <td className="px-3 py-1.5 font-mono text-emerald-600 font-bold">{row.perPaxCO2.toFixed(2)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className={`flex-1 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 relative min-h-[200px] items-end justify-around pb-8 pt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    {dataLog.length === 0 ? (
    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">{t('lab.10carbonfootprint_barchartperpassengerco')}</div>
    ) : (
    <>
     {/* Y Axis line */}
     <div className="absolute left-8 top-4 bottom-8 w-px bg-slate-300 dark:bg-[#121212]"></div>
     <div className="absolute left-8 bottom-8 right-4 h-px bg-slate-300 dark:bg-[#121212]"></div>
     
     {/* Max Label */}
     <div className="absolute left-1 top-4 text-[10px] text-slate-500 dark:text-[#71717a]">{maxPerPax.toFixed(1)}</div>
     <div className="absolute left-4 bottom-8 text-[10px] text-slate-500 dark:text-[#71717a]">0</div>
     <div className="absolute -left-4 top-1/2 -rotate-90 text-xs text-slate-500 dark:text-[#71717a] whitespace-nowrap">{t('lab.p10carbonfootprint_per_pax_co_kg')}</div>

     {/* Bars */}
     {dataLog.map((row) => {
     const heightPct = (row.perPaxCO2 / maxPerPax) * 100;
     return (
      <div key={row.id} className="relative w-8 mx-2 group z-10 flex flex-col justify-end h-full">
      <div 
       className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
       style={{ height: `${heightPct}%` }}
      >
       {/* Tooltip */}
       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#121212] dark:bg-[#121212] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
       {row.perPaxCO2.toFixed(2)} kg
       </div>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm">
       {modes[row.mode].emoji}
      </div>
      </div>
     );
     })}
    </>
    )}
   </div>
  </div>
  </div>
 </div>
 );
}
