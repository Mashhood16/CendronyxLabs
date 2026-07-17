import { useState } from 'react';
import { Info, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';
import DataChart from './DataChart';
import ProgressionPath from './ProgressionPath';
import { addMeasurementNoise } from '../utils/measurementNoise';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7TranspirationLeaves({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [upperColor, setUpperColor] = useState('blue');
 const [lowerColor, setLowerColor] = useState('blue');
 const [tested, setTested] = useState(false);
 const [dataLog, setDataLog] = useState<{ time: number; waterLoss: number }[]>([]);
 const [runCount, setRunCount] = useState(0);

 const runTest = () => {
 // Stomata are primarily on the lower surface. Upper surface has fewer/none depending on the plant.
 setTested(true);
 setTimeout(() => {
 setLowerColor('pink'); // Water vapour turns dry cobalt chloride paper pink
 setTimeout(() => {
 setUpperColor('blue'); // Stays blue or turns slightly pink much slower (simulated as staying blue for contrast)
 }, 1000);
 }, 500);
 };

 const reset = () => {
 setTested(false);
 setUpperColor('blue');
 setLowerColor('blue');
 };

 const handleRecord = () => {
 const t = dataLog.length + 1;
 // Simulate water loss: more from lower surface, less from upper
 const baseLoss = t * 2.5;
 const lowerLoss = addMeasurementNoise(baseLoss * 1.8, t, 5);
 const upperLoss = addMeasurementNoise(baseLoss * 0.3, t + 100, 8);
 const totalLoss = parseFloat((lowerLoss + upperLoss).toFixed(1));
 setDataLog(prev => [...prev, { time: t * 10, waterLoss: totalLoss }]);
 setRunCount(prev => prev + 1);
 };

 const resetData = () => {
 setDataLog([]);
 setRunCount(0);
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s7transpirationleaves_unit_1_transpiration_from_leav')} />

 <div className="flex-1 p-8 flex flex-col items-center">
 <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full text-center mb-8">
 <h2 className="text-2xl font-bold text-blue-800 mb-4 dark:text-[#ffffff]">{t('lab.s7transpirationleaves_stomata_and_water_vapour')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.s7transpirationleaves_attach_dry_blue_cobalt_chlorid')}</p>
 
 <div className="flex justify-center gap-4">
 <button 
 onClick={runTest}
 disabled={tested}
 className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.s7transpirationleaves_wait_1_hour')}
 </button>
 <button 
 onClick={reset}
 className="flex items-center px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium"
 >
 
 {t('lab.s7transpirationleaves_reset')}
 </button>
 </div>
 </div>

 <div className="flex gap-16 justify-center mt-8">
 {/* Upper Surface View */}
 <div className="flex flex-col items-center">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.s7transpirationleaves_leaf_upper_surface')}</h3>
 <div className="relative w-48 h-64 bg-green-500 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-md border-t border-green-400 flex items-center justify-center dark:!bg-[#121212] dark:border-[#1c1b1b]">
 <div className="w-1 h-full bg-green-600 absolute"></div> {/* Midrib */}
 {/* Tape & Paper */}
 <div className="w-24 h-12 bg-slate-50 dark:bg-[#121212]/30 backdrop-blur-sm border border-white/50 absolute rotate-[-10deg] flex items-center justify-center z-10 shadow-sm">
 {/* Cobalt Paper */}
 <div className={`w-16 h-8 transition-colors duration-1000 border border-slate-300 dark:border-[#1c1b1b] ${upperColor === 'blue' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
 </div>
 </div>
 <div className="mt-4 font-medium text-slate-500 dark:text-[#71717a]">
 
 {t('lab.s7transpirationleaves_color')} {upperColor === 'blue' ? <span className="text-blue-600">{t('lab.s7transpirationleaves_dry_blue')}</span> : <span className="text-pink-500">{t('lab.s7transpirationleaves_wet_pink')}</span>}
 </div>
 </div>

 {/* Lower Surface View */}
 <div className="flex flex-col items-center">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.s7transpirationleaves_leaf_lower_surface')}</h3>
 <div className="relative w-48 h-64 bg-green-400 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-md border-t border-green-300 flex items-center justify-center">
 <div className="w-2 h-full bg-green-600 absolute"></div> {/* Vein */}
 {/* Stomata dots (stylized) */}
 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,100,0,1)_2px,_transparent_3px)] bg-[length:15px_15px]"></div>
 {/* Tape & Paper */}
 <div className="w-24 h-12 bg-slate-50 dark:bg-[#121212]/30 backdrop-blur-sm border border-white/50 absolute rotate-[5deg] flex items-center justify-center z-10 shadow-sm">
 {/* Cobalt Paper */}
 <div className={`w-16 h-8 transition-colors duration-1000 border border-slate-300 dark:border-[#1c1b1b] ${lowerColor === 'blue' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
 </div>
 </div>
 <div className="mt-4 font-medium text-slate-500 dark:text-[#71717a]">
 
 {t('lab.s7transpirationleaves_color')} {lowerColor === 'blue' ? <span className="text-blue-600">{t('lab.s7transpirationleaves_dry_blue')}</span> : <span className="text-pink-500">{t('lab.s7transpirationleaves_wet_pink')}</span>}
 </div>
 </div>
 </div>

 {tested && (
 <div className="mt-12 p-6 bg-slate-50 dark:!bg-[#121212] shadow-lg text-slate-800 dark:text-[#ffffff] rounded-xl border-l-4 border-blue-500 max-w-xl animate-bounce">
 <h4 className="font-bold text-lg mb-2 flex items-center"><Info className="w-5 h-5 mr-2 text-blue-500"/> {t('lab.s7transpirationleaves_observation_result')}</h4>
 <p>{t('lab.s7transpirationleaves_the_paper_on_the')} <strong>{t('lab.s7transpirationleaves_lower_surface')}</strong> {t('lab.s7transpirationleaves_turned_pink_while_the_upper_su')} <strong>{t('lab.s7transpirationleaves_stomata')}</strong>{t('lab.s7transpirationleaves_which_are_concentrated_on_the_')}</p>
 </div>
 )}

 {/* Data Collection & Analysis */}
 {tested && (
 <div className="mt-8 w-full max-w-2xl space-y-4">
 <DataChart
 title={t('lab.s7transpirationleaves_transpiration_data_logger')}
 xAxisKey="time"
 xAxisLabel="Time (min)"
 series={[{ key: 'waterLoss', name: 'Water Loss (ml)', color: '#3b82f6' }]}
 data={dataLog}
 onRecord={handleRecord}
 onReset={resetData}
 noisePercent={3}
 recordLabel="Record Measurement"
 />

 {dataLog.length >= 3 && (
 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
 <h4 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
 <Droplets className="w-4 h-4" /> {t('lab.s7transpirationleaves_analysis')}
 </h4>
 <p className="text-sm text-blue-700 dark:text-blue-300">
 
 {t('lab.s7transpirationleaves_notice_how_water_loss_increase')}
 </p>
 <p className="text-xs mt-2 text-blue-500">
 
 {t('lab.s7transpirationleaves_why_is_the_answer_slightly_dif')}{' '}
 <strong>{t('lab.s7transpirationleaves_measurement_uncertainty')}</strong> {t('lab.s7transpirationleaves_no_two_readings_are_exactly_th')}
 </p>
 </div>
 )}

 <ProgressionPath
 currentClass={7}
 links={[
 { fromClass: 6, fromSubject: 'Science', fromLab: 'Plant Basics', toConcept: 'Plants need water, sunlight, and air' },
 ]}
 />
 </div>
 )}
 </div>
 </div>
 );
}
