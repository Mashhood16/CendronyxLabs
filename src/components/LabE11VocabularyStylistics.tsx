import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Feather, Info, Target, RefreshCcw } from 'lucide-react';

type Mode = 'vocab' | 'stylistics';

const VOCAB_QUESTIONS = [
  {
    type: 'silent',
    question: "Which letter is silent in the word 'mnemonic'?",
    options: ['m', 'n', 'e', 'c'],
    answer: 'm',
    explanation: "The initial 'm' in 'mnemonic' is silent."
  },
  {
    type: 'idiom',
    question: "What does the idiom 'beat around the bush' mean?",
    options: ['To destroy nature', 'To avoid talking about what is important', 'To act impulsively', 'To go on a long hike'],
    answer: 'To avoid talking about what is important',
    explanation: "It means to delay or avoid getting to the point of a topic."
  },
  {
    type: 'connotation',
    question: "Which word has a more positive connotation for someone who asks many questions?",
    options: ['Nosy', 'Inquisitive', 'Prying', 'Interfering'],
    answer: 'Inquisitive',
    explanation: "'Inquisitive' implies a healthy desire to learn, while the others imply rude intrusion."
  },
  {
    type: 'transition',
    question: "Which transitional device fits best: 'The experiment failed; _______, we must rethink our hypothesis.'",
    options: ['furthermore', 'nevertheless', 'consequently', 'similarly'],
    answer: 'consequently',
    explanation: "'Consequently' indicates that rethinking the hypothesis is a result of the failure."
  }
];

const LITERARY_QUOTES = [
  { 
    quote: "All the world's a stage, and all the men and women merely players.", 
    author: "William Shakespeare", 
    device: "Metaphor" 
  },
  { 
    quote: "It was the best of times, it was the worst of times...", 
    author: "Charles Dickens", 
    device: "Anaphora" 
  },
  { 
    quote: "The pen is mightier than the sword.", 
    author: "Edward Bulwer-Lytton", 
    device: "Synecdoche" 
  },
  { 
    quote: "I wandered lonely as a cloud...", 
    author: "William Wordsworth", 
    device: "Simile" 
  },
  { 
    quote: "Water, water, everywhere, nor any drop to drink.", 
    author: "Samuel Taylor Coleridge", 
    device: "Irony" 
  },
  { 
    quote: "Parting is such sweet sorrow.", 
    author: "William Shakespeare", 
    device: "Oxymoron" 
  },
  { 
    quote: "The leaves danced in the wind.", 
    author: "Unknown", 
    device: "Personification" 
  },
  { 
    quote: "I've told you a million times!", 
    author: "Common phrase", 
    device: "Hyperbole" 
  }
];

const LITERARY_DEVICES = [
  'Simile', 'Metaphor', 'Personification', 'Hyperbole', 'Alliteration',
  'Oxymoron', 'Synecdoche', 'Anaphora', 'Irony', 'Paradox'
];

