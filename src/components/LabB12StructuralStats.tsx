import { useState } from 'react';
import { Database, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB12StructuralStats({ onExit }: { onExit?: () => void }) {
 const { setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [humidity, setHumidity] = useState(92);
 const [measurements, setMeasurements] = useState<number[]>([]);
 const [meanAns, setMeanAns] = useState('');
 const [sdAns, setSdAns] = useState('');
 const [feedback, setFeedback] = useState('');

 const isBForm = humidity >= 80;
 const truePitch = isBForm ? 3.4 : 2.8;
 const angle = isBForm ? 34 : 25;

 const takeMeasurements = () => {
 const newMeas = Array.from({length: 5}, () => {
  const noise = (Math.random() * 0.4) - 0.2;
  return Number((truePitch + noise).toFixed(2));
 });
 setMeasurements(newMeas);
 setFeedback('');
 setMeanAns('');
 setSdAns('');
 };

 const checkAnswers = () => {
 if (measurements.length === 0) return;
 
 // Calculate actual
 const sum = measurements.reduce((a, b) => a + b, 0);
 const mean = sum / measurements.length;
 
 const squaredDiffs = measurements.map(m => Math.pow(m - mean, 2));
 const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (measurements.length - 1);
 const sd = Math.sqrt(variance);

 const userMean = parseFloat(meanAns);
 const userSd = parseFloat(sdAns);

 let correct = 0;
 if (Math.abs(userMean - mean) < 0.05) correct++;
 if (Math.abs(userSd - sd) < 0.05) correct++;

 if (correct === 2) {
  setFeedback('Perfect! Both Mean and Standard Deviation are correct.');
 } else {
  setFeedback(`You got ${correct}/2 correct. Check your calculations. (Hint: Mean = ${mean.toFixed(2)})`);
    setLabScore(correct, 2);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.b12structuralstats_structural_biophysics_stats')} subtitle={t('lab.subtitle_crystallography_conformations')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b12structuralstats_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b12structuralstats_lab')}</button>
  </div>
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12structuralstats_theory_context')}</h2>
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
   <p>
    <strong>{t('lab.b12structuralstats_x_ray_crystallography')}</strong>  {t('lab.b12structuralstats_used_by_rosalind_franklin_to_d')}
                            </p>
   <p>
    <strong>{t('lab.b12structuralstats_dna_conformations')}</strong>
    <ul className="list-disc pl-5 mt-1 space-y-1">
    <li><strong>{t('lab.b12structuralstats_b_form')}</strong>  {t('lab.b12structuralstats_high_hydration_gt_80_pitch_3_4')}</li>
    <li><strong>{t('lab.b12structuralstats_a_form')}</strong>  {t('lab.b12structuralstats_low_hydration_more_compact_pit')}</li>
    </ul>
   </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg mt-4 flex-col `}>
    <strong>{t('lab.b12structuralstats_biostatistics_standard_deviati')}</strong>
    <p className="mt-2">{t('lab.b12structuralstats_formula_for_sample_sd')}<em>s</em>):</p>
    <div className="text-center font-serif text-lg mt-2 mb-2">
    
                                 {t('lab.b12structuralstats_s_x_x_n_1')}
                                 </div>
    <ul className="list-disc pl-5 text-xs">
    <li>{t('lab.b12structuralstats_x_sample_mean')}</li>
    <li>{t('lab.b12structuralstats_n_sample_size_degrees_of_freed')}</li>
    <li>{t('lab.b12structuralstats_x_individual_measurement')}</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Interactive */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12structuralstats_diffraction_simulator')}</h2>
   
   <div className="flex-1 flex flex-col items-center">
   <div className="mb-4 w-full">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    <span>{t('lab.b12structuralstats_fiber_hydration')} {humidity}%</span>
    <span>{isBForm ? 'B-Form DNA' : 'A-Form DNA'}</span>
    </label>
    <input 
    type="range" min="50" max="98" value={humidity} 
    onChange={(e) => setHumidity(Number(e.target.value))}
    className="w-full accent-indigo-600"
    />
   </div>

   <div className={`relative w-64 h-64 bg-[#000000] dark:bg-[#121212] rounded-lg flex items-center justify-center shadow-inner overflow- border-4 border-[#1c1b1b] dark:border-[#1c1b1b] flex-col `}>
    {/* X-ray pattern */}
    <svg viewBox="-100 -100 200 200" className="w-full h-full opacity-80 blur-[1px]">
    {/* Central spot */}
    <circle cx="0" cy="0" r="10" fill="white" className="opacity-90" />
    
    {/* Cross spots */}
    {Array.from({ length: 4 }).map((_, i) => (
     <g key={`arm1-${i}`} transform={`rotate(${angle})`}>
     <circle cx="0" cy={-25 - i*15} r={3 + i} fill="white" className="opacity-70" />
     <circle cx="0" cy={25 + i*15} r={3 + i} fill="white" className="opacity-70" />
     </g>
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
     <g key={`arm2-${i}`} transform={`rotate(${-angle})`}>
     <circle cx="0" cy={-25 - i*15} r={3 + i} fill="white" className="opacity-70" />
     <circle cx="0" cy={25 + i*15} r={3 + i} fill="white" className="opacity-70" />
     </g>
    ))}
    
    {/* Layer lines for scale */}
    <line x1="-80" y1="-70" x2="80" y2="-70" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
    <line x1="-80" y1="70" x2="80" y2="70" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
    </svg>
   </div>

   <button 
    onClick={takeMeasurements}
    className={`mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 font-semibold transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}>
    <Database className="w-5 h-5" />  {t('lab.b12structuralstats_collect_experimental_data')}
                            </button>
   </div>
  </div>

  {/* Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12structuralstats_data_analysis')}</h2>
   
   <div className="space-y-6">
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.b12structuralstats_raw_measurements_pitch_in_nm')}</h3>
    {measurements.length > 0 ? (
    <div className="flex flex-wrap gap-2">
     {measurements.map((m, i) => (
     <span key={i} className="bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] px-3 py-1 rounded font-mono text-sm shadow-sm text-indigo-700 font-bold">
      {m.toFixed(2)}
     </span>
     ))}
    </div>
    ) : (
    <p className="text-sm text-slate-400 italic">{t('lab.b12structuralstats_click_collect_data_to_begin')}</p>
    )}
   </div>

   <div className="space-y-4">
    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.b12structuralstats_calculate_the_mean_x')}
                                     </label>
    <input 
     type="number" step="0.01"
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
     value={meanAns}
     onChange={e => setMeanAns(e.target.value)}
     disabled={measurements.length === 0}
    />
    </div>

    <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.b12structuralstats_calculate_the_sample_standard_')}
                                     </label>
    <input 
     type="number" step="0.01"
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
     value={sdAns}
     onChange={e => setSdAns(e.target.value)}
     disabled={measurements.length === 0}
    />
    </div>
   </div>

   <button 
    onClick={checkAnswers}
    disabled={measurements.length === 0}
    className="w-full bg-[#121212] dark:bg-[#121212] text-white font-semibold py-2 rounded hover:bg-[#000000] dark:bg-[#121212] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
    <CheckCircle className="w-5 h-5" />  {t('lab.b12structuralstats_verify_calculations')}
                            </button>

   {feedback && (
    <div className={`p-3 rounded text-sm font-medium ${feedback.includes('Perfect') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
