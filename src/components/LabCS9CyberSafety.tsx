import { useState, useEffect, useRef } from 'react';
import { Smartphone, Shield, ShieldAlert, CheckCircle, Activity, AlertTriangle, MessageSquare, AlertOctagon } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit?: () => void;
}

type Message = {
 id: number;
 sender: string;
 text: string;
 type: 'phishing' | 'bullying' | 'fakeNews' | 'info';
 options: { text: string; safeChoice: boolean; impactText: string }[];
};

const scenarios: Message[] = [
 {
  id: 1,
  sender: "Security Alert",
  text: "Your account will be suspended! Click here to verify your password immediately: http://verify-secure-login.com/login",
  type: 'phishing',
  options: [
   { text: "Click the link and enter password", safeChoice: false, impactText: "You fell for a phishing attack! Your account is compromised." },
   { text: "Ignore and delete message", safeChoice: true, impactText: "Good job! Recognizing fake URLs and urgency is key to avoiding phishing." }
  ]
 },
 {
  id: 2,
  sender: "School Gossip Page",
  text: "Did you hear what Alex did? Everyone is sharing this embarrassing photo! [Forward Message?]",
  type: 'bullying',
  options: [
   { text: "Forward to friends", safeChoice: false, impactText: "You participated in cyberbullying. Always think before sharing." },
   { text: "Report the post and don't share", safeChoice: true, impactText: "Excellent! Stopping the spread of hurtful content helps others." }
  ]
 },
 {
  id: 3,
  sender: "Daily News Feed",
  text: "BREAKING: Scientists discover aliens living in the core of the Earth! Share to spread the truth!",
  type: 'fakeNews',
  options: [
   { text: "Share immediately", safeChoice: false, impactText: "You spread fake news! Always verify sources before sharing." },
   { text: "Check reliable sources first", safeChoice: true, impactText: "Smart move! Cross-checking facts prevents misinformation." }
  ]
 }
];

