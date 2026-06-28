import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Info, BookOpen, RefreshCcw } from 'lucide-react';

type SentenceTopic = 'types' | 'modifiers';

export default function LabE11SentenceStructure({ onExit }: { onExit?: () => void }) {
  const [topic, setTopic] = useState<SentenceTopic>('types');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const sentenceTypesQuestions = [
    { text: "May you live long and prosper.", type: "Optative" },
    { text: "Please close the door behind you.", type: "Imperative" },
    { text: "What an incredible performance that was!", type: "Exclamatory" },
    { text: "The sun rises in the east.", type: "Declarative" },
    { text: "Have you finished reading the chapter?", type: "Interrogative" },
    { text: "Would that I were young again.", type: "Optative" },
    { text: "Do not touch the exhibits in the museum.", type: "Imperative" }
  ];

  const modifierQuestions = [
    { 
      wrong: "Oozing slowly across the floor, I watched the salad dressing.", 
      validAnswers: ["I watched the salad dressing oozing slowly across the floor.", "I watched the salad dressing oozing across the floor slowly."],
      hint: "Who or what is oozing? Put the modifier next to the word it modifies."
    },
    {
      wrong: "She served sandwiches to the children on paper plates.",
      validAnswers: ["She served sandwiches on paper plates to the children.", "On paper plates, she served sandwiches to the children.", "She served the children sandwiches on paper plates."],
      hint: "Are the children on paper plates? Move the prepositional phrase."
    },
    {
      wrong: "He almost drove his kids to school every day.",
      validAnswers: ["He drove his kids to school almost every day.", "He drove his kids to school every day almost."],
      hint: "Does he 'almost drive' or drive 'almost every day'?"
    },
    {
      wrong: "Covered in mud, my mom told me to take off my shoes.",
      validAnswers: ["My mom told me to take off my shoes covered in mud.", "My mom told me to take off my mud-covered shoes."],
      hint: "Was your mom covered in mud, or were your shoes?"
    }
  ];

  const handleTopicChange = (newTopic: SentenceTopic) => {
    setTopic(newTopic);
    setCurrentSentenceIndex(0);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleNext = () => {
    if (topic === 'types') {
      setCurrentSentenceIndex((prev) => (prev + 1) % sentenceTypesQuestions.length);
    } else {
      setCurrentSentenceIndex((prev) => (prev + 1) % modifierQuestions.length);
    }
    setUserAnswer('');
    setFeedback(null);
  };

  const checkSentenceType = (selectedType: string) => {
    const isCorrect = sentenceTypesQuestions[currentSentenceIndex].type === selectedType;
    if (isCorrect) {
      setFeedback({ isCorrect: true, message: "Correct! You successfully identified the sentence type." });
    } else {
      setFeedback({ isCorrect: false, message: `Incorrect. The correct type is ${sentenceTypesQuestions[currentSentenceIndex].type}.` });
    }
  };

  const checkModifierAnswer = () => {
    const currentQ = modifierQuestions[currentSentenceIndex];
    const normalizedUserAnswer = userAnswer.trim().replace(/\.$/, "").toLowerCase();
    
    const isCorrect = currentQ.validAnswers.some(ans => 
      ans.toLowerCase().replace(/\.$/, "") === normalizedUserAnswer
    );

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: "Great job! The modifier is now placed correctly, making the sentence logical." });
    } else {
      setFeedback({ isCorrect: false, message: "Not quite right. " + currentQ.hint });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          )}
          <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">Lab E11: Sentence Structure & Modifiers</h1>
        </div>
      </header>

      {/* Main Content: 2-column junior layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Controls / Workspace */}
        <div className="w-1/3 min-w-[320px] max-w-sm border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col gap-6 overflow-y-auto shadow-inner">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Lesson Modules
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleTopicChange('types')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  topic === 'types' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Sentence Types</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-normal">Identify Declarative, Interrogative, Exclamatory, Imperative, and Optative sentences.</div>
              </button>
              
              <button
                onClick={() => handleTopicChange('modifiers')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  topic === 'modifiers' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Misplaced Modifiers</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-normal">Rewrite sentences to fix dangling or misplaced descriptive phrases.</div>
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-5 rounded-xl mt-auto">
            <h3 className="font-semibold flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
              <Info className="w-4 h-4" /> Instructions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {topic === 'types' 
                ? "Examine the sentence presented on the simulation stage. Analyze its tone, punctuation, and structure to determine its primary function. Click the corresponding button to lock in your answer."
                : "The sentence shown contains a misplaced or dangling modifier, causing it to mean something illogical or humorous. Analyze the intended meaning and rewrite the sentence in the text box below so the modifier is clearly attached to the correct word."
              }
            </p>
          </div>
        </div>

        {/* Right Column: Simulation Stage */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-8 flex flex-col items-center justify-center relative overflow-y-auto">
           
           <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 transition-all">
              
              {topic === 'types' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="flex w-full justify-between items-center mb-8">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Module 1: Analysis
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Sentence {currentSentenceIndex + 1} of {sentenceTypesQuestions.length}
                    </span>
                  </div>
                  
                  <div className="text-3xl font-serif text-center mb-12 text-slate-800 dark:text-slate-100 leading-relaxed min-h-[100px] flex items-center justify-center">
                    "{sentenceTypesQuestions[currentSentenceIndex].text}"
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {['Declarative', 'Interrogative', 'Exclamatory', 'Imperative', 'Optative'].map(type => (
                       <button
                         key={type}
                         onClick={() => checkSentenceType(type)}
                         disabled={feedback !== null}
                         className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-slate-700 dark:hover:border-slate-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 shadow-sm whitespace-nowrap flex-shrink-0"
                       >
                         {type}
                       </button>
                    ))}
                  </div>
                </div>
              )}

              {topic === 'modifiers' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="flex w-full justify-between items-center mb-8">
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Module 2: Correction
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Sentence {currentSentenceIndex + 1} of {modifierQuestions.length}
                    </span>
                  </div>
                  
                  <div className="w-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-8 mb-8 relative shadow-inner">
                    <div className="absolute -top-3 left-6 bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-xs px-2 py-1 rounded font-bold tracking-wide">
                      FLAWED SENTENCE
                    </div>
                    <div className="text-2xl font-serif text-center text-slate-800 dark:text-slate-100 min-h-[80px] flex items-center justify-center">
                      "{modifierQuestions[currentSentenceIndex].wrong}"
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Rewrite correctly:
                    </label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={feedback !== null && feedback.isCorrect}
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                        placeholder="Type your corrected sentence here..."
                        onKeyDown={(e) => { if(e.key === 'Enter') checkModifierAnswer() }}
                      />
                      <button
                        onClick={checkModifierAnswer}
                        disabled={!userAnswer || (feedback !== null && feedback.isCorrect)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap flex-shrink-0"
                      >
                        Check
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div className={`mt-8 p-5 rounded-xl flex items-start gap-4 shadow-sm ${feedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300'} animate-in slide-in-from-bottom-4 duration-300`}>
                  {feedback.isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-medium text-lg mb-1">{feedback.isCorrect ? 'Excellent Work!' : 'Not Quite Right'}</p>
                    <p className="opacity-90">{feedback.message}</p>
                    
                    <button
                      onClick={handleNext}
                      className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-black/20 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-black/40 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      {feedback.isCorrect ? 'Continue to Next' : (topic === 'types' ? 'Skip to Next' : 'Try Another')} <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
}
