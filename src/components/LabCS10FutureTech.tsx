import { useState, useEffect, useRef } from 'react';
import { Home, Lightbulb, Cloud, Brain, Check, X, Activity, FileText, Server } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabCS10FutureTech({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [tab, setTab] = useState<'iot' | 'ai' | 'cloud'>('iot');

 // IoT State
 const [acOn, setAcOn] = useState(false);
 const [lightOn, setLightOn] = useState(false);
 const [energyLog, setEnergyLog] = useState<{t: number, e: number}[]>([]);
 const timeRef = useRef<number>(0);
 const iotRef = useRef({ ac: false, light: false });

 // AI State
 const [candidates] = useState([
 { id: 1, name: 'John D.', gender: 'M', exp: 5 },
 { id: 2, name: 'Sarah M.', gender: 'F', exp: 6 },
 { id: 3, name: 'Mike T.', gender: 'M', exp: 2 },
 { id: 4, name: 'Emma W.', gender: 'F', exp: 4 },
 { id: 5, name: 'David L.', gender: 'M', exp: 8 },
 { id: 6, name: 'Lisa K.', gender: 'F', exp: 7 },
 ]);
 const [screened, setScreened] = useState(false);

 // Cloud State
 const [docText, setDocText] = useState('Project Goals:\n');
 const [syncLogs, setSyncLogs] = useState<string[]>([]);
 const docRef = useRef<string>(docText);

 useEffect(() => {
 iotRef.current = { ac: acOn, light: lightOn };
 }, [acOn, lightOn]);

 useEffect(() => {
 let timer: ReturnType<typeof setInterval>;
 if (tab === 'iot') {
  timer = setInterval(() => {
  timeRef.current += 1;
  let e = 0;
  if (iotRef.current.ac) e += 1500;
  if (iotRef.current.light) e += 60;
  setEnergyLog(prev => [...prev.slice(-19), { t: timeRef.current, e }]);
  }, 1000);
 }
 return () => clearInterval(timer);
 }, [tab]);

 useEffect(() => {
 let timer: ReturnType<typeof setInterval>;
 if (tab === 'cloud') {
  timer = setInterval(() => {
  if (Math.random() > 0.5) {
   const additions = ["- Integrate API\n", "- Update UI\n", "- Fix bugs\n"];
   const addition = additions[Math.floor(Math.random() * additions.length)];
   setDocText(prev => prev + addition);
   setSyncLogs(prev => [`Alice added text (Latency: ${Math.floor(Math.random()*50 + 10)}ms)`, ...prev.slice(0, 4)]);
  }
  }, 2500);
 }
 return () => clearInterval(timer);
 }, [tab]);

 const [iotAns, setIotAns] = useState('');
 const [aiAns, setAiAns] = useState('');
 const [cloudAns, setCloudAns] = useState('');

 // Graph Path
 const maxE = 1600;
 const points = energyLog.map((p, i) => `${(i / 20) * 100},${100 - (p.e / maxE) * 100}`).join(' ');

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs10futuretech_future_tech_virtual_lab')} subtitle={t('lab.subtitle_bias_cloud_computing')} />
  
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs10futuretech_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs10futuretech_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:overflow-visible">
  {/* LEFT COLUMN: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.cs10futuretech_1_select_module')}</h2>
   <div className={`flex gap-2 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <button onClick={() => setTab('iot')} className={`flex-1 py-2 rounded font-medium ${tab === 'iot' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>{t('lab.cs10futuretech_iot_smart_home')}</button>
   <button onClick={() => setTab('ai')} className={`flex-1 py-2 rounded font-medium ${tab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>{t('lab.cs10futuretech_ai_bias')}</button>
   <button onClick={() => setTab('cloud')} className={`flex-1 py-2 rounded font-medium ${tab === 'cloud' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>{t('lab.cs10futuretech_cloud_docs')}</button>
   </div>
   
   <div className={`mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-900 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
   {tab === 'iot' && <p><strong>{t('lab.cs10futuretech_internet_of_things_iot')}</strong>  {t('lab.cs10futuretech_connects_physical_devices_to_t')}</p>}
   {tab === 'ai' && <p><strong>{t('lab.cs10futuretech_ai_bias_1')}</strong>  {t('lab.cs10futuretech_artificial_intelligence_models')}</p>}
   {tab === 'cloud' && <p><strong>{t('lab.cs10futuretech_cloud_computing')}</strong>  {t('lab.cs10futuretech_enables_real_time_collaboratio')}</p>}
   </div>

   {tab === 'iot' && (
   <div className="mt-4 border-t pt-4">
    <h3 className="font-semibold mb-2">{t('lab.cs10futuretech_device_controls')}</h3>
    <div className={`flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded mb-2 flex-col `}>
    <span className="flex items-center gap-2"><Home size={18}/>  {t('lab.cs10futuretech_ac_unit_1500w')}</span>
    <button onClick={() => setAcOn(!acOn)} className={`px-3 py-1 rounded text-white ${acOn ? 'bg-green-500' : 'bg-red-500'}`}>{acOn ? 'ON' : 'OFF'}</button>
    </div>
    <div className={`flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded flex-col `}>
    <span className="flex items-center gap-2"><Lightbulb size={18}/>  {t('lab.cs10futuretech_smart_lights_60w')}</span>
    <button onClick={() => setLightOn(!lightOn)} className={`px-3 py-1 rounded text-white ${lightOn ? 'bg-green-500' : 'bg-red-500'}`}>{lightOn ? 'ON' : 'OFF'}</button>
    </div>
   </div>
   )}
  </div>

  {/* MIDDLE COLUMN: Simulation */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {tab === 'iot' && (
    <div className={`w-full max-w-md bg-slate-100 dark:bg-[#121212] rounded-xl p-6 relative shadow-inner `}>
    <h3 className="text-center font-bold mb-6 text-slate-700 dark:text-[#ffffff]">{t('lab.cs10futuretech_smart_home_floor_plan')}</h3>
    <div className="grid grid-cols-2 gap-4 h-48">
     <div className={`border-2 rounded flex flex-col items-center justify-center transition-colors ${acOn || lightOn ? 'bg-blue-50 border-blue-300' : 'bg-slate-200 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b]'}`}>
     <Home size={32} className={lightOn ? 'text-yellow-500' : 'text-slate-400'} />
     <span className="mt-2 font-semibold">{t('lab.cs10futuretech_living_room')}</span>
     {acOn && <span className="text-xs text-blue-500 font-bold mt-1">{t('lab.cs10futuretech_ac_cooling')}</span>}
     </div>
     <div className="border-2 border-slate-300 dark:border-[#1c1b1b] bg-slate-200 dark:bg-[#121212] rounded flex flex-col items-center justify-center">
     <Home size={32} className="text-slate-400" />
     <span className="mt-2 font-semibold">{t('lab.cs10futuretech_garage_offline')}</span>
     </div>
    </div>
    </div>
   )}

   {tab === 'ai' && (
    <div className="w-full flex flex-col h-full">
    <div className="flex justify-between items-center mb-4">
     <h3 className="font-bold flex items-center gap-2"><Brain className="text-indigo-600"/>  {t('lab.cs10futuretech_ai_resume_screener')}</h3>
     <button onClick={() => setScreened(true)} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.cs10futuretech_run_screening')}</button>
    </div>
    <div className="flex-1 lg:overflow-y-auto space-y-2">
     {candidates.map(c => {
     const rejected = screened && c.gender === 'F';
     const accepted = screened && c.gender === 'M';
     return (
      <div key={c.id} className={`p-3 rounded border flex justify-between items-center ${rejected ? 'bg-red-50 border-red-200' : accepted ? 'bg-green-50 border-green-200' : 'bg-slate-50 dark:bg-[#121212]'}`}>
      <div>
       <p className="font-bold">{c.name}</p>
       <p className="text-xs text-slate-500 dark:text-[#71717a]">{t('lab.cs10futuretech_gender')} {c.gender}  {t('lab.cs10futuretech_experience')} {c.exp}  {t('lab.cs10futuretech_yrs')}</p>
      </div>
      {rejected && <X className="text-red-500" />}
      {accepted && <Check className="text-green-500" />}
      </div>
     );
     })}
    </div>
    </div>
   )}

   {tab === 'cloud' && (
   <div className="w-full flex flex-col h-full">
    <h3 className="font-bold mb-4 flex items-center gap-2"><Cloud className="text-indigo-600"/>  {t('lab.cs10futuretech_collaborative_document')}</h3>
    <textarea 
     className={`flex-1 border-2 border-indigo-200 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-indigo-400 `}
     value={docText}
     onChange={(e) => {
     setDocText(e.target.value);
     docRef.current = e.target.value;
     }}
    />
    <div className="mt-4 h-24 bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-xs p-2 rounded lg:overflow-y-auto">
     <p className="text-slate-400 mb-1">{t('lab.cs10futuretech_server_sync_logs')}</p>
     {syncLogs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
   </div>
   )}
  </div>

  {/* RIGHT COLUMN: Data & Analysis */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-5 rounded-xl shadow-sm flex-col gap-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.cs10futuretech_3_data_logging_analysis')}</h2>
   
   {tab === 'iot' && (
   <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
    <h3 className="font-bold flex items-center gap-2 mb-2"><Activity size={18}/>  {t('lab.cs10futuretech_energy_graph_w')}</h3>
    <svg viewBox="0 0 100 100" className="w-full h-32 bg-slate-50 dark:bg-[#121212] rounded border overflow-visible">
     <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" />
    </svg>
    <div className="flex justify-between text-xs text-slate-400 mt-1">
     <span>{t('lab.cs10futuretech_past')}</span><span>{t('lab.cs10futuretech_now')}</span>
    </div>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-bold mb-2">{t('lab.cs10futuretech_assessment')}</h3>
    <p className="text-sm mb-2">{t('lab.cs10futuretech_if_both_the_ac_and_lights_are_')}</p>
    <input type="number" value={iotAns} onChange={e=>setIotAns(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder={t('lab.cs10futuretech_enter_total_wh')} />
    <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(iotAns === '7800' ? 'Correct! (1560W * 5h)' : 'Incorrect. Try again.')}>{t('lab.cs10futuretech_check_answer')}</button>
    </div>
   </>
   )}

   {tab === 'ai' && (
    <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
     <h3 className="font-bold flex items-center gap-2 mb-2"><FileText size={18}/>  {t('lab.cs10futuretech_data_table')}</h3>
     <table className="w-full text-sm text-left">
     <thead>
      <tr className="border-b"><th className="pb-2">{t('lab.cs10futuretech_group')}</th><th className="pb-2">{t('lab.cs10futuretech_accepted')}</th><th className="pb-2">{t('lab.cs10futuretech_rejected')}</th></tr>
     </thead>
     <tbody>
      <tr className="border-b"><td>{t('lab.cs10futuretech_male_m')}</td><td>{screened ? 3 : 0}</td><td>0</td></tr>
      <tr><td>{t('lab.cs10futuretech_female_f')}</td><td>0</td><td>{screened ? 3 : 0}</td></tr>
     </tbody>
     </table>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold mb-2">{t('lab.cs10futuretech_assessment')}</h3>
     <p className="text-sm mb-2">{t('lab.cs10futuretech_based_on_the_data_table_the_ai')}</p>
     <select value={aiAns} onChange={e=>setAiAns(e.target.value)} className="w-full p-2 border rounded mb-2">
     <option value="">{t('lab.cs10futuretech_select')}</option>
     <option value="M">{t('lab.cs10futuretech_male_candidates')}</option>
     <option value="F">{t('lab.cs10futuretech_female_candidates')}</option>
     <option value="N">{t('lab.cs10futuretech_no_bias')}</option>
     </select>
     <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(aiAns === 'F' ? 'Correct! All female candidates were rejected regardless of experience.' : 'Incorrect. Look at the accepted vs rejected columns.')}>{t('lab.cs10futuretech_check_answer')}</button>
    </div>
    </>
   )}

   {tab === 'cloud' && (
    <>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border">
     <h3 className="font-bold flex items-center gap-2 mb-2"><Server size={18}/>  {t('lab.cs10futuretech_network_logs')}</h3>
     <div className="text-sm space-y-1">
     <p className="flex justify-between"><span>{t('lab.cs10futuretech_packets_sent')}</span> <strong>{syncLogs.length * 4}</strong></p>
     <p className="flex justify-between"><span>{t('lab.cs10futuretech_avg_latency')}</span> <strong>{t('lab.cs10futuretech_35ms')}</strong></p>
     <p className="flex justify-between"><span>{t('lab.cs10futuretech_connections')}</span> <strong>{t('lab.cs10futuretech_2_active')}</strong></p>
     </div>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold mb-2">{t('lab.cs10futuretech_assessment')}</h3>
     <p className="text-sm mb-2">{t('lab.cs10futuretech_if_alice_s_connection_drops_wh')}</p>
     <select value={cloudAns} onChange={e => setCloudAns(e.target.value)} className="w-full p-2 border rounded mb-2 text-sm">
     <option value="">{t('lab.cs10futuretech_select')}</option>
     <option value="drop">{t('lab.cs10futuretech_edits_are_permanently_dropped')}</option>
     <option value="sync">{t('lab.cs10futuretech_local_caching_and_conflict_res')}</option>
     <option value="email">{t('lab.cs10futuretech_changes_are_emailed_to_bob')}</option>
     </select>
     <button className="w-full bg-indigo-600 text-white py-2 rounded dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40" onClick={() => alert(cloudAns === 'sync' ? 'Correct! The local edits are cached and synchronized once restored.' : 'Incorrect.')}>{t('lab.cs10futuretech_check_answer')}</button>
    </div>
    </>
   )}

  </div>
  </div>
 </div>
 );
}