export default function LabCS9CyberSafety({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [currentScenario, setCurrentScenario] = useState<number>(0);
 const [safetyScore, setSafetyScore] = useState<number>(100);
 const [chatLog, setChatLog] = useState<{sender: string, text: string, userAction: string, safe: boolean, impact: string}[]>([]);
 
 // Assessment State
 const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
 const [finalFeedback, setFinalFeedback] = useState('');
 const endOfSimRef = useRef<boolean>(false);

 useEffect(() => {
  if (currentScenario === -1) {
   endOfSimRef.current = true;
  }
 }, [currentScenario]);

 const handleChoice = (option: { text: string; safeChoice: boolean; impactText: string }) => {
  setChatLog(prev => [...prev, {
   sender: scenarios[currentScenario].sender,
   text: scenarios[currentScenario].text,
   userAction: option.text,
   safe: option.safeChoice,
   impact: option.impactText
  }]);

  if (!option.safeChoice) {
   setSafetyScore(prev => Math.max(0, prev - 34)); // deduct 34 so 3 mistakes = ~0
  }

  if (currentScenario < scenarios.length - 1) {
   setCurrentScenario(prev => prev + 1);
  } else {
   setCurrentScenario(-1); // End of simulator
  }
 };

 const calculateFinalAssessment = () => {
  setAssessmentScore(safetyScore);
  if (safetyScore >= 90) setFinalFeedback("Outstanding! You made extremely safe digital choices.");
  else if (safetyScore >= 50) setFinalFeedback("Fair. You survived, but fell for some traps. Review the safety rules.");
  else setFinalFeedback("Danger! Your digital footprint is severely compromised. Please retake the module.");
 };

 const gaugeWidth = `${safetyScore}%`;
 const gaugeColor = safetyScore > 70 ? 'bg-green-500' : safetyScore > 40 ? 'bg-yellow-500' : 'bg-red-500';

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.cs9cybersafety_cyber_safety_digital_footprint')} />

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs9cybersafety_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs9cybersafety_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
    {/* Column 1: Theory */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-100  ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
      <AlertOctagon className="w-6 h-6 text-teal-600" />
      
                           {t('lab.cs9cybersafety_digital_threats')}
                          </h2>
     <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
      <p>{t('lab.cs9cybersafety_in_the_digital_world_every_act')} <strong>{t('lab.cs9cybersafety_digital_footprint')}</strong>{t('lab.cs9cybersafety_being_aware_of_online_threats_')}</p>
      
      <div className="space-y-2">
       <h3 className="font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500"/>  {t('lab.cs9cybersafety_phishing')}</h3>
       <p className="pl-6 border-l-2 border-red-200">{t('lab.cs9cybersafety_deceptive_attempts_to_steal_se')}</p>
      </div>
      
      <div className="space-y-2">
       <h3 className="font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2"><MessageSquare className="w-4 h-4 text-orange-500"/>  {t('lab.cs9cybersafety_cyberbullying')}</h3>
       <p className="pl-6 border-l-2 border-orange-200">{t('lab.cs9cybersafety_using_digital_platforms_to_har')}</p>
      </div>

      <div className="space-y-2">
       <h3 className="font-bold text-slate-700 dark:text-[#ffffff] flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/>  {t('lab.cs9cybersafety_fake_news')}</h3>
       <p className="pl-6 border-l-2 border-yellow-200">{t('lab.cs9cybersafety_false_or_misleading_informatio')}</p>
      </div>
     </div>
    </div>

    {/* Column 2: Simulator */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col items-center border border-slate-100  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
      <Smartphone className="w-6 h-6 text-teal-600" />
      
                           {t('lab.cs9cybersafety_device_simulator')}
                          </h2>
     
     <div className={`w-full max-w-xs bg-[#000000] dark:!bg-[#121212] rounded-[2.5rem] p-3 shadow-2xl border-4 border-[#1c1b1b] dark:border-[#1c1b1b] relative mt-4 h-[500px] flex flex-col `}>
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-10">
       <div className={`w-32 h-6 bg-[#121212] dark:bg-[#121212] rounded-b-xl flex-col `}></div>
      </div>
      
      <div className="flex-1 bg-slate-100 dark:bg-[#121212] rounded-3xl overflow-hidden flex flex-col relative">
       {/* Screen Header */}
       <div className="bg-teal-600 p-4 pt-8 text-white shadow dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
        <p className="text-center font-semibold text-sm">{t('lab.cs9cybersafety_messages')}</p>
       </div>

       {/* Screen Body */}
       <div className="flex-1 p-4 flex flex-col justify-end">
        {currentScenario !== -1 ? (
         <div className="animate-in slide-in-from-bottom-4 fade-in">
          <p className="text-xs text-slate-500 dark:text-[#71717a] mb-1 font-semibold">{scenarios[currentScenario].sender}</p>
          <div className="bg-slate-50 dark:!bg-[#121212] p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-slate-200 dark:border-[#1c1b1b] mb-4">
           {scenarios[currentScenario].text}
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
           {scenarios[currentScenario].options.map((opt, idx) => (
            <button 
             key={idx}
             onClick={() => handleChoice(opt)}
             className="w-full bg-teal-500 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
            >
             {opt.text}
            </button>
           ))}
          </div>
         </div>
        ) : (
         <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Shield className="w-12 h-12 text-teal-500 mb-2" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-[#ffffff]">{t('lab.cs9cybersafety_simulation_complete')}</h3>
          <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mt-2">{t('lab.cs9cybersafety_check_the_analysis_panel_for_y')}</p>
         </div>
        )}
       </div>
      </div>
     </div>
    </div>

    {/* Column 3: Analysis */}
    <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-100">
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <Activity className="w-6 h-6 text-teal-600" />
      
                           {t('lab.cs9cybersafety_safety_log_analysis')}
                          </h2>

     <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
       <span className="font-semibold text-sm text-slate-700 dark:text-[#ffffff]">{t('lab.cs9cybersafety_overall_safety_score')}</span>
       <span className="font-bold text-lg text-teal-700">{safetyScore}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-[#121212] rounded-full h-3 overflow-hidden shadow-inner">
       <div className={`h-full transition-all duration-700 ease-out ${gaugeColor}`} style={{ width: gaugeWidth }}></div>
      </div>
     </div>
     
     <div className={`flex-1 lg:overflow-y-auto bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] mb-6 shadow-inner space-y-3 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
      <h3 className="font-semibold text-sm text-slate-700 dark:text-[#ffffff] border-b pb-1 border-slate-200 dark:border-[#1c1b1b]">{t('lab.cs9cybersafety_action_history')}</h3>
      {chatLog.length === 0 ? (
       <p className="text-xs text-slate-500 dark:text-[#71717a] italic text-center mt-4">{t('lab.cs9cybersafety_make_choices_on_the_device_to_')}</p>
      ) : (
       chatLog.map((log, i) => (
        <div key={i} className={`p-3 rounded border text-xs shadow-sm ${log.safe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
         <p className="font-semibold mb-1 flex items-center gap-1">
          {log.safe ? <CheckCircle className="w-3 h-3 text-green-600"/> : <ShieldAlert className="w-3 h-3 text-red-600"/>}
          
                             {t('lab.cs9cybersafety_scenario')} {log.sender}
         </p>
         <p className="text-slate-600 dark:text-[#a1a1aa] mb-2">{t('lab.cs9cybersafety_you_chose')}{log.userAction}"</p>
         <p className={`font-semibold ${log.safe ? 'text-green-700' : 'text-red-700'}`}>{log.impact}</p>
        </div>
       ))
      )}
     </div>

     <div className="bg-teal-50 p-5 rounded-lg border border-teal-200 shadow-sm">
      <h3 className="font-bold text-teal-900 mb-2 text-sm">{t('lab.cs9cybersafety_final_assessment')}</h3>
      <p className="text-xs text-teal-800 mb-4">{t('lab.cs9cybersafety_complete_all_scenarios_to_gene')}</p>
      
      <button 
       onClick={calculateFinalAssessment}
       disabled={currentScenario !== -1}
       className={`w-full py-2 rounded-md transition-colors text-sm font-semibold shadow-sm ${currentScenario === -1 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-300 dark:bg-[#121212] text-slate-500 dark:text-[#a1a1aa] cursor-not-allowed'}`}
      >
       
                                {t('lab.cs9cybersafety_generate_report')}
                               </button>
      
      {assessmentScore !== null && (
       <div className="mt-4 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-teal-100 shadow-sm">
        <p className="text-sm font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.cs9cybersafety_score')} {assessmentScore}/100</p>
        <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mt-1">{finalFeedback}</p>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
