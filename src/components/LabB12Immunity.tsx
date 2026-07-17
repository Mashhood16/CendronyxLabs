import { useState, useEffect } from 'react';
import { Shield, FlaskConical, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB12Immunity({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [elisaStep, setElisaStep] = useState<number>(0);
 const [absorbance, setAbsorbance] = useState<number>(0);
 const [assessmentConc, setAssessmentConc] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const elisaStages = [
 { name: 'Empty Well', desc: 'Starting with a clean microtiter well.' },
 { name: 'Add Sample', desc: 'Patient sample added. Target antigens bind to the well surface.' },
 { name: 'Add Primary mAb', desc: 'Monoclonal antibodies specific to the antigen are added and bind.' },
 { name: 'Add Secondary mAb', desc: 'Enzyme-linked secondary antibodies bind to the primary mAbs.' },
 { name: 'Add Substrate', desc: 'Substrate is added. Enzyme converts it to a colored product. Color intensity = Antigen concentration.' }
 ];

 useEffect(() => {
 // Generate a random absorbance between 0.5 and 1.5 when component mounts
 const abs = 0.5 + Math.random();
 setAbsorbance(parseFloat(abs.toFixed(2)));
 }, []);

 const handleNextStep = () => {
 if (elisaStep < 4) {
 setElisaStep(elisaStep + 1);
 }
 };

 const handleReset = () => {
 setElisaStep(0);
 setIsCorrect(null);
 setAssessmentConc('');
 const abs = 0.5 + Math.random();
 setAbsorbance(parseFloat(abs.toFixed(2)));
 };

 const handleCheckAnswer = () => {
 // Formula: A = 0.15 * C + 0.05
 // C = (A - 0.05) / 0.15
 const correctC = (absorbance - 0.05) / 0.15;
 const val = parseFloat(assessmentConc);
 if (!isNaN(val) && Math.abs(val - correctC) < 0.2) {
 setIsCorrect(true);
 } else {
 setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.b12immunity_interactive_immunology')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.b12immunity_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.b12immunity_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow min-h-0 lg:overflow-hidden">
 
 {/* Theory Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <Shield className="mr-2 text-blue-500" /> {t('lab.b12immunity_theory_mechanisms')}
 </h2>
 <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
 <div className={`p-4 bg-indigo-50 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
 <h3 className="font-semibold text-indigo-800 mb-2 dark:text-[#ffffff]">{t('lab.b12immunity_monoclonal_antibodies_mabs')}</h3>
 <p>
 
 {t('lab.b12immunity_mabs_are_laboratory_produced_m')} <strong>{t('lab.b12immunity_elisa')}</strong> {t('lab.b12immunity_enzyme_linked_immunosorbent_as')}
 </p>
 </div>
 
 <div className={`p-4 bg-teal-50 rounded-lg border border-teal-100 flex-col `}>
 <h3 className="font-semibold text-teal-800 mb-2">{t('lab.b12immunity_organ_transplant_rejection')}</h3>
 <p>
 
 {t('lab.b12immunity_after_an_organ_transplant_the_')}
 <strong>{t('lab.b12immunity_immunosuppressants')}</strong> {t('lab.b12immunity_like_cyclosporine_inhibit_t_ce')}
 </p>
 </div>
 </div>
 </div>

 {/* Simulation Column */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex w-full">
 <FlaskConical className="mr-2 text-indigo-500" /> {t('lab.b12immunity_elisa_simulator')}
 </h2>
 
 <div className="flex-grow flex flex-col items-center justify-center w-full space-y-6">
 <div className="text-center h-16">
 <h3 className="font-bold text-indigo-700 text-lg">{elisaStages[elisaStep].name}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] max-w-xs">{elisaStages[elisaStep].desc}</p>
 </div>

 {/* SVG ELISA Well */}
 <div className="relative w-48 h-48 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-4 border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-b-3xl shadow-inner flex flex-col justify-end ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 
 {/* Colored liquid */}
 <div 
 className={`absolute bottom-0 w-full transition-all duration-1000 ease-in-out ${elisaStep === 4 ? 'bg-yellow-400 opacity-80' : 'bg-blue-100 opacity-0'}`}
 style={{ height: elisaStep >= 1 ? '70%' : '0%' }}
 ></div>

 {/* Molecular structures inside well (simplified) */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
 {/* Antigens */}
 {elisaStep >= 1 && (
 <g fill="#EF4444">
 <circle cx="20" cy="85" r="4" />
 <circle cx="50" cy="85" r="4" />
 <circle cx="80" cy="85" r="4" />
 </g>
 )}
 {/* Primary mAbs */}
 {elisaStep >= 2 && (
 <g stroke="#3B82F6" strokeWidth="2" fill="none">
 <path d="M 20 81 L 20 70 L 15 65 M 20 70 L 25 65" />
 <path d="M 50 81 L 50 70 L 45 65 M 50 70 L 55 65" />
 <path d="M 80 81 L 80 70 L 75 65 M 80 70 L 85 65" />
 </g>
 )}
 {/* Secondary mAbs with Enzyme */}
 {elisaStep >= 3 && (
 <g>
 <g stroke="#10B981" strokeWidth="2" fill="none">
 <path d="M 15 65 L 10 55 M 15 65 L 20 55 L 20 50" />
 <path d="M 45 65 L 40 55 M 45 65 L 50 55 L 50 50" />
 <path d="M 75 65 L 70 55 M 75 65 L 80 55 L 80 50" />
 </g>
 <g fill="#F59E0B">
 <circle cx="20" cy="48" r="3" />
 <circle cx="50" cy="48" r="3" />
 <circle cx="80" cy="48" r="3" />
 </g>
 </g>
 )}
 </svg>
 </div>

 <div className="flex space-x-4">
 <button 
 onClick={handleNextStep}
 disabled={elisaStep === 4}
 className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.b12immunity_next_step')}
 </button>
 <button 
 onClick={handleReset}
 className="px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-semibold hover:bg-slate-300 dark:bg-[#121212]"
 >
 
 {t('lab.b12immunity_reset')}
 </button>
 </div>
 
 {elisaStep === 4 && (
 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 font-bold">
 
 {t('lab.b12immunity_spectrophotometer_reading')} {absorbance} AU
 </div>
 )}
 </div>
 </div>

 {/* Assessment Column */}
 <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <Stethoscope className="mr-2 text-rose-500" /> {t('lab.b12immunity_clinical_assessment')}
 </h2>
 
 <div className="flex-grow space-y-6">
 <div className="p-4 bg-slate-100 dark:bg-[#121212] rounded-lg text-sm text-slate-700 dark:text-[#ffffff]">
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.b12immunity_determine_antigen_concentratio')}</h3>
 <p className="mb-2">
 
 {t('lab.b12immunity_a_standard_curve_was_generated')}
 </p>
 <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-300 dark:border-[#1c1b1b] font-mono text-center my-2 text-indigo-700">
 
 {t('lab.b12immunity_absorbance_a_0_15_c_0_05')}
 </div>
 <p>{t('lab.b12immunity_where')} <strong>C</strong> {t('lab.b12immunity_is_the_concentration_of_the_bi')}</p>
 
 {elisaStep === 4 ? (
 <p className="mt-3 font-semibold text-rose-700">
 
 {t('lab.b12immunity_given_the_patient_s_absorbance')} {absorbance} {t('lab.b12immunity_au_calculate_c')}
 </p>
 ) : (
 <p className="mt-3 text-slate-500 dark:text-[#71717a] italic">
 
 {t('lab.b12immunity_complete_the_elisa_simulation_')}
 </p>
 )}
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wide mb-1">
 
 {t('lab.b12immunity_concentration_ng_ml')}
 </label>
 <div className="flex space-x-2">
 <input 
 type="number"
 step="0.01"
 className="flex-grow p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
 placeholder={t('lab.b12immunity_e_g_5_2')}
 value={assessmentConc}
 onChange={(e) => setAssessmentConc(e.target.value)}
 disabled={elisaStep < 4}
 />
 <button 
 onClick={handleCheckAnswer}
 disabled={elisaStep < 4 || !assessmentConc}
 className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.b12immunity_check')}
 </button>
 </div>
 </div>

 {isCorrect !== null && (
 <div className={`p-4 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
 {isCorrect ? <CheckCircle className="mt-0.5" size={20} /> : <XCircle className="mt-0.5" size={20} />}
 <div>
 <h4 className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
 <p className="text-sm mt-1">
 {isCorrect 
 ? `Excellent. C = (${absorbance} - 0.05) / 0.15 = ${((absorbance - 0.05) / 0.15).toFixed(2)} ng/mL.` 
 : 'Review your algebra: subtract 0.05 from the absorbance, then divide by 0.15.'}
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}
