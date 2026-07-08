import { useState, useEffect, useRef } from 'react';
import { BookOpen, Code, Activity, RefreshCw, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10HelloWorld({ onExit }: LabProps) {
 const { setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [htmlCode, setHtmlCode] = useState<string>('<div id="box" class="box">\n Hello World!\n</div>\n<button onclick="changeText()">Click Me</button>');
 const [cssCode, setCssCode] = useState<string>('.box {\n padding: 20px;\n background: #e2e8f0;\n border-radius: 8px;\n text-align: center;\n margin-bottom: 10px;\n font-family: sans-serif;\n font-weight: bold;\n}');
 const [jsCode, setJsCode] = useState<string>('function changeText() {\n document.getElementById("box").innerHTML = "Welcome to Grade 10 CS!";\n document.getElementById("box").style.background = "#86efac";\n}');

 const iframeRef = useRef<HTMLIFrameElement>(null);
 
 const [questionIndex, setQuestionIndex] = useState<number>(0);
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 const [logs, setLogs] = useState<string[]>([]);

 const questions = [
 {
  q: "What HTML tag is used to create a clickable button?",
  a: "button"
 },
 {
  q: "Which JS method finds an element by its ID?",
  a: "getElementById"
 },
 {
  q: "In CSS, which property changes the background color?",
  a: "background"
 }
 ];

 const updatePreview = () => {
 if (!iframeRef.current) return;
 const document = iframeRef.current.contentDocument;
 if (document) {
  document.open();
  document.write(`
  <!DOCTYPE html>
  <html>
   <head>
   <style>${cssCode}</style>
   </head>
   <body>
   ${htmlCode}
   <script>
    ${jsCode}
   </script>
   </body>
  </html>
  `);
  document.close();
  addLog('Preview refreshed.');
 }
 };

 useEffect(() => {
 // Small delay to allow iframe to mount
 const timer = setTimeout(() => {
  updatePreview();
 }, 100);
 return () => clearTimeout(timer);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const handleRefresh = () => {
 updatePreview();
 };

 const checkAnswer = () => {
 const correct = questions[questionIndex].a.toLowerCase();
 if (answer.trim().toLowerCase() === correct) {
  setIsCorrect(true);
  addLog(`Assessment Q${questionIndex + 1} passed.`);
 } else {
  setIsCorrect(false);
    setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 const nextQuestion = () => {
 if (questionIndex < questions.length - 1) {
  setQuestionIndex(prev => prev + 1);
  setAnswer('');
  setIsCorrect(null);
 }
 };

 const addLog = (msg: string) => {
 setLogs(prev => [...prev, msg]);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs10helloworld_hello_world_virtual_web_dev')} />

  <div className="flex-1 p-6">
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                         {t('lab.cs10helloworld_theory')}
                        </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs10helloworld_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full lg:overflow-visible">
   
   {/* Column 1: Theory */}
   <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:h-full lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-orange-600">
    <BookOpen className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10helloworld_web_basics_theory')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
    
                                 {t('lab.cs10helloworld_a_web_page_is_typically_built_')}
                                 </p>
    <ul className="list-disc pl-5">
    <li><strong>{t('lab.cs10helloworld_html_hypertext_markup_language')}</strong>  {t('lab.cs10helloworld_provides_the_structure_of_the_')} <code>{t('lab.cs10helloworld_lt_div_gt')}</code>  {t('lab.cs10helloworld_and')} <code>{t('lab.cs10helloworld_lt_button_gt')}</code>  {t('lab.cs10helloworld_to_define_elements')}</li>
    <li><strong>{t('lab.cs10helloworld_css_cascading_style_sheets')}</strong>  {t('lab.cs10helloworld_defines_the_visual_appearance_')}</li>
    <li><strong>{t('lab.cs10helloworld_javascript_js')}</strong>  {t('lab.cs10helloworld_adds_interactivity_and_logic_i')}</li>
    </ul>
    <p>
    
                                 {t('lab.cs10helloworld_in_this_lab_you_have_a_small_c')} <strong>{t('lab.cs10helloworld_html')}</strong>  {t('lab.cs10helloworld_text_the')} <strong>{t('lab.cs10helloworld_css')}</strong>  {t('lab.cs10helloworld_colors_or_the')} <strong>JS</strong>  {t('lab.cs10helloworld_function_to_see_how_it_affects')}
                                 </p>
   </div>
   </div>

   {/* Column 2: Simulation/Builder */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col lg:h-full '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2 text-indigo-600">
    <Code className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10helloworld_code_editor_preview')}</h2>
    </div>
    <button onClick={handleRefresh} className={`flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100 transition dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <RefreshCw className="w-4 h-4" />  {t('lab.cs10helloworld_run_code')}
                                 </button>
   </div>

   <div className="flex flex-col gap-4 flex-1">
    {/* Editors */}
    <div className="flex flex-col gap-2 h-1/2 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="flex-1 flex flex-col">
     <label className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-1">{t('lab.cs10helloworld_html')}</label>
     <textarea 
     value={htmlCode} 
     onChange={e => setHtmlCode(e.target.value)} 
     className={`flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 dark:bg-[#121212] resize-none outline-none focus:border-indigo-400 flex-col `}
     />
    </div>
    <div className="flex gap-2 flex-1">
     <div className="flex-1 flex flex-col">
     <label className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-1">{t('lab.cs10helloworld_css')}</label>
     <textarea 
      value={cssCode} 
      onChange={e => setCssCode(e.target.value)} 
      className={`flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 dark:bg-[#121212] resize-none outline-none focus:border-indigo-400 flex-col `}
     />
     </div>
     <div className="flex-1 flex flex-col">
     <label className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-1">{t('lab.cs10helloworld_javascript')}</label>
     <textarea 
      value={jsCode} 
      onChange={e => setJsCode(e.target.value)} 
      className="flex-1 w-full p-2 border rounded font-mono text-xs bg-slate-50 dark:bg-[#121212] resize-none outline-none focus:border-indigo-400"
     />
     </div>
    </div>
    </div>

    {/* Preview */}
    <div className="flex-1 flex flex-col border rounded overflow-hidden relative">
    <div className="bg-slate-200 dark:bg-[#121212] px-3 py-1 text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] border-b flex justify-between">
     <span>{t('lab.cs10helloworld_live_preview')}</span>
    </div>
    <iframe 
     ref={iframeRef} 
     title={t('lab.cs10helloworld_preview')} 
     className="w-full flex-1 bg-slate-50 dark:bg-[#121212]"
     sandbox="allow-scripts allow-same-origin"
    />
    </div>
   </div>
   </div>

   {/* Column 3: Analysis/Assessment */}
   <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col h-full ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-indigo-600">
    <Activity className="w-5 h-5" />
    <h2 className="text-lg font-semibold">{t('lab.cs10helloworld_assessment_logs')}</h2>
   </div>

   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-medium text-indigo-800 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <Terminal className="w-4 h-4" />
    
                                 {t('lab.cs10helloworld_knowledge_check')}{questionIndex + 1}/{questions.length})
    </h3>
    <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-3">
    {questions[questionIndex].q}
    </p>
    <div className="flex gap-2">
    <input
     type="text"
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     className="border rounded px-3 py-2 flex-1 outline-none focus:border-indigo-400"
     placeholder={t('lab.cs10helloworld_your_answer')}
    />
    <button
     onClick={checkAnswer}
     className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     
                                      {t('lab.cs10helloworld_check')}
                                     </button>
    </div>
    {isCorrect !== null && (
    <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
     {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
     <span className="font-medium text-sm">{isCorrect ? 'Correct!' : 'Incorrect, try again.'}</span>
    </div>
    )}
    {isCorrect && questionIndex < questions.length - 1 && (
    <button onClick={nextQuestion} className="mt-3 text-sm text-indigo-600 hover:underline">
     
                                      {t('lab.cs10helloworld_next_question_rarr')}
                                     </button>
    )}
   </div>

   <div className="flex-1 flex flex-col">
    <h3 className="font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10helloworld_editor_logs')}</h3>
    <div className="flex-1 bg-slate-50 dark:bg-[#121212] border rounded p-3 lg:overflow-y-auto text-sm font-mono text-slate-600 dark:text-[#a1a1aa]">
    {logs.length === 0 && <span className="text-slate-400">{t('lab.cs10helloworld_no_events_logged')}</span>}
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
