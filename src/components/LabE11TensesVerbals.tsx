import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Clock, Check } from 'lucide-react';

const STORY_PARTS = [
  {
    id: 1,
    text: "By the time the rescue team ",
    options: ["arrives", "arrived", "had arrived", "will arrive"],
    correct: "arrived",
    type: "tense",
    hint: "Simple Past (Action completed in the past)",
    timelinePos: "past",
    label: "Team Arrival"
  },
  {
    id: 2,
    text: ", the hikers ",
    options: ["already waited", "had already waited", "have already been waiting", "had already been waiting"],
    correct: "had already been waiting",
    type: "tense",
    hint: "Past Perfect Continuous (Action ongoing up to a point in the past)",
    timelinePos: "past-perfect",
    label: "Hikers Waiting"
  },
  {
    id: 3,
    text: " for hours. Right now, they ",
    options: ["rested", "rest", "are resting", "will rest"],
    correct: "are resting",
    type: "tense",
    hint: "Present Continuous (Happening currently)",
    timelinePos: "present",
    label: "Resting"
  },
  {
    id: 4,
    text: " safely at the base camp. ",
    options: ["To survive", "Surviving", "Survived", "Survive"],
    correct: "Surviving",
    type: "verbal",
    hint: "Gerund acting as the subject of the sentence",
    timelinePos: "general",
    label: "Surviving"
  },
  {
    id: 5,
    text: " such an ordeal requires resilience. By this time tomorrow, they ",
    options: ["will travel", "will have traveled", "will be traveling", "travel"],
    correct: "will be traveling",
    type: "tense",
    hint: "Future Continuous (Action that will be in progress at a specific future time)",
    timelinePos: "future",
    label: "Traveling Home"
  },
  {
    id: 6,
    text: " back to their homes, looking forward to ",
    options: ["settle down", "settling down", "settled down", "have settled down"],
    correct: "settling down",
    type: "phrasal",
    hint: "Gerund after the phrasal verb 'look forward to'",
    timelinePos: "general",
    label: "Settling Down"
  }
];

export default function LabE11TensesVerbals({ onExit }: { onExit?: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setFeedback(prev => ({ ...prev, [id]: null })); // Reset feedback for this part on change
  };

  const checkAnswers = () => {
    let currentScore = 0;
    const newFeedback: Record<number, boolean> = {};
    STORY_PARTS.forEach(part => {
      const isCorrect = answers[part.id] === part.correct;
      newFeedback[part.id] = isCorrect;
      if (isCorrect) currentScore++;
    });
    setFeedback(newFeedback);
    setScore(currentScore);
  };

  const reset = () => {
    setAnswers({});
    setFeedback({});
    setScore(null);
  };

  const renderTimelineEvent = (part: typeof STORY_PARTS[0]) => {
    const isCorrect = feedback[part.id];
    
    let positionClass = "";
    switch (part.timelinePos) {
      case "past-perfect": positionClass = "left-[10%]"; break;
      case "past": positionClass = "left-[30%]"; break;
      case "present": positionClass = "left-[50%]"; break;
      case "future": positionClass = "left-[80%]"; break;
      case "general": positionClass = "left-[50%] top-[60%]"; break;
    }

    return (
      <div 
        key={part.id} 
        className={`absolute flex flex-col items-center transition-all duration-500 ease-in-out ${positionClass} ${part.timelinePos === 'general' ? 'translate-y-8' : '-translate-y-1/2 top-1/2'}`}
        style={{ opacity: isCorrect ? 1 : 0.3 }}
      >
        <div className={`w-4 h-4 rounded-full border-2 ${isCorrect ? 'bg-green-500 border-green-600' : 'bg-slate-300 border-slate-400 dark:bg-slate-700 dark:border-slate-600'}`}></div>
        <div className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 text-center w-24">
          {part.label}
          {isCorrect && <div className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">{answers[part.id]}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="w-full bg-white dark:bg-slate-800 shadow-sm p-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Lab: Tenses & Verbals</h1>
        </div>
        <div className="flex items-center gap-2">
          {score !== null && (
            <span className="font-semibold text-lg mr-4">
              Score: {score} / {STORY_PARTS.length}
            </span>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Interactive Controls/Workspace */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Narrative Timeline Editor
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Fix the tense inconsistencies and select the correct verbal forms in the story below. Ensure temporal logic makes sense!
            </p>
          </div>

          <div className="flex-1 text-lg leading-loose space-x-1 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            {STORY_PARTS.map((part) => (
              <span key={part.id}>
                <span>{part.text}</span>
                <span className="inline-block relative">
                  <select
                    className={`appearance-none bg-white dark:bg-slate-800 border-b-2 font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 mx-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer
                      ${feedback[part.id] === true ? 'border-green-500 text-green-600 dark:text-green-400' : ''}
                      ${feedback[part.id] === false ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-blue-300 dark:border-blue-700'}
                    `}
                    value={answers[part.id] || ""}
                    onChange={(e) => handleSelect(part.id, e.target.value)}
                  >
                    <option value="" disabled>Select verb...</option>
                    {part.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {feedback[part.id] === true && (
                    <CheckCircle className="w-4 h-4 text-green-500 absolute -top-3 -right-2 bg-white dark:bg-slate-800 rounded-full" />
                  )}
                  {feedback[part.id] === false && (
                    <XCircle className="w-4 h-4 text-red-500 absolute -top-3 -right-2 bg-white dark:bg-slate-800 rounded-full" />
                  )}
                </span>
                {feedback[part.id] === false && (
                  <div className="block text-xs text-red-500 mt-1 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800/50">
                    Hint: {part.hint}
                  </div>
                )}
              </span>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={checkAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors whitespace-nowrap flex-shrink-0 shadow-sm"
            >
              <Check className="w-5 h-5" /> Check Story
            </button>
          </div>
        </div>

        {/* Right Column: Simulation Stage */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Temporal Visualization</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              As you correct the tenses, the events will snap to their proper place on the timeline.
            </p>
          </div>
          
          <div className="flex-1 relative min-h-[400px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center p-8 shadow-inner">
            
            {/* Timeline Axis */}
            <div className="absolute left-8 right-8 h-1 bg-slate-300 dark:bg-slate-600 top-1/2 -translate-y-1/2 rounded-full"></div>
            
            {/* Markers */}
            <div className="absolute left-[10%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>
            <div className="absolute left-[30%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>
            <div className="absolute left-[50%] top-1/2 w-0.5 h-8 bg-blue-500 dark:bg-blue-400 -translate-y-1/2 -ml-[1px]"></div>
            <div className="absolute left-[80%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>

            {/* Axis Labels */}
            <div className="absolute left-[10%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Past Perfect</div>
            <div className="absolute left-[30%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Past</div>
            <div className="absolute left-[50%] top-1/2 mt-8 -translate-x-1/2 text-sm font-bold text-blue-500 uppercase tracking-wider">Present</div>
            <div className="absolute left-[80%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Future</div>

            {/* Events */}
            {STORY_PARTS.map(renderTimelineEvent)}

          </div>
        </div>
      </div>
    </div>
  );
}
