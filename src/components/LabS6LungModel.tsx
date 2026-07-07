import { useState } from 'react';
import { Wind, Info, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6LungModel({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [inhale, setInhale] = useState(false);

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s6lungmodel_unit_4_working_model_of_lungs')} />

  <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
  <div className="w-full max-w-5xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex gap-8">
   
   <div className="flex-1">
    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl mb-8 flex gap-4">
    <Info className="w-8 h-8 shrink-0 mt-1" />
    <div>
     <h2 className="font-bold text-lg mb-2">{t('lab.s6lungmodel_build_a_breathing_model')}</h2>
     <p className="text-sm leading-relaxed mb-4">
     
                                      {t('lab.s6lungmodel_in_this_project_you_will_build')}
                                      </p>
     <ul className="list-disc pl-5 text-sm space-y-1 font-medium">
     <li>{t('lab.s6lungmodel_plastic_bottle_chest_cavity')}</li>
     <li>{t('lab.s6lungmodel_y_tube_trachea_bronchi')}</li>
     <li>{t('lab.s6lungmodel_small_balloons_lungs')}</li>
     <li>{t('lab.s6lungmodel_rubber_sheet_balloon_diaphragm')}</li>
     </ul>
    </div>
    </div>

    <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-xl p-6">
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6lungmodel_upload_assignment')}</h3>
    <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl mb-4 bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] transition-colors cursor-pointer">
     <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
     <span className="font-medium text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6lungmodel_upload_a_video_or_photo_of_you')}</span>
    </div>
    <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">{t('lab.s6lungmodel_submit_project')}</button>
    </div>
   </div>

   <div className="w-96 bg-slate-100 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2 text-center">{t('lab.s6lungmodel_interactive_diagram')}</h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] text-center mb-8">{t('lab.s6lungmodel_pull_the_diaphragm_down_to_inh')}</p>

    <div className="relative w-48 h-64 mb-8">
    {/* Trachea (Y-tube main) */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-300 dark:bg-[#121212] border-x-2 border-slate-400 dark:border-[#1c1b1b] z-10"></div>
    
    {/* Bottle */}
    <div className="absolute top-12 w-full h-48 border-4 border-slate-300 dark:border-[#1c1b1b]/50 rounded-t-[40px] bg-blue-50/20 overflow-hidden shadow-inner dark:bg-teal-950/20 dark:border-teal-900">
     
     {/* Bronchi (Y-tube branches) */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-12 border-t-4 border-l-4 border-r-4 border-slate-400 dark:border-[#1c1b1b] rounded-t-xl z-10"></div>

     {/* Lungs (Balloons) */}
     <div className={`absolute top-10 left-[20px] w-16 bg-pink-400 rounded-full transition-all duration-300 shadow-inner ${inhale ? 'h-24 scale-110' : 'h-16 scale-90'}`}></div>
     <div className={`absolute top-10 right-[20px] w-16 bg-pink-400 rounded-full transition-all duration-300 shadow-inner ${inhale ? 'h-24 scale-110' : 'h-16 scale-90'}`}></div>

     {/* Air entering/exiting */}
     {inhale && (
     <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-400 animate-bounce z-20">
      <Wind className="w-8 h-8 rotate-90" />
     </div>
     )}

     {/* Diaphragm (Rubber sheet) */}
     <div 
     className={`absolute bottom-0 w-full bg-red-500 transition-all duration-300 cursor-pointer hover:bg-red-600 flex items-center justify-center ${inhale ? 'h-8 rounded-t-none' : 'h-16 rounded-t-[100%]'}`}
     onMouseDown={() => setInhale(true)}
     onMouseUp={() => setInhale(false)}
     onMouseLeave={() => setInhale(false)}
     onTouchStart={() => setInhale(true)}
     onTouchEnd={() => setInhale(false)}
     >
     <span className="text-white text-xs font-bold pointer-events-none mt-2">{t('lab.s6lungmodel_pull_me')}</span>
     </div>
    </div>
    </div>

    <div className="text-center bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b] w-full">
    <span className="block font-bold text-slate-800 dark:text-[#ffffff] text-lg mb-1">{inhale ? 'Inhalation' : 'Exhalation'}</span>
    <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">
     {inhale 
     ? "Diaphragm contracts (moves down). Volume increases, pressure drops. Air rushes IN." 
     : "Diaphragm relaxes (moves up). Volume decreases, pressure rises. Air pushed OUT."}
    </span>
    </div>

   </div>

  </div>
  </div>
 </div>
 );
}
