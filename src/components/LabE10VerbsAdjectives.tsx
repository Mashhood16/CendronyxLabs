import { useState } from 'react';
import { BookOpen, Target, CheckCircle2, Activity, Edit3 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10VerbsAdjectivesProps {
  onExit?: () => void;
}

const VOICE_EXERCISES = [
  {
    active: "The chef cooked a delicious meal.",
    passive: "A delicious meal was cooked by the chef.",
    subject: "The chef",
    verb: "cooked",
    object: "a delicious meal"
  },
  {
    active: "The students are solving the math problem.",
    passive: "The math problem is being solved by the students.",
    subject: "The students",
    verb: "are solving",
    object: "the math problem"
  },
  {
    active: "The author has written three books.",
    passive: "Three books have been written by the author.",
    subject: "The author",
    verb: "has written",
    object: "three books"
  }
];

const ADJECTIVE_ORDER_PUZZLE = [
  { word: "old", type: "Age" },
  { word: "beautiful", type: "Opinion" },
  { word: "Italian", type: "Origin" },
  { word: "red", type: "Color" },
  { word: "car", type: "Noun" }
];

export default function LabE10VerbsAdjectives({ onExit = () => {} }: LabE10VerbsAdjectivesProps) {
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [isPassive, setIsPassive] = useState(false);
  
  const [adjectiveOrder, setAdjectiveOrder] = useState<typeof ADJECTIVE_ORDER_PUZZLE>([]);
  const [availableAdjectives, setAvailableAdjectives] = useState<typeof ADJECTIVE_ORDER_PUZZLE>([...ADJECTIVE_ORDER_PUZZLE].sort(() => Math.random() - 0.5));

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "Which verb is Transitive in: 'He opened the door quietly'?",
      options: ["He", "opened", "door", "quietly"],
      correct: 1
    },
    {
      q: "Identify the correct order of adjectives:",
      options: [
        "A red big plastic ball",
        "A big red plastic ball",
        "A plastic big red ball",
        "A big plastic red ball"
      ],
      correct: 1
    },
    {
      q: "Convert to Passive Voice: 'The teacher graded the exams.'",
      options: [
        "The exams graded the teacher.",
        "The teacher was grading the exams.",
        "The exams were graded by the teacher.",
        "The exams have been graded."
      ],
      correct: 2
    }
  ];

  const handleSelectAdjective = (item: typeof ADJECTIVE_ORDER_PUZZLE[0]) => {
    setAvailableAdjectives(prev => prev.filter(a => a.word !== item.word));
    setAdjectiveOrder(prev => [...prev, item]);
  };

  const handleRemoveAdjective = (item: typeof ADJECTIVE_ORDER_PUZZLE[0]) => {
    setAdjectiveOrder(prev => prev.filter(a => a.word !== item.word));
    setAvailableAdjectives(prev => [...prev, item]);
  };

  const checkAdjectiveOrder = () => {
    if (adjectiveOrder.length !== ADJECTIVE_ORDER_PUZZLE.length) return false;
    const correctOrder = ["Opinion", "Size", "Age", "Shape", "Color", "Origin", "Material", "Purpose", "Noun"];
    
    let lastIndex = -1;
    for (const item of adjectiveOrder) {
      const currentIndex = correctOrder.indexOf(item.type);
      if (currentIndex < lastIndex && item.type !== "Noun") return false;
      if (item.type === "Noun" && currentIndex !== correctOrder.length - 1) return false;
      lastIndex = currentIndex;
    }
    // Specific check for this puzzle
    return adjectiveOrder[adjectiveOrder.length - 1].type === "Noun";
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (assessmentAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-[#ffffff]">
      <LabHeader title="Unit 2: Action & Description" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-100 dark:border-emerald-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Verbs & Adjectives</h2>
            </div>
            <div className="p-6 lg:overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-[#a1a1aa]">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Transitive vs Intransitive Verbs</h3>
                <p className="text-sm mb-2"><strong>Transitive Verbs</strong> require an object to complete their meaning. (e.g., He <em>bought</em> a car.)</p>
                <p className="text-sm"><strong>Intransitive Verbs</strong> do not require an object. (e.g., The sun <em>shines</em>.)</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Active vs Passive Voice</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Active:</strong> The subject performs the action. (Subject + Verb + Object)</li>
                  <li><strong>Passive:</strong> The subject receives the action. (Object + <em>be</em> verb + Past Participle + by + Subject)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Order of Adjectives</h3>
                <p className="text-sm mb-2">When multiple adjectives describe a noun, they follow a specific order:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Opinion (beautiful, ugly)</li>
                  <li>Size (big, small)</li>
                  <li>Age (old, new)</li>
                  <li>Shape (round, square)</li>
                  <li>Color (red, blue)</li>
                  <li>Origin (Italian, lunar)</li>
                  <li>Material (wooden, metal)</li>
                  <li>Purpose (sleeping, roasting)</li>
                </ol>
              </section>
            </div>
          </div>

          {/* Column 2: Sentence Transformer */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-neutral-900">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Sentence Transformer</h2>
            </div>
            
            <div className="flex-1 lg:overflow-y-auto space-y-8">
              {/* Voice Transformer */}
              <div>
                <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Voice Conversion
                </h3>
                
                <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a]">
                      {isPassive ? 'Passive Voice' : 'Active Voice'}
                    </span>
                    <button 
                      onClick={() => setIsPassive(!isPassive)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
                    >
                      Toggle Voice
                    </button>
                  </div>
                  
                  <p className="text-lg font-medium text-slate-900 dark:text-[#ffffff] text-center py-4">
                    {isPassive ? VOICE_EXERCISES[activeVoiceIndex].passive : VOICE_EXERCISES[activeVoiceIndex].active}
                  </p>
                  
                  <div className="flex gap-2 justify-center mt-2">
                    {VOICE_EXERCISES.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveVoiceIndex(i)}
                        className={`w-2 h-2 rounded-full ${activeVoiceIndex === i ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Adjective Order Puzzle */}
              <div>
                <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Adjective Order Puzzle
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#71717a] mb-3">Arrange the words in the correct order to describe the car:</p>
                
                <div className="min-h-[60px] p-3 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl mb-4 flex flex-wrap gap-2 bg-emerald-50/50 dark:bg-emerald-900/10">
                  {adjectiveOrder.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemoveAdjective(item)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
                    >
                      {item.word} <span className="text-[10px] opacity-75 block">{item.type}</span>
                    </button>
                  ))}
                  {adjectiveOrder.length === 0 && (
                    <span className="text-sm text-slate-400 my-auto ml-2">Drop words here...</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableAdjectives.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAdjective(item)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#a1a1aa] rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      {item.word}
                    </button>
                  ))}
                </div>

                {adjectiveOrder.length === ADJECTIVE_ORDER_PUZZLE.length && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${checkAdjectiveOrder() ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'}`}>
                    {checkAdjectiveOrder() ? (
                      <><CheckCircle2 className="w-4 h-4" /> Correct adjective order!</>
                    ) : (
                      <>Incorrect order. Remember: Opinion, Size, Age, Shape, Color, Origin, Material, Purpose, Noun.</>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-neutral-900">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Knowledge Check</h2>
            </div>

            <div className="flex-1 lg:overflow-y-auto">
              {!assessmentSubmitted ? (
                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
                        {qIdx + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              className="mt-1 w-4 h-4 text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-[#121212]/50 border-slate-300 dark:border-[#1c1b1b]"
                              checked={assessmentAnswers[qIdx] === oIdx}
                              onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            />
                            <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setAssessmentSubmitted(true)}
                    disabled={Object.keys(assessmentAnswers).length < questions.length}
                    className="w-full mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled: text-white rounded-lg font-medium transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#a1a1aa] mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-[#71717a] mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You've mastered verbs and adjectives." 
                      : "Good effort! Review the rules of passive voice and adjective ordering to improve."}
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setAssessmentAnswers({});
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#a1a1aa] rounded-lg font-medium transition-colors"
                  >
                    Retry Lab
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
