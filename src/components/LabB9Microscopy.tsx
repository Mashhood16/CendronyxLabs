import { useState } from 'react';
import { ZoomIn, Eye, Move, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabB9Microscopy({ onExit }: { onExit: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [selectedSlide, setSelectedSlide] = useState('onion');
 const [focus, setFocus] = useState(0);
 const [mag, setMag] = useState(10);
 const [panX, setPanX] = useState(0);
 const [panY, setPanY] = useState(0);

 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [showResults, setShowResults] = useState(false);

 const blurAmount = Math.abs(focus - 5) * 1.5; 
 const scale = mag === 10 ? 1 : mag === 40 ? 2 : 4;

 const slides = [
 { id: 'onion', name: 'Onion Skin' },
 { id: 'cheek', name: 'Human Cheek Cell' },
 { id: 'root', name: 'Onion Root Tip (Mitosis)' },
 ];

 const renderSlideSVG = () => {
 if (selectedSlide === 'onion') {
 return (
 <svg width="200" height="200" viewBox="0 0 100 100">
 <defs>
 <pattern id="onion-pat" width="20" height="30" patternUnits="userSpaceOnUse">
 <rect width="20" height="30" fill="#f0fdf4" stroke="#166534" strokeWidth="1" />
 <circle cx="10" cy="15" r="2.5" fill="#14532d" />
 </pattern>
 </defs>
 <rect width="100" height="100" fill="url(#onion-pat)" />
 </svg>
 );
 }
 if (selectedSlide === 'cheek') {
 return (
 <svg width="200" height="200" viewBox="0 0 100 100">
 <rect width="100" height="100" fill="#fdf2f8" />
 <path d="M20,20 Q35,5 50,25 T80,40 Q85,60 65,70 T20,60 Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="1" />
 <circle cx="45" cy="45" r="4" fill="#831843" />
 <path d="M70,10 Q80,15 90,30 T85,50 Q75,45 65,30 Z" fill="#fbcfe8" stroke="#be185d" strokeWidth="1" />
 <circle cx="78" cy="32" r="3" fill="#831843" />
 </svg>
 );
 }
 if (selectedSlide === 'root') {
 return (
 <svg width="200" height="200" viewBox="0 0 100 100">
 <defs>
 <pattern id="root-pat" width="25" height="25" patternUnits="userSpaceOnUse">
 <rect width="25" height="25" fill="#f0fdf4" stroke="#166534" strokeWidth="1" />
 <circle cx="12.5" cy="12.5" r="3" fill="#14532d" />
 </pattern>
 </defs>
 <rect width="100" height="100" fill="url(#root-pat)" />
 {/* Metaphase cell */}
 <rect x="25" y="25" width="25" height="25" fill="#dcfce7" stroke="#166534" strokeWidth="1" />
 <line x1="30" y1="37.5" x2="45" y2="37.5" stroke="#14532d" strokeWidth="2" strokeDasharray="1 2" />
 {/* Anaphase cell */}
 <rect x="50" y="50" width="25" height="25" fill="#dcfce7" stroke="#166534" strokeWidth="1" />
 <line x1="55" y1="58" x2="70" y2="58" stroke="#14532d" strokeWidth="1.5" strokeDasharray="1 2" />
 <line x1="55" y1="67" x2="70" y2="67" stroke="#14532d" strokeWidth="1.5" strokeDasharray="1 2" />
 </svg>
 );
 }
 return null;
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.b9microscopy_microscopy_cell_biology_lab')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.b9microscopy_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.b9microscopy_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 grow min-h-0 lg:overflow-hidden">
 {/* Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <Info className="mr-2 text-indigo-600" /> {t('lab.b9microscopy_microscope_basics')}
 </h2>
 <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
 <p>
 
 {t('lab.b9microscopy_light_microscopes_allow_us_to_')}
 </p>
 <div className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
 <h3 className="font-bold text-indigo-800 mb-2 dark:text-[#ffffff]">{t('lab.b9microscopy_key_plant_vs_animal_difference')}</h3>
 <ul className="list-disc pl-5 space-y-2">
 <li><strong>{t('lab.b9microscopy_plant_cells_onion')}</strong> {t('lab.b9microscopy_have_a_rigid_cell_wall_providi')}</li>
 <li><strong>{t('lab.b9microscopy_animal_cells_cheek')}</strong> {t('lab.b9microscopy_only_have_a_flexible_cell_memb')}</li>
 </ul>
 </div>
 <div className={`bg-fuchsia-50 p-4 rounded-lg border border-fuchsia-100 text-fuchsia-900 flex-col `}>
 <h3 className="font-bold text-fuchsia-800 mb-2">{t('lab.b9microscopy_mitosis_in_onion_root_tip')}</h3>
 <p>{t('lab.b9microscopy_root_tips_grow_rapidly_via_cel')}</p>
 <ul className="list-disc pl-5 space-y-1 mt-2">
 <li><strong>{t('lab.b9microscopy_prophase')}</strong> {t('lab.b9microscopy_chromosomes_condense')}</li>
 <li><strong>{t('lab.b9microscopy_metaphase')}</strong> {t('lab.b9microscopy_chromosomes_align_in_the_middl')}</li>
 <li><strong>{t('lab.b9microscopy_anaphase')}</strong> {t('lab.b9microscopy_sister_chromatids_pull_apart')}</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Simulation */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 w-full text-left">{t('lab.b9microscopy_microscope_viewport')}</h2>
 
 <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-[#1c1b1b] dark:border-[#1c1b1b] bg-black overflow-hidden shadow-2xl flex items-center justify-center mb-6">
 <div 
 style={{ 
 transform: `scale(${scale}) translate(${panX}px, ${panY}px)`, 
 filter: `blur(${blurAmount}px)`, 
 transition: 'transform 0.2s, filter 0.2s' 
 }}
 className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-[#121212]"
 >
 {renderSlideSVG()}
 </div>
 
 {/* Crosshair */}
 <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
 <div className="w-full h-[1px] bg-black"></div>
 <div className="h-full w-[1px] bg-black absolute"></div>
 </div>
 </div>

 <div className="w-full space-y-4 mt-auto">
 <div>
 <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex justify-between">
 <span><Eye className="inline w-4 h-4 mr-1"/> {t('lab.b9microscopy_coarse_fine_focus')}</span>
 <span>{focus === 5 ? 'Perfect' : 'Blurry'}</span>
 </label>
 <input 
 type="range" min="0" max="10" step="1" 
 value={focus} onChange={(e) => setFocus(Number(e.target.value))}
 className="w-full accent-indigo-600"
 />
 </div>
 
 <div className="flex gap-4">
 <div className="flex-1">
 <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center mb-1">
 <ZoomIn className="inline w-4 h-4 mr-1"/> {t('lab.b9microscopy_magnification')}
 </label>
 <div className={`flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1 `}>
 {[10, 40, 100].map(m => (
 <button 
 key={m}
 onClick={() => setMag(m)}
 className={`flex-1 text-sm py-1 rounded-md font-bold transition-colors ${mag === m ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 >
 {m}x
 </button>
 ))}
 </div>
 </div>
 <div className="flex-1">
 <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex items-center mb-1">
 <Move className="inline w-4 h-4 mr-1"/> {t('lab.b9microscopy_pan_x_y')}
 </label>
 <div className="flex gap-2">
 <input type="range" min="-50" max="50" value={panX} onChange={e=>setPanX(Number(e.target.value))} className="w-full accent-slate-500" />
 <input type="range" min="-50" max="50" value={panY} onChange={e=>setPanY(Number(e.target.value))} className="w-full accent-slate-500" />
 </div>
 </div>
 </div>

 <div>
 <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase mb-1 block">{t('lab.b9microscopy_slide_selector')}</label>
 <div className="grid grid-cols-3 gap-2">
 {slides.map(s => (
 <button 
 key={s.id}
 onClick={() => { setSelectedSlide(s.id); setFocus(0); setPanX(0); setPanY(0); }}
 className={`text-xs p-2 border rounded-md font-bold transition-colors ${selectedSlide === s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 {s.name}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Assessment */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <CheckCircle className="mr-2 text-indigo-600" /> {t('lab.b9microscopy_observations_analysis')}
 </h2>
 
 <div className="space-y-6">
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.b9microscopy_1_what_structure_gives_the_oni')}
 </label>
 <select 
 value={q1} 
 onChange={(e) => setQ1(e.target.value)}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
 >
 <option value="">{t('lab.b9microscopy_select')}</option>
 <option value="membrane">{t('lab.b9microscopy_cell_membrane')}</option>
 <option value="wall">{t('lab.b9microscopy_cell_wall')}</option>
 <option value="nucleus">{t('lab.b9microscopy_nucleus')}</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.b9microscopy_2_in_the_onion_root_tip_slide_')}
 </label>
 <select 
 value={q2} 
 onChange={(e) => setQ2(e.target.value)}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
 >
 <option value="">{t('lab.b9microscopy_select_phase')}</option>
 <option value="prophase">{t('lab.b9microscopy_prophase_1')}</option>
 <option value="metaphase">{t('lab.b9microscopy_metaphase_1')}</option>
 <option value="anaphase">{t('lab.b9microscopy_anaphase_1')}</option>
 </select>
 </div>

 <button 
 onClick={() => setShowResults(true)}
 className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors mt-auto dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.b9microscopy_check_analysis')}
 </button>

 {showResults && (
 <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <p className="font-bold text-indigo-800 dark:text-[#ffffff]">{t('lab.b9microscopy_feedback')}</p>
 <ul className="text-sm space-y-2 mt-2">
 <li>{t('lab.b9microscopy_question_1')} {q1 === 'wall' ? '✅ Correct (Plant cells have rigid cell walls)' : '❌ Incorrect'}</li>
 <li>{t('lab.b9microscopy_question_2')} {q2 === 'metaphase' ? '✅ Correct (Metaphase = Middle)' : '❌ Incorrect'}</li>
 </ul>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
