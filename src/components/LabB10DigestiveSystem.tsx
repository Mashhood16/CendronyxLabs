import { useState } from 'react';
import { BookOpen, Activity, Edit3, Droplet, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabB10DigestiveSystem({ onExit }: { onExit: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [bolusPosition, setBolusPosition] = useState(10);
 const [bileDrops, setBileDrops] = useState(0);
 const [emulsified, setEmulsified] = useState(false);

 const [q1, setQ1] = useState("");
 const [q2, setQ2] = useState("");
 const [score, setScore] = useState<number | null>(null);

 const pinchEsophagus = () => {
 if (bolusPosition < 80) setBolusPosition(prev => prev + 15);
 };

 const addBile = () => {
 if (bileDrops < 3) {
  setBileDrops(prev => prev + 1);
 } else if (!emulsified) {
  setEmulsified(true);
 }
 };

 const checkAnswers = () => {
 let s = 0;
 const ans1 = q1.toLowerCase();
 const ans2 = q2.toLowerCase();
 if (ans1.includes("peristalsis") || ans1.includes("muscle") || ans1.includes("contract")) s += 50;
 if (ans2.includes("surface area") || ans2.includes("emulsif") || ans2.includes("bile")) s += 50;
 setScore(s);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Top Header */}
  <LabHeader onExit={onExit} title={t('lab.b10digestivesystem_lab_b10_1_the_digestive_system')} subtitle={t('lab.subtitle_peristalsis_emulsification_simulators')} />

  {/* Main Grid */}
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b10digestivesystem_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b10digestivesystem_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className={`p-2 bg-blue-100 text-blue-600 rounded-lg flex-col `}><BookOpen className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10digestivesystem_theory_context')}</h2>
   </div>
   <div className="prose prose-slate text-sm flex-grow lg:overflow-y-auto pr-2">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.b10digestivesystem_1_mechanical_digestion_perista')}</h3>
   <p>
    
                             {t('lab.b10digestivesystem_food_moves_through_the_digesti')} <strong>{t('lab.b10digestivesystem_peristalsis')}</strong>{t('lab.b10digestivesystem_this_involves_rhythmic_wave_li')}
                            </p>
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.b10digestivesystem_2_chemical_digestion_emulsific')}</h3>
   <p>
    
                             {t('lab.b10digestivesystem_lipids_fats_and_oils_are_hydro')} <strong>{t('lab.b10digestivesystem_surface_area')}</strong>  {t('lab.b10digestivesystem_for_lipase_action_the_liver_se')} <strong>{t('lab.b10digestivesystem_bile')}</strong>{t('lab.b10digestivesystem_bile_salts_act_as_emulsifiers_')}
                            </p>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10digestivesystem_interactive_simulator')}</h2>
   </div>
   
   <div className="flex flex-col gap-6 flex-grow lg:overflow-y-auto pr-2 pb-8">
   {/* Peristalsis Sim */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.b10digestivesystem_station_1_esophageal_peristals')}</h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.b10digestivesystem_pinch_the_esophagus_above_the_')}</p>
    
    <div className="flex items-center justify-center gap-8">
    <div className="relative w-24 h-56 bg-pink-50 rounded-full border-4 border-pink-200 overflow-hidden flex flex-col">
     {/* Esophagus tube styling */}
     <div className="absolute inset-0 flex flex-col justify-between opacity-20 py-2">
      {Array.from({length: 10}).map((_, i) => (
      <div key={i} className="w-full h-1 bg-pink-800" />
      ))}
     </div>
     
     {/* Bolus */}
     <div 
     className="w-16 h-16 bg-green-500 rounded-full absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out shadow-inner dark:bg-[#121212] dark:border-[#1c1b1b]"
     style={{ top: `${bolusPosition}%` }}
     />
     
     {/* Pinch interaction */}
     <button 
     onClick={pinchEsophagus}
     className="absolute w-full h-12 bg-indigo-500/0 hover:bg-indigo-500/20 cursor-pointer flex items-center justify-center transition-all group dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     style={{ top: `${Math.max(0, bolusPosition - 15)}%` }}
     title={t('lab.b10digestivesystem_pinch_muscle')}
     >
     <div className="w-full flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-2 h-8 bg-indigo-500 rounded-full dark:bg-[#121212] dark:border-[#1c1b1b]" />
      <div className="w-2 h-8 bg-indigo-500 rounded-full dark:bg-[#121212] dark:border-[#1c1b1b]" />
     </div>
     </button>
    </div>
    
    <div className="flex flex-col gap-2">
     <button onClick={pinchEsophagus} disabled={bolusPosition >= 80} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
      
                                           {t('lab.b10digestivesystem_pinch_muscle')}
                                          </button>
     <button onClick={() => setBolusPosition(10)} className="px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] text-sm font-medium transition-colors">
      
                                           {t('lab.b10digestivesystem_reset_bolus')}
                                          </button>
    </div>
    </div>
   </div>

   {/* Emulsification Sim */}
   <div className={`bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.b10digestivesystem_station_2_lipid_emulsification')}</h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.b10digestivesystem_add_bile_drops_to_the_oil_wate')}</p>
    
    <div className="flex items-center justify-center gap-8">
    <div className="relative w-32 h-40 bg-slate-50 dark:bg-[#121212] border-b-8 border-x-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-2xl overflow-hidden flex flex-col justify-end">
     {/* Water layer */}
     <div className="absolute bottom-0 w-full h-20 bg-blue-200/60" />
     
     {/* Oil layer / Emulsion */}
     {!emulsified ? (
     <div className="absolute bottom-20 w-full h-10 bg-yellow-300/80 transition-all duration-500" />
     ) : (
     <div className="absolute bottom-0 w-full h-30 flex flex-wrap content-start p-2 gap-1.5 transition-all duration-1000">
      {Array.from({ length: 48 }).map((_, i) => (
      <div key={i} className="w-3 h-3 bg-yellow-300/90 rounded-full shadow-sm animate-pulse" style={{ animationDelay: `${Math.random()}s` }} />
      ))}
     </div>
     )}

     {/* Falling Bile Drops */}
     {bileDrops > 0 && !emulsified && (
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-sm dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40" />
     )}
    </div>

    <div className="flex flex-col gap-2">
     <div className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.b10digestivesystem_bile_drops')} {bileDrops}/3</div>
     <button onClick={addBile} disabled={emulsified} className={`px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}>
     <Droplet className="w-4 h-4"/>  {t('lab.b10digestivesystem_add_bile')}
                                          </button>
     <button onClick={() => { setBileDrops(0); setEmulsified(false); }} className="px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] text-sm font-medium transition-colors">
     
                                          {t('lab.b10digestivesystem_reset_mixture')}
                                          </button>
    </div>
    </div>
   </div>

   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Edit3 className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10digestivesystem_assessment')}</h2>
   </div>
   
   <div className="flex-grow flex flex-col gap-6 lg:overflow-y-auto pr-2">
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10digestivesystem_1_explain_how_the_food_bolus_i')}
                                 </label>
    <textarea 
    value={q1}
    onChange={e => setQ1(e.target.value)}
    placeholder={t('lab.b10digestivesystem_type_your_explanation_here')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10digestivesystem_2_why_is_emulsification_necess')}
                                 </label>
    <textarea 
    value={q2}
    onChange={e => setQ2(e.target.value)}
    placeholder={t('lab.b10digestivesystem_mention_surface_area_and_enzym')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full py-3 bg-[#121212] dark:bg-[#121212] text-white rounded-xl font-semibold hover:bg-slate-700 dark:bg-[#121212] transition-colors flex items-center justify-center gap-2"
   >
    <CheckCircle className="w-5 h-5" />  {t('lab.b10digestivesystem_check_answers')}
                            </button>

   {score !== null && (
    <div className={`p-4 rounded-xl border ${score === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
    <h3 className="font-bold mb-1">{t('lab.b10digestivesystem_score')} {score}%</h3>
    {score < 100 && (
     <p className="text-sm">{t('lab.b10digestivesystem_make_sure_you_mentioned_perist')}</p>
    )}
    {score === 100 && (
     <p className="text-sm">{t('lab.b10digestivesystem_excellent_you_understand_mecha')}</p>
    )}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
