import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, Puzzle, AlertCircle } from 'lucide-react';

const PUZZLES = [
  {
    id: 1,
    topic: "Coordinating Conjunctions",
    text: "I was very tired, {gap} I went to bed early.",
    options: ["for", "and", "so", "but"],
    answer: "so",
    feedback: "'so' indicates a result or consequence."
  },
  {
    id: 2,
    topic: "Subordinating Conjunctions",
    text: "{gap} it was raining, we decided to stay indoors.",
    options: ["Although", "Because", "Unless", "Until"],
    answer: "Because",
    feedback: "'Because' introduces a cause or reason."
  },
  {
    id: 3,
    topic: "Prepositions of Place",
    text: "The keys are hidden {gap} the mat.",
    options: ["over", "under", "through", "into"],
    answer: "under",
    feedback: "'under' indicates position beneath something."
  },
  {
    id: 4,
    topic: "Correlative Conjunctions",
    text: "She is {gap} intelligent but also very kind.",
    options: ["neither", "either", "not only", "both"],
    answer: "not only",
    feedback: "'not only... but also' are used together to link two qualities."
  },
  {
    id: 5,
    topic: "Interjections",
    text: "{gap} ! I didn't see you there.",
    options: ["Alas", "Oh", "Well", "Bravo"],
    answer: "Oh",
    feedback: "'Oh' expresses surprise."
  },
  {
    id: 6,
    topic: "Phrasal Prepositions",
    text: "We stayed home {gap} the bad weather.",
    options: ["instead of", "because of", "in spite of", "according to"],
    answer: "because of",
    feedback: "'because of' shows the reason for staying home."
  }
];

export default function LabE11PrepositionsConjunctions({ onExit }: { onExit?: () => void }) {
  const [activeTab, setActiveTab] = useState('prepositions');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const puzzle = PUZZLES[currentPuzzleIndex];

  const handleCheck = () => {
    if (selectedOption === puzzle.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-900 dark:text-slate-100">
      <header className="flex items-center p-4 bg-white dark:bg-slate-800 shadow-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={onExit} 
          className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
          aria-label="Go Back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 flex items-center gap-2">
          <BookOpen className="text-indigo-500" />
          Prepositions & Conjunctions
        </h1>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700 shadow-inner">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-indigo-500" />
            Grammar Guide
          </h2>
          
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto no-scrollbar">
            {['prepositions', 'conjunctions', 'interjections'].map(tab => (
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
            {activeTab === 'prepositions' && (
              <div className="space-y-4 transition-opacity duration-300">
                <p><strong>Prepositions</strong> show relationships between nouns/pronouns and other words in a sentence, often indicating time, place, or direction.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Time:</strong> at (at 5 PM), on (on Monday), in (in May), during.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Place:</strong> in (in the box), on (on the table), at (at the door), under.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Direction:</strong> to (go to school), into, towards, across.</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Phrasal:</strong> because of, in spite of, according to, instead of.</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'conjunctions' && (
              <div className="space-y-4 transition-opacity duration-300">
                <p><strong>Conjunctions</strong> connect words, phrases, or clauses together.</p>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Coordinating (FANBOYS)</strong>
                    <p>Connect equal parts: For, And, Nor, But, Or, Yet, So.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Subordinating</strong>
                    <p>Connect dependent to independent clauses: Because, although, if, since, when, unless.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Correlative</strong>
                    <p>Work in pairs: Both...and, either...or, neither...nor, not only...but also.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interjections' && (
              <div className="space-y-4 transition-opacity duration-300">
                <p><strong>Interjections</strong> are words that express strong emotion or sudden feeling. They are often followed by an exclamation mark.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Joy/Surprise:</strong> Wow!, Oh!, Aha!</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Pain:</strong> Ouch!, Ow!</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Sorrow:</strong> Alas!</li>
                  <li><strong className="text-indigo-600 dark:text-indigo-400">Hesitation:</strong> Uh, well, hmm...</li>
                </ul>
              </div>
            )}
          </div>
        </aside>

        <section className="w-full lg:w-2/3 p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 overflow-y-auto relative">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-3xl w-full border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider text-sm">
                <Puzzle size={18} />
                {puzzle.topic}
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                Puzzle {currentPuzzleIndex + 1} / {PUZZLES.length}
              </span>
            </div>

            <div className="text-2xl md:text-3xl lg:text-4xl font-medium mb-12 text-center leading-relaxed text-slate-800 dark:text-slate-100 py-8 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
              {puzzle.text.split('{gap}').map((part, idx) => (
                <span key={idx}>
                  {part}
                  {idx === 0 && (
                    <span 
                      className={`inline-flex items-center justify-center min-w-[140px] mx-2 px-4 py-2 border-b-4 rounded-lg transition-all duration-300 ${
                        selectedOption 
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-400 dark:text-indigo-300 shadow-sm' 
                          : 'bg-white border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-600 shadow-inner'
                      }`}
                    >
                      {selectedOption || "___"}
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {puzzle.options.map(opt => (
                <button
                  key={opt}
                  disabled={isCorrect === true}
                  onClick={() => {
                    if (isCorrect !== true) {
                      setSelectedOption(opt);
                      setIsCorrect(null);
                    }
                  }}
                  className={`px-4 py-4 rounded-xl font-semibold text-lg transition-all shadow-sm whitespace-nowrap flex-shrink-0 ${
                    selectedOption === opt 
                      ? 'bg-indigo-500 text-white shadow-md scale-105 ring-4 ring-indigo-200 dark:ring-indigo-900' 
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-indigo-500'
                  } ${isCorrect === true ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6 h-24 items-center">
              {!isCorrect && isCorrect !== false && (
                <button 
                  onClick={handleCheck}
                  disabled={!selectedOption}
                  className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                    selectedOption 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl transform hover:-translate-y-1' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Check size={24} /> Check Answer
                </button>
              )}
              
              {isCorrect === true && (
                <div className="flex flex-col items-center transition-all duration-500">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xl flex items-center gap-2 mb-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1 rounded-full">
                      <Check size={24} />
                    </div>
                    Correct!
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-center mb-4 max-w-md">{puzzle.feedback}</p>
                  <button 
                    onClick={handleNext}
                    className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg transition-all whitespace-nowrap flex-shrink-0 hover:-translate-y-1"
                  >
                    Next Puzzle
                  </button>
                </div>
              )}
              
              {isCorrect === false && (
                <div className="text-rose-500 dark:text-rose-400 font-bold text-xl flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-6 py-3 rounded-full border border-rose-200 dark:border-rose-800/50 transition-all duration-300">
                  <AlertCircle size={24} />
                  Incorrect, try another piece!
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
