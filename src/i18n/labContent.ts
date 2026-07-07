/**
 * Lab Content Translation System
 *
 * Translates lab module descriptions and titles using the main translation JSON files.
 * All translations come from src/locales/en/translation.json and
 * src/locales/roman-urdu/translation.json.
 */
import type { Language } from './types';
import urTranslation from '../locales/roman-urdu/translation.json';

const UR_MAP = urTranslation as Record<string, string>;

// English-subject modules that should NOT be translated
const ENGLISH_SUBJECT_MODULES = new Set<string>();

/**
 * Translate a lab module's title for display in LabHeader.
 */
export function translateLabTitle(
  moduleId: string,
  originalTitle: string,
  language: Language,
): string {
  if (language === 'en') return originalTitle;
  if (ENGLISH_SUBJECT_MODULES.has(moduleId)) return originalTitle;

  const key = `lab.title.${moduleId}`;
  const translated = UR_MAP[key];
  if (language === 'roman-urdu' && translated) return translated;

  return originalTitle;
}

/**
 * Translate a lab module's description for display in module cards.
 * Uses verb-pattern lookup from the main translation JSON files.
 * Scientific/technical terms (cells, microscope, DNA, etc.) stay in English.
 */
export function translateLabDesc(
  moduleId: string,
  originalDesc: string,
  language: Language,
): string {
  if (language === 'en') return originalDesc;
  if (ENGLISH_SUBJECT_MODULES.has(moduleId)) return originalDesc;

  if (language === 'roman-urdu') {
    // Replace ALL matching verbs with Roman Urdu equivalents from main JSON
    return originalDesc.replace(/\b\w[\w-]*\b/g, (word) => {
      const ruVerb = UR_MAP[`lab.verb.${word.toLowerCase()}`];
      return ruVerb && ruVerb !== word ? ruVerb : word;
    });
  }

  return originalDesc;
}
