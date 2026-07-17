import { useState } from 'react';
import { CheckCircle, Info, Upload, X } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6Unit1Projects({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [tab, setTab] = useState<'cell' | 'organ'>('cell');
 const [cellType, setCellType] = useState<'animal' | 'plant' | null>(null);
 const [organSystem, setOrganSystem] = useState<string>('');
 const [cellPhoto, setCellPhoto] = useState<string | null>(null);
 const [organPhoto, setOrganPhoto] = useState<string | null>(null);


 const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: (v: string | null) => void) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (ev) => setPhoto(ev.target?.result as string);
 reader.readAsDataURL(file);
 }
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6unit1projects_unit_1_cellular_organization_p')} />

 <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
 
 <div className="flex gap-4 mb-8">
 <button 
 onClick={() => setTab('cell')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'cell' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-indigo-300'}`}
 >
 
 {t('lab.s6unit1projects_activity_1_3_cell_model')}
 </button>
 <button 
 onClick={() => setTab('organ')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'organ' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-teal-300'}`}
 >
 
 {t('lab.s6unit1projects_project_work_organ_system_mode')}
 </button>
 </div>

 {tab === 'cell' && (
 <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
 <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl mb-8 flex gap-4 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
 <Info className="w-6 h-6 shrink-0" />
 <div>
 <h3 className="font-bold">{t('lab.s6unit1projects_group_work_instructions')}</h3>
 <p className="text-sm">{t('lab.s6unit1projects_make_a_physical_model_of_an_an')}</p>
 </div>
 </div>

 <div className="flex gap-8 justify-center mb-8">
 <button onClick={() => setCellType('animal')} className={`p-6 rounded-xl border-4 flex flex-col items-center gap-4 transition-all ${cellType === 'animal' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
 <div className="w-32 h-32 bg-pink-200 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-pink-400 relative flex items-center justify-center">
 <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
 </div>
 <span className="font-bold text-lg text-slate-700 dark:text-[#ffffff]">{t('lab.s6unit1projects_animal_cell')}</span>
 </button>

 <button onClick={() => setCellType('plant')} className={`p-6 rounded-xl border-4 flex flex-col items-center gap-4 transition-all ${cellType === 'plant' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}>
 <div className="w-32 h-32 bg-green-100 border-8 border-green-600 rounded-sm relative flex items-center justify-center">
 <div className="absolute top-2 w-24 h-16 bg-blue-200 rounded-full opacity-60"></div>
 <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-indigo-600"></div>
 </div>
 <span className="font-bold text-lg text-slate-700 dark:text-[#ffffff]">{t('lab.s6unit1projects_plant_cell')}</span>
 </button>
 </div>

 {cellType && (
 <div className="p-6 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl">
 <h4 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6unit1projects_required_labels_for_your_physi')}</h4>
 <div className="grid grid-cols-2 gap-4">
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> {t('lab.s6unit1projects_cell_membrane')}</div>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> {t('lab.s6unit1projects_nucleus')}</div>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> {t('lab.s6unit1projects_cytoplasm')}</div>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> {t('lab.s6unit1projects_mitochondria')}</div>
 {cellType === 'plant' && (
 <>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> {t('lab.s6unit1projects_cell_wall')}</div>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> {t('lab.s6unit1projects_chloroplasts')}</div>
 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> {t('lab.s6unit1projects_large_central_vacuole')}</div>
 </>
 )}
 </div>
 <div className="mt-8 pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
 <input id="cell-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setCellPhoto)} />
 {cellPhoto ? (
 <div className="relative">
 <img src={cellPhoto} alt={t("Uploaded model")} className="w-full max-h-64 object-contain rounded-lg border border-slate-200 dark:border-[#1c1b1b]" />
 <button onClick={() => setCellPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"><X className="w-4 h-4" /></button>
 <p className="text-sm text-emerald-600 font-medium mt-2 text-center">{t('lab.s6unit1projects_photo_uploaded_successfully')}</p>
 </div>
 ) : (
 <label htmlFor="cell-upload" className="block w-full p-6 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer dark:bg-[#121212] dark:border-[#1c1b1b]">
 <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
 <span className="font-medium">{t('lab.s6unit1projects_click_to_upload_a_photo_of_you')}</span>
 </label>
 )}
 </div>
 </div>
 )}
 </div>
 )}

 {tab === 'organ' && (
 <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
 <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-xl mb-8 flex gap-4">
 <Info className="w-6 h-6 shrink-0" />
 <div>
 <h3 className="font-bold">{t('lab.s6unit1projects_project_work_instructions')}</h3>
 <p className="text-sm">{t('lab.s6unit1projects_make_a_model_of_a_human_organ_')}</p>
 </div>
 </div>

 <div className="mb-6">
 <label className="block font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.s6unit1projects_select_organ_system_for_your_p')}</label>
 <select 
 className="w-full p-4 border border-slate-300 dark:border-[#1c1b1b] rounded-xl bg-slate-50 dark:bg-[#121212] font-medium"
 value={organSystem}
 onChange={e => setOrganSystem(e.target.value)}
 >
 <option value="">{t('lab.s6unit1projects_choose_a_system')}</option>
 <option value="digestive">{t('lab.s6unit1projects_digestive_system')}</option>
 <option value="respiratory">{t('lab.s6unit1projects_respiratory_system')}</option>
 <option value="circulatory">{t('lab.s6unit1projects_circulatory_system')}</option>
 <option value="nervous">{t('lab.s6unit1projects_nervous_system')}</option>
 </select>
 </div>

 {organSystem && (
 <div className="p-6 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl mt-8">
 <h4 className="font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6unit1projects_suggested_recycled_materials')}</h4>
 <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-[#a1a1aa] mb-6">
 <li>{t('lab.s6unit1projects_empty_plastic_bottles_for_stom')}</li>
 <li>{t('lab.s6unit1projects_cardboard_tubes_from_paper_tow')}</li>
 <li>{t('lab.s6unit1projects_rubber_tubing_or_old_hoses_for')}</li>
 <li>{t('lab.s6unit1projects_balloons_for_lung_expansion_si')}</li>
 <li>{t('lab.s6unit1projects_colored_yarn_for_nerves')}</li>
 </ul>
 
 <div className="mt-8 pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
 <input id="organ-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setOrganPhoto)} />
 {organPhoto ? (
 <div className="relative">
 <img src={organPhoto} alt={t("Uploaded model")} className="w-full max-h-64 object-contain rounded-lg border border-slate-200 dark:border-[#1c1b1b]" />
 <button onClick={() => setOrganPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"><X className="w-4 h-4" /></button>
 <p className="text-sm text-emerald-600 font-medium mt-2 text-center">{t('lab.s6unit1projects_photo_uploaded_successfully')}</p>
 </div>
 ) : (
 <label htmlFor="organ-upload" className="block w-full p-6 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer dark:bg-[#121212] dark:border-[#1c1b1b]">
 <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
 <span className="font-medium">{t('lab.s6unit1projects_click_to_upload_a_photo_of_you')}</span>
 </label>
 )}
 </div>
 </div>
 )}
 </div>
 )}

 </div>
 </div>
 );
}
