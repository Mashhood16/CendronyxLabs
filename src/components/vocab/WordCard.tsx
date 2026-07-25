/**
 * WordCard — displays an English word with pronunciation (TTS) and
 * Urdu script (Nastaliq) translation side by side.
 *
 * Uses the comprehensive dictionary from englishMeanings.ts for Urdu meanings
 * and the PronounceButton component for English TTS pronunciation.
 */

import { BookOpen } from 'lucide-react';
import PronounceButton from './PronounceButton';
import { getMeaning } from './englishMeanings';
import { type AccentColor, getAccentColors, getRandomAccent } from './vocabAccent';

interface WordCardProps {
  word: string;
  /** Show a smaller compact version (for inline use) */
  compact?: boolean;
  /** Custom accent color class for the card border/accent */
  accent?: AccentColor;
  /** Optional className override */
  className?: string;
}

export default function WordCard({
  word,
  compact = false,
  accent = 'indigo',
  className = '',
}: WordCardProps) {
  const cleanWord = word.toLowerCase().trim().replace(/[.,!?;:'"()]/g, '');
  const urduMeaning = getMeaning(cleanWord);
  const accentColors = getAccentColors(accent);

  if (!urduMeaning) return null;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${accentColors.card} ${accentColors.bg} ${className}`}
      >
        <PronounceButton text={word} size="sm" lang="en-US" />
        <span className={`text-xs font-semibold ${accentColors.word}`}>{word}</span>
        <span className="font-urdu text-xs leading-relaxed text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>
          ({urduMeaning})
        </span>
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl border ${accentColors.card} ${accentColors.bg} p-3 transition-all hover:shadow-md hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-center gap-2">
        <PronounceButton text={word} size="sm" lang="en-US" />
        <span className={`text-sm font-bold ${accentColors.word}`}>{word}</span>
      </div>
      <div className="mt-1.5 pl-8">
        <span
          className="font-urdu text-[14px] leading-relaxed text-slate-600 dark:text-slate-300"
          style={{ fontWeight: 500, letterSpacing: '0.01em' }}
        >
          {urduMeaning}
        </span>
      </div>
    </div>
  );
}

/**
 * VocabularyPanel — displays a list of WordCards in a compact grid layout,
 * with an optional title and header icon.
 */

interface VocabularyPanelProps {
  words: string[];
  title?: string;
  accent?: AccentColor;
}

export function VocabularyPanel({
  words,
  title = 'Vocabulary',
  accent = getRandomAccent(words.join('')),
}: VocabularyPanelProps) {
  const filteredWords = words.filter(w => getMeaning(w.toLowerCase().trim().replace(/[.,!?;:'"()]/g, '')));

  if (filteredWords.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {filteredWords.map((w) => (
          <WordCard key={w} word={w} compact accent={accent} />
        ))}
      </div>
    </div>
  );
}
