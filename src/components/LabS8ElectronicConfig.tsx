import { useState } from 'react';
import { } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

const ELEMENTS = [
 { symbol: 'Li', name: 'Lithium', group: 'IA', electrons: [2, 1] },
 { symbol: 'Na', name: 'Sodium', group: 'IA', electrons: [2, 8, 1] },
 { symbol: 'K', name: 'Potassium', group: 'IA', electrons: [2, 8, 8, 1] },
 { symbol: 'Be', name: 'Beryllium', group: 'IIA', electrons: [2, 2] },
 { symbol: 'Mg', name: 'Magnesium', group: 'IIA', electrons: [2, 8, 2] },
 { symbol: 'Ca', name: 'Calcium', group: 'IIA', electrons: [2, 8, 8, 2] },
];

export default function LabS8ElectronicConfig({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [selected, setSelected] = useState(ELEMENTS[0]);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s8electronicconfig_act_5_2_electronic_configurati')} subtitle={t('lab.subtitle_group_group_outermost')} />

 <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
 {/* Selection */}
 <div className="w-full md:w-64 flex flex-col gap-4">
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-4">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-3 border-b pb-2">{t('lab.s8electronicconfig_group_ia_alkali')}</h3>
 <div className="flex flex-col gap-2">
 {ELEMENTS.filter(e => e.group === 'IA').map(e => (
 <button 
 key={e.symbol}
 onClick={() => setSelected(e)}
 className={`p-2 text-left rounded-lg font-bold transition-colors ${selected.symbol === e.symbol ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]'}`}
 >
 {e.name} ({e.symbol})
 </button>
 ))}
 </div>
 </div>
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-4">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-3 border-b pb-2">{t('lab.s8electronicconfig_group_iia_alkaline_earth')}</h3>
 <div className="flex flex-col gap-2">
 {ELEMENTS.filter(e => e.group === 'IIA').map(e => (
 <button 
 key={e.symbol}
 onClick={() => setSelected(e)}
 className={`p-2 text-left rounded-lg font-bold transition-colors ${selected.symbol === e.symbol ? 'bg-green-600 text-white' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]'}`}
 >
 {e.name} ({e.symbol})
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Atom Visualizer */}
 <div className="flex-1 bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative lg:overflow-hidden">
 
 <div className="absolute top-6 left-6 text-slate-400 font-mono text-sm">
 
 {t('lab.s8electronicconfig_total_electrons')} {selected.electrons.reduce((a, b) => a + b, 0)}<br/>
 
 {t('lab.s8electronicconfig_configuration')} {selected.electrons.join(', ')}
 </div>

 <div className="relative w-80 h-80 flex items-center justify-center">
 {/* Nucleus */}
 <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-[0_0_20px_rgba(244,63,94,0.5)] dark:bg-[#121212] dark:border-[#1c1b1b]">
 {selected.symbol}
 </div>

 {/* Shells */}
 {selected.electrons.map((count, shellIndex) => {
 const radius = 60 + (shellIndex * 35);
 const isOutermost = shellIndex === selected.electrons.length - 1;

 return (
 <div 
 key={shellIndex}
 className={`absolute rounded-full border border-[#1c1b1b] dark:border-slate-500/50 flex items-center justify-center animate-spin-slow`}
 style={{ 
 width: radius * 2, 
 height: radius * 2,
 animationDuration: `${10 + shellIndex * 5}s`
 }}
 >
 {/* Electrons in this shell */}
 {Array.from({ length: count }).map((_, eIdx) => {
 const angle = (eIdx / count) * Math.PI * 2;
 return (
 <div 
 key={eIdx}
 className={`absolute w-3 h-3 rounded-full ${isOutermost ? (selected.group === 'IA' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]') : 'bg-slate-400 dark:bg-[#121212]'}`}
 style={{
 transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`
 }}
 />
 );
 })}
 </div>
 );
 })}
 </div>

 <div className="mt-12 bg-[#121212] dark:bg-[#121212] border border-[#1c1b1b] dark:border-[#1c1b1b] px-6 py-4 rounded-xl text-center">
 <p className="text-slate-300">
 
 {t('lab.s8electronicconfig_observation')} <strong className={selected.group === 'IA' ? 'text-blue-400' : 'text-green-400'}>{selected.name}</strong> {t('lab.s8electronicconfig_is_in_group')} {selected.group}.
 </p>
 <p className="text-white text-lg font-bold mt-1">
 
 {t('lab.s8electronicconfig_it_has')} {selected.electrons[selected.electrons.length - 1]} {t('lab.s8electronicconfig_electron_s_in_its_outermost_sh')}
 </p>
 </div>

 </div>
 </div>
 </div>
 );
}
