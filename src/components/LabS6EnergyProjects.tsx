import { useState } from 'react';
import { Activity, Image as ImageIcon, CheckSquare } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6EnergyProjects({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeProject, setActiveProject] = useState<'windmill' | 'rollercoaster'>('windmill');
 
 // Example checklist state
 const [checks, setChecks] = useState<Record<string, boolean>>({});

 const toggleCheck = (id: string) => {
 setChecks({ ...checks, [id]: !checks[id] });
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6energyprojects_unit_8_energy_projects')} />

 <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
 
 <div className="flex gap-4 mb-8">
 <button 
 onClick={() => setActiveProject('windmill')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${activeProject === 'windmill' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-indigo-300'}`}
 >
 
 {t('lab.s6energyprojects_project_model_windmill')}
 </button>
 <button 
 onClick={() => setActiveProject('rollercoaster')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${activeProject === 'rollercoaster' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-indigo-300'}`}
 >
 
 {t('lab.s6energyprojects_project_roller_coaster_energy')}
 </button>
 </div>

 <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
 
 {activeProject === 'windmill' && (
 <div className="space-y-8">
 <div className="flex gap-4 items-start bg-indigo-50 dark:bg-[#121212] border border-indigo-200 dark:border-[#1c1b1b] p-6 rounded-xl">
 <Activity className="w-8 h-8 text-indigo-600 shrink-0 mt-1" />
 <div>
 <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">{t('lab.s6energyprojects_build_a_working_windmill')}</h2>
 <p className="text-slate-700 dark:text-[#ffffff] text-sm leading-relaxed">
 
 {t('lab.s6energyprojects_construct_a_model_windmill_usi')}
 </p>
 </div>
 </div>

 <div>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><CheckSquare /> {t('lab.s6energyprojects_construction_checklist')}</h3>
 <div className="space-y-3 bg-slate-50 dark:bg-[#121212] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
 {['Cut a square piece of paper', 'Cut diagonally from corners towards center', 'Fold alternating corners to the center', 'Pin the center to a wooden stick', 'Blow on the windmill to test'].map((step, i) => (
 <label key={i} className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 className="w-5 h-5 rounded border-slate-300 dark:border-[#1c1b1b] text-indigo-600 focus:ring-indigo-500" 
 checked={checks[`wind_${i}`] || false}
 onChange={() => toggleCheck(`wind_${i}`)}
 />
 <span className={`text-slate-700 dark:text-[#ffffff] ${checks[`wind_${i}`] ? 'line-through text-slate-400' : ''}`}>{step}</span>
 </label>
 ))}
 </div>
 </div>

 <div className="border-t border-slate-200 dark:border-[#1c1b1b] pt-8">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6energyprojects_submission')}</h3>
 <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl hover:bg-slate-50 dark:bg-[#121212] transition-colors cursor-pointer">
 <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
 <span className="font-medium">{t('lab.s6energyprojects_upload_a_video_of_your_windmil')}</span>
 </div>
 </div>
 </div>
 )}

 {activeProject === 'rollercoaster' && (
 <div className="space-y-8">
 <div className="flex gap-4 items-start bg-indigo-50 dark:bg-[#121212] border border-indigo-200 dark:border-[#1c1b1b] p-6 rounded-xl">
 <Activity className="w-8 h-8 text-indigo-600 shrink-0 mt-1" />
 <div>
 <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">{t('lab.s6energyprojects_design_a_roller_coaster_track')}</h2>
 <p className="text-slate-700 dark:text-[#ffffff] text-sm leading-relaxed">
 
 {t('lab.s6energyprojects_use_foam_pipe_insulation_or_ca')}
 </p>
 </div>
 </div>

 <div>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><CheckSquare /> {t('lab.s6energyprojects_project_requirements')}</h3>
 <div className="space-y-3 bg-slate-50 dark:bg-[#121212] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
 {['Track has a steep starting hill (Max PE)', 'Track includes a loop (Requires high KE)', 'Marble successfully completes the track without falling off', 'Created labels for "High PE" and "High KE"'].map((step, i) => (
 <label key={i} className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 className="w-5 h-5 rounded border-slate-300 dark:border-[#1c1b1b] text-indigo-600 focus:ring-indigo-500" 
 checked={checks[`roller_${i}`] || false}
 onChange={() => toggleCheck(`roller_${i}`)}
 />
 <span className={`text-slate-700 dark:text-[#ffffff] ${checks[`roller_${i}`] ? 'line-through text-slate-400' : ''}`}>{step}</span>
 </label>
 ))}
 </div>
 </div>

 <div className="border-t border-slate-200 dark:border-[#1c1b1b] pt-8">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6energyprojects_submission')}</h3>
 <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl hover:bg-slate-50 dark:bg-[#121212] transition-colors cursor-pointer">
 <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
 <span className="font-medium">{t('lab.s6energyprojects_upload_a_video_of_your_marble_')}</span>
 </div>
 </div>
 </div>
 )}

 </div>
 </div>
 </div>
 );
}
