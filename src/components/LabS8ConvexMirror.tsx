import { useState } from 'react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

export default function LabS8ConvexMirror({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [mirrorType, setMirrorType] = useState<'plane' | 'convex'>('convex');

 return (
 <div className="lg:overflow-y-auto flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s8convexmirror_act_9_6_car_rearview_mirror')} subtitle={t('lab.subtitle_convex_plane_mirrors')} />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Selection */}
  <div className="w-full md:w-64 flex flex-col gap-2">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.s8convexmirror_select_mirror')}</h3>
   <button 
   onClick={() => setMirrorType('plane')}
   className={`p-4 text-left rounded-xl font-bold border-2 transition-colors ${mirrorType === 'plane' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
   
                        {t('lab.s8convexmirror_inside_mirror')}
                        <div className="text-xs font-normal opacity-70 mt-1">{t('lab.s8convexmirror_flat_plane_mirror')}</div>
   </button>
   <button 
   onClick={() => setMirrorType('convex')}
   className={`p-4 text-left rounded-xl font-bold border-2 transition-colors ${mirrorType === 'convex' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}
   >
   
                        {t('lab.s8convexmirror_side_passenger_mirror')}
                        <div className="text-xs font-normal opacity-70 mt-1">{t('lab.s8convexmirror_curved_outward_convex')}</div>
   </button>

   <div className="mt-8 bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
    <h4 className="font-bold text-sm text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.s8convexmirror_observations')}</h4>
    <ul className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2 list-disc pl-4">
    {mirrorType === 'plane' ? (
     <>
     <li>{t('lab.s8convexmirror_image_is_true_to_size')}</li>
     <li>{t('lab.s8convexmirror_narrow_field_of_view')}</li>
     <li>{t('lab.s8convexmirror_blind_spots_are_large')}</li>
     </>
    ) : (
     <>
     <li className="text-emerald-600 font-bold">{t('lab.s8convexmirror_image_is_smaller_diminished')}</li>
     <li className="text-emerald-600 font-bold">{t('lab.s8convexmirror_wide_field_of_view')}</li>
     <li>{t('lab.s8convexmirror_objects_in_mirror_are_closer_t')}</li>
     </>
    )}
    </ul>
   </div>
  </div>

  <div className="flex-1 bg-[#121212] dark:!bg-[#121212] rounded-3xl shadow-2xl border-4 border-slate-900 dark:border-[#1c1b1b] p-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
   
   <h2 className="absolute top-4 text-slate-400 font-bold tracking-widest uppercase">{t('lab.s8convexmirror_mirror_view')}</h2>

   {/* The Mirror Frame */}
   <div className={`bg-slate-300 dark:bg-[#121212] border-4 border-slate-950 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${mirrorType === 'plane' ? 'w-[400px] h-[150px] rounded-lg' : 'w-[250px] h-[180px] rounded-[40px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]'}`}>
    
    {/* The Reflection Content */}
    <div className={`absolute flex items-center justify-center transition-all duration-500 ${mirrorType === 'plane' ? 'scale-100' : 'scale-[0.6] w-[200%]'}`}>
    
    {/* Background Road */}
    <div className="absolute w-[800px] h-64 bg-slate-600 dark:bg-[#121212] flex flex-col">
     <div className="h-1/2 bg-sky-300" />
     <div className="h-1/2 bg-slate-600 dark:bg-[#121212] relative flex items-center">
      <div className="w-full border-b-4 border-dashed border-white" />
     </div>
    </div>

    {/* Cars in the reflection */}
    <div className="z-10 flex gap-8 items-end relative top-4">
     <div className="text-[100px] transform -scale-x-100">🚗</div>
     <div className="text-[100px] transform -scale-x-100 mt-10">🚙</div>
     <div className="text-[100px] transform -scale-x-100">🚕</div>
    </div>

    </div>

    {/* Convex Curve Shine Effect */}
    {mirrorType === 'convex' && (
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[40px] pointer-events-none" />
    )}
    
    {/* Disclaimer Text */}
    {mirrorType === 'convex' && (
    <div className="absolute bottom-2 right-4 text-[8px] uppercase tracking-tighter font-bold text-slate-800 dark:text-[#ffffff]/60">
     
                                  {t('lab.s8convexmirror_objects_in_mirror_are_closer')}<br/>{t('lab.s8convexmirror_than_they_appear')}
                                 </div>
    )}
   </div>

  </div>
  </div>
 </div>
 );
}
