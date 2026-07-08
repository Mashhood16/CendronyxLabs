import { useState, useEffect } from 'react';
import { BookOpen, Settings, Activity, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10NumberSystems({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'convert' | 'arithmetic' | 'complements'>('convert');

 // Conversion State
 const [convInput, setConvInput] = useState<string>('10');
 const [convBaseIn, setConvBaseIn] = useState<number>(10);
 const [convBaseOut, setConvBaseOut] = useState<number>(2);
 const [convResult, setConvResult] = useState<string>('1010');

 // Arithmetic State
 const [arithA, setArithA] = useState<string>('1010');
 const [arithB, setArithB] = useState<string>('0101');
 const [arithOp, setArithOp] = useState<'+' | '-'>('+');
 const [arithResult, setArithResult] = useState<string>('1111');

 // Complements State
 const [compInput, setCompInput] = useState<string>('1010');
 const [comp1, setComp1] = useState<string>('0101');
 const [comp2, setComp2] = useState<string>('0110');

 // Assessment State
 const [questionVal, setQuestionVal] = useState<number>(45);
 const [questionBaseIn, setQuestionBaseIn] = useState<number>(10);
 const [questionBaseOut, setQuestionBaseOut] = useState<number>(2);
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 const [logs, setLogs] = useState<string[]>([]);

 useEffect(() => {
 generateQuestion();
 }, []);

 const generateQuestion = () => {
 const bases = [2, 8, 10, 16];
 const bIn = bases[Math.floor(Math.random() * bases.length)];
 let bOut = bases[Math.floor(Math.random() * bases.length)];
 while (bOut === bIn) {
  bOut = bases[Math.floor(Math.random() * bases.length)];
 }
 const val = Math.floor(Math.random() * 255) + 1;
 setQuestionVal(val);
 setQuestionBaseIn(bIn);
 setQuestionBaseOut(bOut);
 setAnswer('');
 setIsCorrect(null);
 };

 const handleConvert = () => {
 try {
  const parsed = parseInt(convInput, convBaseIn);
  if (isNaN(parsed)) {
  setConvResult('Invalid Input');
  return;
  }
  const res = parsed.toString(convBaseOut).toUpperCase();
  setConvResult(res);
  addLog(`Converted ${convInput} (Base ${convBaseIn}) to ${res} (Base ${convBaseOut})`);
 } catch (e) {
  setConvResult('Error');
 }
 };

 const handleArithmetic = () => {
 try {
  const a = parseInt(arithA, 2);
  const b = parseInt(arithB, 2);
  if (isNaN(a) || isNaN(b)) {
  setArithResult('Invalid Binary');
  return;
  }
  let res = 0;
  if (arithOp === '+') res = a + b;
  if (arithOp === '-') res = a - b;
  const binRes = res >= 0 ? res.toString(2) : '-' + Math.abs(res).toString(2);
  setArithResult(binRes);
  addLog(`Arithmetic: ${arithA} ${arithOp} ${arithB} = ${binRes}`);
 } catch (e) {
  setArithResult('Error');
 }
 };

 const handleComplements = () => {
 try {
  if (!/^[01]+$/.test(compInput)) {
  setComp1('Invalid Binary');
  setComp2('Invalid Binary');
  return;
  }
  let c1 = '';
  for (let i = 0; i < compInput.length; i++) {
  c1 += compInput[i] === '1' ? '0' : '1';
  }
  setComp1(c1);
  const valC1 = parseInt(c1, 2);
  const valC2 = valC1 + 1;
  let c2 = valC2.toString(2);
  if (c2.length < compInput.length) {
   c2 = c2.padStart(compInput.length, '0');
  } else if (c2.length > compInput.length) {
   c2 = c2.slice(c2.length - compInput.length);
  }
  setComp2(c2);
  addLog(`Complements for ${compInput}: 1s=${c1}, 2s=${c2}`);
 } catch (e) {
  setComp1('Error');
  setComp2('Error');
 }
 };

 const checkAnswer = () => {
 const correctVal = questionVal.toString(questionBaseOut).toUpperCase();
 if (answer.trim().toUpperCase() === correctVal) {
  setIsCorrect(true);
  addLog(`Assessment Passed: ${questionVal.toString(questionBaseIn).toUpperCase()} (Base ${questionBaseIn}) = ${correctVal} (Base ${questionBaseOut})`);
 } else {
  setIsCorrect(false);
    setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 const addLog = (msg: string) => {
 setLogs(prev => [...prev, msg]);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <LabHeader onExit={onExit} title={t('lab.cs10numbersystems_number_systems_virtual_lab')} />

  {/* Main Content */}
  <div className="flex-1 p-6">
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                         {t('lab.cs10numbersystems_theory')}
                        </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs10numbersystems_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full lg:overflow-visible">
   
   {/* Column 1: Theory */}
   <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:h-full lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-indigo-600">
    <BookOpen className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10numbersystems_theory_concepts')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
    <strong>{t('lab.cs10numbersystems_number_systems')}</strong>  {t('lab.cs10numbersystems_are_ways_to_represent_quantiti')}
                                 </p>
    <ul className="list-disc pl-5">
    <li><strong>{t('lab.cs10numbersystems_decimal_base_10')}</strong>  {t('lab.cs10numbersystems_digits_0_9_our_daily_system')}</li>
    <li><strong>{t('lab.cs10numbersystems_binary_base_2')}</strong>  {t('lab.cs10numbersystems_digits_0_1_used_in_digital_ele')}</li>
    <li><strong>{t('lab.cs10numbersystems_octal_base_8')}</strong>  {t('lab.cs10numbersystems_digits_0_7')}</li>
    <li><strong>{t('lab.cs10numbersystems_hexadecimal_base_16')}</strong>  {t('lab.cs10numbersystems_digits_0_9_a_f_used_for_memory')}</li>
    </ul>
    <p>
    <strong>{t('lab.cs10numbersystems_binary_arithmetic')}</strong>  {t('lab.cs10numbersystems_follows_similar_rules_to_decim')}
                                 </p>
    <p>
    <strong>{t('lab.cs10numbersystems_1_s_complement')}</strong>  {t('lab.cs10numbersystems_flip_all_bits_0_becomes_1_1_be')}<br/>
    <strong>{t('lab.cs10numbersystems_2_s_complement')}</strong>  {t('lab.cs10numbersystems_add_1_to_the_1_s_complement_us')}
                                 </p>
   </div>
   </div>

   {/* Column 2: Simulation */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col lg:h-full '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-emerald-600">
    <Settings className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10numbersystems_interactive_tools')}</h2>
   </div>

   <div className="flex gap-2 mb-4 border-b pb-2">
    <button 
    onClick={() => setActiveTab('convert')}
    className={`px-3 py-1 rounded ${activeTab === 'convert' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    
                                 {t('lab.cs10numbersystems_conversion')}
                                 </button>
    <button 
    onClick={() => setActiveTab('arithmetic')}
    className={`px-3 py-1 rounded ${activeTab === 'arithmetic' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    
                                 {t('lab.cs10numbersystems_arithmetic')}
                                 </button>
    <button 
    onClick={() => setActiveTab('complements')}
    className={`px-3 py-1 rounded ${activeTab === 'complements' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    
                                 {t('lab.cs10numbersystems_complements')}
                                 </button>
   </div>

   <div className="flex-1 flex flex-col gap-4">
    {activeTab === 'convert' && (
    <div className={`flex flex-col gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg `}>
     <div>
     <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_input_value')}</label>
     <input type="text" value={convInput} onChange={e => setConvInput(e.target.value)} className="border rounded p-2 w-full" />
     </div>
     <div className="flex gap-4">
     <div className="flex-1">
      <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_from_base')}</label>
      <select value={convBaseIn} onChange={e => setConvBaseIn(Number(e.target.value))} className="border rounded p-2 w-full">
      <option value={2}>{t('lab.cs10numbersystems_binary_2')}</option>
      <option value={8}>{t('lab.cs10numbersystems_octal_8')}</option>
      <option value={10}>{t('lab.cs10numbersystems_decimal_10')}</option>
      <option value={16}>{t('lab.cs10numbersystems_hex_16')}</option>
      </select>
     </div>
     <div className="flex-1">
      <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_to_base')}</label>
      <select value={convBaseOut} onChange={e => setConvBaseOut(Number(e.target.value))} className="border rounded p-2 w-full">
      <option value={2}>{t('lab.cs10numbersystems_binary_2')}</option>
      <option value={8}>{t('lab.cs10numbersystems_octal_8')}</option>
      <option value={10}>{t('lab.cs10numbersystems_decimal_10')}</option>
      <option value={16}>{t('lab.cs10numbersystems_hex_16')}</option>
      </select>
     </div>
     </div>
     <button onClick={handleConvert} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">{t('lab.cs10numbersystems_convert')}</button>
     <div className={`mt-2 p-3 bg-slate-50 dark:bg-[#121212] border rounded text-center flex-col `}>
     <span className="text-sm text-slate-500 dark:text-[#71717a]">{t('lab.cs10numbersystems_result')}</span>
     <div className="text-2xl font-mono font-bold mt-1 text-slate-800 dark:text-[#ffffff]">{convResult}</div>
     </div>
    </div>
    )}

    {activeTab === 'arithmetic' && (
    <div className={`flex flex-col gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg `}>
     <div>
     <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_binary_a')}</label>
     <input type="text" value={arithA} onChange={e => setArithA(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
     </div>
     <div>
     <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_operation')}</label>
     <select value={arithOp} onChange={e => setArithOp(e.target.value as '+' | '-')} className="border rounded p-2 w-full">
      <option value="+">{t('lab.cs10numbersystems_addition')}</option>
      <option value="-">{t('lab.cs10numbersystems_subtraction')}</option>
     </select>
     </div>
     <div>
     <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_binary_b')}</label>
     <input type="text" value={arithB} onChange={e => setArithB(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
     </div>
     <button onClick={handleArithmetic} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">{t('lab.cs10numbersystems_calculate')}</button>
     <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] border rounded text-center">
     <span className="text-sm text-slate-500 dark:text-[#71717a]">{t('lab.cs10numbersystems_result')}</span>
     <div className="text-2xl font-mono font-bold mt-1 text-slate-800 dark:text-[#ffffff]">{arithResult}</div>
     </div>
    </div>
    )}

    {activeTab === 'complements' && (
    <div className="flex flex-col gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg">
     <div>
     <label className="block text-sm font-medium mb-1">{t('lab.cs10numbersystems_input_binary')}</label>
     <input type="text" value={compInput} onChange={e => setCompInput(e.target.value.replace(/[^01]/g, ''))} className="border rounded p-2 w-full font-mono" />
     </div>
     <button onClick={handleComplements} className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">{t('lab.cs10numbersystems_calculate_complements')}</button>
     <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] border rounded">
     <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-slate-500 dark:text-[#71717a]">{t('lab.cs10numbersystems_1_s_complement')}</span>
      <span className="text-lg font-mono font-bold text-slate-800 dark:text-[#ffffff]">{comp1}</span>
     </div>
     <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500 dark:text-[#71717a]">{t('lab.cs10numbersystems_2_s_complement')}</span>
      <span className="text-lg font-mono font-bold text-slate-800 dark:text-[#ffffff]">{comp2}</span>
     </div>
     </div>
    </div>
    )}
   </div>
   </div>

   {/* Column 3: Analysis/Assessment */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col lg:h-full '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-blue-600">
    <Activity className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10numbersystems_assessment_logs')}</h2>
   </div>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <Calculator className="w-4 h-4" />
    
                                 {t('lab.cs10numbersystems_practice_challenge')}
                                 </h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                                 {t('lab.cs10numbersystems_convert')} <strong className="font-mono text-base">{questionVal.toString(questionBaseIn).toUpperCase()}</strong>  {t('lab.cs10numbersystems_base')} {questionBaseIn}{t('lab.cs10numbersystems_to_base_1')} {questionBaseOut}.
    </p>
    <div className="flex gap-2">
    <input
     type="text"
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     className="border rounded px-3 py-2 flex-1"
     placeholder={t('lab.cs10numbersystems_your_answer')}
    />
    <button
     onClick={checkAnswer}
     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     
                                      {t('lab.cs10numbersystems_check')}
                                     </button>
    </div>
    {isCorrect !== null && (
    <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
     {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
     <span className="font-medium">{isCorrect ? 'Correct! Well done.' : 'Incorrect, try again.'}</span>
    </div>
    )}
    {isCorrect && (
    <button onClick={generateQuestion} className="mt-3 text-sm text-blue-600 hover:underline">
     
                                      {t('lab.cs10numbersystems_new_question')}
                                     </button>
    )}
   </div>

   <div className="flex-1 flex flex-col">
    <h3 className="font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10numbersystems_activity_log')}</h3>
    <div className="flex-1 bg-slate-50 dark:bg-[#121212] border rounded p-3 lg:overflow-y-auto text-sm font-mono text-slate-600 dark:text-[#a1a1aa]">
    {logs.length === 0 && <span className="text-slate-400">{t('lab.cs10numbersystems_no_activity_yet')}</span>}
    {logs.map((log, i) => (
     <div key={i} className="mb-1 border-b border-slate-100 pb-1">
     <span className="text-slate-400 mr-2">[{i + 1}]</span>
     {log}
     </div>
    ))}
    </div>
   </div>
   
   </div>
  </div>
  </div>
 </div>
 );
}
