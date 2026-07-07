import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit?: () => void;
}

export default function LabC10PETAcidHydrolysis({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [petMass, setPetMass] = useState<number>(50); // g
 const [acidConc, setAcidConc] = useState<number>(1); // M
 const [temp, setTemp] = useState<number>(120); // Celsius
 
 const [isReacting, setIsReacting] = useState<boolean>(false);
 const [progress, setProgress] = useState<number>(0);
 const [time, setTime] = useState<number>(0);
 
 interface DataPoint {
  time: number;
  petRemaining: number;
  acidYield: number; // Terephthalic acid
 }
 const [data, setData] = useState<DataPoint[]>([]);
 
 const [unknownMass] = useState<number>(Math.floor(Math.random() * 200) + 50);
 const [assessmentAns, setAssessmentAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const animationRef = useRef<number>(0);

 const molarMassPETUnit = 192.17; // g/mol
 const molarMassTPA = 166.13; // Terephthalic acid g/mol
 const theoreticalYieldTPA = (petMass / molarMassPETUnit) * molarMassTPA;

 useEffect(() => {
  if (isReacting) {
   const k = acidConc * Math.exp((temp - 100) / 30) * 0.1;
   const animate = () => {
    setProgress(p => {
     const newP = p + k;
     if (newP >= 100) {
      setIsReacting(false);
      return 100;
     }
     return newP;
    });
    setTime(t => t + 0.1);
    animationRef.current = requestAnimationFrame(animate);
   };
   animationRef.current = requestAnimationFrame(animate);
  }
  return () => {
   if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
 }, [isReacting, temp, acidConc]);

 const handleReact = () => {
  setProgress(0);
  setTime(0);
  setData([]);
  setIsReacting(true);
 };

 const handleReset = () => {
  setProgress(0);
  setTime(0);
  setIsReacting(false);
 };

 const recordData = () => {
  const petRemaining = petMass * (1 - progress / 100);
  const acidYield = theoreticalYieldTPA * (progress / 100);
  setData(prev => [...prev, {
   time: parseFloat(time.toFixed(1)),
   petRemaining: parseFloat(petRemaining.toFixed(2)),
   acidYield: parseFloat(acidYield.toFixed(2))
  }]);
 };

 const checkAnswer = () => {
  const expected = (unknownMass / molarMassPETUnit) * molarMassTPA;
  if (Math.abs(parseFloat(assessmentAns) - expected) < 2) {
   setIsCorrect(true);
  } else {
   setIsCorrect(false);
  }
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.c10petacidhydrolysis_chemical_recycling_pet_acid_hy')} subtitle={t('lab.subtitle_depolymerisation')} />

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10petacidhydrolysis_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10petacidhydrolysis_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 flex-grow lg:overflow-visible">
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
     <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-orange-600"/>  {t('lab.c10petacidhydrolysis_setup_theory')}</h2>
     <p className="text-sm text-slate-700 dark:text-[#ffffff]">
      
                           {t('lab.c10petacidhydrolysis_chemical_recycling_of_pet_invo')}
                          </p>
     
     <div className={`space-y-4 mt-4 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
      <div>
       <label className="block text-sm font-medium">{t('lab.c10petacidhydrolysis_pet_waste_mass_g')} {petMass}</label>
       <input type="range" min="10" max="200" value={petMass} onChange={(e) => setPetMass(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      <div>
       <label className="block text-sm font-medium">{t('lab.c10petacidhydrolysis_acid_conc_m')} {acidConc.toFixed(1)}</label>
       <input type="range" min="0.1" max="5.0" step="0.1" value={acidConc} onChange={(e) => setAcidConc(parseFloat(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      <div>
       <label className="block text-sm font-medium">{t('lab.c10petacidhydrolysis_temperature_c')} {temp}</label>
       <input type="range" min="80" max="200" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      
      <div className="flex space-x-2 pt-4">
       <button onClick={handleReact} disabled={isReacting || progress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
        <Play className="w-4 h-4 mr-1"/>  {t('lab.c10petacidhydrolysis_hydrolyse')}
                                    </button>
       <button onClick={handleReset} className="flex-1 bg-slate-600 dark:bg-[#121212] text-white py-2 rounded hover:bg-slate-700 dark:bg-[#121212] flex justify-center items-center dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
        <RotateCcw className="w-4 h-4 mr-1"/>  {t('lab.c10petacidhydrolysis_reset')}
                                    </button>
      </div>
     </div>
    </div>

    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-semibold absolute top-4 left-4">{t('lab.c10petacidhydrolysis_reactor_vessel')}</h2>
     <div className="w-full h-64 mt-12 bg-slate-100 dark:bg-[#121212] rounded border border-slate-300 dark:border-[#1c1b1b] relative flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 500 200">
       <rect x="0" y={100 + (100 - progress)} width="500" height="100" fill="#fca5a5" opacity="0.3" />
       
       <g transform="translate(100, 100)">
        {Array.from({ length: 5 }).map((_, i) => {
         const isBroken = progress > (i + 1) * 15;
         const yOffset = isBroken ? (Math.sin(time + i) * 20) : 0;
         const xOffset = isBroken ? (i * 60 + Math.cos(time + i) * 10) : i * 60;
         return (
          <g key={i} transform={`translate(${xOffset}, ${yOffset})`}>
           <rect x="0" y="-10" width="25" height="20" fill="#3b82f6" rx="2" />
           <rect x="30" y="-10" width="25" height="20" fill="#ef4444" rx="2" />
           {!isBroken && i < 4 && <line x1="55" y1="0" x2="60" y2="0" stroke="#333" strokeWidth="2"/>}
           <line x1="25" y1="0" x2="30" y2="0" stroke="#333" strokeWidth={isBroken ? 0 : 2} />
          </g>
         );
        })}
       </g>
      </svg>
      <div className="absolute top-2 right-2 text-sm font-semibold">{t('lab.c10petacidhydrolysis_tpa_yield')} {(theoreticalYieldTPA * (progress / 100)).toFixed(1)} g</div>
      <div className="absolute top-8 right-2 text-sm font-semibold">{t('lab.c10petacidhydrolysis_time')} {time.toFixed(1)} s</div>
     </div>
     <div className="mt-4 text-center">
      <p className="text-sm font-mono whitespace-normal">
       
                                {t('lab.c10petacidhydrolysis_oc_c_h_coo_ch_ch_o')}<sub className="text-xs">n</sub>  {t('lab.c10petacidhydrolysis_2n_h_o_rarr_n_hooc_c_h_cooh_n_')}
                               </p>
     </div>
    </div>

    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-orange-600"/>  {t('lab.c10petacidhydrolysis_data_analysis')}</h2>
     
     <button onClick={recordData} disabled={!isReacting && progress === 0} className="w-full bg-orange-100 text-orange-700 py-2 rounded font-medium hover:bg-orange-200 disabled:opacity-50">
      
                           {t('lab.c10petacidhydrolysis_log_concentration')}
                          </button>

     <div className="flex-1 lg:overflow-y-auto">
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212]">
        <tr>
         <th className="p-2 border">{t('lab.c10petacidhydrolysis_time_s')}</th>
         <th className="p-2 border">{t('lab.c10petacidhydrolysis_pet_g')}</th>
         <th className="p-2 border">{t('lab.c10petacidhydrolysis_tpa_yield_g')}</th>
        </tr>
       </thead>
       <tbody>
        {data.map((d, i) => (
         <tr key={i} className="border-b">
          <td className="p-2 border">{d.time}</td>
          <td className="p-2 border">{d.petRemaining}</td>
          <td className="p-2 border">{d.acidYield}</td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded">
      <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/>  {t('lab.c10petacidhydrolysis_assessment')}</h3>
      <p className="text-xs mb-2">{t('lab.c10petacidhydrolysis_assuming_100_yield_what_mass_o')} {unknownMass}  {t('lab.c10petacidhydrolysis_g_of_pet_waste_pet_unit_192_17')}</p>
      <div className="flex space-x-2">
       <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder={t('lab.c10petacidhydrolysis_mass_g')} className="flex-1 px-2 py-1 border rounded text-sm"/>
       <button onClick={checkAnswer} className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">{t('lab.c10petacidhydrolysis_check')}</button>
      </div>
      {isCorrect !== null && (
       <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {isCorrect ? 'Correct! Stoichiometry applied correctly.' : 'Incorrect. Use (Mass / M_PET) * M_TPA.'}
       </p>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
