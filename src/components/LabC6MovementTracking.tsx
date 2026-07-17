import { useState, useEffect } from 'react';
import {Rocket } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC6MovementTracking({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [xPos, setXPos] = useState(0);
 const [counter, setCounter] = useState(0);
 const [pressedKey, setPressedKey] = useState<string | null>(null);

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 const key = e.key;
 setPressedKey(key);
 
 if (key === 'ArrowRight') {
 setXPos(x => Math.min(x + 20, 240));
 setCounter(c => c + 1);
 } else if (key === 'ArrowLeft') {
 setXPos(x => Math.max(x - 20, -240));
 setCounter(c => c - 1);
 }
 };

 const handleKeyUp = () => {
 setPressedKey(null);
 };

 window.addEventListener('keydown', handleKeyDown);
 window.addEventListener('keyup', handleKeyUp);
 return () => {
 window.removeEventListener('keydown', handleKeyDown);
 window.removeEventListener('keyup', handleKeyUp);
 };
 }, []);

 return (
 <div className="flex flex-col font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c6movementtracking_tracking_movement_with_variabl')} />
 <div className="flex-1 p-8 flex flex-col lg:overflow-y-auto min-h-0">
 

 <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c6movementtracking_use_the_left_and_right_arrow_k')}</p>

 <div className="flex gap-8 flex-1">
 {/* Blocks Editor (Mock) */}
 <div className="w-80 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
 <div className="bg-orange-500 text-white font-bold p-3 text-sm">{t('lab.c6movementtracking_variables_events')}</div>
 <div className="flex-1 p-6 flex flex-col gap-8 bg-slate-50 dark:bg-[#121212]/50">
 
 {/* Right Arrow Block */}
 <div>
 <div className="bg-amber-500 rounded-lg shadow-sm border border-amber-600 p-4 w-full text-white font-bold text-sm rounded-b-none pb-6 relative z-10 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
 <div className="absolute top-0 left-4 w-12 h-3 bg-amber-600 rounded-b-full dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"></div>
 
 {t('lab.c6movementtracking_when_right_arrow_key_pressed')}
 </div>
 <div className="bg-orange-500 rounded-lg shadow-sm border border-orange-600 p-3 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2 mb-1 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">
 
 {t('lab.c6movementtracking_change_counter_by_1')}
 </div>
 <div className="bg-blue-500 rounded-lg shadow-sm border border-blue-600 p-3 w-full text-white font-bold text-sm ml-2 relative z-30 /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.c6movementtracking_change_x_by_20')}
 </div>
 </div>

 {/* Left Arrow Block */}
 <div>
 <div className="bg-amber-500 rounded-lg shadow-sm border border-amber-600 p-4 w-full text-white font-bold text-sm rounded-b-none pb-6 relative z-10 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
 <div className="absolute top-0 left-4 w-12 h-3 bg-amber-600 rounded-b-full dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"></div>
 
 {t('lab.c6movementtracking_when_left_arrow_key_pressed')}
 </div>
 <div className="bg-orange-500 rounded-lg shadow-sm border border-orange-600 p-3 w-full text-white font-bold text-sm -mt-4 relative z-20 ml-2 mb-1 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">
 
 {t('lab.c6movementtracking_change_counter_by_1_1')}
 </div>
 <div className="bg-blue-500 rounded-lg shadow-sm border border-blue-600 p-3 w-full text-white font-bold text-sm ml-2 relative z-30 /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.c6movementtracking_change_x_by_20_1')}
 </div>
 </div>

 </div>
 </div>

 {/* Stage Area */}
 <div className="flex-1 flex flex-col">
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-t-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] border-b-0 p-3 flex justify-between items-center bg-slate-100 dark:!bg-[#121212]">
 <span className="font-bold text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.c6movementtracking_scratch_stage')}</span>
 <div className="bg-slate-50 dark:bg-[#121212] px-3 py-1 rounded border border-slate-300 dark:border-[#1c1b1b] font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2">
 <span className="text-orange-500">{t('lab.c6movementtracking_counter')}</span>
 <span className="bg-orange-100 px-2 rounded text-orange-800">{counter}</span>
 </div>
 </div>
 
 <div className="bg-slate-50 dark:!bg-[#121212] flex-1 rounded-b-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative overflow-hidden flex items-center justify-center">
 
 <div className="absolute inset-0 bg-[#000000] dark:bg-slate-950 flex flex-col">
 <div className="flex-1"></div>
 {/* Ground */}
 <div className="h-1/4 bg-[#121212] dark:bg-[#121212] border-t-4 border-[#1c1b1b] dark:border-neutral-900 w-full"></div>
 </div>

 <div className="absolute top-4 left-4 flex gap-2">
 <div className={`px-4 py-2 rounded-lg font-bold transition-colors ${pressedKey === 'ArrowLeft' ? 'bg-amber-400 text-slate-900 dark:text-[#ffffff]' : 'bg-slate-700 dark:bg-[#121212] text-slate-300'}`}>
 
 {t('lab.c6movementtracking_larr_left')}
 </div>
 <div className={`px-4 py-2 rounded-lg font-bold transition-colors ${pressedKey === 'ArrowRight' ? 'bg-amber-400 text-slate-900 dark:text-[#ffffff]' : 'bg-slate-700 dark:bg-[#121212] text-slate-300'}`}>
 
 {t('lab.c6movementtracking_right_rarr')}
 </div>
 </div>

 {/* Sprite (Rocket) */}
 <div 
 className="absolute transition-all duration-100 ease-linear"
 style={{
 left: `calc(50% + ${(xPos / 240) * 50}% - 48px)`,
 bottom: '25%'
 }}
 >
 <div className="relative">
 <Rocket className="w-24 h-24 text-white transform rotate-45" fill="#ef4444" strokeWidth={1} />
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
