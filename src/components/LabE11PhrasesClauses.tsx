import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Layers } from 'lucide-react';

type ChunkType = 'independent' | 'dependent' | 'prep_phrase' | 'noun_clause' | 'relative_clause' | 'adverb_clause' | 'none';

interface Chunk {
  id: string;
  text: string;
  correctType: ChunkType;
}

interface Sentence {
  id: number;
  chunks: Chunk[];
}

const CATEGORIES: { id: ChunkType; label: string; color: string; bg: string; border: string }[] = [
  { id: 'independent', label: 'Independent Clause', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-300 dark:border-purple-700' },
  { id: 'dependent', label: 'Dependent Clause', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-300 dark:border-orange-700' },
  { id: 'prep_phrase', label: 'Prepositional Phrase', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-100 dark:bg-teal-900/40', border: 'border-teal-300 dark:border-teal-700' },
  { id: 'noun_clause', label: 'Noun Clause', color: 'text-pink-700 dark:text-pink-300', bg: 'bg-pink-100 dark:bg-pink-900/40', border: 'border-pink-300 dark:border-pink-700' },
  { id: 'relative_clause', label: 'Relative Clause', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/40', border: 'border-indigo-300 dark:border-indigo-700' },
  { id: 'adverb_clause', label: 'Adverb Clause', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-300 dark:border-emerald-700' },
];

const SENTENCES: Sentence[] = [
  {
    id: 1,
    chunks: [
      { id: '1-1', text: 'Because it was raining heavily, ', correctType: 'adverb_clause' },
      { id: '1-2', text: 'we decided ', correctType: 'independent' },
      { id: '1-3', text: 'that we should stay ', correctType: 'noun_clause' },
      { id: '1-4', text: 'inside the house.', correctType: 'prep_phrase' }
    ]
  },
  {
    id: 2,
    chunks: [
      { id: '2-1', text: 'The ancient manuscript, ', correctType: 'none' },
      { id: '2-2', text: 'which was discovered ', correctType: 'relative_clause' },
      { id: '2-3', text: 'under the floorboards, ', correctType: 'prep_phrase' },
      { id: '2-4', text: 'revealed secrets ', correctType: 'independent' },
      { id: '2-5', text: 'although it was damaged.', correctType: 'adverb_clause' }
    ]
  },
  {
    id: 3,
    chunks: [
      { id: '3-1', text: 'Whoever finishes first ', correctType: 'noun_clause' },
      { id: '3-2', text: 'will receive the grand prize ', correctType: 'independent' },
      { id: '3-3', text: 'at the ceremony.', correctType: 'prep_phrase' }
    ]
  }
];

export default function LabE11PhrasesClauses({ onExit }: { onExit?: () => void }) {
  const [activeTool, setActiveTool] = useState<ChunkType>('independent');
  const [chunkAssignments, setChunkAssignments] = useState<Record<string, ChunkType>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleChunkClick = (chunkId: string, correctType: ChunkType) => {
    // If clicking a none chunk, do nothing unless maybe they want to clear it?
    if (correctType === 'none') return;

    setChunkAssignments(prev => ({
      ...prev,
      [chunkId]: activeTool
    }));
    setFeedback(prev => ({ ...prev, [chunkId]: null }));
  };

  const clearChunk = (e: React.MouseEvent, chunkId: string) => {
    e.stopPropagation();
    setChunkAssignments(prev => {
      const next = { ...prev };
      delete next[chunkId];
      return next;
    });
    setFeedback(prev => {
      const next = { ...prev };
      delete next[chunkId];
      return next;
    });
  };

  const checkAnswers = () => {
    let currentScore = 0;
    let totalAssessable = 0;
    const newFeedback: Record<string, boolean> = {};
    
    SENTENCES.forEach(sentence => {
      sentence.chunks.forEach(chunk => {
        if (chunk.correctType !== 'none') {
          totalAssessable++;
          const isCorrect = chunkAssignments[chunk.id] === chunk.correctType;
          newFeedback[chunk.id] = isCorrect;
          if (isCorrect) currentScore++;
        }
      });
    });
    
    setFeedback(newFeedback);
    setScore(currentScore);
  };

  const reset = () => {
    setChunkAssignments({});
    setFeedback({});
    setScore(null);
  };

  const getToolStyles = (type: ChunkType) => {
    const category = CATEGORIES.find(c => c.id === type);
    if (!category) return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
    return `${category.bg} ${category.color} ${category.border} border-2 font-bold`;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="w-full bg-white dark:bg-slate-800 shadow-sm p-4 flex items-center justify-between z-10 flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Lab: Phrases & Clauses Highlighter</h1>
        </div>
        <div className="flex items-center gap-2">
          {score !== null && (
            <span className="font-semibold text-lg mr-4 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              Score: {score}
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
        {/* Left Column: Interactive Controls */}
        <div className="w-full lg:w-1/3 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shadow-sm z-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Syntactic Tools
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select a syntactic category below, then click on the corresponding chunks in the Simulation Stage to highlight them.
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTool(category.id)}
                className={`text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                  activeTool === category.id
                    ? `${category.bg} ${category.border} ${category.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-${category.border.split('-')[1]}-400 scale-[1.02]`
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="font-bold text-md">{category.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={checkAnswers}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors whitespace-nowrap flex-shrink-0 shadow-md"
            >
              <Check className="w-6 h-6" /> Evaluate Analysis
            </button>
          </div>
        </div>

        {/* Right Column: Simulation Stage */}
        <div className="w-full lg:w-2/3 p-6 lg:p-12 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-y-auto">
          <div className="mb-8 max-w-3xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-2">Sentence Analysis Stage</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Apply your selected syntactic tools to classify the highlighted chunks.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col gap-8 max-w-3xl mx-auto w-full">
            {SENTENCES.map(sentence => (
              <div key={sentence.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 leading-loose text-lg">
                <div className="flex flex-wrap items-center gap-y-4">
                  {sentence.chunks.map(chunk => {
                    const assignedType = chunkAssignments[chunk.id];
                    const category = CATEGORIES.find(c => c.id === assignedType);
                    const isEvaluated = feedback[chunk.id] !== undefined && feedback[chunk.id] !== null;
                    const isCorrect = feedback[chunk.id] === true;
                    
                    if (chunk.correctType === 'none') {
                      return <span key={chunk.id} className="text-slate-800 dark:text-slate-200">{chunk.text}</span>;
                    }

                    return (
                      <span
                        key={chunk.id}
                        onClick={() => handleChunkClick(chunk.id, chunk.correctType)}
                        className={`
                          relative group cursor-pointer px-2 py-1 mx-1 rounded-lg border-2 transition-all
                          ${assignedType 
                            ? getToolStyles(assignedType)
                            : 'bg-slate-100 dark:bg-slate-700 border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'}
                          ${isEvaluated && !isCorrect ? 'ring-2 ring-red-500 animate-pulse' : ''}
                        `}
                      >
                        {chunk.text}
                        
                        {/* Clear button overlay */}
                        {assignedType && !isEvaluated && (
                          <button
                            onClick={(e) => clearChunk(e, chunk.id)}
                            className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        )}
                        
                        {/* Label Badge */}
                        {assignedType && (
                          <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white dark:bg-slate-800 border ${category?.border}`}>
                            {category?.label}
                          </span>
                        )}

                        {/* Result Icon */}
                        {isEvaluated && (
                          <span className="absolute -bottom-4 right-0 transform translate-y-1/2 z-20 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                            {isCorrect ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
