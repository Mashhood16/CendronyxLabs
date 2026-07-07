import { useState } from 'react';
import { Droplets, Info, FlaskConical, Activity, Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabC10SaturatedUnsaturated({ onExit }: { onExit: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [flaskSample, setFlaskSample] = useState<'Oil' | 'Butter' | null>(null);
 const [sampleMass, setSampleMass] = useState<number>(1);
 const [br2Volume, setBr2Volume] = useState<number>(0);
 const [isBrown, setIsBrown] = useState<boolean>(false);
 const [equation, setEquation] = useState<string>('Empty Flask');
 const [logs, setLogs] = useState<{ id: number; mass: number; volume: number; type: string }[]>([]);
 
 const [assessmentAns, setAssessmentAns] = useState<string>('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [targetMass] = useState<number>(() => Math.floor(Math.random() * 5) + 5);

 const maxBr2ForOil = sampleMass * 1.5;

 const addSample = (type: 'Oil' | 'Butter') => {
 setFlaskSample(type);
 setBr2Volume(0);
 setIsBrown(false);
 setEquation(type === 'Oil' ? 'R-CH=CH-R' : 'R-CH₂-CH₂-R');
 };

 const addBr2 = () => {
 if (!flaskSample) return;
 const newVol = br2Volume + 0.5;
 setBr2Volume(newVol);
 
 if (flaskSample === 'Butter') {
  setIsBrown(true);
  setEquation('R-CH₂-CH₂-R + Br₂ → No Reaction');
 } else {
  if (newVol >= maxBr2ForOil) {
  setIsBrown(true);
  setEquation('R-CH=CH-R + excess Br₂ → R-CH(Br)-CH(Br)-R + Br₂(aq)');
  } else {
  setIsBrown(false);
  setEquation('R-CH=CH-R + Br₂ → R-CH(Br)-CH(Br)-R');
  }
 }
 };

 const resetFlask = () => {
 setFlaskSample(null);
 setBr2Volume(0);
 setIsBrown(false);
 setEquation('Empty Flask');
 };

 const recordData = () => {
 if (flaskSample && isBrown) {
  setLogs((prev) => [...prev, { id: Date.now(), mass: sampleMass, volume: br2Volume, type: flaskSample }]);
  resetFlask();
 }
 };

 const checkAns = () => {
 const expected = targetMass * 1.5;
 if (Math.abs(parseFloat(assessmentAns) - expected) < 0.5) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 const oilLogs = logs.filter(l => l.type === 'Oil');
 const maxMass = Math.max(5, ...oilLogs.map((l) => l.mass));
 const maxVol = Math.max(10, ...oilLogs.map((l) => l.volume));

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c10saturatedunsaturated_bromine_water_test_saturated_v')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10saturatedunsaturated_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10saturatedunsaturated_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:overflow-visible">
  {/* Theory Section */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
   <Info className="w-5 h-5 text-blue-500" />  {t('lab.c10saturatedunsaturated_theory_setup')}
                        </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
   
                        {t('lab.c10saturatedunsaturated_unsaturated_compounds_like_veg')}
                        </p>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
   
                        {t('lab.c10saturatedunsaturated_saturated_compounds_like_butte')}
                        </p>
   
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg mt-2 flex-col  ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">
    
                             {t('lab.c10saturatedunsaturated_set_sample_mass_g')} {sampleMass} g
   </label>
   <input 
    type="range" 
    min="1" max="5" step="0.5" 
    value={sampleMass} 
    onChange={(e) => setSampleMass(parseFloat(e.target.value))}
    disabled={flaskSample !== null}
    className="w-full"
   />
   <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{t('lab.c10saturatedunsaturated_set_mass_before_adding_sample_')}</p>
   </div>
  </div>

  {/* Simulation Section */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`flex justify-around w-full mb-6 bg-slate-50 dark:bg-[#121212] p-3 rounded-lg flex-col `}>
   <button onClick={() => addSample('Oil')} disabled={flaskSample !== null} className="flex flex-col items-center p-2 border border-slate-200 dark:border-[#1c1b1b] rounded bg-white dark:bg-[#121212] dark:border-[#1c1b1b] text-slate-800 dark:text-[#f8fafc] transition-colors hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#111827] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-yellow-400/10">
    <FlaskConical className="text-yellow-500 w-8 h-8 mb-1" />
    <span className="text-xs font-semibold">{t('lab.c10saturatedunsaturated_add_oil')}</span>
   </button>
   <button onClick={() => addSample('Butter')} disabled={flaskSample !== null} className="flex flex-col items-center p-2 border border-slate-200 dark:border-[#1c1b1b] rounded bg-white dark:bg-[#121212] dark:border-[#1c1b1b] text-slate-800 dark:text-[#f8fafc] transition-colors hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#111827] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-orange-400/10">
    <FlaskConical className="text-orange-300 w-8 h-8 mb-1" />
    <span className="text-xs font-semibold">{t('lab.c10saturatedunsaturated_add_butter')}</span>
   </button>
   <button onClick={addBr2} disabled={!flaskSample} className="flex flex-col items-center p-2 border border-slate-200 dark:border-[#1c1b1b] rounded bg-white dark:bg-[#121212] dark:border-[#1c1b1b] text-slate-800 dark:text-[#f8fafc] transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#111827] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-red-400/10">
    <Droplets className="text-orange-700 w-8 h-8 mb-1" />
    <span className="text-xs font-semibold">{t('lab.c10saturatedunsaturated_0_5ml_br')}</span>
   </button>
   <button onClick={resetFlask} className="flex flex-col items-center p-2 border border-slate-200 dark:border-[#1c1b1b] rounded bg-white dark:bg-[#121212] dark:border-[#1c1b1b] text-slate-800 dark:text-[#f8fafc] transition-colors hover:bg-slate-100 dark:bg-[#111827] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/10">
    <RefreshCw className="text-slate-500 dark:text-[#71717a] w-8 h-8 mb-1" />
    <span className="text-xs font-semibold">{t('lab.c10saturatedunsaturated_empty_flask')}</span>
   </button>
   </div>

   <div className={`relative w-full max-w-[250px] aspect-square justify-center items-end bg-slate-50 dark:bg-[#121212] rounded-xl p-4 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <svg viewBox="0 0 200 200" className="w-full h-full">
    <clipPath id="flask-clip">
    <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" />
    </clipPath>
    <path d="M80,40 L80,100 L40,180 L160,180 L120,100 L120,40 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="4" />
    
    {flaskSample && (
    <rect 
     x="0" 
     y={180 - (sampleMass * 8) - (br2Volume * 4)} 
     width="200" 
     height="200" 
     fill={isBrown ? "rgba(217, 119, 6, 0.85)" : (flaskSample === 'Oil' ? "rgba(253, 224, 71, 0.7)" : "rgba(253, 186, 116, 0.9)")} 
     clipPath="url(#flask-clip)" 
     className="transition-all duration-300"
    />
    )}
   </svg>
   {flaskSample && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-bold text-slate-800 dark:text-[#ffffff] bg-slate-50 dark:bg-[#121212]/70 px-2 py-1 rounded">
    {flaskSample} ({sampleMass}g)<br/>
    
                                 {t('lab.c10saturatedunsaturated_br')} {br2Volume}mL
    </div>
   )}
   </div>

   <div className="w-full mt-6 bg-[#121212] dark:bg-[#121212] text-green-400 font-mono text-sm p-4 rounded-lg min-h-[80px] flex items-center justify-center text-center">
   {equation}
   </div>
   
   <button 
   onClick={recordData} 
   disabled={!flaskSample || !isBrown}
   className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   <Plus className="w-5 h-5" />
   
                        {t('lab.c10saturatedunsaturated_record_permanent_color_data')}
                        </button>
  </div>

  {/* Data Section */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
   <Activity className="w-5 h-5 text-green-500" />  {t('lab.c10saturatedunsaturated_data_analysis')}
                        </h2>
   
   <div className="overflow-x-auto">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
    <tr>
     <th className="px-3 py-2 rounded-tl-lg">{t('lab.c10saturatedunsaturated_sample')}</th>
     <th className="px-3 py-2">{t('lab.c10saturatedunsaturated_mass_g')}</th>
     <th className="px-3 py-2 rounded-tr-lg">{t('lab.c10saturatedunsaturated_br_vol_ml')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 && <tr><td colSpan={3} className="text-center p-3 text-slate-400">{t('lab.c10saturatedunsaturated_no_data_recorded')}</td></tr>}
    {logs.map((log) => (
     <tr key={log.id} className="border-b border-slate-100">
     <td className="px-3 py-2">{log.type}</td>
     <td className="px-3 py-2">{log.mass}</td>
     <td className="px-3 py-2">{log.volume}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   <div className="h-48 w-full border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-2 bg-slate-50 dark:bg-[#121212] relative mt-2">
   <div className="absolute top-2 left-2 text-xs font-semibold text-slate-500 dark:text-[#71717a]">{t('lab.c10saturatedunsaturated_vol_br_ml_vs_mass_of_oil_g')}</div>
   <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1] overflow-visible pb-6 pl-8">
    <line x1="0" y1="0" x2="100" y2="0" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
    {oilLogs.map((log, i) => (
     <circle 
     key={i} 
     cx={(log.mass / maxMass) * 90} 
     cy={(log.volume / maxVol) * 90} 
     r="3" 
     fill="#ef4444" 
     />
    ))}
    {oilLogs.length > 1 && (
     <line 
     x1="0" y1="0" 
     x2="90" y2={90 * ((maxMass * 1.5) / maxVol)} 
     stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" 
     />
    )}
   </svg>
   </div>

   <div className="bg-orange-50 p-4 rounded-lg mt-auto border border-orange-100">
   <h3 className="font-bold text-sm text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c10saturatedunsaturated_assessment')}</h3>
   <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                             {t('lab.c10saturatedunsaturated_based_on_your_data_how_many_ml')} {targetMass}{t('lab.c10saturatedunsaturated_g_of_vegetable_oil')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    value={assessmentAns} 
    onChange={(e) => setAssessmentAns(e.target.value)}
    placeholder={t('lab.c10saturatedunsaturated_vol_ml')} 
    className="w-24 px-2 py-1 text-sm border rounded"
    />
    <button 
    onClick={checkAns}
    className="bg-orange-600 text-white px-3 py-1 text-sm rounded hover:bg-orange-700 transition-colors dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
    >
    
                                 {t('lab.c10saturatedunsaturated_check')}
                                 </button>
   </div>
   {assessmentStatus === 'correct' && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>  {t('lab.c10saturatedunsaturated_correct_1_5_ml_per_gram')}</div>}
   {assessmentStatus === 'incorrect' && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/>  {t('lab.c10saturatedunsaturated_incorrect_check_the_ratio')}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
