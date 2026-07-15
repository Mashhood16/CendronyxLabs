/**
 * Centralized Lab Theme System
 * Provides consistent dark mode and light mode colors for all lab components.
 * 
 * Light mode tokens come from labThemeLight.ts (single source of truth).
 * Dark mode tokens are defined here alongside light.
 * 
 * Usage:
 *   import { theme } from '../utils/labTheme';
 *   <div className={`${theme.page.bg} ${theme.card.bg} ${theme.text.primary}`}>
 * 
 * For backward compatibility, light mode tokens are also re-exported.
 */

import { useTheme } from '../store';

export interface SolidTheme {
  lightBg: string;
  darkBg: string;
  text: string;
  subtext: string;
  button: string;
}

export const SOLID_THEMES: SolidTheme[] = [
  {
    lightBg: 'bg-indigo-600 shadow-md shadow-indigo-500/10',
    darkBg: 'bg-indigo-900 shadow-md shadow-indigo-950/40 border-b border-indigo-800/50',
    text: 'text-white',
    subtext: 'text-indigo-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-emerald-600 shadow-md shadow-emerald-500/10',
    darkBg: 'bg-emerald-900 shadow-md shadow-emerald-950/40 border-b border-emerald-800/50',
    text: 'text-white',
    subtext: 'text-emerald-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-rose-600 shadow-md shadow-rose-500/10',
    darkBg: 'bg-rose-900 shadow-md shadow-rose-950/40 border-b border-rose-800/50',
    text: 'text-white',
    subtext: 'text-rose-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-amber-600 shadow-md shadow-amber-500/10',
    darkBg: 'bg-amber-900 shadow-md shadow-amber-950/40 border-b border-amber-800/50',
    text: 'text-white',
    subtext: 'text-amber-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-blue-600 shadow-md shadow-blue-500/10',
    darkBg: 'bg-blue-900 shadow-md shadow-blue-950/40 border-b border-blue-800/50',
    text: 'text-white',
    subtext: 'text-blue-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-purple-600 shadow-md shadow-purple-500/10',
    darkBg: 'bg-purple-900 shadow-md shadow-purple-950/40 border-b border-purple-800/50',
    text: 'text-white',
    subtext: 'text-purple-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  }
];

// Re-export light mode tokens for backward compatibility
export { light, lightSection, lightWith, lightTokens } from './labThemeLight';

// ── Combined Theme (light + dark in one string) ────────────────────────────
// Mirrors the structure of `light` from labThemeLight.ts.
// Each value includes both light and dark: "lightClass dark:darkClass"

export const theme = {
  /** Main page background (behind everything) */
  page: {
    bg: 'bg-slate-50 dark:bg-[#0a0a0a]',
    bgAlt: 'bg-slate-50 dark:bg-[#0a0a0a]',
    text: 'text-slate-800 dark:text-[#ffffff]',
    textMuted: 'text-slate-600 dark:text-[#a1a1aa]',
  },

  /** Card / panel containers */
  card: {
    bg: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
    borderStrong: 'border-slate-200 dark:border-[#2a2a2a]',
    shadow: 'shadow-sm',
    bgMobile: 'bg-white dark:bg-[#1c1b1b]',
  },

  /** Inner card (nested inside a card) */
  innerCard: {
    bg: 'bg-slate-50 dark:bg-[#1c1b1b]',
    border: 'border-slate-200 dark:border-[#2a2a2a]',
  },

  /** Sidebar / left panel */
  sidebar: {
    bg: 'bg-white dark:bg-[#111111]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
  },

  /** Workspace / right panel / active area */
  workspace: {
    bg: 'bg-slate-100 dark:bg-[#0f0f0f]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
  },

  // ── Borders ─────────────────────────────────────────────────────────────
  border: {
    default: 'border-slate-200 dark:border-[#1c1b1b]',
    strong: 'border-slate-300 dark:border-[#333333]',
    subtle: 'border-slate-100 dark:border-[#1a1a1a]',
    focus: 'focus:border-indigo-500',
    focusRing: 'focus:ring-2 focus:ring-indigo-500',
    header: 'border-slate-200 dark:border-[#1c1b1b]',
  },

  // ── Text colors ────────────────────────────────────────────────────────
  text: {
    primary: 'text-slate-800 dark:text-[#ffffff]',
    secondary: 'text-slate-700 dark:text-[#ffffff]',
    muted: 'text-slate-600 dark:text-[#a1a1aa]',
    subtle: 'text-slate-500 dark:text-[#71717a]',
    faint: 'text-slate-400 dark:text-[#71717a]',
    white: 'text-white',
    onAccent: 'text-slate-700 dark:text-slate-300',
  },

  // ── Hover states (buttons, cards, rows, any interactive element) ──────
  hover: {
    bg: 'hover:bg-slate-100 dark:hover:bg-[#1c1b1b]',
    bgSubtle: 'hover:bg-slate-50 dark:hover:bg-[#161616]',
    bgStrong: 'hover:bg-slate-200 dark:hover:bg-[#2a2a2a]',
    bgStronger: 'hover:bg-slate-300 dark:hover:bg-[#333333]',
    bgIndigo: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
    bgIndigoStrong: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/60',
    bgBlue: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    bgBlueStrong: 'hover:bg-blue-200 dark:hover:bg-blue-900/60',
    bgEmerald: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    bgEmeraldStrong: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/60',
    bgRed: 'hover:bg-red-100 dark:hover:bg-red-900/40',
    bgRedStrong: 'hover:bg-red-200 dark:hover:bg-red-900/60',
    bgAmber: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
    bgAmberStrong: 'hover:bg-amber-200 dark:hover:bg-amber-900/60',
    bgPurple: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
    bgPurpleStrong: 'hover:bg-purple-200 dark:hover:bg-purple-900/60',
    bgTeal: 'hover:bg-teal-100 dark:hover:bg-teal-900/40',
    bgTealStrong: 'hover:bg-teal-200 dark:hover:bg-teal-900/60',
    bgRose: 'hover:bg-rose-100 dark:hover:bg-rose-900/40',
    bgRoseStrong: 'hover:bg-rose-200 dark:hover:bg-rose-900/60',
    text: 'hover:text-slate-900 dark:hover:text-white',
    textSubtle: 'hover:text-slate-700 dark:hover:text-slate-200',
    textMuted: 'hover:text-slate-600 dark:hover:text-slate-300',
    border: 'hover:border-slate-300 dark:hover:border-[#444444]',
    borderStrong: 'hover:border-slate-400 dark:hover:border-[#555555]',
    borderIndigo: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    borderBlue: 'hover:border-blue-300 dark:hover:border-blue-700',
    borderEmerald: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    borderRed: 'hover:border-red-300 dark:hover:border-red-700',
  },

  /** Selected / active state */
  selected: {
    bg: 'bg-slate-100 dark:bg-[#1a1a1a]',
    border: 'border-slate-300 dark:border-[#333333]',
    text: 'text-slate-800 dark:text-[#ffffff]',
  },

  // ── Form elements ──────────────────────────────────────────────────────
  input: {
    bg: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-300 dark:border-[#2a2a2a]',
    text: 'text-slate-800 dark:text-white',
    placeholder: 'placeholder-slate-400 dark:placeholder-slate-600',
    focus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500',
  },

  textarea: {
    bg: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-300 dark:border-[#2a2a2a]',
    text: 'text-slate-800 dark:text-white',
  },

  select: {
    bg: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-300 dark:border-[#333333]',
  },

  // ── Buttons ────────────────────────────────────────────────────────────
  button: {
    default: 'bg-white dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2a2a2a]',
    primary: 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]',
    danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-400',
    success: 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400',
    disabled: 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-400 dark:text-slate-500 cursor-not-allowed',
  },

  // ── Tab navigation ─────────────────────────────────────────────────────
  tab: {
    active: 'bg-[#4158D1] text-white shadow-md',
    inactive: 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700',
  },

  // ── Score / result feedback ────────────────────────────────────────────
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  },

  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  },

  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
  },

  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
  },

  // ── Dividers ───────────────────────────────────────────────────────────
  divider: {
    default: 'border-slate-200 dark:border-[#1c1b1b]',
    strong: 'border-slate-300 dark:border-[#2a2a2a]',
  },

  // ── Scrollbar ──────────────────────────────────────────────────────────
  scrollbar: {
    track: 'bg-slate-100 dark:bg-[#1a1a1a]',
    thumb: 'bg-slate-300 dark:bg-[#333333]',
  },

  // ── SVG / diagram backgrounds ──────────────────────────────────────────
  diagram: {
    bg: 'bg-slate-50 dark:bg-[#0a0a0a]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
    grid: 'stroke-slate-200 dark:stroke-slate-700',
    axis: 'stroke-slate-400 dark:stroke-slate-600',
    label: 'fill-slate-600 dark:fill-slate-400',
  },

  // ── Theory / prose section ─────────────────────────────────────────────
  theory: {
    heading: 'text-slate-800 dark:text-[#ffffff]',
    subheading: 'text-slate-700 dark:text-[#ffffff]',
    body: 'text-slate-600 dark:text-[#a1a1aa]',
    muted: 'text-slate-500 dark:text-[#71717a]',
    emphasis: 'text-slate-800 dark:text-[#ffffff] font-semibold',
    code: 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-800 dark:text-white',
    blockquote: 'border-slate-300 dark:border-[#333333] text-slate-600 dark:text-[#a1a1aa]',
  },

  // ── Slider / range input ──────────────────────────────────────────────
  slider: {
    track: 'bg-slate-200 dark:bg-[#2a2a2a]',
    thumb: 'accent-indigo-600 dark:accent-indigo-400',
    label: 'text-slate-500 dark:text-[#71717a]',
    value: 'text-indigo-600 dark:text-indigo-400',
  },

  // ── Modal / overlay ────────────────────────────────────────────────────
  overlay: {
    bg: 'bg-black/50 dark:bg-black/70',
    card: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
  },

  // ── Tooltip / popover ─────────────────────────────────────────────────
  tooltip: {
    bg: 'bg-slate-800 dark:bg-[#000000]',
    text: 'text-white',
  },

  // ── Progress / loading ─────────────────────────────────────────────────
  progress: {
    track: 'bg-slate-200 dark:bg-[#2a2a2a]',
    bar: 'bg-indigo-600 dark:bg-indigo-500',
    text: 'text-slate-600 dark:text-[#a1a1aa]',
  },

  // ── Additional lab-specific tokens ─────────────────────────────────────
  /** Dark code block / formula display background */
  codeBlock: {
    bg: 'bg-[#000000] dark:bg-[#000000]',
    border: 'border-[#1c1b1b] dark:border-[#1c1b1b]',
    text: 'text-yellow-400',
  },

  /** Accent step label (blue) used in derivation/theorem steps */
  stepLabel: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
  },

  /** Key insight / real-life application card (amber) */
  insight: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
  },

  /** Nav header / top-level navigation bar */
  nav: {
    bg: 'bg-white/95 dark:bg-[#121212]/95',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
    text: 'text-slate-600 dark:text-[#a1a1aa]',
    textActive: 'text-indigo-600 dark:text-[#5560F1]',
    textHover: 'hover:text-slate-600 dark:hover:text-[#a1a1aa]',
    searchBg: 'bg-white dark:bg-[#000000]',
    searchBorder: 'border-slate-200 dark:border-[#1c1b1b]',
  },

  /** Bottom navigation bar (mobile) */
  bottomNav: {
    bg: 'bg-white/95 dark:bg-[#121212]/95',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
    text: 'text-slate-400 dark:text-[#71717a]',
    textActive: 'text-indigo-600 dark:text-[#5560F1]',
    textHover: 'hover:text-slate-600 dark:hover:text-[#a1a1aa]',
  },

  /** Header bar inside lab pages */
  labHeader: {
    bg: 'bg-white dark:bg-[#121212]',
    border: 'border-slate-200 dark:border-[#1c1b1b]',
    text: 'text-slate-700 dark:text-[#ffffff]',
  },

  // ── Per-accent-color tokens ──────────────────────────────────────────────
  // Each color provides pre-computed Tailwind class strings for buttons, info
  // boxes, derivation/theorem steps, and badges. Using literal strings ensures
  // Tailwind JIT detects them during build.
  accent: {
    teal: {
      btn: 'dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40',
      infoBox: 'dark:bg-teal-950/20 dark:border-teal-900',
      stepBg: 'bg-teal-50 dark:bg-teal-900/20',
      stepBorder: 'border-teal-200 dark:border-teal-800',
      stepText: 'text-teal-800 dark:text-teal-300',
      badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    },
    blue: {
      btn: 'dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40',
      infoBox: 'dark:bg-blue-950/20 dark:border-blue-900',
      stepBg: 'bg-blue-50 dark:bg-blue-900/20',
      stepBorder: 'border-blue-200 dark:border-blue-800',
      stepText: 'text-blue-800 dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    amber: {
      btn: 'dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40',
      infoBox: 'dark:bg-amber-950/20 dark:border-amber-900',
      stepBg: 'bg-amber-50 dark:bg-amber-900/20',
      stepBorder: 'border-amber-200 dark:border-amber-800',
      stepText: 'text-amber-800 dark:text-amber-300',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
    emerald: {
      btn: 'dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40',
      infoBox: 'dark:bg-emerald-950/20 dark:border-emerald-900',
      stepBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      stepBorder: 'border-emerald-200 dark:border-emerald-800',
      stepText: 'text-emerald-800 dark:text-emerald-300',
      badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    },
    indigo: {
      btn: 'dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40',
      infoBox: 'dark:bg-indigo-950/20 dark:border-indigo-900',
      stepBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      stepBorder: 'border-indigo-200 dark:border-indigo-800',
      stepText: 'text-indigo-800 dark:text-indigo-300',
      badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    },
    pink: {
      btn: 'dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40',
      infoBox: 'dark:bg-pink-950/20 dark:border-pink-900',
      stepBg: 'bg-pink-50 dark:bg-pink-900/20',
      stepBorder: 'border-pink-200 dark:border-pink-800',
      stepText: 'text-pink-800 dark:text-pink-300',
      badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    },
    rose: {
      btn: 'dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40',
      infoBox: 'dark:bg-rose-950/20 dark:border-rose-900',
      stepBg: 'bg-rose-50 dark:bg-rose-900/20',
      stepBorder: 'border-rose-200 dark:border-rose-800',
      stepText: 'text-rose-800 dark:text-rose-300',
      badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    },
    orange: {
      btn: 'dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40',
      infoBox: 'dark:bg-orange-950/20 dark:border-orange-900',
      stepBg: 'bg-orange-50 dark:bg-orange-900/20',
      stepBorder: 'border-orange-200 dark:border-orange-800',
      stepText: 'text-orange-800 dark:text-orange-300',
      badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    green: {
      btn: 'dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40',
      infoBox: 'dark:bg-green-950/20 dark:border-green-900',
      stepBg: 'bg-green-50 dark:bg-green-900/20',
      stepBorder: 'border-green-200 dark:border-green-800',
      stepText: 'text-green-800 dark:text-green-300',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    cyan: {
      btn: 'dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-cyan-500/40',
      infoBox: 'dark:bg-cyan-950/20 dark:border-cyan-900',
      stepBg: 'bg-cyan-50 dark:bg-cyan-900/20',
      stepBorder: 'border-cyan-200 dark:border-cyan-800',
      stepText: 'text-cyan-800 dark:text-cyan-300',
      badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    },
    yellow: {
      btn: 'dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40',
      infoBox: 'dark:bg-yellow-950/20 dark:border-yellow-900',
      stepBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      stepBorder: 'border-yellow-200 dark:border-yellow-800',
      stepText: 'text-yellow-800 dark:text-yellow-300',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    },
    purple: {
      btn: 'dark:bg-purple-500 dark:hover:bg-purple-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-purple-500/40',
      infoBox: 'dark:bg-purple-950/20 dark:border-purple-900',
      stepBg: 'bg-purple-50 dark:bg-purple-900/20',
      stepBorder: 'border-purple-200 dark:border-purple-800',
      stepText: 'text-purple-800 dark:text-purple-300',
      badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    violet: {
      btn: 'dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-violet-500/40',
      infoBox: 'dark:bg-violet-950/20 dark:border-violet-900',
      stepBg: 'bg-violet-50 dark:bg-violet-900/20',
      stepBorder: 'border-violet-200 dark:border-violet-800',
      stepText: 'text-violet-800 dark:text-violet-300',
      badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    },
    red: {
      btn: 'dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40',
      infoBox: 'dark:bg-red-950/20 dark:border-red-900',
      stepBg: 'bg-red-50 dark:bg-red-900/20',
      stepBorder: 'border-red-200 dark:border-red-800',
      stepText: 'text-red-800 dark:text-red-300',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    },
    sky: {
      btn: 'dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-sky-500/40',
      infoBox: 'dark:bg-sky-950/20 dark:border-sky-900',
      stepBg: 'bg-sky-50 dark:bg-sky-900/20',
      stepBorder: 'border-sky-200 dark:border-sky-800',
      stepText: 'text-sky-800 dark:text-sky-300',
      badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    },
  } as const,
} as const;

// ── Combined Theme (light + dark as pairs) ──────────────────────────────────
// Kept for the labClasses() helper and advanced usage.

export const labTheme = {
  page: {
    light: 'bg-slate-50',
    dark: 'dark:bg-[#0a0a0a]',
  },
  card: {
    light: 'bg-white',
    dark: 'dark:bg-[#141414]',
  },
  sidebar: {
    light: 'bg-white',
    dark: 'dark:bg-[#111111]',
  },
  workspace: {
    light: 'bg-slate-100',
    dark: 'dark:bg-[#0f0f0f]',
  },
  border: {
    light: 'border-slate-200',
    dark: 'dark:border-[#222222]',
  },
  borderSubtle: {
    light: 'border-slate-100',
    dark: 'dark:border-[#1a1a1a]',
  },
  text: {
    light: 'text-slate-800',
    dark: 'dark:text-[#e5e5e5]',
  },
  textMuted: {
    light: 'text-slate-500',
    dark: 'dark:text-[#888888]',
  },
  textSubtle: {
    light: 'text-slate-400',
    dark: 'dark:text-[#666666]',
  },
  hover: {
    light: 'hover:bg-slate-100',
    dark: 'dark:hover:bg-[#1e1e1e]',
  },
  hoverStrong: {
    light: 'hover:bg-slate-200',
    dark: 'dark:hover:bg-[#2a2a2a]',
  },
  hoverSubtle: {
    light: 'hover:bg-slate-50',
    dark: 'dark:hover:bg-[#161616]',
  },
  hoverBorder: {
    light: 'hover:border-slate-300',
    dark: 'dark:hover:border-[#333333]',
  },
  hoverIndigo: {
    light: 'hover:bg-indigo-100',
    dark: 'dark:hover:bg-indigo-900/40',
  },
  hoverBlue: {
    light: 'hover:bg-blue-100',
    dark: 'dark:hover:bg-blue-900/40',
  },
  hoverEmerald: {
    light: 'hover:bg-emerald-100',
    dark: 'dark:hover:bg-emerald-900/40',
  },
  hoverRed: {
    light: 'hover:bg-red-100',
    dark: 'dark:hover:bg-red-900/40',
  },
  hoverAmber: {
    light: 'hover:bg-amber-100',
    dark: 'dark:hover:bg-amber-900/40',
  },
  selected: {
    light: 'bg-slate-100',
    dark: 'dark:bg-[#1a1a1a]',
  },
  input: {
    light: 'bg-white border-slate-300',
    dark: 'dark:bg-[#111111] dark:border-[#333333]',
  },
  successBg: {
    light: 'bg-emerald-50',
    dark: 'dark:bg-emerald-950/30',
  },
  errorBg: {
    light: 'bg-red-50',
    dark: 'dark:bg-red-950/30',
  },
  divider: {
    light: 'border-slate-200',
    dark: 'dark:border-[#222222]',
  },
  scrollbar: {
    light: 'bg-slate-100',
    dark: 'dark:bg-[#1a1a1a]',
  },
  shadow: {
    card: 'shadow-sm',
    elevated: 'shadow-md',
  },
} as const;

/**
 * Helper to combine light + dark classes for a theme property.
 * Usage: labClasses('page') → "bg-slate-50 dark:bg-[#0a0a0a]"
 */
export function labClasses(key: keyof typeof labTheme): string {
  const t = labTheme[key];
  if ('light' in t && 'dark' in t) {
    return `${(t as any).light} ${(t as any).dark}`;
  }
  return '';
}

export const headerVariants = {
  blue:   { light: 'bg-blue-600',   dark: 'bg-blue-800' },
  indigo: { light: 'bg-indigo-600', dark: 'bg-indigo-800' },
  emerald:{ light: 'bg-emerald-600',dark: 'bg-emerald-800' },
  amber:  { light: 'bg-amber-600',  dark: 'bg-amber-800' },
  purple: { light: 'bg-purple-600', dark: 'bg-purple-800' },
  rose:   { light: 'bg-rose-600',   dark: 'bg-rose-800' },
  teal:   { light: 'bg-teal-600',   dark: 'bg-teal-800' },
  pink:   { light: 'bg-pink-600',   dark: 'bg-pink-800' },
} as const;

/**
 * Dynamic theme colors hook for components that need active theme values
 * (e.g., canvas, SVGs, or conditional javascript logic)
 */
export function useThemeColors() {
  const { theme: currentTheme } = useTheme();

  const raw = {
    background: currentTheme === 'dark' ? '#000000' : '#f8fafc',
    surface: currentTheme === 'dark' ? '#121212' : '#ffffff',
    surfaceMuted: currentTheme === 'dark' ? '#1c1b1b' : '#f1f5f9',
    border: currentTheme === 'dark' ? '#1c1b1b' : '#e2e8f0',
    textPrimary: currentTheme === 'dark' ? '#ffffff' : '#1e293b',
    textSecondary: currentTheme === 'dark' ? '#a1a1aa' : '#64748b',
    tickColor: currentTheme === 'dark' ? '#a1a1aa' : '#334155',
  };

  return { theme: currentTheme, raw };
}
