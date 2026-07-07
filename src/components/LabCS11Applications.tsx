import { useState, useMemo } from 'react';
import { Cpu, Radio, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabCS11Applications({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'iot' | 'blockchain'>('iot');

 // IoT State
 const [motion, setMotion] = useState(false);
 const [pressure, setPressure] = useState(0);
 const [pressureThreshold, setPressureThreshold] = useState(50);
 const alarmOn = motion && (pressure > pressureThreshold);

 // Blockchain State
 const [rawBlocks, setRawBlocks] = useState([
 { id: 1, data: 'Genesis', nonce: 42 },
 { id: 2, data: 'Tx1', nonce: 15 },
 { id: 3, data: 'Tx2', nonce: 99 },
 ]);

 const computeHash = (id: number, data: string, prevHash: number, nonce: number) => {
 let dataSum = 0;
 for (let i = 0; i < data.length; i++) dataSum += data.charCodeAt(i);
 return Math.abs(id * 100 + dataSum * 13 + prevHash * 7 + nonce * 31) % 10000;
 };

 const blocks = useMemo(() => {
 const computed = [];
 let prevHash = 0;
 for (const b of rawBlocks) {
  const hash = computeHash(b.id, b.data, prevHash, b.nonce);
  computed.push({ ...b, prevHash, hash });
  prevHash = hash;
 }
 return computed;
 }, [rawBlocks]);

 const updateBlock = (index: number, field: string, value: string | number) => {
 const newRaw = [...rawBlocks];
 newRaw[index] = { ...newRaw[index], [field]: value as never };
 setRawBlocks(newRaw);
 };

 const [assessmentAns, setAssessmentAns] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const checkAnswer = () => {
 if (activeTab === 'iot') {
  if (parseInt(assessmentAns) === pressureThreshold) {
  setFeedback('Correct! The alarm only triggers when pressure exceeds the threshold AND motion is detected.');
  } else {
  setFeedback('Incorrect. Check your threshold slider setting.');
  }
 } else {
  const b2 = blocks[1];
  if (b2.hash < 1000) {
  if (parseInt(assessmentAns) === b2.nonce) {
   setFeedback('Correct! You successfully mined the block by finding a valid nonce.');
  } else {
   setFeedback('Incorrect. Make sure you entered the correct valid nonce from Block 2.');
  }
  } else {
  setFeedback('Block 2 is not valid yet. Adjust the nonce until its Hash is < 1000 (turns green).');
  }
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs11applications_lab_advanced_tech_applications')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs11applications_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs11applications_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 lg:overflow-visible">
  {/* Left Col */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 shrink-0">{t('lab.cs11applications_concepts_theory')}</h2>
   
   <div className={`flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg shrink-0 flex-col `}>
   <button 
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'iot' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setActiveTab('iot'); setFeedback(null); setAssessmentAns(''); }}
   >
    
                             {t('lab.cs11applications_iot_systems')}
                            </button>
   <button 
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'blockchain' ? 'bg-slate-50 dark:bg-[#121212] shadow text-indigo-600' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
    onClick={() => { setActiveTab('blockchain'); setFeedback(null); setAssessmentAns(''); }}
   >
    
                             {t('lab.cs11applications_blockchain')}
                            </button>
   </div>

   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm mt-2">
   {activeTab === 'iot' ? (
    <>
    <p><strong>{t('lab.cs11applications_internet_of_things_iot')}</strong>  {t('lab.cs11applications_refers_to_interconnected_physi')}</p>
    <p>{t('lab.cs11applications_our_virtual_testbench_features')}</p>
    <ul className="list-disc pl-5 space-y-1">
     <li><strong>{t('lab.cs11applications_pir_sensor')}</strong>  {t('lab.cs11applications_detects_motion_boolean_true_fa')}</li>
     <li><strong>{t('lab.cs11applications_pressure_pad')}</strong>  {t('lab.cs11applications_detects_physical_weight_analog')}</li>
     <li><strong>{t('lab.cs11applications_logic_controller')}</strong>  {t('lab.cs11applications_combines_inputs_using_boolean_')}</li>
    </ul>
    <div className={`p-3 bg-slate-50 dark:bg-[#121212] border rounded-md font-mono text-xs text-blue-800 mt-4 dark:text-[#ffffff] flex-col `}>
     
                                      {t('lab.cs11applications_if_motion_true_pressure_gt_thr')} {"{\n triggerAlarm();\n}"}
    </div>
    </>
   ) : (
    <>
    <p><strong>{t('lab.cs11applications_blockchain')}</strong>  {t('lab.cs11applications_is_a_distributed_immutable_led')}</p>
    <p>{t('lab.cs11applications_key_properties_of_our_simulato')}</p>
    <ul className="list-disc pl-5 space-y-2">
     <li><strong>{t('lab.cs11applications_cryptographic_hash')}</strong>  {t('lab.cs11applications_a_unique_digital_fingerprint_i')}</li>
     <li><strong>{t('lab.cs11applications_chain')}</strong>  {t('lab.cs11applications_each_block_contains_the_previo')}</li>
     <li><strong>{t('lab.cs11applications_mining_proof_of_work')}</strong>  {t('lab.cs11applications_to_make_a_block_valid_on_the_n')} <strong>{t('lab.cs11applications_nonce')}</strong>  {t('lab.cs11applications_to_find_a_valid_hash')}</li>
    </ul>
    </>
   )}
   </div>
  </div>

  {/* Middle Col */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">
   {activeTab === 'iot' ? 'IoT Testbench Simulator' : 'Distributed Ledger Simulator'}
   </h2>

   {activeTab === 'iot' ? (
   <div className={`flex-1 flex flex-col items-center justify-center gap-8 border rounded-lg bg-slate-50 dark:bg-[#121212] p-6 min-h-[400px] `}>
    <div className="flex flex-wrap gap-8 items-center w-full justify-center">
    <div className={`flex flex-col items-center gap-4 bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border shadow-sm w-48 `}>
     <div className="font-semibold text-slate-700 dark:text-[#ffffff] flex items-center gap-2">
     <Radio size={18} className="text-blue-500" />  {t('lab.cs11applications_pir_sensor_1')}
                                          </div>
     <button 
     onClick={() => setMotion(!motion)}
     className={`w-16 h-16 rounded-full flex items-center justify-center border-4 font-bold transition-all duration-300 ${motion ? 'border-green-500 bg-green-100 text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border-slate-300 dark:border-[#1c1b1b] bg-slate-100 dark:bg-[#121212] text-slate-400'}`}
     >
     {motion ? 'ON' : 'OFF'}
     </button>
     <span className="text-xs text-slate-500 dark:text-[#71717a] uppercase tracking-wider">{t('lab.cs11applications_toggle_motion')}</span>
    </div>

    <div className="flex flex-col items-center gap-4 bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border shadow-sm w-48">
     <div className="font-semibold text-slate-700 dark:text-[#ffffff] flex items-center gap-2">
     <Cpu size={18} className="text-orange-500" />  {t('lab.cs11applications_pressure_pad_1')}
                                          </div>
     <div className="text-2xl font-bold font-mono text-slate-800 dark:text-[#ffffff]">{pressure} kg</div>
     <input 
     type="range" min="0" max="100" value={pressure} 
     onChange={(e) => setPressure(parseInt(e.target.value))} 
     className="w-full accent-orange-500"
     />
     <div className="w-full px-2 mt-2">
     <label className="text-xs text-slate-500 dark:text-[#71717a] flex justify-between items-center font-bold">
      
                                               {t('lab.cs11applications_threshold')} 
                                               <input 
      type="number" className="w-14 border rounded px-1 py-1 text-center font-mono text-sm outline-none focus:border-orange-400"
      value={pressureThreshold} onChange={(e) => setPressureThreshold(parseInt(e.target.value) || 0)}
      />
     </label>
     </div>
    </div>
    </div>

    <div className="w-1 h-12 bg-slate-300 dark:bg-[#121212] relative">
     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#121212] dark:bg-[#121212] px-3 py-1 text-xs font-bold text-white rounded-md shadow">{t('lab.cs11applications_and_logic')}</div>
    </div>

    <div className={`p-6 rounded-2xl border-4 flex items-center justify-center gap-4 w-64 transition-all duration-300 ${alarmOn ? 'bg-red-100 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-slate-100 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b]'}`}>
    <AlertTriangle size={36} className={alarmOn ? 'text-red-600 animate-pulse' : 'text-slate-400'} />
    <span className={`text-2xl font-bold ${alarmOn ? 'text-red-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}>
     
                                      {t('lab.cs11applications_alarm')} {alarmOn ? 'TRIGGERED' : 'OFF'}
    </span>
    </div>
   </div>
   ) : (
   <div className="flex-1 flex flex-col gap-4 border rounded-lg bg-slate-50 dark:bg-[#121212] p-4 lg:overflow-y-auto">
    {blocks.map((block, i) => {
    const isValid = block.hash < 1000;
    return (
     <div key={block.id} className={`p-4 rounded-xl border-2 transition-colors ${isValid ? 'border-green-400 bg-green-50/50' : 'border-red-400 bg-red-50/50'}`}>
     <div className="flex justify-between items-center mb-3">
      <h3 className="font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <Shield size={16} className={isValid ? 'text-green-600' : 'text-red-600'} /> 
       
                          {t('lab.cs11applications_block')}{block.id}
      </h3>
      <span className={`text-xs font-bold px-2 py-1 rounded ${isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isValid ? 'VALID (Hash < 1000)' : 'INVALID'}
      </span>
     </div>

     <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
      <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] block mb-1">{t('lab.cs11applications_payload_data')}</label>
      <input 
       type="text" value={block.data} 
       onChange={(e) => updateBlock(i, 'data', e.target.value)}
       className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-2 py-1.5 focus:border-indigo-400 outline-none transition-colors"
      />
      </div>
      <div>
      <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] block mb-1">{t('lab.cs11applications_nonce_mining_guess')}</label>
      <div className="flex gap-1">
       <input 
       type="number" value={block.nonce} 
       onChange={(e) => updateBlock(i, 'nonce', parseInt(e.target.value) || 0)}
       className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-2 py-1.5 focus:border-indigo-400 outline-none font-mono"
       />
       <button 
       onClick={() => updateBlock(i, 'nonce', block.nonce + 1)}
       className="px-3 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] rounded font-bold text-slate-700 dark:text-[#ffffff] transition-colors"
       >
       +
       </button>
      </div>
      </div>
      <div className="col-span-2 flex justify-between bg-slate-50 dark:!bg-[#121212] p-3 rounded-lg border shadow-sm mt-1">
      <div className="flex flex-col w-1/2 pr-3 border-r text-xs">
       <span className="text-slate-400 font-bold uppercase mb-1">{t('lab.cs11applications_previous_hash')}</span>
       <span className="font-mono text-slate-600 dark:text-[#a1a1aa] text-lg tracking-widest">{block.prevHash.toString().padStart(4, '0')}</span>
      </div>
      <div className="flex flex-col w-1/2 pl-3 text-xs">
       <span className="text-slate-400 font-bold uppercase mb-1">{t('lab.cs11applications_block_hash')}</span>
       <span className={`font-mono font-bold text-lg tracking-widest ${isValid ? 'text-green-600' : 'text-red-600'}`}>{block.hash.toString().padStart(4, '0')}</span>
      </div>
      </div>
     </div>
     </div>
    );
    })}
   </div>
   )}
  </div>

  {/* Right Col */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">{t('lab.cs11applications_assessment_validation')}</h2>
   
   <div className="space-y-6 flex-1 pr-2">
   {activeTab === 'iot' ? (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">{t('lab.cs11applications_q_iot_logic_configuration')}</h3>
    <p className="text-sm text-blue-900 mb-4 leading-relaxed dark:text-[#ffffff]">
     
                                      {t('lab.cs11applications_in_order_for_the_alarm_to_trig')} <strong>{t('lab.cs11applications_threshold_1')}</strong>  {t('lab.cs11applications_value_currently_configured_in_')}
                                     </p>
    <div className="flex gap-2">
     <input
     type="number"
     value={assessmentAns}
     onChange={e => setAssessmentAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
     placeholder={t('lab.cs11applications_enter_threshold')}
     />
     <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.cs11applications_submit')}</button>
    </div>
    </div>
   ) : (
    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-indigo-800 mb-2 dark:text-[#ffffff]">{t('lab.cs11applications_q_proof_of_work_mining')}</h3>
    <p className="text-sm text-indigo-900 mb-4 leading-relaxed dark:text-[#ffffff]">
     
                                          {t('lab.cs11applications_a_block_is_only_cryptographica')} <strong>{t('lab.cs11applications_block_2')}</strong>  {t('lab.cs11applications_by_adjusting_it_until_the_bloc')}
                                         </p>
    <div className="flex gap-2">
     <input
     type="number"
     value={assessmentAns}
     onChange={e => setAssessmentAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
     placeholder={t('lab.cs11applications_enter_valid_nonce')}
     />
     <button onClick={checkAnswer} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-sm transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.cs11applications_submit')}</button>
    </div>
    </div>
   )}

   {feedback && (
    <div className={`p-4 rounded-lg flex items-start gap-3 text-sm font-medium border ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
    <div className="mt-0.5">
     {feedback.includes('Correct') ? <CheckCircle size={18} /> : <XCircle size={18} />}
    </div>
    <div className="leading-relaxed">{feedback}</div>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
