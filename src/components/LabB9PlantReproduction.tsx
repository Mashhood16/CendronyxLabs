import { useState } from 'react';
import { Calendar, Scissors, Info, Sprout, Flower2, Save} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabB9PlantReproduction({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'Germination' | 'Dissection'>('Germination');

 // Germination State
 const [day, setDay] = useState(0);

 // Dissection State
 const [activeTool, setActiveTool] = useState<'scalpel' | 'hand'>('hand');
 const [parts, setParts] = useState({
 petals: { extracted: false },
 stamens: { extracted: false },
 pistil: { extracted: false },
 sepals: { extracted: false }
 });

 const extractPart = (part: keyof typeof parts) => {
 if (activeTool === 'scalpel' && !parts[part].extracted) {
  setParts(prev => ({ ...prev, [part]: { extracted: true } }));
 }
 };

 // Observations & Assessment
 const [observations, setObservations] = useState<{ id: number; text: string }[]>([]);
 const [obsText, setObsText] = useState('');
 
 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [feedback, setFeedback] = useState('');

 const addObservation = () => {
 if(obsText.trim()) {
  setObservations(prev => [...prev, { id: Date.now(), text: activeTab === 'Germination' ? `Day ${day}: ${obsText}` : `Dissection: ${obsText}` }]);
  setObsText('');
 }
 };

 const checkAnswers = () => {
 let correct = 0;
 if (q1.trim().toLowerCase() === 'radicle') correct++;
 if (q2.trim().toLowerCase() === 'pistil' || q2.trim().toLowerCase() === 'carpel') correct++;
 
 if (correct === 2) setFeedback('Perfect! You correctly identified the plant parts.');
 else setFeedback(`You got ${correct} out of 2. Keep exploring!`);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.b9plantreproduction_virtual_lab_plant_reproduction')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b9plantreproduction_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b9plantreproduction_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col space-y-6  ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] flex items-center mb-2">
    <Info className="w-5 h-5 mr-2 text-emerald-600" />
    
                             {t('lab.b9plantreproduction_theory_context')}
                            </h2>
   <p className="text-gray-600 text-sm leading-relaxed mb-2">
    <strong>{t('lab.b9plantreproduction_seed_germination')}</strong>  {t('lab.b9plantreproduction_the_process_by_which_an_organi')}
                            </p>
   <p className="text-gray-600 text-sm leading-relaxed">
    <strong>{t('lab.b9plantreproduction_flower_structure')}</strong>  {t('lab.b9plantreproduction_flowers_are_the_reproductive_o')}
                            </p>
   </div>

   <div className="space-y-4 flex-1">
   <h3 className="font-bold text-gray-700 dark:text-[#ffffff]">{t('lab.b9plantreproduction_lab_setup')}</h3>
   
   <div className="flex space-x-2 mb-4">
    <button onClick={() => setActiveTab('Germination')} className={`px-4 py-2 flex-1 rounded-lg text-sm font-semibold transition ${activeTab === 'Germination' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
    <Sprout className="w-4 h-4 inline mr-2" />  {t('lab.b9plantreproduction_germination')}
                                 </button>
    <button onClick={() => setActiveTab('Dissection')} className={`px-4 py-2 flex-1 rounded-lg text-sm font-semibold transition ${activeTab === 'Dissection' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
    <Flower2 className="w-4 h-4 inline mr-2" />  {t('lab.b9plantreproduction_dissection')}
                                 </button>
   </div>

   {activeTab === 'Germination' && (
    <div className="space-y-2 pt-4">
    <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-[#ffffff]">
     <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-blue-500" />  {t('lab.b9plantreproduction_timeline_days')}</span>
     <span>{t('lab.b9plantreproduction_day')} {day}</span>
    </label>
    <input type="range" min="0" max="10" value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full accent-emerald-600" />
    <p className="text-xs text-gray-500 mt-2 italic">{t('lab.b9plantreproduction_drag_the_slider_to_observe_the')}</p>
    </div>
   )}

   {activeTab === 'Dissection' && (
    <div className="space-y-2 pt-4">
    <label className="text-sm font-medium text-gray-700 dark:text-[#ffffff] block mb-2">{t('lab.b9plantreproduction_select_tool')}</label>
    <div className="flex space-x-2">
     <button onClick={() => setActiveTool('hand')} className={`flex-1 py-2 flex justify-center items-center rounded-md text-sm font-semibold transition-colors ${activeTool === 'hand' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-gray-100 text-gray-600'}`}>
     
                                          {t('lab.b9plantreproduction_hand_view')}
                                          </button>
     <button onClick={() => setActiveTool('scalpel')} className={`flex-1 py-2 flex justify-center items-center rounded-md text-sm font-semibold transition-colors ${activeTool === 'scalpel' ? 'bg-red-100 text-red-700 border-2 border-red-400' : 'bg-gray-100 text-gray-600'}`}>
     <Scissors className="w-4 h-4 mr-2" />  {t('lab.b9plantreproduction_scalpel')}
                                          </button>
    </div>
    <p className="text-xs text-gray-500 mt-2 italic">{t('lab.b9plantreproduction_select_the_scalpel_and_click_o')}</p>
    </div>
   )}

   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] flex items-center mb-4">
   {activeTab === 'Germination' ? <Sprout className="w-5 h-5 mr-2 text-emerald-600" /> : <Flower2 className="w-5 h-5 mr-2 text-emerald-600" />}
   
                        {t('lab.b9plantreproduction_interactive_visualizer')}
                        </h2>
   
   <div className={`relative bg-slate-100 dark:bg-[#121212] rounded-xl aspect-video overflow- border-2 border-slate-200 dark:border-[#1c1b1b] flex-1 flex-col `}>
   {activeTab === 'Germination' && (
    <svg viewBox="0 0 400 300" className="w-full h-full">
    {/* Soil & Sky */}
    <rect x="0" y="200" width="400" height="100" fill="#78350f" opacity="0.8" />
    <rect x="0" y="0" width="400" height="200" fill="#e0f2fe" opacity="0.6" />
    
    {/* Seed/Plant */}
    <g transform="translate(200, 200)">
     {/* Radicle (Root) */}
     {day >= 3 && (
     <path d={`M 0 25 Q ${(day-3)*5} ${30 + (day-3)*10} 0 ${40 + (day-3)*15}`} fill="none" stroke="#fef08a" strokeWidth={3 + day*0.2} strokeLinecap="round" />
     )}
     {/* Root hairs */}
     {day >= 6 && (
     <path d="M 0 50 L -10 60 M 0 60 L 10 70 M 0 80 L -15 85" fill="none" stroke="#fef08a" strokeWidth="1.5" />
     )}
     
     {/* Seed body */}
     <ellipse cx="0" cy="10" rx={10 + day*0.5} ry={15 + day*0.5} fill="#b45309" />
     
     {/* Plumule (Shoot) */}
     {day >= 5 && (
     <path d={`M 0 0 Q -${(day-5)*5} -${(day-5)*10} 0 -${(day-5)*20}`} fill="none" stroke="#4ade80" strokeWidth="4" />
     )}
     
     {/* Leaves */}
     {day >= 8 && (
     <g transform={`translate(0, -${(day-5)*20})`}>
      <path d="M 0 0 Q -20 -10 -30 0 Q -20 10 0 0" fill="#22c55e" />
      <path d="M 0 0 Q 20 -10 30 0 Q 20 10 0 0" fill="#22c55e" />
     </g>
     )}
    </g>
    
    <text x="20" y="30" fontSize="16" fontWeight="bold" fill="#334155">{t('lab.b9plantreproduction_day_1')} {day}</text>
    </svg>
   )}

   {activeTab === 'Dissection' && (
    <svg viewBox="0 0 500 350" className="w-full h-full select-none">
    {/* Flower Base */}
    <path d="M 150 250 L 150 350" stroke="#15803d" strokeWidth="8" />
    <path d="M 130 250 Q 150 270 170 250 Z" fill="#22c55e" />
    
    {/* Parts to click */}
    {!parts.sepals.extracted && (
     <g onClick={() => extractPart('sepals')} className={`${activeTool === 'scalpel' ? 'cursor-pointer hover:opacity-70' : ''}`}>
     <path d="M 130 250 Q 100 230 110 260 Z" fill="#4ade80" />
     <path d="M 170 250 Q 200 230 190 260 Z" fill="#4ade80" />
     </g>
    )}
    
    {!parts.pistil.extracted && (
     <g onClick={() => extractPart('pistil')} className={`${activeTool === 'scalpel' ? 'cursor-pointer hover:opacity-70' : ''}`}>
     <path d="M 150 250 L 150 160 Q 140 150 150 140 Q 160 150 150 160" fill="#a3e635" stroke="#65a30d" strokeWidth="2" />
     </g>
    )}

    {!parts.stamens.extracted && (
     <g onClick={() => extractPart('stamens')} className={`${activeTool === 'scalpel' ? 'cursor-pointer hover:opacity-70' : ''}`}>
     <path d="M 145 240 L 120 180" fill="none" stroke="#fcd34d" strokeWidth="2" />
     <circle cx="120" cy="180" r="4" fill="#fbbf24" />
     <path d="M 155 240 L 180 180" fill="none" stroke="#fcd34d" strokeWidth="2" />
     <circle cx="180" cy="180" r="4" fill="#fbbf24" />
     </g>
    )}

    {!parts.petals.extracted && (
     <g onClick={() => extractPart('petals')} className={`${activeTool === 'scalpel' ? 'cursor-pointer hover:opacity-70' : ''}`}>
     <path d="M 150 240 Q 100 150 130 120 Q 150 180 150 240" fill="#f472b6" opacity="0.9" />
     <path d="M 150 240 Q 200 150 170 120 Q 150 180 150 240" fill="#f472b6" opacity="0.9" />
     <path d="M 150 240 Q 120 130 150 90 Q 180 130 150 240" fill="#fbcfe8" opacity="0.9" />
     </g>
    )}

    {/* Herbarium Sheet Area */}
    <rect x="250" y="20" width="230" height="310" fill="#fdfbf7" stroke="#e5e7eb" strokeWidth="2" rx="8" />
    <text x="365" y="45" textAnchor="middle" fill="#78716c" fontWeight="bold">{t('lab.b9plantreproduction_digital_herbarium')}</text>
    <line x1="260" y1="55" x2="470" y2="55" stroke="#e5e7eb" strokeWidth="2" />
    
    {/* Placed Parts */}
    {parts.petals.extracted && (
     <g transform="translate(130, -50) scale(0.8)">
     <path d="M 150 240 Q 100 150 130 120 Q 150 180 150 240" fill="#f472b6" opacity="0.9" />
     <path d="M 150 240 Q 200 150 170 120 Q 150 180 150 240" fill="#f472b6" opacity="0.9" />
     <path d="M 150 240 Q 120 130 150 90 Q 180 130 150 240" fill="#fbcfe8" opacity="0.9" />
     <text x="150" y="260" fontSize="14" fill="#57534e" textAnchor="middle" fontWeight="bold">{t('lab.b9plantreproduction_petals_corolla')}</text>
     </g>
    )}
    {parts.stamens.extracted && (
     <g transform="translate(220, -50) scale(0.8)">
     <path d="M 145 240 L 120 180" fill="none" stroke="#fcd34d" strokeWidth="2" />
     <circle cx="120" cy="180" r="4" fill="#fbbf24" />
     <path d="M 155 240 L 180 180" fill="none" stroke="#fcd34d" strokeWidth="2" />
     <circle cx="180" cy="180" r="4" fill="#fbbf24" />
     <text x="150" y="260" fontSize="14" fill="#57534e" textAnchor="middle" fontWeight="bold">{t('lab.b9plantreproduction_stamens_male')}</text>
     </g>
    )}
    {parts.pistil.extracted && (
     <g transform="translate(130, 80) scale(0.8)">
     <path d="M 150 250 L 150 160 Q 140 150 150 140 Q 160 150 150 160" fill="#a3e635" stroke="#65a30d" strokeWidth="2" />
     <text x="150" y="270" fontSize="14" fill="#57534e" textAnchor="middle" fontWeight="bold">{t('lab.b9plantreproduction_pistil_female')}</text>
     </g>
    )}
    {parts.sepals.extracted && (
     <g transform="translate(220, 80) scale(0.8)">
     <path d="M 130 250 Q 100 230 110 260 Z" fill="#4ade80" />
     <path d="M 170 250 Q 200 230 190 260 Z" fill="#4ade80" />
     <text x="150" y="280" fontSize="14" fill="#57534e" textAnchor="middle" fontWeight="bold">{t('lab.b9plantreproduction_sepals_calyx')}</text>
     </g>
    )}
    </svg>
   )}
   </div>
  </div>

  {/* Right Column: Observation & Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] flex items-center mb-4">
   <Save className="w-5 h-5 mr-2 text-emerald-600" />
   
                        {t('lab.b9plantreproduction_observations_log')}
                        </h2>
   
   <div className="flex mb-4">
   <input 
    type="text" 
    value={obsText} 
    onChange={(e) => setObsText(e.target.value)} 
    placeholder={t('lab.b9plantreproduction_e_g_root_started_growing')}
    className="flex-1 border rounded-l-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
    onKeyDown={(e) => e.key === 'Enter' && addObservation()}
   />
   <button onClick={addObservation} className={`px-4 bg-emerald-600 text-white font-semibold rounded-r-md hover:bg-emerald-700 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 flex-col `}>
    
                             {t('lab.b9plantreproduction_add')}
                            </button>
   </div>

   <div className={`lg:overflow-y-auto max-h-40 mb-6 bg-slate-50 dark:bg-[#121212] border rounded-lg p-3 space-y-2 flex-1 flex-col `}>
   {observations.length === 0 ? (
    <p className="text-sm text-gray-400 text-center mt-4">{t('lab.b9plantreproduction_no_observations_recorded')}</p>
   ) : (
    observations.map(obs => (
    <div key={obs.id} className="text-sm bg-slate-50 dark:bg-[#121212] p-2 rounded border shadow-sm flex items-start">
     <span className="text-emerald-600 mr-2 font-bold">•</span>
     <span className="text-gray-700 dark:text-[#ffffff]">{obs.text}</span>
    </div>
    ))
   )}
   </div>

   <div className="space-y-4">
   <h3 className="font-bold text-gray-700 dark:text-[#ffffff]">{t('lab.b9plantreproduction_assessment')}</h3>
   <div className="space-y-3">
    <div>
    <label className="text-sm text-gray-600 block mb-1">{t('lab.b9plantreproduction_1_which_part_of_the_germinatin')}</label>
    <input type="text" value={q1} onChange={(e) => setQ1(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder={t('lab.b9plantreproduction_e_g_radicle')} />
    </div>
    <div>
    <label className="text-sm text-gray-600 block mb-1">{t('lab.b9plantreproduction_2_what_is_the_female_reproduct')}</label>
    <input type="text" value={q2} onChange={(e) => setQ2(e.target.value)} className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder={t('lab.b9plantreproduction_e_g_pistil')} />
    </div>
   </div>
   <button onClick={checkAnswers} className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mt-2 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    
                             {t('lab.b9plantreproduction_check_answers')}
                            </button>
   {feedback && (
    <div className={`p-3 mt-2 rounded-lg text-sm font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
