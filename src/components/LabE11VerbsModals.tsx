import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, List, Activity, HelpCircle, AlertCircle } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1,
    type: "Modal Verbs",
    situation: "You see very dark clouds in the sky and hear loud thunder.",
    question: "Which modal verb best completes the deduction: 'It ___ rain soon.'?",
    options: ["must", "can't", "ought to", "would"],
    answer: "must",
    feedback: "'Must' is used for strong deductions based on clear present evidence."
  },
  {
    id: 2,
    type: "Linking Verbs",
    situation: "Sentence: 'The chef's special soup tastes incredible.'",
    question: "What role does the verb 'tastes' play in this sentence?",
    options: ["Transitive", "Intransitive", "Linking", "Helping"],
    answer: "Linking",
    feedback: "'Tastes' connects the subject (soup) to an adjective describing it (incredible), making it a linking verb."
  },
  {
    id: 3,
    type: "Transitive vs. Intransitive",
    situation: "Sentence: 'The alarm clock rang loudly at 6 AM.'",
    question: "Is the action verb 'rang' transitive or intransitive?",
    options: ["Transitive", "Intransitive", "Linking", "Modal"],
    answer: "Intransitive",
    feedback: "The verb 'rang' is intransitive because it does not take a direct object; 'loudly' is an adverb."
  },
  {
    id: 4,
    type: "Finite vs. Non-finite Verbs",
    situation: "Sentence: 'They plan to travel to Japan next year.'",
    question: "Identify the non-finite verb (infinitive) in the sentence.",
    options: ["plan", "to travel", "travel", "to Japan"],
    answer: "to travel",
    feedback: "'To travel' is an infinitive, which is a non-finite verb form that doesn't change with subject or tense."
  },
  {
    id: 5,
    type: "Regular vs. Irregular Verbs",
    situation: "Consider the past tense of the verb 'catch'.",
    question: "Is 'catch' a regular or irregular verb, and what is its past tense form?",
    options: ["Regular: catched", "Irregular: caught", "Regular: caught", "Irregular: catch"],
    answer: "Irregular: caught",
    feedback: "Irregular verbs don't form their past tense by adding '-ed'. The past of 'catch' is 'caught'."
  },
  {
    id: 6,
    type: "Modal Verbs",
    situation: "You want to politely ask a stranger for the time.",
    question: "Which modal verb makes the request most polite: '___ you tell me the time, please?'",
    options: ["Must", "Should", "Could", "May"],
    answer: "Could",
    feedback: "'Could' is used to make polite requests."
  }
];

export default function LabE11VerbsModals({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState('verbs');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const scenario = SCENARIOS[currentScenarioIndex];

  const handleCheck = () => {
    if (selectedOption === scenario.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-900 dark:text-slate-100">
      <header className="flex items-center p-4 bg-white dark:bg-slate-800 shadow-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={onExit} 
          className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 flex items-center gap-2">
          <Activity className="text-indigo-500" />
          Verbs & Modals
        </h1>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto">
        <aside className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-slate-700 shadow-inner">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-500" />
            Study Notes
          </h2>
          
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
            {['verbs', 'modals'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6 text-sm md:text-base text-slate-700 dark:text-slate-300">
            {activeTab === 'verbs' && (
              <div className="space-y-4">
                <p>Verbs describe an action, state, or occurrence.</p>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Action vs Linking</strong>
                    <p><strong>Action verbs</strong> express physical or mental actions (run, think).</p>
                    <p><strong>Linking verbs</strong> connect the subject to a complement that describes it (is, seems, tastes).</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Transitive vs Intransitive</strong>
                    <p><strong>Transitive verbs</strong> require a direct object (She <em>wrote</em> a letter).</p>
                    <p><strong>Intransitive verbs</strong> do not take an object (He <em>slept</em> peacefully).</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Finite vs Non-finite</strong>
                    <p><strong>Finite verbs</strong> show tense, person, and number (I <em>walk</em>).</p>
                    <p><strong>Non-finite verbs</strong> (infinitives, participles, gerunds) do not (I want <em>to walk</em>).</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Regular vs Irregular</strong>
                    <p><strong>Regular verbs</strong> form past tense with -ed (play → played).</p>
                    <p><strong>Irregular verbs</strong> have unique past tense forms (catch → caught).</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'modals' && (
              <div className="space-y-4">
                <p><strong>Modal verbs</strong> are helping verbs that express necessity, possibility, permission, or ability.</p>
                <ul className="list-disc pl-5 space-y-3">
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Must:</strong> Strong obligation or logical deduction based on evidence.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Might / May:</strong> Possibility or formal permission.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Should / Ought to:</strong> Advice, recommendation, or expectation.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Can / Could:</strong> Ability, possibility, or polite request.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Will / Would:</strong> Future intentions, conditionals, or polite offers.</li>
                </ul>
              </div>
            )}
          </div>
        </aside>

        <section className="w-full lg:w-2/3 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 lg:overflow-y-auto relative">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <List size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Scenario Simulator</h3>
                  <p className="text-indigo-200 text-sm">{scenario.type}</p>
                </div>
              </div>
              <div className="bg-indigo-800/50 px-4 py-2 rounded-full text-sm font-semibold border border-indigo-500/50">
                Case {currentScenarioIndex + 1} of {SCENARIOS.length}
              </div>
            </div>

            <div className="p-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800 shadow-inner">
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-2 font-medium">Situation:</p>
                <p className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 italic border-l-4 border-indigo-500 pl-4">"{scenario.situation}"</p>
                <div className="flex items-start gap-3">
                  <HelpCircle className="text-indigo-500 mt-1 flex-shrink-0" size={24} />
                  <p className="text-xl font-medium text-slate-800 dark:text-slate-200">{scenario.question}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {scenario.options.map(opt => (
                  <button
                    key={opt}
                    disabled={isCorrect === true}
                    onClick={() => {
                      if (isCorrect !== true) {
                        setSelectedOption(opt);
                        setIsCorrect(null);
                      }
                    }}
                    className={`p-4 rounded-xl font-semibold text-lg text-left transition-all border-2 flex items-center justify-between group ${
                      selectedOption === opt 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-400 dark:text-indigo-300' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                    } ${isCorrect === true ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOption === opt ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-300'}`}>
                      {selectedOption === opt && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center h-20 bg-slate-50 dark:bg-slate-900/30 -mx-8 -mb-8 px-8 py-4 border-t border-slate-100 dark:border-slate-800">
                {isCorrect === null || isCorrect === false ? (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-rose-500 font-medium flex items-center gap-2">
                      {isCorrect === false && <><AlertCircle size={20} /> Incorrect, review the options.</>}
                    </span>
                    <button 
                      onClick={handleCheck}
                      disabled={!selectedOption}
                      className={`px-8 py-3 rounded-full font-bold shadow-md transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                        selectedOption 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                      }`}
                    >
                      Verify Answer <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-between items-center w-full">
                    <div className="flex-1 max-w-lg">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 mb-1">
                        <Check size={20} /> Correct!
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">{scenario.feedback}</p>
                    </div>
                    <button 
                      onClick={handleNext}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-md transition-all whitespace-nowrap flex-shrink-0 ml-4"
                    >
                      Next Scenario
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
