import { useState } from 'react';
import { ArrowRight, Droplet, Sun, CheckCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabC11EnvironmentalChem({ onExit }: Props) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // State for Water Treatment
 const [treatmentSteps, setTreatmentSteps] = useState<string[]>([]);
 const availableSteps = ['Filtration', 'Chlorination', 'Coagulation', 'Sedimentation'];
 const correctSequence = ['Coagulation', 'Sedimentation', 'Filtration', 'Chlorination'];

 // State for Smog
 const [sunlight, setSunlight] = useState<number>(50);
 const [vocs, setVocs] = useState<number>(50);
 const [nox, setNox] = useState<number>(50);
 
 const [activeTab, setActiveTab] = useState<'water' | 'smog'>('water');

 // Assessment state
 const [chlorineVolume, setChlorineVolume] = useState<string>('');
 const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);
 const [targetDose] = useState<number>(4); // 4 mg/L typical
 const [waterVolume] = useState<number>(100); // 100 ML typical

 const handleAddStep = (step: string) => {
 if (!treatmentSteps.includes(step)) {
 setTreatmentSteps([...treatmentSteps, step]);
 }
 };

 const resetTreatment = () => {
 setTreatmentSteps([]);
 };

 const checkTreatment = () => {
 if (treatmentSteps.length !== 4) return false;
 return treatmentSteps.every((step, index) => step === correctSequence[index]);
 };

 const calculateOzone = () => {
 // Arbitrary model for photochemical smog severity
 return Math.min(100, Math.max(0, (sunlight * 0.5) + (vocs * 0.3) + (nox * 0.2)));
 };

 const checkAssessment = () => {
 // calculate mass = dose * volume
 const correctMass = targetDose * waterVolume; // kg
 if (Math.abs(parseFloat(chlorineVolume) - correctMass) < 0.1) {
 setAssessmentFeedback("Correct! The required mass of chlorine is calculated correctly.");
 } else {
 setAssessmentFeedback(`Incorrect. Hint: Mass (kg) = Dose (mg/L) * Volume (ML). Check your units!`);
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 {/* Header */}
 <LabHeader onExit={onExit} title={t('lab.c11environmentalchem_environmental_chemistry_lab')} />

 {/* Main Grid */}
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c11environmentalchem_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c11environmentalchem_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-hidden">
 
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
 <Info className="w-5 h-5 text-emerald-600" /> {t('lab.c11environmentalchem_theory_setup')}
 </h2>
 
 <div className="space-y-4 text-sm text-slate-700 dark:text-[#ffffff]">
 <div className={`p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex-col `}>
 <h3 className="font-semibold text-emerald-800 mb-2">{t('lab.c11environmentalchem_water_treatment')}</h3>
 <p>{t('lab.c11environmentalchem_municipal_water_treatment_ensu')}</p>
 <ul className="list-disc pl-5 mt-2 space-y-1">
 <li><strong>{t('lab.c11environmentalchem_coagulation')}</strong> {t('lab.c11environmentalchem_alum_is_added_to_neutralize_ch')}</li>
 <li><strong>{t('lab.c11environmentalchem_sedimentation')}</strong> {t('lab.c11environmentalchem_flocs_settle_to_the_bottom_due')}</li>
 <li><strong>{t('lab.c11environmentalchem_filtration')}</strong> {t('lab.c11environmentalchem_water_passes_through_sand_grav')}</li>
 <li><strong>{t('lab.c11environmentalchem_chlorination')}</strong> {t('lab.c11environmentalchem_disinfection_kills_remaining_p')}</li>
 </ul>
 </div>

 <div className={`p-3 bg-orange-50 rounded-lg border border-orange-100 flex-col `}>
 <h3 className="font-semibold text-orange-800 mb-2">{t('lab.c11environmentalchem_photochemical_smog')}</h3>
 <p>{t('lab.c11environmentalchem_smog_forms_when_nitrogen_oxide')}</p>
 <p className={`mt-2 text-xs font-mono bg-slate-50 dark:bg-[#121212] p-2 rounded flex-col `}>
 
 {t('lab.c11environmentalchem_no2_hv_no_o')}<br/>
 
 {t('lab.c11environmentalchem_o_o2_o3_ozone')}<br/>
 
 {t('lab.c11environmentalchem_no2_vocs_pan_peroxyacetyl_nitr')}
 </p>
 </div>
 </div>
 </div>

 {/* Column 2: Interactive Simulator */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex gap-2 mb-4 border-b pb-2">
 <button 
 onClick={() => setActiveTab('water')}
 className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'water' ? 'bg-emerald-100 text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 
 {t('lab.c11environmentalchem_water_treatment')}
 </button>
 <button 
 onClick={() => setActiveTab('smog')}
 className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'smog' ? 'bg-orange-100 text-orange-800 border-b-2 border-orange-600' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 
 {t('lab.c11environmentalchem_smog_visualizer')}
 </button>
 </div>

 {activeTab === 'water' && (
 <div className="flex-1 flex flex-col">
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c11environmentalchem_sequence_the_treatment_plant')}</h3>
 <p className="text-sm text-slate-500 dark:text-[#71717a] mb-4">{t('lab.c11environmentalchem_click_the_steps_in_the_correct')}</p>
 
 <div className="flex gap-2 mb-6 flex-wrap">
 {availableSteps.map(step => (
 <button 
 key={step}
 onClick={() => handleAddStep(step)}
 disabled={treatmentSteps.includes(step)}
 className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded shadow-sm hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
 >
 + {step}
 </button>
 ))}
 </div>

 <div className={`bg-slate-100 dark:bg-[#121212] rounded-xl p-4 flex-1 flex flex-col justify-center items-center relative border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] min-h-[200px] `}>
 {treatmentSteps.length === 0 ? (
 <span className="text-slate-400">{t('lab.c11environmentalchem_plant_sequence_empty')}</span>
 ) : (
 <div className="flex items-center gap-2 max-w-full overflow-x-auto p-4">
 <Droplet className="w-8 h-8 text-blue-400 animate-bounce shrink-0" />
 {treatmentSteps.map((step, idx) => (
 <div key={idx} className="flex items-center shrink-0">
 {idx > 0 && <ArrowRight className="w-5 h-5 text-slate-400 mx-2" />}
 <div className="bg-slate-50 dark:!bg-[#121212] border-2 border-emerald-500 rounded-lg p-3 text-center shadow-md animate-in fade-in zoom-in duration-300">
 <span className="font-bold text-emerald-700 text-sm">{step}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="mt-4 flex justify-between items-center">
 <button onClick={resetTreatment} className="flex items-center gap-1 text-slate-500 dark:text-[#71717a] hover:text-slate-700 dark:text-[#ffffff] text-sm">
 <RefreshCw className="w-4 h-4" /> {t('lab.c11environmentalchem_reset')}
 </button>
 {treatmentSteps.length === 4 && (
 <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg ${checkTreatment() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
 {checkTreatment() ? <><CheckCircle className="w-4 h-4" /> {t('lab.c11environmentalchem_correct_sequence')}</> : <><AlertCircle className="w-4 h-4" /> {t('lab.c11environmentalchem_incorrect_sequence')}</>}
 </div>
 )}
 </div>
 </div>
 )}

 {activeTab === 'smog' && (
 <div className="flex-1 flex flex-col">
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.c11environmentalchem_photochemical_smog_simulator')}</h3>
 
 <div className="space-y-4 mb-6">
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.c11environmentalchem_sunlight_intensity')}</span>
 <span>{sunlight}%</span>
 </label>
 <input type="range" min="0" max="100" value={sunlight} onChange={e => setSunlight(Number(e.target.value))} className="w-full accent-yellow-500" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.c11environmentalchem_vocs_unburned_fuel_solvents')}</span>
 <span>{vocs}%</span>
 </label>
 <input type="range" min="0" max="100" value={vocs} onChange={e => setVocs(Number(e.target.value))} className="w-full accent-orange-500" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.c11environmentalchem_nox_vehicle_exhaust')}</span>
 <span>{nox}%</span>
 </label>
 <input type="range" min="0" max="100" value={nox} onChange={e => setNox(Number(e.target.value))} className="w-full accent-red-500" />
 </div>
 </div>

 <div className="bg-sky-100 rounded-xl flex-1 relative overflow-hidden flex items-end justify-center border border-sky-200 min-h-[200px]">
 {/* Sun */}
 <div className="absolute top-4 right-4 transition-all duration-300 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block" style={{ opacity: sunlight / 100, transform: `scale(${0.5 + sunlight / 100})` }}>
 <Sun className="w-16 h-16 text-yellow-400 fill-yellow-400" />
 </div>
 
 {/* Cityscape */}
 <div className="w-full h-1/3 bg-[#121212] dark:bg-[#121212] flex items-end justify-around px-4">
 <div className="w-8 h-24 bg-slate-700 dark:bg-[#121212]" />
 <div className="w-12 h-32 bg-slate-600 dark:bg-[#121212]" />
 <div className="w-10 h-16 bg-slate-700 dark:bg-[#121212]" />
 <div className="w-16 h-20 bg-slate-50 dark:bg-[#000000]0 dark:bg-[#121212]" />
 <div className="w-8 h-28 bg-slate-700 dark:bg-[#121212]" />
 </div>

 {/* Smog Layer */}
 <div 
 className="absolute bottom-0 left-0 right-0 h-2/3 bg-orange-500 transition-all duration-500 pointer-events-none mix-blend-multiply"
 style={{ opacity: calculateOzone() / 150 }}
 />

 {/* Indicator */}
 <div className="absolute top-4 left-4 bg-slate-50 dark:bg-[#121212]/80 p-2 rounded shadow backdrop-blur-sm text-sm font-bold text-slate-800 dark:text-[#ffffff]">
 
 {t('lab.c11environmentalchem_ozone_pan_level')} {calculateOzone().toFixed(0)} {t('lab.c11environmentalchem_aqi')}
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Column 3: Analysis/Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
 <CheckCircle className="w-5 h-5 text-emerald-600" /> {t('lab.c11environmentalchem_analysis_assessment')}
 </h2>
 
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] mb-4 shrink-0 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c11environmentalchem_water_plant_operations_log')}</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead>
 <tr className="border-b border-slate-300 dark:border-[#1c1b1b]">
 <th className="py-2">{t('lab.c11environmentalchem_step')}</th>
 <th className="py-2">{t('lab.c11environmentalchem_process')}</th>
 <th className="py-2">{t('lab.c11environmentalchem_status')}</th>
 </tr>
 </thead>
 <tbody>
 {[0, 1, 2, 3].map((i) => (
 <tr key={i} className="border-b border-slate-100">
 <td className="py-2">{i + 1}</td>
 <td className="py-2">{treatmentSteps[i] || '-'}</td>
 <td className="py-2">
 {treatmentSteps[i] === correctSequence[i] ? (
 <span className="text-green-600">{t('lab.c11environmentalchem_optimal')}</span>
 ) : treatmentSteps[i] ? (
 <span className="text-red-500">{t('lab.c11environmentalchem_error')}</span>
 ) : '-'}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1c1b1b] shrink-0">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c11environmentalchem_chlorination_calculation')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.c11environmentalchem_a_water_treatment_plant_proces')} <strong>{waterVolume} ML</strong> {t('lab.c11environmentalchem_megaliters_of_water_per_day_th')} <strong>{targetDose} {t('lab.c11environmentalchem_mg_l')}</strong>{t('lab.c11environmentalchem_calculate_the_mass_of_chlorine')} <strong>{t('lab.c11environmentalchem_kg_day')}</strong>.
 </p>
 <div className="flex gap-2">
 <input 
 type="number" 
 value={chlorineVolume}
 onChange={e => setChlorineVolume(e.target.value)}
 placeholder={t('lab.c11environmentalchem_mass_in_kg')} 
 className="flex-1 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0"
 />
 <button 
 onClick={checkAssessment}
 className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 
 {t('lab.c11environmentalchem_check')}
 </button>
 </div>
 {assessmentFeedback && (
 <div className={`mt-3 p-3 rounded text-sm font-medium ${assessmentFeedback.includes('Correct') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
 {assessmentFeedback}
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
