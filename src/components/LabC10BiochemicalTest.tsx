import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabC10BiochemicalTest({ onExit }: LabProps) {

const { recordLabData, setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [hCGConc, setHCGConc] = useState<number>(25); // mIU/mL
 const [sampleVol, setSampleVol] = useState<number>(3); // drops
 
 const [isRunning, setIsRunning] = useState<boolean>(false);
 const [flowProgress, setFlowProgress] = useState<number>(0);
 
 interface DataPoint {
  volume: number;
  concentration: number;
  testLineIntensity: number;
 }
 const [data, setData] = useState<DataPoint[]>([]);
 
 const [unknownOD] = useState<number>(Math.floor(Math.random() * 80) + 10);
 const [assessmentAns, setAssessmentAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const animationRef = useRef<number>(0);

 const maxIntensity = 100;
 const testIntensity = Math.min(maxIntensity, (hCGConc * sampleVol) / 1.5);
 const controlIntensity = 90;

 useEffect(() => {
  if (isRunning) {
   const animate = () => {
    setFlowProgress(p => {
     const nextP = p + 0.5;
     if (nextP >= 100) {
      setIsRunning(false);
      return 100;
     }
     return nextP;
    });
    animationRef.current = requestAnimationFrame(animate);
   };
   animationRef.current = requestAnimationFrame(animate);
  }
  return () => {
   if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
 }, [isRunning]);

 const handleRun = () => {
  setFlowProgress(0);
  setIsRunning(true);
 };

 const handleReset = () => {
  setFlowProgress(0);
  setIsRunning(false);
 };

 const recordData = () => {
  setData([...data, {
   volume: sampleVol,
   concentration: hCGConc,
   testLineIntensity: parseFloat(testIntensity.toFixed(1))
  }]);
 
  recordLabData({ timestamp: Date.now() });
};

 const checkAnswer = () => {
  const expected = unknownOD / 2;
  if (Math.abs(parseFloat(assessmentAns) - expected) < 2) {
   setIsCorrect(true);
  } else {
   setIsCorrect(false);
    setLabScore(isCorrect ? 100 : 0, 100);
  }
 };

 const testColorOpacity = flowProgress > 60 ? ((flowProgress - 60) / 40) * (testIntensity / 100) : 0;
 const controlColorOpacity = flowProgress > 80 ? ((flowProgress - 80) / 20) * (controlIntensity / 100) : 0;

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.c10biochemicaltest_biochemical_test_hcg_lateral_f')} subtitle={t('lab.subtitle_immunoassay_simulation')} />

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10biochemicaltest_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10biochemicaltest_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 flex-grow lg:overflow-visible">
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
     <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-pink-600"/>  {t('lab.c10biochemicaltest_setup_theory')}</h2>
     <p className="text-sm text-slate-700 dark:text-[#ffffff]">
      
                           {t('lab.c10biochemicaltest_pregnancy_tests_use_a_lateral_')}
                          </p>
     
     <div className={`space-y-4 mt-4 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
      <div>
       <label className="block text-sm font-medium">{t('lab.c10biochemicaltest_sample_hcg_conc_miu_ml')} {hCGConc}</label>
       <input type="range" min="0" max="100" value={hCGConc} onChange={(e) => setHCGConc(parseInt(e.target.value))} className="w-full" disabled={isRunning || flowProgress > 0} />
      </div>
      <div>
       <label className="block text-sm font-medium">{t('lab.c10biochemicaltest_sample_volume_drops')} {sampleVol}</label>
       <input type="range" min="1" max="5" value={sampleVol} onChange={(e) => setSampleVol(parseInt(e.target.value))} className="w-full" disabled={isRunning || flowProgress > 0} />
      </div>
      
      <div className="flex space-x-2 pt-4">
       <button onClick={handleRun} disabled={isRunning || flowProgress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
        <Play className="w-4 h-4 mr-1"/>  {t('lab.c10biochemicaltest_apply_sample')}
                                    </button>
       <button onClick={handleReset} className="flex-1 bg-slate-600 dark:bg-[#121212] text-white py-2 rounded hover:bg-slate-700 dark:bg-[#121212] flex justify-center items-center dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
        <RotateCcw className="w-4 h-4 mr-1"/>  {t('lab.c10biochemicaltest_reset')}
                                    </button>
      </div>
     </div>
    </div>

    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-semibold absolute top-4 left-4">{t('lab.c10biochemicaltest_test_strip')}</h2>
     <div className="w-full h-64 mt-12 bg-slate-100 dark:bg-[#121212] rounded border border-slate-300 dark:border-[#1c1b1b] relative flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 500 200">
       <rect x="50" y="70" width="400" height="60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" rx="10"/>
       <circle cx="90" cy="100" r="15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2"/>
       <rect x="200" y="80" width="150" height="40" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" rx="4"/>
       
       <text x="240" y="140" fill="#64748b" fontSize="16" fontWeight="bold">T</text>
       <text x="310" y="140" fill="#64748b" fontSize="16" fontWeight="bold">C</text>
       <text x="90" y="140" fill="#64748b" fontSize="12" textAnchor="middle">{t('lab.c10biochemicaltest_sample')}</text>

       <clipPath id="flowClip">
        <rect x="200" y="80" width={150 * (flowProgress / 100)} height="40" />
       </clipPath>
       <rect x="200" y="80" width="150" height="40" fill="#fbcfe8" opacity="0.3" clipPath="url(#flowClip)"/>

       <rect x="235" y="80" width="10" height="40" fill={`rgba(219, 39, 119, ${testColorOpacity})`} />
       <rect x="305" y="80" width="10" height="40" fill={`rgba(219, 39, 119, ${controlColorOpacity})`} />
      </svg>
      <div className="absolute bottom-4 left-4 text-sm font-semibold">
       
                                {t('lab.c10biochemicaltest_status')} {flowProgress === 0 ? 'Ready' : flowProgress < 100 ? 'Running...' : 'Complete'}
      </div>
     </div>
    </div>

    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-pink-600"/>  {t('lab.c10biochemicaltest_data_analysis')}</h2>
     
     <button onClick={recordData} disabled={flowProgress < 100} className="w-full bg-pink-100 text-pink-700 py-2 rounded font-medium hover:bg-pink-200 disabled:opacity-50">
      
                           {t('lab.c10biochemicaltest_measure_optical_density_od')}
                          </button>

     <div className="flex-1 lg:overflow-y-auto">
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212]">
        <tr>
         <th className="p-2 border">{t('lab.c10biochemicaltest_vol_drops')}</th>
         <th className="p-2 border">{t('lab.c10biochemicaltest_hcg_miu_ml')}</th>
         <th className="p-2 border">{t('lab.c10biochemicaltest_test_od')}</th>
        </tr>
       </thead>
       <tbody>
        {data.map((d, i) => (
         <tr key={i} className="border-b">
          <td className="p-2 border">{d.volume}</td>
          <td className="p-2 border">{d.concentration}</td>
          <td className="p-2 border font-bold text-pink-600">{d.testLineIntensity}</td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded">
      <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/>  {t('lab.c10biochemicaltest_assessment')}</h3>
      <p className="text-xs mb-2">{t('lab.c10biochemicaltest_based_on_your_data_using_3_dro')} <code>{t('lab.c10biochemicaltest_od_conc_2')}</code>{t('lab.c10biochemicaltest_an_unknown_sample_yields_an_od')} {unknownOD}{t('lab.c10biochemicaltest_what_is_its_hcg_concentration')}</p>
      <div className="flex space-x-2">
       <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder={t('lab.c10biochemicaltest_miu_ml')} className="flex-1 px-2 py-1 border rounded text-sm"/>
       <button onClick={checkAnswer} className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 dark:text-white dark:text-white dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40">{t('lab.c10biochemicaltest_check')}</button>
      </div>
      {isCorrect !== null && (
       <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {isCorrect ? 'Correct! You successfully interpolated the concentration.' : 'Incorrect. Use the formula Conc = OD / 2.'}
       </p>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
