import { useState, useEffect, useRef } from 'react';
import { Hand, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabS8ReflexTimeProps {
 onExit?: () => void;
}

export default function LabS8ReflexTime({ onExit }: LabS8ReflexTimeProps) {
    const { t } = useTranslate();
 const [gameState, setGameState] = useState<'ready' | 'falling' | 'caught' | 'missed'>('ready');
 const [rulerY, setRulerY] = useState(0); // 0 to 400 (pixels dropped)
 const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
 
 const dropStartTime = useRef<number>(0);
 const fallAnimationRef = useRef<number>(0);

 const GRAVITY = 2.0; // m/s^2 artificially lowered for easier catching
 const PIXELS_PER_CM = 10;

 const startDrop = () => {
 // Random delay between 1-4 seconds
 setGameState('ready');
 setRulerY(0);
 setReactionTimeMs(null);

 const delay = 1000 + Math.random() * 3000;
 setTimeout(() => {
  setGameState('falling');
  dropStartTime.current = performance.now();
  animateFall();
 }, delay);
 };

 const animateFall = () => {
 const timeNow = performance.now();
 const tSeconds = (timeNow - dropStartTime.current) / 1000;
 
 // Distance = 0.5 * g * t^2 (in meters)
 const distanceMeters = 0.5 * GRAVITY * tSeconds * tSeconds;
 const distanceCm = distanceMeters * 100;
 const distancePixels = distanceCm * PIXELS_PER_CM;

 setRulerY(distancePixels);

 if (distancePixels < 500) {
  fallAnimationRef.current = requestAnimationFrame(animateFall);
 } else {
  setGameState('missed');
 }
 };

 const handleCatch = () => {
 if (gameState === 'falling') {
  if (fallAnimationRef.current) cancelAnimationFrame(fallAnimationRef.current);
  const catchTime = performance.now() - dropStartTime.current;
  setReactionTimeMs(catchTime);
  setGameState('caught');
 }
 };

 useEffect(() => {
 return () => {
  if (fallAnimationRef.current) cancelAnimationFrame(fallAnimationRef.current);
 };
 }, []);

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s8reflextime_act_2_3_reflex_action_time')} subtitle={t('lab.subtitle_measure_human_reaction')} />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  {/* Left Column: Interactive */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center">
   
   <div className="w-full flex justify-between items-center mb-6">
   <button 
    onClick={startDrop} 
    disabled={gameState === 'falling'}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    
                             {t('lab.s8reflextime_start_trial')}
                            </button>
   <div className="text-right">
    <p className="text-sm text-slate-500 dark:text-[#71717a]">{t('lab.s8reflextime_status')}</p>
    <p className={`font-bold ${gameState === 'caught' ? 'text-green-600' : gameState === 'missed' ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
    {gameState.toUpperCase()}
    </p>
   </div>
   </div>

   <div className="relative w-32 h-[500px] border border-slate-200 dark:border-[#1c1b1b] rounded-xl overflow-hidden flex justify-center mt-4" style={{backgroundColor: 'rgb(var(--slate-50))'}}>
   
   {/* The Ruler */}
   <div 
    className="absolute w-12 bg-yellow-400 border-x-2 border-yellow-600 h-[400px] z-10"
    style={{
    top: `${-rulerY}px`
    }}
   >
    {/* Ruler markings */}
    {Array.from({ length: 30 }).map((_, i) => (
    <div key={i} className="w-full h-0 border-b border-yellow-700 opacity-50" style={{ marginTop: '13.3px' }}>
     <span className="text-[8px] font-bold ml-1">{i+1}</span>
    </div>
    ))}
   </div>

   {/* The catching hand line */}
   <div className="absolute top-[300px] w-full border-t-2 border-red-500 border-dashed z-10 pointer-events-none" />
   <Hand className="absolute top-[300px] -right-16 w-12 h-12 text-slate-400 -mt-6 z-10" />

   {/* Catch Button Overlay */}
   <button 
    onMouseDown={handleCatch}
    className="absolute inset-0 w-full h-full cursor-pointer z-20 outline-none"
    aria-label="Click here to catch"
   />
   </div>

   <div className="mt-6 text-center font-medium" style={{color: 'rgb(var(--slate-600))'}}>
   
                        {t('lab.s8reflextime_click_the_ruler_area_to_catch_')}
                        </div>

  </div>

  {/* Right Column */}
  <div className="w-full md:w-80 flex flex-col gap-4">
   <div className="bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-sm text-white p-6">
   <h3 className="font-bold mb-4 text-slate-300">{t('lab.s8reflextime_results')}</h3>
   
   <div className="mb-4">
    <p className="text-sm text-slate-400">{t('lab.s8reflextime_distance_dropped')}</p>
    <p className="text-3xl font-bold font-mono">
    {gameState === 'caught' ? (rulerY / PIXELS_PER_CM).toFixed(1) : '-.--'} cm
    </p>
   </div>
   
   <div>
    <p className="text-sm text-slate-400">{t('lab.s8reflextime_reaction_time')}</p>
    <p className="text-3xl font-bold font-mono text-green-400">
    {reactionTimeMs ? `${(reactionTimeMs / 1000).toFixed(3)} s` : '-.--- s'}
    </p>
   </div>
   </div>

   <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <Info className="w-5 h-5" />  {t('lab.s8reflextime_the_math')}
                            </h3>
   <p className="text-sm text-blue-800 mb-2 dark:text-[#ffffff]">
    
                             {t('lab.s8reflextime_unlike_a_knee_jerk_reflex_catc')}
                            </p>
   <p className="text-xs text-blue-700 bg-slate-50 dark:bg-[#121212] p-2 rounded border border-blue-200 font-mono text-center">
    
                             {t('lab.s8reflextime_t_2d_g')}
                            </p>
   </div>
  </div>
  </div>
 </div>
 );
}
