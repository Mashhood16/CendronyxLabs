import { useState, useEffect } from 'react';
import { Zap, Play, Sun, Fan } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6EnergyTransformation({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [tab, setTab] = useState<'bouncing' | 'solar'>('bouncing');
 
 // Bouncing Ball State
 const [ballState, setBallState] = useState<'held' | 'falling' | 'impact' | 'rising' | 'peak'>('held');
 
 // Solar Fan State
 const [sunlight, setSunlight] = useState(false);
 const [switchOn, setSwitchOn] = useState(false);

 useEffect(() => {
 let timeout: any;
 if (ballState === 'falling') {
  timeout = setTimeout(() => setBallState('impact'), 1000);
 } else if (ballState === 'impact') {
  timeout = setTimeout(() => setBallState('rising'), 200);
 } else if (ballState === 'rising') {
  timeout = setTimeout(() => setBallState('peak'), 1000);
 }
 return () => clearTimeout(timeout);
 }, [ballState]);

 const dropBall = () => {
 if (ballState === 'held' || ballState === 'peak') {
  setBallState('falling');
 }
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s6energytransformation_unit_8_energy_transformations')} />

  <div className="flex-1 flex flex-col p-6 items-center">
  
  <div className="flex gap-4 mb-6">
   <button 
   onClick={() => setTab('bouncing')}
   className={`px-6 py-2 rounded font-bold border-2 ${tab === 'bouncing' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-amber-300'}`}
   >
   
                        {t('lab.s6energytransformation_activity_8_1_bouncing_ball')}
                        </button>
   <button 
   onClick={() => setTab('solar')}
   className={`px-6 py-2 rounded font-bold border-2 ${tab === 'solar' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-yellow-300'}`}
   >
   
                        {t('lab.s6energytransformation_activity_8_3_solar_fan')}
                        </button>
  </div>

  {tab === 'bouncing' && (
   <div className="flex gap-8 w-full max-w-4xl">
   {/* Physics Engine View */}
   <div className="w-96 h-[500px] bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-end relative">
    <button 
    onClick={dropBall}
    disabled={ballState === 'falling' || ballState === 'impact' || ballState === 'rising'}
    className="absolute top-6 px-4 py-2 bg-amber-600 text-white rounded font-bold disabled:opacity-50 flex items-center gap-2 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
    >
    <Play className="w-4 h-4" />  {t('lab.s6energytransformation_drop_ball')}
                                 </button>

    <div className="w-full h-full relative border-b-8 border-[#1c1b1b] dark:border-[#1c1b1b] mt-12">
     <div className={`absolute left-1/2 -translate-x-1/2 w-12 bg-red-500 rounded-full transition-all ease-linear ${ ballState === 'held' ? 'top-0 h-12 duration-0' : ballState === 'falling' ? 'top-[calc(100%-48px)] h-12 duration-1000' : ballState === 'impact' ? 'top-[calc(100%-36px)] h-9 w-16 duration-75' : ballState === 'rising' ? 'top-12 h-12 duration-1000' : 'top-12 h-12 duration-0' }`}></div>
    </div>
   </div>

   {/* Energy Map */}
   <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col justify-center">
    <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-[#ffffff]">{t('lab.s6energytransformation_energy_state_analysis')}</h2>
    
    <div className="space-y-4">
    <div className={`p-4 rounded-xl border-2 transition-colors ${ballState === 'held' || ballState === 'peak' ? 'border-amber-500 bg-amber-50' : 'border-slate-100'}`}>
     <h3 className="font-bold text-amber-800 dark:text-[#ffffff]">{t('lab.s6energytransformation_1_maximum_height_held_peak')}</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6energytransformation_maximum_gravitational_potentia')}</p>
    </div>
    
    <div className={`p-4 rounded-xl border-2 transition-colors ${ballState === 'falling' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
     <h3 className="font-bold text-blue-800 dark:text-[#ffffff]">{t('lab.s6energytransformation_2_falling')}</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6energytransformation_gpe_is_converting_into_kinetic')}</p>
    </div>

    <div className={`p-4 rounded-xl border-2 transition-colors ${ballState === 'impact' ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}>
     <h3 className="font-bold text-red-800">{t('lab.s6energytransformation_3_impact')}</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6energytransformation_ke_converts_into_elastic_poten')}</p>
    </div>

    <div className={`p-4 rounded-xl border-2 transition-colors ${ballState === 'rising' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
     <h3 className="font-bold text-emerald-800">{t('lab.s6energytransformation_4_rising')}</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6energytransformation_epe_pushes_the_ball_up_convert')}</p>
    </div>
    </div>

    <button onClick={() => setBallState('held')} className="mt-8 text-slate-500 dark:text-[#71717a] font-bold hover:text-slate-800 dark:text-[#ffffff] self-start">{t('lab.s6energytransformation_reset_simulation')}</button>
   </div>
   </div>
  )}

  {tab === 'solar' && (
   <div className="flex flex-col items-center bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-12 max-w-4xl w-full">
   <div className="flex justify-center gap-24 items-center mb-16">
    {/* Sun Toggle */}
    <div className="flex flex-col items-center">
    <button 
     onClick={() => setSunlight(!sunlight)}
     className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${sunlight ? 'bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)] text-white scale-110' : 'bg-slate-200 dark:bg-[#121212] text-slate-400'}`}
    >
     <Sun className="w-12 h-12" />
    </button>
    <span className="mt-4 font-bold text-slate-600 dark:text-[#a1a1aa]">{sunlight ? 'Sunlight Active' : 'Sunlight Blocked'}</span>
    </div>

    {/* Circuit Switch */}
    <div className="flex flex-col items-center">
    <button 
     onClick={() => setSwitchOn(!switchOn)}
     className="w-20 h-10 bg-slate-300 dark:bg-[#121212] rounded-full relative shadow-inner"
    >
     <div className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-[#121212] shadow absolute top-1 transition-all ${switchOn ? 'left-11' : 'left-1'}`}></div>
    </button>
    <span className="mt-4 font-bold text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6energytransformation_circuit')} {switchOn ? 'Closed' : 'Open'}</span>
    </div>
   </div>

   {/* Apparatus */}
   <div className="relative w-full h-64 border-b-4 border-slate-300 dark:border-[#1c1b1b] flex items-end justify-center pb-4 gap-12">
    {/* Solar Panel */}
    <div className="relative">
    {sunlight && (
     <div className="absolute -top-32 -left-12 w-64 h-64 bg-yellow-400/20 blur-2xl rounded-full dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40"></div>
    )}
    <div className="w-32 h-24 bg-blue-900 border-4 border-[#1c1b1b] dark:border-[#1c1b1b] rounded flex flex-wrap content-start p-1 gap-1 -rotate-12 transform origin-bottom-right z-10 relative">
     {[...Array(8)].map((_, i) => (
     <div key={i} className="w-[calc(50%-2px)] h-[calc(25%-2px)] border border-blue-400/30"></div>
     ))}
    </div>
    <div className="w-2 h-16 bg-[#121212] dark:bg-[#121212] absolute right-4 bottom-0"></div>
    </div>

    {/* Wires */}
    <svg className="absolute w-full h-full top-0 left-0" style={{ zIndex: 0 }}>
    {/* Panel to Switch */}
    <path d="M 380 180 Q 450 120 500 120" fill="none" stroke={sunlight && switchOn ? "#ef4444" : "#94a3b8"} strokeWidth="4" />
    {/* Switch to Fan */}
    <path d="M 580 120 Q 620 120 620 180" fill="none" stroke={sunlight && switchOn ? "#ef4444" : "#94a3b8"} strokeWidth="4" />
    {/* Ground Return */}
    <path d="M 620 190 Q 500 230 380 190" fill="none" stroke="#1e293b" strokeWidth="4" />
    </svg>

    {/* Fan */}
    <div className="relative z-10 flex flex-col items-center">
    <div className={`w-24 h-24 text-slate-800 dark:text-slate-100 transition-transform duration-100 ease-linear ${sunlight && switchOn ? 'animate-spin' : ''}`}>
     <Fan className="w-full h-full" />
    </div>
    <div className="w-4 h-12 bg-slate-400 dark:bg-[#121212] mt-2 rounded-t"></div>
    <div className="w-16 h-4 bg-slate-50 dark:bg-[#000000]0 dark:bg-[#121212] rounded-t"></div>
    </div>
   </div>

   <div className="mt-8 p-4 bg-yellow-50 dark:bg-[#121212] border border-yellow-200 dark:border-[#1c1b1b] rounded-xl text-yellow-800 dark:text-yellow-200 text-center max-w-xl">
    <h3 className="font-bold flex items-center justify-center gap-2 mb-2"><Zap className="w-5 h-5" />  {t('lab.s6energytransformation_energy_conversion')}</h3>
    <p>
    <strong>{t('lab.s6energytransformation_light_energy')}</strong>  {t('lab.s6energytransformation_from_the_sun_is_converted_into')} <strong>{t('lab.s6energytransformation_electrical_energy')}</strong>  {t('lab.s6energytransformation_by_the_solar_panel_when_the_ci')} <strong>{t('lab.s6energytransformation_mechanical_kinetic_energy')}</strong>  {t('lab.s6energytransformation_to_spin_the_fan_blades')}
                                 </p>
   </div>
   </div>
  )}
  </div>
 </div>
 );
}
