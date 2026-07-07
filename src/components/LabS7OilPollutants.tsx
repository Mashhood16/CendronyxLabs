import { useState } from 'react';
import { Droplets, Grid, Utensils, BarChart3 } from 'lucide-react';
import LabHeader from './LabHeader';
import DataChart from './DataChart';
import ProgressionPath from './ProgressionPath';
import { addMeasurementNoise } from '../utils/measurementNoise';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7OilPollutants({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [method, setMethod] = useState<'none' | 'spoon' | 'cheesecloth' | 'sand'>('none');
 const [oilRemoved, setOilRemoved] = useState(0); // 0 to 100
 const [trialResults, setTrialResults] = useState<{ method: string; efficiency: number }[]>([]);
 const [trialCount, setTrialCount] = useState(0);

 const applyMethod = (m: 'spoon' | 'cheesecloth' | 'sand') => {
 setMethod(m);
 // Spoon removes a little (20%), cheesecloth removes some (50%), sand clumps and removes lots (90%)
 const baseEff = m === 'spoon' ? 20 : m === 'cheesecloth' ? 50 : 90;
 const noisyEff = parseFloat(addMeasurementNoise(baseEff, trialCount + 1, 8).toFixed(1));
 const clampedEff = Math.min(100, Math.max(0, noisyEff));
 setOilRemoved(clampedEff);
 };

 const recordTrial = () => {
  if (method === 'none') return;
  setTrialResults(prev => [...prev, { method, efficiency: oilRemoved }]);
  setTrialCount(prev => prev + 1);
 };

 const reset = () => {
 setMethod('none');
 setOilRemoved(0);
 };

 const resetTrials = () => {
  setTrialResults([]);
  setTrialCount(0);
 };

 // Aggregate trial results by method for the chart
 const aggregatedData = ['spoon', 'cheesecloth', 'sand'].map(m => {
  const trials = trialResults.filter(t => t.method === m);
  const avg = trials.length > 0 ? trials.reduce((s, t) => s + t.efficiency, 0) / trials.length : 0;
  return { method: m === 'spoon' ? 'Spoon' : m === 'cheesecloth' ? 'Cheesecloth' : 'Sand', avgEff: parseFloat(avg.toFixed(1)) };
 }).filter(d => d.avgEff > 0);

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7oilpollutants_unit_7_removing_oil_pollutants')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="p-6 rounded-2xl shadow-xl max-w-2xl w-full text-center mb-8 bg-slate-50 dark:!bg-[#121212] border border-slate-200 dark:border-[#1c1b1b]">
   <h2 className="text-2xl font-bold text-emerald-400 mb-4">{t('lab.s7oilpollutants_cleaning_oil_spills')}</h2>
   <p className="text-slate-300 mb-6">{t('lab.s7oilpollutants_oil_is_less_dense_than_water_s')}</p>
   
   <div className="flex justify-center gap-4 flex-wrap">
   <button 
    onClick={() => applyMethod('spoon')}
    className="flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium"
   >
    <Utensils className="w-4 h-4 mr-2" />  {t('lab.s7oilpollutants_skim_with_spoon')}
                            </button>
   <button 
    onClick={() => applyMethod('cheesecloth')}
    className="flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium"
   >
    <Grid className="w-4 h-4 mr-2" />  {t('lab.s7oilpollutants_drag_cheesecloth')}
                            </button>
   <button 
    onClick={() => applyMethod('sand')}
    className="flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium"
   >
    <Droplets className="w-4 h-4 mr-2" />  {t('lab.s7oilpollutants_sprinkle_sand')}
                            </button>
   <button 
    onClick={reset}
    className="flex items-center px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-600/40 font-medium ml-4 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
   >
    
                             {t('lab.s7oilpollutants_reset_spill')}
                            </button>
   </div>
  </div>

  <div className="relative w-full max-w-4xl h-80 flex justify-center items-center bg-[#000000] dark:!bg-[#121212] rounded-3xl border-8 border-[#1c1b1b] dark:border-[#1c1b1b] overflow-hidden shadow-2xl">
   
   {/* Water */}
   <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
   {/* Grid to look like a tank */}
   <div className="w-full h-full opacity-10 bg-[linear-gradient(white_1px,_transparent_1px),_linear-gradient(90deg,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
   </div>

   {/* Oil Slick */}
   <div 
   className="absolute transition-all duration-1000 ease-in-out bg-yellow-600/80 backdrop-blur-sm shadow-[0_0_20px_rgba(202,138,4,0.5)] flex items-center justify-center overflow-hidden border border-yellow-500/50"
   style={{ 
    width: `${100 - oilRemoved}%`, 
    height: '100px', 
    top: '50px', 
    borderRadius: '50% 40% 60% 40% / 40% 50% 60% 50%' 
   }}
   >
    <span className="text-yellow-900 font-bold opacity-50 select-none tracking-widest">{t('lab.s7oilpollutants_crude_oil')}</span>
   </div>

   {/* Sinking Clumps (Sand only) */}
   {method === 'sand' && (
   <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
     <div 
     key={i} 
     className="absolute w-6 h-6 bg-yellow-800 rounded-full blur-[1px] animate-[fall_2s_linear_forwards]"
     style={{ left: `${10 + i * 4}%`, animationDelay: `${Math.random()}s`, top: '-20px' }}
     ></div>
    ))}
    <style>{`
     @keyframes fall {
     to { transform: translateY(400px); }
     }
    `}</style>
   </div>
   )}

   <div className="absolute bottom-4 right-6 text-slate-400 font-bold">
   
                        {t('lab.s7oilpollutants_efficiency')} {oilRemoved}{t('lab.s7oilpollutants_removed')}
                        </div>
  </div>

  {method !== 'none' && (
   <div className="mt-8 p-6 rounded-xl max-w-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-l-4 border-emerald-500">
   {method === 'spoon' && <p>{t('lab.s7oilpollutants_skimming_with_a_spoon_only_rem')}</p>}
   {method === 'cheesecloth' && <p>{t('lab.s7oilpollutants_dragging_cheesecloth_a_porous_')}</p>}
   {method === 'sand' && <p>{t('lab.s7oilpollutants_sprinkling_sand_over_the_oil_c')}</p>}
   </div>
  )}

  {/* Record Trial Button */}
  {method !== 'none' && oilRemoved > 0 && (
   <button
    onClick={recordTrial}
    className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
   >
    
                         {t('lab.s7oilpollutants_record_trial')}{trialCount + 1}
   </button>
  )}

  {/* Data Collection & Analysis */}
  {trialResults.length >= 1 && (
   <div className="mt-8 w-full max-w-2xl space-y-4">
    <DataChart
     title={t('lab.s7oilpollutants_oil_removal_efficiency_compari')}
     xAxisKey="method"
     xAxisLabel="Method"
     series={[
      { key: 'avgEff', name: 'Avg Efficiency (%)', color: '#10b981' },
     ]}
     data={aggregatedData}
     onRecord={() => {}}
     onReset={resetTrials}
     noisePercent={5}
     recordLabel={`${trialResults.length} Trials Recorded`}
     chartType="bar"
    />

    {trialResults.length >= 2 && (
     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
      <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-2">
       <BarChart3 className="w-4 h-4" />  {t('lab.s7oilpollutants_analysis')}
                                       </h4>
      <p className="text-sm text-emerald-700 dark:text-emerald-300">
       
                                        {t('lab.s7oilpollutants_sand_consistently_removes_the_')} <strong>{t('lab.s7oilpollutants_experimental_variation')}</strong>.
      </p>
     </div>
    )}

    <ProgressionPath
     currentClass={7}
     links={[
      { fromClass: 6, fromSubject: 'Science', fromLab: 'Environmental Awareness', toConcept: 'Pollution harms ecosystems' },
     ]}
    />
   </div>
  )}
  </div>
 </div>
 );
}
