import { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabC10EthanolFermentation({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [glucose, setGlucose] = useState(50); 
 const [temp, setTemp] = useState(30); 
 const [yeast, setYeast] = useState(5); 
 const [anaerobic, setAnaerobic] = useState(true);
 
 const [running, setRunning] = useState(false);
 const [time, setTime] = useState(0); 
 const [ethanol, setEthanol] = useState(0); 
 const [co2, setCo2] = useState(0); 
 const [ethanoicAcid, setEthanoicAcid] = useState(0); 
 
 const [logs, setLogs] = useState<{run: number, t: number, glu: number, yeast: number, ana: string, eth: number, time: number}[]>([]);
 
 const targetMass = useRef(Math.floor(Math.random() * 5 + 1) * 18); 

 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState('');

 useEffect(() => {
 let timer: number;
 if (running) {
  timer = window.setInterval(() => {
  setTime(t => {
   if (t >= 72) {
   setRunning(false);
   return 72;
   }
   return t + 1; 
  });
  }, 50);
 }
 return () => clearInterval(timer);
 }, [running]);

 useEffect(() => {
 if (time === 0) {
  setEthanol(0);
  setCo2(0);
  setEthanoicAcid(0);
  return;
 }
 
 let enzymeActivity = 0;
 if (temp < 10 || temp > 50) enzymeActivity = 0;
 else if (temp <= 35) enzymeActivity = (temp - 10) / 25;
 else enzymeActivity = 1 - (temp - 35) / 15; 
 
 const rate = enzymeActivity * (yeast / 10) * 0.05; 
 const converted = glucose * (1 - Math.exp(-rate * time));
 
 if (anaerobic) {
  setEthanol((converted * 0.51) / 10); 
  setCo2(converted * 240); 
  setEthanoicAcid(0);
 } else {
  setEthanol(((converted * 0.51) / 10) * 0.2); 
  setEthanoicAcid((converted * 0.3) / 10);
  setCo2(converted * 300); 
 }

 }, [time, temp, yeast, glucose, anaerobic]);

 const handleStart = () => {
 if (running) setRunning(false);
 else {
  if (time >= 72) setTime(0);
  setRunning(true);
 }
 };

 const handleLog = () => {
 setLogs([...logs, { run: logs.length + 1, t: temp, glu: glucose, yeast: yeast, ana: anaerobic ? 'Yes' : 'No', eth: parseFloat(ethanol.toFixed(2)), time: time }]);
 };

 const checkAnswer = () => {
 const expected = (targetMass.current / 180) * 92;
 if (Math.abs(parseFloat(answer) - expected) < 0.5) {
  setFeedback('Correct! Well done.');
 } else {
  setFeedback(`Incorrect. Hint: Equation is C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. M_r of glucose = 180, M_r of ethanol = 46. Mass given = ${targetMass.current}g.`);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c10ethanolfermentation_virtual_lab_ethanol_fermentati')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10ethanolfermentation_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10ethanolfermentation_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:flex-1 lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.c10ethanolfermentation_theory_setup')}</h2>
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-2 text-sm">
   <p><strong>{t('lab.c10ethanolfermentation_fermentation')}</strong>  {t('lab.c10ethanolfermentation_is_the_anaerobic_breakdown_of_')}</p>
   <div className={`bg-emerald-50 p-3 rounded font-mono text-center text-emerald-900 border border-emerald-200 flex-col `}>
    
                             {t('lab.c10ethanolfermentation_c_h_o_aq_2c_h_oh_aq_2co_g')}
                            </div>
   <p><strong>{t('lab.c10ethanolfermentation_conditions')}</strong>  {t('lab.c10ethanolfermentation_yeast_is_added_to_an_aqueous_g')} <em>{t('lab.c10ethanolfermentation_anaerobic')}</em>  {t('lab.c10ethanolfermentation_without_oxygen')}</p>
   <p><strong>{t('lab.c10ethanolfermentation_why_anaerobic')}</strong>  {t('lab.c10ethanolfermentation_in_the_presence_of_oxygen_yeas')}</p>
   </div>
   
   <div className="flex-1 overflow-auto">
   <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2 mt-4">{t('lab.c10ethanolfermentation_experiment_controls')}</h3>
   <div className="space-y-4">
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>{t('lab.c10ethanolfermentation_glucose_conc_g_l')}</span>
     <span>{glucose}  {t('lab.c10ethanolfermentation_g_l')}</span>
    </label>
    <input type="range" min="10" max="100" value={glucose} onChange={(e) => { setGlucose(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>{t('lab.c10ethanolfermentation_yeast_added_g')}</span>
     <span>{yeast} g</span>
    </label>
    <input type="range" min="1" max="10" value={yeast} onChange={(e) => { setYeast(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div>
    <label className="text-sm font-semibold flex justify-between">
     <span>{t('lab.c10ethanolfermentation_temperature_c')}</span>
     <span>{temp} °C</span>
    </label>
    <input type="range" min="10" max="60" value={temp} onChange={(e) => { setTemp(Number(e.target.value)); setTime(0); }} className="w-full" disabled={running} />
    </div>
    <div className="flex items-center gap-2 mt-2">
    <input type="checkbox" id="anaerobic" checked={anaerobic} onChange={(e) => { setAnaerobic(e.target.checked); setTime(0); }} disabled={running} className="w-4 h-4" />
    <label htmlFor="anaerobic" className="text-sm font-semibold">{t('lab.c10ethanolfermentation_anaerobic_seal_airlock')}</label>
    </div>
   </div>
   </div>
  </div>

  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col items-center relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] w-full border-b pb-2 mb-4">{t('lab.c10ethanolfermentation_simulation')}</h2>
   
   <div className="flex-1 w-full flex flex-col items-center justify-center relative">
   <svg viewBox="0 0 200 300" className="w-64 h-auto max-h-full drop-shadow-xl">
    <path d="M 90 80 L 90 140 L 50 220 A 20 20 0 0 0 70 250 L 130 250 A 20 20 0 0 0 150 220 L 110 140 L 110 80 Z" fill="rgba(255,255,255,0.9)" stroke="#444" strokeWidth="2" />
    
    <path d="M 60 200 L 140 200 A 20 20 0 0 1 130 248 L 70 248 A 20 20 0 0 1 60 200 Z" fill={ethanoicAcid > 0 ? "rgba(220, 240, 180, 0.7)" : "rgba(240, 230, 180, 0.7)"} />
    
    {anaerobic && (
    <g>
     <rect x="85" y="70" width="30" height="15" fill="#555" />
     <path d="M 100 70 L 100 40 L 130 40 L 130 60" fill="none" stroke="#888" strokeWidth="3" />
    </g>
    )}
    
    {running && ethanol > 0 && Array.from({length: 8}).map((_, i) => (
    <circle key={i} cx={80 + (i * 5)} cy={240 - ((time * 2 + i * 10) % 50)} r="2" fill="white" opacity="0.8" />
    ))}
    
    {!anaerobic && running && ethanol > 0 && (
    <text x="100" y="60" textAnchor="middle" fill="#555" fontSize="12" className="animate-pulse">{t('lab.c10ethanolfermentation_o_entering')}</text>
    )}
   </svg>

   <div className="w-full mt-4 text-xs text-slate-600 dark:text-[#a1a1aa] space-y-1">
    <div className="flex justify-between">
    <span className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.c10ethanolfermentation_ethanol')}</span>
    <span className="font-mono">{ethanol.toFixed(2)} %</span>
    </div>
    <div className="flex justify-between">
    <span className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.c10ethanolfermentation_co_released')}</span>
    <span className="font-mono">{co2.toFixed(0)} mL</span>
    </div>
    {!anaerobic && (
    <div className="flex justify-between text-red-600">
     <span className="font-bold">{t('lab.c10ethanolfermentation_ethanoic_acid')}</span>
     <span className="font-mono">{ethanoicAcid.toFixed(2)} %</span>
    </div>
    )}
   </div>
   </div>

   <div className="w-full mt-4 flex items-center justify-between gap-4">
   <div className={`flex-1 bg-slate-200 dark:bg-[#121212] h-2 rounded-full lg:overflow- flex-col `}>
    <div className="bg-emerald-500 h-full transition-all duration-100" style={{ width: `${(time/72)*100}%` }} />
   </div>
   <div className="text-sm font-mono">{time}{t('lab.c10ethanolfermentation_h_72h')}</div>
   <button onClick={handleStart} className={`flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 flex-col `}>
    {running ? <Square size={16} /> : <Play size={16} />}
    {running ? 'Stop' : 'Start'}
   </button>
   </div>
  </div>

  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-sm border p-4 flex flex-col gap-4  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.c10ethanolfermentation_data_analysis')}</h2>
   
   <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded flex justify-between items-center">
   <div>
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold">{t('lab.c10ethanolfermentation_max_ethanol')}</div>
    <div className="text-2xl font-mono text-emerald-700">{ethanol.toFixed(2)}%</div>
   </div>
   <button onClick={handleLog} disabled={time === 0} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    
                             {t('lab.c10ethanolfermentation_record_data')}
                            </button>
   </div>

   <div className="flex-1 overflow-auto border rounded bg-slate-50 dark:bg-[#121212]">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-200 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="p-2">{t('lab.c10ethanolfermentation_run')}</th>
     <th className="p-2">{t('lab.c10ethanolfermentation_t_c')}</th>
     <th className="p-2">{t('lab.c10ethanolfermentation_glu')}</th>
     <th className="p-2">{t('lab.c10ethanolfermentation_anaerobic_1')}</th>
     <th className="p-2">{t('lab.c10ethanolfermentation_eth')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={5} className="p-4 text-center text-slate-500 dark:text-[#71717a]">{t('lab.c10ethanolfermentation_no_data_recorded_yet')}</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-b">
      <td className="p-2">{log.run}</td>
      <td className="p-2">{log.t}</td>
      <td className="p-2">{log.glu}</td>
      <td className="p-2">{log.ana}</td>
      <td className="p-2 font-mono font-bold text-emerald-700">{log.eth}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
   <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
    <CheckCircle size={18} />  {t('lab.c10ethanolfermentation_knowledge_check')}
                            </h3>
   <p className="text-sm text-emerald-800 mb-3">
    
                             {t('lab.c10ethanolfermentation_calculate_the_theoretical_maxi')} <strong>{targetMass.current} g</strong>  {t('lab.c10ethanolfermentation_of_glucose_a_h_1_c_12_o_16')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    value={answer}
    onChange={e => setAnswer(e.target.value)}
    placeholder={t('lab.c10ethanolfermentation_mass_g')} 
    className="flex-1 px-3 py-1 border rounded"
    />
    <button onClick={checkAnswer} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    
                                 {t('lab.c10ethanolfermentation_check')}
                                 </button>
   </div>
   {feedback && (
    <p className={`mt-2 text-sm font-semibold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
    {feedback}
    </p>
   )}
   </div>

  </div>
  </div>
 </div>
 );
}
