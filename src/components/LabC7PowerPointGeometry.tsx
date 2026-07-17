import { useState } from 'react';

import { Square, Circle, Triangle, Play, MousePointer2 } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC7PowerPointGeometry({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [shapes, setShapes] = useState<{id: string, type: string, x: number, y: number, anim: string}[]>([]);
 const [selectedShape, setSelectedShape] = useState<string | null>(null);
 const [transition, setTransition] = useState('none');
 const [isPlaying, setIsPlaying] = useState(false);

 const addShape = (type: string) => {
 setShapes([...shapes, { id: Math.random().toString(), type, x: 100 + Math.random() * 200, y: 100 + Math.random() * 100, anim: 'none' }]);
 };

 const setAnimation = (anim: string) => {
 if (selectedShape) {
 setShapes(shapes.map(s => s.id === selectedShape ? { ...s, anim } : s));
 }
 };

 const handlePlay = () => {
 if (shapes.length === 0) return;
 setIsPlaying(true);
 };

 const handleExitPlay = () => {
 setIsPlaying(false);
 };

 if (isPlaying) {
 return (
 <div className="fixed inset-0 bg-black z-50 flex items-center justify-center min-h-screen lg:h-screen overflow-x-hidden w-full" onClick={handleExitPlay}>
 <div className="w-full max-w-5xl aspect-[16/9] bg-white dark:bg-[#121212] dark:border-[#1c1b1b] relative overflow-hidden shadow-2xl dark:bg-[#121212]">
 {shapes.map(shape => {
 let animStyle = '';
 if (shape.anim === 'spin') animStyle = 'animate-spin';
 if (shape.anim === 'pulse') animStyle = 'animate-pulse';
 if (shape.anim === 'bounce') animStyle = 'animate-bounce';
 return (
 <div key={shape.id} className={`absolute ${animStyle}`} style={{ left: shape.x, top: shape.y }}>
 {shape.type === 'square' && <div className="w-24 h-24 bg-blue-600" />}
 {shape.type === 'circle' && <div className="w-24 h-24 bg-rose-600 rounded-full" />}
 {shape.type === 'triangle' && (
 <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-emerald-600" />
 )}
 {shape.type === 'parallelogram' && <div className="w-32 h-20 bg-indigo-600 skew-x-[-20deg]" />}
 </div>
 );
 })}
 </div>
 <div className="absolute top-8 right-8 text-white/50 text-sm">{t('lab.c7powerpointgeometry_click_anywhere_to_exit')}</div>
 </div>
 );
 }

 return (
 <div className="flex flex-col min-h-screen lg:h-screen font-sans bg-slate-100 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff]">
 <LabHeader onExit={onExit} title={t('lab.c7powerpointgeometry_geometry_presentation')} />
 <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

 <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.c7powerpointgeometry_insert_geometrical_figures_ont')}</p>

 {/* Ribbon Toolbar */}
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-t-xl border border-slate-300 dark:border-[#1c1b1b] p-2 flex gap-6 w-full max-w-4xl mx-auto shadow-sm">
 {/* Insert Shapes */}
 <div className="flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] pr-6">
 <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t('lab.c7powerpointgeometry_insert_shapes')}</span>
 <div className="flex gap-2">
 <button onClick={() => addShape('square')} className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded border border-transparent hover:border-slate-300 dark:border-[#1c1b1b]"><Square className="w-5 h-5 text-blue-600" fill="currentColor"/></button>
 <button onClick={() => addShape('circle')} className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded border border-transparent hover:border-slate-300 dark:border-[#1c1b1b]"><Circle className="w-5 h-5 text-rose-600" fill="currentColor"/></button>
 <button onClick={() => addShape('triangle')} className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded border border-transparent hover:border-slate-300 dark:border-[#1c1b1b]"><Triangle className="w-5 h-5 text-emerald-600" fill="currentColor"/></button>
 <button onClick={() => addShape('parallelogram')} className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded border border-transparent hover:border-slate-300 dark:border-[#1c1b1b]">
 <div className="w-5 h-5 bg-indigo-600 skew-x-[-20deg]" />
 </button>
 </div>
 </div>

 {/* Transitions */}
 <div className="flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] pr-6">
 <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t('lab.c7powerpointgeometry_slide_transition')}</span>
 <select value={transition} onChange={e => setTransition(e.target.value)} className="p-1 text-sm border border-slate-300 dark:border-[#1c1b1b] rounded outline-none">
 <option value="none">{t('lab.c7powerpointgeometry_none')}</option>
 <option value="fade">{t('lab.c7powerpointgeometry_fade')}</option>
 <option value="slide">{t('lab.c7powerpointgeometry_slide')}</option>
 </select>
 </div>

 {/* Animations (Requires Selection) */}
 <div className="flex flex-col pr-6">
 <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t('lab.c7powerpointgeometry_object_animation')}</span>
 <select 
 disabled={!selectedShape} 
 onChange={e => setAnimation(e.target.value)} 
 value={selectedShape ? shapes.find(s=>s.id === selectedShape)?.anim : 'none'}
 className="p-1 text-sm border border-slate-300 dark:border-[#1c1b1b] rounded outline-none disabled:opacity-50"
 >
 <option value="none">{t('lab.c7powerpointgeometry_none')}</option>
 <option value="spin">{t('lab.c7powerpointgeometry_spin')}</option>
 <option value="pulse">{t('lab.c7powerpointgeometry_pulse')}</option>
 <option value="bounce">{t('lab.c7powerpointgeometry_bounce')}</option>
 </select>
 </div>

 <button 
 onClick={handlePlay}
 className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg font-bold flex items-center transition-colors dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
 >
 <Play className="w-4 h-4 mr-2" />
 
 {t('lab.c7powerpointgeometry_slide_show')}
 </button>
 </div>

 {/* Slide Canvas */}
 <div className="w-full max-w-4xl mx-auto flex-1 flex items-center justify-center relative p-8">
 <div className="w-full aspect-[16/9] bg-slate-50 dark:bg-[#121212] shadow-2xl border-4 border-slate-200 dark:border-[#1c1b1b] relative overflow-hidden">
 
 {/* Shapes */}
 {shapes.map(shape => {
 const isSelected = selectedShape === shape.id;
 
 let animClass = '';
 if (isPlaying && shape.anim === 'spin') animClass = 'animate-spin';
 if (isPlaying && shape.anim === 'pulse') animClass = 'animate-pulse';
 if (isPlaying && shape.anim === 'bounce') animClass = 'animate-bounce';

 return (
 <div 
 key={shape.id}
 onClick={() => setSelectedShape(shape.id)}
 className={`absolute cursor-pointer transition-all ${isSelected && !isPlaying ? 'ring-4 ring-blue-400 ring-offset-4' : ''} ${animClass}`}
 style={{ left: shape.x, top: shape.y }}
 >
 {shape.type === 'square' && <div className="w-24 h-24 bg-blue-600" />}
 {shape.type === 'circle' && <div className="w-24 h-24 bg-rose-600 rounded-full" />}
 {shape.type === 'triangle' && (
 <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-emerald-600" />
 )}
 {shape.type === 'parallelogram' && <div className="w-32 h-20 bg-indigo-600 skew-x-[-20deg]" />}
 </div>
 )
 })}

 {shapes.length === 0 && (
 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
 <MousePointer2 className="w-12 h-12 mb-4" />
 <p className="text-xl font-medium">{t('lab.c7powerpointgeometry_use_toolbar_to_insert_geometry')}</p>
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
