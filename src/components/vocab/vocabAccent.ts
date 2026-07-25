/**
 * Shared accent color constants for WordCard and VocabularyPanel.
 * Centralizes the valid accent colors to prevent typos like "blue".
 * Use `AccentColor` as the type and reference `ACCENT_COLORS` for iteration/validation.
 */

/** All valid accent color names */
export const ACCENT_COLORS = [
  'indigo',
  'emerald',
  'amber',
  'rose',
  'sky',
  'violet',
  'orange',
  'teal',
  'blue',
  'purple',
  'pink',
  'green',
] as const;

/** Type-safe union of valid accent color names */
export type AccentColor = typeof ACCENT_COLORS[number];

/** Maps each accent color to its Tailwind CSS class sets */
export const ACCENT_MAP: Record<AccentColor, {
  card: string;
  bg: string;
  word: string;
  label: string;
}> = {
  indigo: {
    card: 'border-indigo-200 dark:border-indigo-800/50',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    word: 'text-indigo-700 dark:text-indigo-300',
    label: 'bg-indigo-100 dark:bg-indigo-800/40 text-indigo-600 dark:text-indigo-400',
  },
  emerald: {
    card: 'border-emerald-200 dark:border-emerald-800/50',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    word: 'text-emerald-700 dark:text-emerald-300',
    label: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    card: 'border-amber-200 dark:border-amber-800/50',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    word: 'text-amber-700 dark:text-amber-300',
    label: 'bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400',
  },
  rose: {
    card: 'border-rose-200 dark:border-rose-800/50',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    word: 'text-rose-700 dark:text-rose-300',
    label: 'bg-rose-100 dark:bg-rose-800/40 text-rose-600 dark:text-rose-400',
  },
  sky: {
    card: 'border-sky-200 dark:border-sky-800/50',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    word: 'text-sky-700 dark:text-sky-300',
    label: 'bg-sky-100 dark:bg-sky-800/40 text-sky-600 dark:text-sky-400',
  },
  violet: {
    card: 'border-violet-200 dark:border-violet-800/50',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    word: 'text-violet-700 dark:text-violet-300',
    label: 'bg-violet-100 dark:bg-violet-800/40 text-violet-600 dark:text-violet-400',
  },
  orange: {
    card: 'border-orange-200 dark:border-orange-800/50',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    word: 'text-orange-700 dark:text-orange-300',
    label: 'bg-orange-100 dark:bg-orange-800/40 text-orange-600 dark:text-orange-400',
  },
  teal: {
    card: 'border-teal-200 dark:border-teal-800/50',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    word: 'text-teal-700 dark:text-teal-300',
    label: 'bg-teal-100 dark:bg-teal-800/40 text-teal-600 dark:text-teal-400',
  },
  blue: {
    card: 'border-blue-200 dark:border-blue-800/50',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    word: 'text-blue-700 dark:text-blue-300',
    label: 'bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400',
  },
  purple: {
    card: 'border-purple-200 dark:border-purple-800/50',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    word: 'text-purple-700 dark:text-purple-300',
    label: 'bg-purple-100 dark:bg-purple-800/40 text-purple-600 dark:text-purple-400',
  },
  pink: {
    card: 'border-pink-200 dark:border-pink-800/50',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    word: 'text-pink-700 dark:text-pink-300',
    label: 'bg-pink-100 dark:bg-pink-800/40 text-pink-600 dark:text-pink-400',
  },
  green: {
    card: 'border-green-200 dark:border-green-800/50',
    bg: 'bg-green-50 dark:bg-green-900/20',
    word: 'text-green-700 dark:text-green-300',
    label: 'bg-green-100 dark:bg-green-800/40 text-green-600 dark:text-green-400',
  },
};

/**
 * Safely resolve the Tailwind class set for a given accent color.
 * Falls back to `indigo` if the color is invalid.
 */
export function getAccentColors(accent: string) {
  return ACCENT_MAP[accent as AccentColor] ?? ACCENT_MAP.indigo;
}

/**
 * Simple string hash (DJB2) for deterministic pseudo-random color selection.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Pick a deterministic accent color for a given seed string.
 * Same seed always returns the same color; different seeds get different colors.
 * Use the lab name or word list as the seed so each lab gets its own accent.
 */
export function getRandomAccent(seed: string): AccentColor {
  const index = hashString(seed) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}


