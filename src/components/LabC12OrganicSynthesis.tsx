import { useState, useEffect } from 'react';
import { Beaker, BookOpen, CheckCircle, Thermometer, RefreshCw, Layers } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabC12OrganicSynthesis({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [flaskContents, setFlaskContents] = useState<string[]>([]);
 const [temperature, setTemperature] = useState<number>(20);
 const [isDecomposed, setIsDecomposed] = useState<boolean>(false);
 const [flaskColor, setFlaskColor] = useState<string>('#e2e8f0');
 const [reactionStatus, setReactionStatus] = useState<string>('Empty Flask');

 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [score, setScore] = useState<number | null>(null);

 const reagents = ['Aniline', 'NaNO2 + HCl', '2-Naphthol', 'Phthalic Anhydride', 'L-Glutamine', 'Chiral Catalyst'];

 const addReagent = (r: string) => {
  if (!flaskContents.includes(r)) {
   setFlaskContents([...flaskContents, r]);
  }
 };

 const resetFlask = () => {
  setFlaskContents([]);
  setTemperature(20);
  setIsDecomposed(false);
 };

 useEffect(() => {
  let newColor = '#e2e8f0';
  let newStatus = 'Mixed Reagents';

  if (flaskContents.length === 0) {
   newColor = '#f8fafc';
   newStatus = 'Empty Flask';
  } else if (flaskContents.includes('Aniline') && flaskContents.includes('NaNO2 + HCl')) {
   if (temperature > 10 || isDecomposed) {
    if (!isDecomposed) setIsDecomposed(true);
    newColor = '#78350f'; // brown
    newStatus = 'Diazonium Salt Decomposed (Phenol + N2 gas)';
   } else {
    if (flaskContents.includes('2-Naphthol')) {
     newColor = '#ea580c'; // bright orange
     newStatus = 'Azo Dye (Orange II) Formed!';
    } else {
     newColor = '#fef08a'; // pale yellow
     newStatus = 'Diazonium Salt Formed (Stable < 10°C)';
    }
   }
  } else if (flaskContents.includes('Phthalic Anhydride') && flaskContents.includes('L-Glutamine')) {
   if (temperature >= 80) {
    if (flaskContents.includes('Chiral Catalyst')) {
     newColor = '#86efac';
     newStatus = 'Asymmetric Synthesis: (S)-Thalidomide (95% ee)';
    } else {
     newColor = '#cbd5e1';
     newStatus = 'Racemic Thalidomide Formed (50% R, 50% S)';
    }
   } else {
    newColor = '#ffffff';
    newStatus = 'Temperature too low for condensation';
   }
  } else {
   newColor = '#bae6fd';
  }
  
  setFlaskColor(newColor);
  setReactionStatus(newStatus);
 }, [flaskContents, temperature, isDecomposed]);

 const checkAnswers = () => {
  let s = 0;
  if (q1.trim() === '5' || q1.trim() === '0' || q1.trim() === '10') s++; 
  if (q2.trim() === '80') s++;
  setScore(s);
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.c12organicsynthesis_organic_synthesis_asymmetric_c')} />

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c12organicsynthesis_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c12organicsynthesis_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:overflow-visible">
    {/* Theory Column */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <BookOpen size={20} className="text-blue-600" />
      
                           {t('lab.c12organicsynthesis_reaction_theory')}
                          </h2>
     
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
      <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.c12organicsynthesis_azo_dye_synthesis')}</h3>
      <p>
       
                                {t('lab.c12organicsynthesis_azo_dyes_are_manufactured_via_')} <strong>{t('lab.c12organicsynthesis_diazotization')}</strong>  {t('lab.c12organicsynthesis_and')} <strong>{t('lab.c12organicsynthesis_coupling')}</strong>{t('lab.c12organicsynthesis_first_a_primary_aromatic_amine')}
                               </p>

      <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff] mt-4">{t('lab.c12organicsynthesis_asymmetric_synthesis_thalidomi')}</h3>
      <p>
       
                                {t('lab.c12organicsynthesis_thalidomide_possesses_a_chiral')} <strong>{t('lab.c12organicsynthesis_enantiomeric_excess_ee')}</strong>.
      </p>
     </div>
    </div>

    {/* Simulation Column */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <Beaker size={20} className="text-indigo-600" />
      
                           {t('lab.c12organicsynthesis_synthesis_workspace')}
                          </h2>

     <div className={`flex-1 bg-slate-100 dark:bg-[#121212] rounded-lg p-4 flex flex-col items-center justify-center relative border border-slate-300 dark:border-[#1c1b1b] `}>
      <div className={`absolute top-4 right-4 bg-slate-50 dark:!bg-[#121212] px-3 py-1 rounded-md text-sm font-mono shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
       
                                {t('lab.c12organicsynthesis_temp')} {temperature}°C
      </div>
      
      <svg viewBox="0 0 100 120" className="w-48 h-48 drop-shadow-md">
       {/* Flask Background */}
       <path d="M 40 10 L 60 10 L 60 40 L 85 90 L 85 110 L 15 110 L 15 90 L 40 40 Z" fill="rgba(255,255,255,0.8)" stroke="#cbd5e1" strokeWidth="2" />
       {/* Liquid */}
       {flaskContents.length > 0 && (
        <path d="M 33 55 L 67 55 L 83 108 L 17 108 Z" fill={flaskColor} className="transition-colors duration-500" />
       )}
       {/* Bubbles if decomposed */}
       {isDecomposed && (
        <>
         <circle cx="45" cy="80" r="2" fill="#ffffff" opacity="0.8" />
         <circle cx="55" cy="95" r="3" fill="#ffffff" opacity="0.8" />
         <circle cx="35" cy="100" r="1.5" fill="#ffffff" opacity="0.8" />
         <circle cx="60" cy="70" r="2.5" fill="#ffffff" opacity="0.8" />
        </>
       )}
       {/* Flask outline over liquid */}
       <path d="M 40 10 L 60 10 L 60 40 L 85 90 L 85 110 L 15 110 L 15 90 L 40 40 Z" fill="none" stroke="#64748b" strokeWidth="2" />
       {/* Rim */}
       <ellipse cx="50" cy="10" rx="10" ry="2" fill="none" stroke="#64748b" strokeWidth="2" />
      </svg>

      <div className={`mt-4 text-center font-semibold text-slate-700 dark:text-[#ffffff] bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] px-4 py-2 rounded-full border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] shadow-sm w-full max-w-xs truncate flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
       {reactionStatus}
      </div>
     </div>

     <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
       <Thermometer size={18} className="text-red-500" />
       <input 
        type="range" 
        min="0" max="100" 
        value={temperature} 
        onChange={(e) => setTemperature(Number(e.target.value))}
        className="flex-1 accent-red-500"
       />
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
       {reagents.map(r => (
        <button 
         key={r}
         onClick={() => addReagent(r)}
         disabled={flaskContents.includes(r)}
         className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-950/20 dark:border-teal-900"
        >
         + {r}
        </button>
       ))}
      </div>

      <button 
       onClick={resetFlask}
       className={`mt-2 flex items-center justify-center gap-2 w-full py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors text-sm font-medium flex-col `}
      >
       <RefreshCw size={16} />  {t('lab.c12organicsynthesis_wash_flask')}
                               </button>
     </div>
    </div>

    {/* Assessment Column */}
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <Layers size={20} className="text-emerald-600" />
      
                           {t('lab.c12organicsynthesis_data_analysis')}
                          </h2>

     <div className="flex-1 lg:overflow-y-auto pr-2 space-y-5">
      <div className="space-y-2">
       <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block">
        
                                     {t('lab.c12organicsynthesis_1_what_is_the_maximum_safe_tem')}
                                    </label>
       <input 
        type="number" 
        value={q1} 
        onChange={(e) => setQ1(e.target.value)}
        className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        placeholder={t('lab.c12organicsynthesis_enter_value_in_c')}
       />
      </div>

      <div className="space-y-2">
       <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block">
        
                                     {t('lab.c12organicsynthesis_2_in_an_asymmetric_synthesis_y')}
                                    </label>
       <div className="text-xs text-slate-500 dark:text-[#71717a] mb-1">{t('lab.c12organicsynthesis_hint_ee_r_s')}</div>
       <input 
        type="number" 
        value={q2} 
        onChange={(e) => setQ2(e.target.value)}
        className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        placeholder={t('lab.c12organicsynthesis_enter_ee')}
       />
      </div>
     </div>

     <div className="pt-4 border-t border-slate-100">
      <button 
       onClick={checkAnswers}
       className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
      >
       <CheckCircle size={18} />  {t('lab.c12organicsynthesis_verify_results')}
                               </button>

      {score !== null && (
       <div className={`mt-4 p-3 rounded-md text-center font-bold ${score === 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        
                                     {t('lab.c12organicsynthesis_score')} {score} / 2 {score === 2 ? '🎉 Excellent!' : '❌ Review theory and retry.'}
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
