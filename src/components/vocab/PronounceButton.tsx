import { useState, useCallback, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PronounceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Language code, e.g. 'en-US' (default), 'ur-PK' for Urdu */
  lang?: string;
  /** Rate of speech, default 0.85 */
  rate?: number;
  /** Show label text next to the icon */
  showLabel?: boolean;
}

// Cached voices list and a set of preferred Urdu voice name keywords
type VoiceStore = { voices: SpeechSynthesisVoice[]; loaded: boolean };
let voiceStore: VoiceStore = { voices: [], loaded: false };
const voiceListeners: Array<(v: SpeechSynthesisVoice[]) => void> = [];

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const v = window.speechSynthesis.getVoices();
  if (v.length > 0) {
    voiceStore = { voices: v, loaded: true };
    voiceListeners.forEach(fn => fn(v));
  }
}

// Ensure voices are loaded - some browsers need the event, some load synchronously
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.getVoices().length > 0) {
    voiceStore = { voices: window.speechSynthesis.getVoices(), loaded: true };
  }
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Find the best available voice for a given language code.
 * For Urdu (ur, ur-PK), prefers Windows Natural voices or Microsoft Zira.
 */
function findBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = voiceStore.voices;
  if (voices.length === 0) return null;

  const isUrdu = lang.startsWith('ur');

  if (isUrdu) {
    // Prefer a natural-sounding Urdu voice if available
    // Windows provides "Microsoft Zira - Urdu" or similar
    const natural = voices.find(v =>
      (v.lang === 'ur-PK' || v.lang === 'ur') &&
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('zira'))
    );
    if (natural) return natural;

    // Fall back to any Urdu voice
    const anyUrdu = voices.find(v => v.lang === 'ur-PK' || v.lang === 'ur');
    if (anyUrdu) return anyUrdu;

    // Last resort: pick any voice that at least has Urdu-like characteristics
    return null;
  }

  // For English and other languages
  const female = voices.find(
    (v) => v.lang.startsWith(lang.split('-')[0]) && v.name.toLowerCase().includes('female')
  );
  if (female) return female;

  const anyMatch = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
  return anyMatch || null;
}

export default function PronounceButton({
  text,
  size = 'sm',
  className = '',
  lang = 'en-US',
  rate = 0.85,
  showLabel = false,
}: PronounceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Check for speech synthesis support
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    // If voices aren't loaded yet, listen for them
    if (!voiceStore.loaded) {
      const handler = () => {
        // voices loaded - no UI state to update, they'll be used on next speak
      };
      voiceListeners.push(handler);
      // Also retry loading immediately (some browsers populate voices on first getVoices() call)
      loadVoices();
      return () => {
        const idx = voiceListeners.indexOf(handler);
        if (idx >= 0) voiceListeners.splice(idx, 1);
      };
    }

    return () => {
      mountedRef.current = false;
      if (utteranceRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis || speaking) return;

    // Re-load voices in case more became available
    loadVoices();

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Find best voice for the target language
    const bestVoice = findBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    } else if (lang.startsWith('ur')) {
      // No Urdu voice available — suggest installing the Urdu speech pack
      console.warn(
        '[PronounceButton] No Urdu voice found on this system. ' +
        'For authentic Pakistani Urdu TTS, install the Urdu speech pack in ' +
        'Windows Settings → Time & Language → Speech → Add a voice (ur-PK).'
      );
    }

    utterance.onstart = () => {
      if (mountedRef.current) setSpeaking(true);
    };

    utterance.onend = () => {
      if (mountedRef.current) setSpeaking(false);
    };

    utterance.onerror = () => {
      if (mountedRef.current) setSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, lang, rate, speaking]);

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  if (!supported) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSpeak();
      }}
      disabled={speaking}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200
        ${speaking
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-110'
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 active:scale-95 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-800/60 dark:hover:text-blue-300'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-slate-900
        disabled:opacity-70 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${showLabel ? 'gap-1.5 px-3 rounded-lg' : ''}
        ${className}
      `}
      title={`Pronounce: ${text}`}
      aria-label={`Pronounce: ${text}`}
    >
      {speaking ? (
        <VolumeX size={iconSizes[size]} className="animate-pulse" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="text-xs font-medium">{speaking ? 'Playing...' : 'Listen'}</span>
      )}
      {speaking && (
        <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/20" />
      )}
    </button>
  );
}
