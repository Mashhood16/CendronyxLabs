import { useState, useEffect } from 'react';
import { Wind, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6ParticleSimulation({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [simulation, setSimulation] = useState<'none' | 'dissolving' | 'diffusion'>('none');
 const [progress, setProgress] = useState(0); // 0 to 100

 useEffect(() => {
 let interval: any;
 if (simulation !== 'none' && progress < 100) {
 interval = setInterval(() => {
 setProgress(p => Math.min(p + 2, 100));
 }, 100);
 }
 return () => clearInterval(interval);
 }, [simulation, progress]);

 const startDissolving = () => {
 setSimulation('dissolving');
 setProgress(0);
 };

 const startDiffusion = () => {
 setSimulation('diffusion');
 setProgress(0);
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6particlesimulation_unit_5_matter_as_particles')} />

 <div className="flex-1 flex flex-col p-8 items-center">
 <div className="flex gap-4 mb-8">
 <button 
 onClick={startDissolving}
 className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${simulation === 'dissolving' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-blue-300'}`}
 >
 <Droplets className="w-5 h-5" /> {t('lab.s6particlesimulation_dissolving_sugar')}
 </button>
 <button 
 onClick={startDiffusion}
 className={`px-6 py-3 rounded-xl border-2 font-bold flex items-center gap-2 ${simulation === 'diffusion' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-indigo-300'}`}
 >
 <Wind className="w-5 h-5" /> {t('lab.s6particlesimulation_gas_diffusion')}
 </button>
 </div>

 {simulation === 'dissolving' && (
 <div className="w-full max-w-2xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
 <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-[#ffffff]">{t('lab.s6particlesimulation_dissolving_sugar_in_water')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-center mb-8">
 
 {t('lab.s6particlesimulation_watch_as_the_brown_sugar_coati')}
 </p>

 <div className="relative w-64 h-64 border-4 border-blue-200 rounded-b-3xl bg-blue-50/30 overflow-hidden flex items-center justify-center dark:bg-teal-950/20 dark:border-teal-900">
 {/* Water */}
 <div className="absolute bottom-0 w-full h-48 bg-blue-100/50 border-t border-blue-200 flex flex-wrap content-start pt-4 px-2 gap-1 justify-center">
 {/* Dissolved particles spread out based on progress */}
 {[...Array(Math.floor(progress / 2))].map((_, i) => (
 <div key={i} className="w-2 h-2 rounded-full bg-amber-600 opacity-60"></div>
 ))}
 </div>

 {/* Candy */}
 <div className="absolute bottom-4 flex items-center justify-center">
 {/* Chocolate center */}
 <div className="w-16 h-12 bg-amber-900 rounded-full shadow-inner absolute"></div>
 {/* Sugar coating shrinking */}
 <div 
 className="w-20 h-16 bg-amber-600 rounded-full transition-all duration-100 ease-linear"
 style={{ transform: `scale(${1 - (progress / 100)})`, opacity: 1 - (progress / 100) }}
 ></div>
 </div>
 </div>

 <div className="mt-8 w-full bg-slate-100 dark:bg-[#121212] h-2 rounded-full overflow-hidden">
 <div className="h-full bg-blue-500 dark:bg-teal-950/20 dark:border-teal-900" style={{ width: `${progress}%` }}></div>
 </div>
 {progress === 100 && <p className="mt-4 text-blue-600 font-bold">{t('lab.s6particlesimulation_dissolving_complete_the_sugar_')}</p>}
 </div>
 )}

 {simulation === 'diffusion' && (
 <div className="w-full max-w-2xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
 <h2 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-[#ffffff]">{t('lab.s6particlesimulation_diffusion_of_air_freshener')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-center mb-8">
 
 {t('lab.s6particlesimulation_gas_particles_move_quickly_and')}
 </p>

 <div className="relative w-96 h-64 border-2 border-slate-300 dark:border-[#1c1b1b] rounded bg-slate-50 dark:bg-[#121212] overflow-hidden">
 {/* Spray nozzle */}
 <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">{t('lab.s6particlesimulation_spray_corner')}</div>
 
 {/* Particles spreading */}
 {[...Array(100)].map((_, i) => {
 // Initial position: top-left corner
 // Final position: random everywhere
 const initialX = Math.random() * 20;
 const initialY = Math.random() * 20;
 
 const finalX = Math.random() * 380;
 const finalY = Math.random() * 240;

 const currentX = initialX + ((finalX - initialX) * (progress / 100));
 const currentY = initialY + ((finalY - initialY) * (progress / 100));

 return (
 <div 
 key={i} 
 className="absolute w-3 h-3 rounded-full bg-indigo-500/60 transition-all duration-100 dark:bg-[#121212] dark:border-[#1c1b1b]"
 style={{ left: currentX, top: currentY }}
 ></div>
 );
 })}
 </div>

 <div className="mt-8 w-full bg-slate-100 dark:bg-[#121212] h-2 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ width: `${progress}%` }}></div>
 </div>
 {progress === 100 && <p className="mt-4 text-indigo-600 font-bold">{t('lab.s6particlesimulation_diffusion_complete_equilibrium')}</p>}
 </div>
 )}

 {simulation === 'none' && (
 <div className="text-center text-slate-500 dark:text-[#71717a] mt-12">
 
 {t('lab.s6particlesimulation_select_a_simulation_above_to_o')}
 </div>
 )}
 </div>
 </div>
 );
}
