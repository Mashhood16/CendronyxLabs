import { useState } from 'react';
import { Play, CheckCircle, XCircle, Code, BookOpen, ListChecks, Lightbulb } from 'lucide-react';
import LabHeader from './LabHeader';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import { useTranslate } from "../i18n";

interface LabCS9JavaScriptProps {
 onExit?: () => void;
}

export default function LabCS9JavaScript({ onExit }: LabCS9JavaScriptProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty] = useState<DifficultyLevel>('deep-dive');
 

 const [code, setCode] = useState(`// Write your logic here
// The variable 'score' is provided.
// You must return a grade as a string ('A+', 'A', 'B', 'C', 'F').

if (score >= 90) {
 return 'A+';
} else if (score >= 80) {
 return 'A';
} else {
 return 'F';
}
`);

 const [testResults, setTestResults] = useState<{score: number, expected: string, actual: string, passed: boolean}[]>([]);
 const [isPassed, setIsPassed] = useState(false);

 // Randomize test cases on load
 const [testCases] = useState(() => [
 { score: Math.floor(Math.random() * 5) + 95, expected: 'A+' }, // 95-99
 { score: Math.floor(Math.random() * 10) + 80, expected: 'A' }, // 80-89
 { score: Math.floor(Math.random() * 10) + 70, expected: 'B' }, // 70-79
 { score: Math.floor(Math.random() * 10) + 60, expected: 'C' }, // 60-69
 { score: Math.floor(Math.random() * 60), expected: 'F' },  // 0-59
 ]);

 const runCode = () => {
 try {
  // eslint-disable-next-line no-new-func
  const userFunc = new Function('score', code);
  const results = testCases.map(tc => {
  try {
   const actual = String(userFunc(tc.score));
   return {
   score: tc.score,
   expected: tc.expected,
   actual,
   passed: actual === tc.expected
   };
  } catch (err: any) {
   return {
   score: tc.score,
   expected: tc.expected,
   actual: 'Error: ' + err.message,
   passed: false
   };
  }
  });
  setTestResults(results);
  if (results.every(r => r.passed)) {
  setIsPassed(true);
  } else {
  setIsPassed(false);
  }
 } catch (err: any) {
  alert("Syntax Error in your code: " + err.message);
 }
 };

 const config = DIFFICULTY_CONFIGS['deep-dive'];

 // Step-by-step hint for "understand" mode
 const getHint = (): string => {
   if (difficulty !== 'understand') return '';
   return `Hint: Use "if/else if" statements to check score ranges.
   Start with: if (score >= 90) return 'A+';`;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <div className="flex items-center justify-between bg-indigo-600 text-white p-4 shadow-md dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
  <LabHeader onExit={onExit} title={t('lab.cs9javascript_javascript_logic_sandbox')} />
  </div>

  <div className="px-4 pt-2 bg-white dark:bg-[#1c1b1b]">
   
  </div>



  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs9javascript_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs9javascript_lab')}</button>
  </div>
  <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
   <BookOpen size={24} />  {t('lab.cs9javascript_theory_context')}
                        </h2>
   <div className={`prose prose-slate flex-1 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <p>
    
                             {t('lab.cs9javascript_in_javascript')} <code>{t('lab.cs9javascript_if_else')}</code>  {t('lab.cs9javascript_statements_allow_you_to_execut')}
                            </p>
   <h3 className="font-semibold text-lg mt-4 mb-2">{t('lab.cs9javascript_grading_system')}</h3>
   <p>{t('lab.cs9javascript_your_task_is_to_write_logic_to')} <code>{t('lab.cs9javascript_score')}</code>.</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><code>{t('lab.cs9javascript_score_gt_90')}</code> : <b>A+</b></li>
    <li><code>{t('lab.cs9javascript_score_gt_80')}</code>  {t('lab.cs9javascript_and')} <code>{t('lab.cs9javascript_lt_90')}</code> : <b>A</b></li>
    <li><code>{t('lab.cs9javascript_score_gt_70')}</code>  {t('lab.cs9javascript_and')} <code>{t('lab.cs9javascript_lt_80')}</code> : <b>B</b></li>
    <li><code>{t('lab.cs9javascript_score_gt_60')}</code>  {t('lab.cs9javascript_and')} <code>{t('lab.cs9javascript_lt_70')}</code> : <b>C</b></li>
    <li><code>{t('lab.cs9javascript_score_lt_60')}</code> : <b>F</b></li>
   </ul>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b] font-mono text-sm text-slate-700 dark:text-[#ffffff] mb-4 whitespace-pre-wrap flex-col `}>
    {`if (score >= 90) {\n return 'A+';\n} else if (score >= 80) {\n return 'A';\n}`}
   </div>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.cs9javascript_ensure_you_handle_all_possible')}
                            </p>
   {config.showHints && (
   <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-[#1c1b1b] border border-blue-200 dark:border-blue-900 flex gap-2">
    <Lightbulb size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-blue-700 dark:text-blue-300 font-mono whitespace-pre-wrap">{getHint()}</div>
   </div>
   )}
   </div>
  </div>

  {/* Middle Column: Interactive Sandbox */}
  <div className={`w-full bg-[#000000] dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col text-slate-100  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
   <Code size={24} />  {t('lab.cs9javascript_code_editor')}
                        </h2>
   <div className={`flex-1 flex flex-col gap-2 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <div className="font-mono text-sm text-slate-400">
    
                             {t('lab.cs9javascript_function_getgrade_score')} {'{'}
   </div>
   <textarea
    className="flex-1 w-full bg-[#121212] dark:bg-[#121212] text-green-400 p-4 font-mono text-sm rounded border border-[#1c1b1b] dark:border-[#1c1b1b] focus:outline-none focus:border-blue-500 resize-none"
    value={code}
    onChange={(e) => setCode(e.target.value)}
    spellCheck={false}
   />
   <div className="font-mono text-sm text-slate-400">
    {'}'}
   </div>
   </div>
   <button
   onClick={runCode}
   className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
   <Play size={20} />  {t('lab.cs9javascript_run_tests')}
                        </button>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
   <ListChecks size={24} />  {t('lab.cs9javascript_automated_test_suite')}
                        </h2>
   <div className="flex-1 lg:overflow-y-auto">
   {testResults.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
    <ListChecks size={48} className="opacity-50" />
    <p>{t('lab.cs9javascript_run_your_code_to_see_test_resu')}</p>
    </div>
   ) : (
    <div className="space-y-3">
    {testResults.map((result, idx) => (
     <div key={idx} className={`p-3 rounded-lg border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex flex-col gap-1 `}>
     <div className="flex items-center justify-between">
      <span className="font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.cs9javascript_test')} {idx + 1}{t('lab.cs9javascript_score_1')} {result.score}</span>
      {result.passed ? (
      <CheckCircle size={20} className="text-green-600" />
      ) : (
      <XCircle size={20} className="text-red-600" />
      )}
     </div>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa]">
      
                      {t('lab.cs9javascript_expected')} <span className="font-mono bg-slate-50 dark:bg-[#121212] px-1 border rounded">{result.expected}</span>
     </div>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa]">
      
                      {t('lab.cs9javascript_actual')} <span className="font-mono bg-slate-50 dark:bg-[#121212] px-1 border rounded text-red-600">{result.actual}</span>
     </div>
     </div>
    ))}
    </div>
   )}
   </div>
   {testResults.length > 0 && (
   <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${isPassed ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
    {isPassed ? (
     <>
      <div>{t('lab.cs9javascript_all_tests_passed_excellent_wor')}</div>
      {difficulty === 'understand' && <div className="text-sm mt-2">{t('lab.cs9javascript_try_apply_or_analyze_modes_for')}</div>}
      {difficulty === 'apply' && <div className="text-sm mt-2">{t('lab.cs9javascript_great_can_you_handle_the_analy')}</div>}
     </>
    ) : (
     <>
      <div>{t('lab.cs9javascript_some_tests_failed_check_your_l')}</div>
      {config.allowHints && <div className="text-sm mt-2">{t('lab.cs9javascript_review_the_hint_in_the_theory_')}</div>}
     </>
    )}
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
