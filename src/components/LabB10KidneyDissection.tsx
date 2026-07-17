import { useState, useRef } from 'react';
import { Scissors, MousePointer2, CheckCircle2 } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

const EXTERNAL_PARTS = [
 { id: 'renal_vein', name: 'Renal Vein' },
 { id: 'renal_artery', name: 'Renal Artery' },
 { id: 'ureter', name: 'Ureter' },
];

const INTERNAL_PARTS = [
 { id: 'cortex', name: 'Renal Cortex' },
 { id: 'medulla', name: 'Renal Medulla' },
 { id: 'pelvis', name: 'Renal Pelvis' },
];

export default function LabB10KidneyDissection({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTool, setActiveTool] = useState<'pointer' | 'scalpel'>('pointer');
 const [cutProgress, setCutProgress] = useState(0); 
 const [isDissected, setIsDissected] = useState(false);
 const [identifiedParts, setIdentifiedParts] = useState<string[]>([]);
 const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
 const [isDragging, setIsDragging] = useState(false);
 const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [q1Correct, setQ1Correct] = useState<boolean | null>(null);
 const [q2Correct, setQ2Correct] = useState<boolean | null>(null);

 const svgRef = useRef<SVGSVGElement>(null);

 const externalDone = EXTERNAL_PARTS.every(p => identifiedParts.includes(p.id));
 const internalDone = INTERNAL_PARTS.every(p => identifiedParts.includes(p.id));

 const handlePointerDown = () => {
 if (activeTool === 'scalpel' && !isDissected && externalDone) {
 setIsDragging(true);
 }
 };

 const handlePointerUp = () => {
 setIsDragging(false);
 };

 const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
 if (!svgRef.current) return;
 const rect = svgRef.current.getBoundingClientRect();
 const x = (e.clientX - rect.left) * (500 / rect.width);
 const y = (e.clientY - rect.top) * (500 / rect.height);
 setMousePos({ x, y });

 if (activeTool === 'scalpel' && isDragging && !isDissected) {
 if (Math.abs(x - 250) < 100) { 
 if (y > cutProgress) {
 setCutProgress(y);
 }
 if (y > 380) {
 setIsDissected(true);
 setActiveTool('pointer');
 setCutProgress(500);
 setSelectedRegion(null);
 }
 }
 }
 };

 const handleSvgClick = () => {
 setSelectedRegion(null);
 };

 const handlePartClick = (e: React.MouseEvent, id: string) => {
 e.stopPropagation();
 if (activeTool === 'pointer') {
 setSelectedRegion(id);
 }
 };

 const identifyRegion = (id: string) => {
 if (selectedRegion === id) {
 setIdentifiedParts(prev => [...prev, id]);
 setSelectedRegion(null);
 } else {
 alert("Incorrect structure. Please try again.");
 }
 };

 const checkAnswers = () => {
 setQ1Correct(q1Answer.trim() === '172.8');
 setQ2Correct(q2Answer === 'collect');
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.b10kidneydissection_biology_lab_kidney_dissection')} subtitle={t('lab.subtitle_examine_external_internal')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.b10kidneydissection_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.b10kidneydissection_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 min-h-0 lg:overflow-hidden">
 {/* Left Column: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.b10kidneydissection_anatomy_of_the_kidney')}</h2>
 <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
 <p>
 
 {t('lab.b10kidneydissection_the_kidney_is_a_bean_shaped_or')}
 </p>
 <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.b10kidneydissection_external_structures')}</h3>
 <ul className="list-disc pl-5 space-y-1">
 <li><strong>{t('lab.b10kidneydissection_renal_artery')}</strong> {t('lab.b10kidneydissection_supplies_oxygenated_unfiltered')}</li>
 <li><strong>{t('lab.b10kidneydissection_renal_vein')}</strong> {t('lab.b10kidneydissection_transports_filtered_deoxygenat')}</li>
 <li><strong>{t('lab.b10kidneydissection_ureter')}</strong> {t('lab.b10kidneydissection_a_tube_that_carries_urine_from')}</li>
 </ul>
 
 <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.b10kidneydissection_internal_structures')}</h3>
 <p>{t('lab.b10kidneydissection_when_sectioned_longitudinally_')}</p>
 <ul className="list-disc pl-5 space-y-1">
 <li><strong>{t('lab.b10kidneydissection_renal_cortex')}</strong> {t('lab.b10kidneydissection_the_lighter_outer_layer_contai')}</li>
 <li><strong>{t('lab.b10kidneydissection_renal_medulla')}</strong> {t('lab.b10kidneydissection_the_inner_region_consisting_of')}</li>
 <li><strong>{t('lab.b10kidneydissection_renal_pelvis')}</strong> {t('lab.b10kidneydissection_a_funnel_like_dilated_chamber_')}</li>
 </ul>
 </div>
 </div>

 {/* Middle Column: Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col items-center relative '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center justify-between w-full mb-4">
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10kidneydissection_dissection_tray')}</h2>
 <div className={`flex bg-slate-100 dark:bg-[#121212] p-1 rounded-lg flex-col `}>
 <button
 onClick={() => setActiveTool('pointer')}
 className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTool === 'pointer' ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-blue-600' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}
 >
 <MousePointer2 className="w-4 h-4 mr-2" /> {t('lab.b10kidneydissection_pointer')}
 </button>
 <button
 onClick={() => setActiveTool('scalpel')}
 disabled={!externalDone || isDissected}
 className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTool === 'scalpel' ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-red-600' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed'}`}
 >
 <Scissors className="w-4 h-4 mr-2" /> {t('lab.b10kidneydissection_scalpel')}
 </button>
 </div>
 </div>

 <div className={`bg-[#121212] dark:bg-[#121212] w-full flex-1 rounded-xl flex items-center justify-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b] relative flex-col `}>
 <svg
 ref={svgRef}
 viewBox="0 0 500 500"
 className={`w-full h-full ${activeTool === 'scalpel' ? 'cursor-none' : 'cursor-pointer'}`}
 onPointerMove={handlePointerMove}
 onPointerDown={handlePointerDown}
 onPointerUp={handlePointerUp}
 onPointerLeave={handlePointerUp}
 onClick={handleSvgClick}
 >
 <defs>
 <clipPath id="cut-clip">
 <rect x="0" y="0" width="500" height={cutProgress} />
 </clipPath>
 </defs>

 <rect width="500" height="500" fill="#1e293b" />
 <rect x="50" y="50" width="400" height="400" fill="#334155" rx="20" />

 <g>
 <path
 id="renal_vein"
 d="M 100,190 L 220,190 L 220,210 L 100,210 Z"
 fill={identifiedParts.includes('renal_vein') ? '#3b82f6' : '#64748b'}
 stroke={selectedRegion === 'renal_vein' ? '#fde047' : 'none'}
 strokeWidth="4"
 onClick={(e) => handlePartClick(e, 'renal_vein')}
 className="transition-colors duration-300"
 />
 <path
 id="renal_artery"
 d="M 100,230 L 220,230 L 220,250 L 100,250 Z"
 fill={identifiedParts.includes('renal_artery') ? '#ef4444' : '#64748b'}
 stroke={selectedRegion === 'renal_artery' ? '#fde047' : 'none'}
 strokeWidth="4"
 onClick={(e) => handlePartClick(e, 'renal_artery')}
 className="transition-colors duration-300"
 />
 <path
 id="ureter"
 d="M 215,260 C 210,320 160,370 100,400 L 120,420 C 180,380 235,330 235,260 Z"
 fill={identifiedParts.includes('ureter') ? '#eab308' : '#94a3b8'}
 stroke={selectedRegion === 'ureter' ? '#fde047' : 'none'}
 strokeWidth="4"
 onClick={(e) => handlePartClick(e, 'ureter')}
 className="transition-colors duration-300"
 />

 <path
 id="capsule"
 d="M 220,150 C 220,50 420,50 420,200 C 420,350 220,380 220,280 C 250,260 250,180 220,150 Z"
 fill="#92400e"
 stroke={selectedRegion === 'capsule' && !isDissected ? '#fde047' : '#78350f'}
 strokeWidth="4"
 onClick={(e) => !isDissected && handlePartClick(e, 'capsule')}
 />
 </g>

 <g clipPath="url(#cut-clip)">
 <path
 id="cortex"
 d="M 220,150 C 220,50 420,50 420,200 C 420,350 220,380 220,280 C 250,260 250,180 220,150 Z"
 fill={identifiedParts.includes('cortex') ? '#d97706' : '#fcd34d'}
 stroke={selectedRegion === 'cortex' ? '#fde047' : 'none'}
 strokeWidth="6"
 onClick={(e) => handlePartClick(e, 'cortex')}
 />
 
 <g id="medulla" onClick={(e) => handlePartClick(e, 'medulla')}>
 <path d="M 290,100 L 340,130 L 290,160 Z" fill={identifiedParts.includes('medulla') ? '#991b1b' : '#f87171'} stroke={selectedRegion === 'medulla' ? '#fde047' : 'none'} strokeWidth="3"/>
 <path d="M 360,180 L 400,230 L 350,250 Z" fill={identifiedParts.includes('medulla') ? '#991b1b' : '#f87171'} stroke={selectedRegion === 'medulla' ? '#fde047' : 'none'} strokeWidth="3"/>
 <path d="M 290,290 L 330,340 L 260,340 Z" fill={identifiedParts.includes('medulla') ? '#991b1b' : '#f87171'} stroke={selectedRegion === 'medulla' ? '#fde047' : 'none'} strokeWidth="3"/>
 </g>
 
 <path
 id="pelvis"
 d="M 220,190 L 270,150 L 280,170 L 240,220 L 310,230 L 310,250 L 240,260 L 270,300 L 250,310 L 220,270 Z"
 fill={identifiedParts.includes('pelvis') ? '#fef08a' : '#fef9c3'}
 stroke={selectedRegion === 'pelvis' ? '#facc15' : '#ca8a04'}
 strokeWidth="3"
 onClick={(e) => handlePartClick(e, 'pelvis')}
 />
 </g>

 {externalDone && !isDissected && (
 <line x1="320" y1="50" x2="320" y2="380" stroke="white" strokeWidth="4" strokeDasharray="10 10" opacity="0.6" />
 )}

 {activeTool === 'scalpel' && !isDissected && externalDone && (
 <g transform={`translate(${mousePos.x}, ${mousePos.y})`} style={{ pointerEvents: 'none' }}>
 <path d="M 0,0 L 12,-12 L 35,-6 L 35,6 L 6,12 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
 <circle cx="0" cy="0" r="3" fill="#ef4444" opacity="0.8" />
 </g>
 )}
 </svg>

 {!externalDone && (
 <div className={`absolute top-4 bg-[#000000] dark:bg-[#121212]/80 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none flex-col `}>
 
 {t('lab.b10kidneydissection_phase_1_identify_all_external_')}
 </div>
 )}
 {externalDone && !isDissected && (
 <div className="absolute top-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.b10kidneydissection_phase_2_use_the_scalpel_to_dis')}
 </div>
 )}
 {isDissected && !internalDone && (
 <div className="absolute top-4 bg-[#000000] dark:bg-[#121212]/80 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none">
 
 {t('lab.b10kidneydissection_phase_3_identify_internal_stru')}
 </div>
 )}
 </div>
 </div>

 {/* Right Column: Assessment & Identification */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="mb-6">
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.b10kidneydissection_identification_log')}</h2>
 
 {selectedRegion ? (
 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
 <p className="text-sm font-medium text-yellow-800 mb-3">{t('lab.b10kidneydissection_identify_the_highlighted_regio')}</p>
 <div className="grid grid-cols-2 gap-2">
 {(!isDissected ? EXTERNAL_PARTS : INTERNAL_PARTS).map(part => (
 <button
 key={part.id}
 onClick={() => identifyRegion(part.id)}
 disabled={identifiedParts.includes(part.id)}
 className="px-3 py-2 bg-slate-50 dark:bg-[#121212] border border-yellow-300 rounded text-sm font-medium text-slate-700 dark:text-[#ffffff] hover:bg-yellow-100 disabled:opacity-50"
 >
 {part.name}
 </button>
 ))}
 </div>
 </div>
 ) : (
 <p className="text-sm text-slate-500 dark:text-[#71717a] italic mb-4">{t('lab.b10kidneydissection_select_a_region_on_the_kidney_')}</p>
 )}

 <div className="space-y-2">
 <h3 className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] uppercase tracking-wider">{t('lab.b10kidneydissection_external')}</h3>
 {EXTERNAL_PARTS.map(part => (
 <div key={part.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[#121212] rounded border border-slate-100">
 <span className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{part.name}</span>
 {identifiedParts.includes(part.id) ? (
 <CheckCircle2 className="w-5 h-5 text-green-500" />
 ) : (
 <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-[#1c1b1b]" />
 )}
 </div>
 ))}

 <h3 className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] uppercase tracking-wider mt-4">{t('lab.b10kidneydissection_internal')}</h3>
 {INTERNAL_PARTS.map(part => (
 <div key={part.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[#121212] rounded border border-slate-100">
 <span className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{part.name}</span>
 {identifiedParts.includes(part.id) ? (
 <CheckCircle2 className="w-5 h-5 text-green-500" />
 ) : (
 <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-[#1c1b1b]" />
 )}
 </div>
 ))}
 </div>
 </div>

 <div className="flex-1 mt-6 pt-6 border-t border-slate-200 dark:border-[#1c1b1b]">
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.b10kidneydissection_assessment')}</h2>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.b10kidneydissection_1_if_the_kidney_filters_120_ml')}
 </label>
 <div className="flex space-x-2">
 <input
 type="number"
 value={q1Answer}
 onChange={(e) => setQ1Answer(e.target.value)}
 placeholder={t('lab.b10kidneydissection_enter_value')}
 className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 <span className="flex items-center text-slate-600 dark:text-[#a1a1aa] font-medium">L</span>
 </div>
 {q1Correct !== null && (
 <p className={`text-sm mt-1 font-medium ${q1Correct ? 'text-green-600' : 'text-red-600'}`}>
 {q1Correct ? 'Correct! 120 * 60 * 24 = 172,800 mL = 172.8 L.' : 'Incorrect. Check your math.'}
 </p>
 )}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.b10kidneydissection_2_what_is_the_primary_function')}
 </label>
 <select
 value={q2Answer}
 onChange={(e) => setQ2Answer(e.target.value)}
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-[#121212]"
 >
 <option value="">{t('lab.b10kidneydissection_select_an_option')}</option>
 <option value="filter">{t('lab.b10kidneydissection_filter_toxins_from_the_blood')}</option>
 <option value="collect">{t('lab.b10kidneydissection_collect_urine_and_funnel_it_to')}</option>
 <option value="hormones">{t('lab.b10kidneydissection_produce_hormones_like_epo')}</option>
 </select>
 {q2Correct !== null && (
 <p className={`text-sm mt-1 font-medium ${q2Correct ? 'text-green-600' : 'text-red-600'}`}>
 {q2Correct ? 'Correct!' : 'Incorrect.'}
 </p>
 )}
 </div>

 <button
 onClick={checkAnswers}
 className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.b10kidneydissection_check_answers')}
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