export default function LabE11VocabularyStylistics({ onExit }: { onExit?: () => void }) {
  const [mode, setMode] = useState<Mode>('vocab');
  
  // Vocab State
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabFeedback, setVocabFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Stylistics State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stylisticsFeedback, setStylisticsFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setVocabFeedback(null);
    setStylisticsFeedback(null);
    setVocabIndex(0);
    setQuoteIndex(0);
  };

  const handleVocabAnswer = (selectedOption: string) => {
    const q = VOCAB_QUESTIONS[vocabIndex];
    if (selectedOption === q.answer) {
      setVocabFeedback({ isCorrect: true, message: `Correct! ${q.explanation}` });
    } else {
      setVocabFeedback({ isCorrect: false, message: `Incorrect. The correct answer was "${q.answer}". ${q.explanation}` });
    }
  };

  const handleStylisticsAnswer = (selectedDevice: string) => {
    const q = LITERARY_QUOTES[quoteIndex];
    if (selectedDevice === q.device) {
      setStylisticsFeedback({ isCorrect: true, message: `Spot on! This quote is an excellent example of ${q.device}.` });
    } else {
      setStylisticsFeedback({ isCorrect: false, message: `Not quite. The correct literary device is ${q.device}.` });
    }
  };

  const nextVocab = () => {
    setVocabIndex((prev) => (prev + 1) % VOCAB_QUESTIONS.length);
    setVocabFeedback(null);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % LITERARY_QUOTES.length);
    setStylisticsFeedback(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-[#121212] shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-[#a1a1aa]" />
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-400">Lab E11: Vocabulary & Stylistics</h1>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex lg:overflow-hidden">
        
        {/* Left Column: Workspace Controls */}
        <div className="w-1/3 min-w-[320px] max-w-sm border-r border-slate-200 dark:border-[#1c1b1b] bg-white dark:bg-[#121212] p-6 flex flex-col gap-6 lg:overflow-y-auto shadow-inner">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
              <Target className="w-5 h-5 text-emerald-500" /> Lab Modes
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleModeSwitch('vocab')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  mode === 'vocab' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 shadow-sm' 
                    : 'border-slate-200 dark:border-[#1c1b1b] hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Comprehensive Vocabulary
                </div>
                <div className="text-xs text-slate-500 dark:text-[#71717a] whitespace-normal">Test dictionary skills, connotation vs denotation, idioms, and transitions.</div>
              </button>
              
              <button
                onClick={() => handleModeSwitch('stylistics')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  mode === 'stylistics' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 shadow-sm' 
                    : 'border-slate-200 dark:border-[#1c1b1b] hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1 flex items-center gap-2">
                  <Feather className="w-4 h-4" /> Literary Devices Categorizer
                </div>
                <div className="text-xs text-slate-500 dark:text-[#71717a] whitespace-normal">Map poetic and rhetorical devices to famous literary quotes.</div>
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-5 rounded-xl mt-auto">
            <h3 className="font-semibold flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-300">
              <Info className="w-4 h-4" /> Lab Instructions
            </h3>
            <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
              {mode === 'vocab' 
                ? "Read the vocabulary question carefully. It may test your knowledge of silent letters, idiomatic expressions, nuanced connotations, or sentence flow using transitional devices. Select the best option."
                : "Analyze the provided literary quote. Determine which primary Figure of Speech or rhetorical device is being employed by the author to create stylistic effect, then select it from the grid."
              }
            </p>
          </div>
        </div>

        {/* Right Column: Simulation Stage */}
        <div className="flex-1 bg-slate-50 dark:bg-[#121212] p-8 flex flex-col items-center justify-center relative lg:overflow-y-auto">
           
           <div className="w-full max-w-3xl bg-white dark:!bg-[#121212] rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-[#1c1b1b] transition-all">
              
              {/* Vocab Mode */}
              {mode === 'vocab' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="flex w-full justify-between items-center mb-8">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Vocabulary Drill: {VOCAB_QUESTIONS[vocabIndex].type}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-[#71717a]">
                      Question {vocabIndex + 1} of {VOCAB_QUESTIONS.length}
                    </span>
                  </div>
                  
                  <div className="text-2xl font-medium text-center mb-10 text-slate-800 dark:text-[#ffffff] min-h-[80px] flex items-center justify-center">
                    {VOCAB_QUESTIONS[vocabIndex].question}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {VOCAB_QUESTIONS[vocabIndex].options.map(opt => (
                       <button
                         key={opt}
                         onClick={() => handleVocabAnswer(opt)}
                         disabled={vocabFeedback !== null}
                         className="px-6 py-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-slate-700 dark:hover:border-slate-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-[#ffffff] shadow-sm text-left flex items-center"
                       >
                         {opt}
                       </button>
                    ))}
                  </div>

                  {vocabFeedback && (
                    <div className={`mt-8 w-full p-5 rounded-xl flex items-start gap-4 shadow-sm ${vocabFeedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'} animate-in slide-in-from-bottom-4 duration-300`}>
                      {vocabFeedback.isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium text-lg mb-1">{vocabFeedback.isCorrect ? 'Correct!' : 'Incorrect'}</p>
                        <p className="opacity-90">{vocabFeedback.message}</p>
                        <button
                          onClick={nextVocab}
                          className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-[#121212]/20 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-black/40 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          Next Question <RefreshCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stylistics Mode */}
              {mode === 'stylistics' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="flex w-full justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Literary Devices Categorizer
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-[#71717a]">
                      Quote {quoteIndex + 1} of {LITERARY_QUOTES.length}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-50 dark:bg-[#121212]/50 border border-slate-200 dark:border-[#1c1b1b]/50 rounded-2xl p-8 mb-8 relative shadow-inner">
                    <div className="text-2xl font-serif text-center text-slate-800 dark:text-[#ffffff] mb-4 italic">
                      "{LITERARY_QUOTES[quoteIndex].quote}"
                    </div>
                    <div className="text-center text-sm font-medium text-slate-500 dark:text-[#71717a] uppercase tracking-widest">
                      — {LITERARY_QUOTES[quoteIndex].author}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-4 text-center">
                      Identify the primary literary device used:
                    </label>
                    <div className="flex flex-wrap justify-center gap-3">
                      {LITERARY_DEVICES.map(device => (
                        <button
                          key={device}
                          onClick={() => handleStylisticsAnswer(device)}
                          disabled={stylisticsFeedback !== null}
                          className="bg-white dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 dark:hover:border-indigo-400 text-slate-700 dark:text-[#a1a1aa] px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap flex-shrink-0"
                        >
                          {device}
                        </button>
                      ))}
                    </div>
                  </div>

                  {stylisticsFeedback && (
                    <div className={`mt-8 w-full p-5 rounded-xl flex items-start gap-4 shadow-sm ${stylisticsFeedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'} animate-in slide-in-from-bottom-4 duration-300`}>
                      {stylisticsFeedback.isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium text-lg mb-1">{stylisticsFeedback.isCorrect ? 'Masterful Analysis!' : 'Keep Analyzing'}</p>
                        <p className="opacity-90">{stylisticsFeedback.message}</p>
                        <button
                          onClick={nextQuote}
                          className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-[#121212]/20 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-black/40 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          {stylisticsFeedback.isCorrect ? 'Analyze Next Quote' : 'Skip to Next'} <RefreshCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
}
