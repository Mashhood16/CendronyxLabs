import { useState } from 'react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabS8KneeJerkProps {
 onExit?: () => void;
}

export default function LabS8KneeJerk({ onExit }: LabS8KneeJerkProps) {
 const { t } = useTranslate();
 const [kickState, setKickState] = useState<'idle' | 'tapping' | 'kicking'>('idle');

 const handleTap = () => {
 if (kickState !== 'idle') return;
 
 setKickState('tapping');
 
 // Simulate tap delay
 setTimeout(() => {
 setKickState('kicking');
 // Return to idle
 setTimeout(() => {
 setKickState('idle');
 }, 800);
 }, 300);
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s8kneejerk_act_2_2_knee_jerk_reflex')} subtitle={t('lab.subtitle_observe_involuntary_reflex')} />

 <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
 {/* Left Column: Animation */}
 <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative min-h-[400px]">
 
 <div className="relative w-64 h-80">
 {/* Chair */}
 <div className="absolute top-20 left-0 w-32 h-40 bg-amber-800 rounded-l-lg border-b-8 border-amber-900" />
 
 {/* Thigh */}
 <div className="absolute top-16 left-10 w-40 h-16 bg-[#e1b899] rounded-full origin-left rotate-12" />
 
 {/* Knee joint */}
 <div className="absolute top-24 left-44 w-12 h-12 bg-[#d4a888] rounded-full z-10">
 {/* Hitbox Target */}
 <button 
 onClick={handleTap}
 className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500/20 rounded-full border border-red-500 border-dashed animate-pulse hover:bg-red-500/40 cursor-pointer z-30 flex items-center justify-center text-xs font-bold text-red-700 dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
 >
 
 {t('lab.s8kneejerk_tap')}
 </button>
 </div>

 {/* Lower Leg */}
 <div 
 className="absolute top-28 left-48 w-12 h-48 bg-[#e1b899] rounded-b-full origin-top transition-transform duration-300 ease-out z-0"
 style={{
 transform: kickState === 'kicking' ? 'rotate(-60deg)' : 'rotate(10deg)'
 }}
 >
 {/* Foot */}
 <div className="absolute bottom-0 -right-6 w-20 h-10 bg-[#e1b899] rounded-r-full" />
 </div>

 {/* Hand / Hammer (Animated) */}
 <div 
 className="absolute top-48 left-64 transition-transform duration-200 ease-in z-20"
 style={{
 transform: kickState === 'tapping' ? 'translate(-40px, -40px) rotate(-30deg)' : 'translate(0px, 0px) rotate(0deg)',
 opacity: kickState === 'kicking' ? 0 : 1
 }}
 >
 <div className="w-16 h-4 bg-slate-300 dark:bg-[#121212] rounded-full" />
 <div className="w-6 h-8 bg-[#121212] dark:bg-[#121212] rounded-md absolute -left-2 -top-2" />
 </div>

 </div>

 <div className="mt-8 text-center">
 {kickState === 'idle' && <p className="text-slate-500 dark:text-[#71717a] font-medium animate-pulse">{t('lab.s8kneejerk_click_the_tap_target_below_the')}</p>}
 {kickState === 'tapping' && <p className="text-amber-600 font-bold">{t('lab.s8kneejerk_stimulus_applied')}</p>}
 {kickState === 'kicking' && <p className="text-green-600 font-bold text-xl">{t('lab.s8kneejerk_reflex_action_involuntary_kick')}</p>}
 </div>

 </div>

 {/* Right Column: Educational Content */}
 <div className="w-full md:w-80 flex flex-col gap-4">
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.s8kneejerk_the_reflex_arc')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.s8kneejerk_a_reflex_is_a_rapid_automatic_')}
 </p>
 <ol className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2 list-decimal pl-4">
 <li>{t('lab.s8kneejerk_tap_hits_the_patellar_tendon')}</li>
 <li>{t('lab.s8kneejerk_sensory_neurons_send_a_signal_')}</li>
 <li>{t('lab.s8kneejerk_spinal_cord_immediately_bounce')}</li>
 <li>{t('lab.s8kneejerk_the_thigh_muscle_contracts_cau')}</li>
 </ol>
 </div>
 </div>
 </div>
 </div>
 );
}
