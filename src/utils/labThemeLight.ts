/**
 * Centralized Light Mode Theme for All Lab Components
 * 
 * This is the single source of truth for light mode colors in labs.
 * Import tokens from here instead of hardcoding colors in lab files.
 * 
 * Usage:
 *   import { light } from '../utils/labThemeLight';
 *   <div className={`${light.page.bg} ${light.card.border}`}>
 * 
 * Or use the helper:
 *   import { l } from '../utils/labThemeLight';
 *   <div className={l.page}>   // "bg-slate-50"
 *   <div className={l.card}>   // "bg-white border-slate-200"
 */

// ── Page-level ──────────────────────────────────────────────────────────────
export const light = {
  /** Main page background (behind everything) */
  page: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
  },

  /** Card / panel containers */
  card: {
    bg: 'bg-white',
    border: 'border-slate-200',
    shadow: 'shadow-sm',
  },

  /** Inner card (nested inside a card) */
  innerCard: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },

  /** Sidebar / left panel */
  sidebar: {
    bg: 'bg-white',
    border: 'border-slate-200',
  },

  /** Workspace / right panel / active area */
  workspace: {
    bg: 'bg-slate-100',
    border: 'border-slate-200',
  },

  // ── Borders ─────────────────────────────────────────────────────────────
  border: {
    default: 'border-slate-200',
    strong: 'border-slate-300',
    subtle: 'border-slate-100',
    focus: 'focus:border-indigo-500',
    focusRing: 'focus:ring-2 focus:ring-indigo-500',
  },

  // ── Text colors ────────────────────────────────────────────────────────
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-700',
    muted: 'text-slate-600',
    subtle: 'text-slate-500',
    faint: 'text-slate-400',
    white: 'text-white',
    onAccent: 'text-slate-700',
  },

  // ── Hover states (buttons, cards, rows, any interactive element) ──────
  hover: {
    // Background hovers (slate scale)
    bg: 'hover:bg-slate-100',
    bgSubtle: 'hover:bg-slate-50',
    bgStrong: 'hover:bg-slate-200',
    bgStronger: 'hover:bg-slate-300',
    // Accent background hovers
    bgIndigo: 'hover:bg-indigo-100',
    bgIndigoStrong: 'hover:bg-indigo-200',
    bgBlue: 'hover:bg-blue-100',
    bgBlueStrong: 'hover:bg-blue-200',
    bgEmerald: 'hover:bg-emerald-100',
    bgEmeraldStrong: 'hover:bg-emerald-200',
    bgRed: 'hover:bg-red-100',
    bgRedStrong: 'hover:bg-red-200',
    bgAmber: 'hover:bg-amber-100',
    bgAmberStrong: 'hover:bg-amber-200',
    bgPurple: 'hover:bg-purple-100',
    bgPurpleStrong: 'hover:bg-purple-200',
    bgTeal: 'hover:bg-teal-100',
    bgTealStrong: 'hover:bg-teal-200',
    bgRose: 'hover:bg-rose-100',
    bgRoseStrong: 'hover:bg-rose-200',
    // Text hovers
    text: 'hover:text-slate-900',
    textSubtle: 'hover:text-slate-700',
    textMuted: 'hover:text-slate-600',
    // Border hovers
    border: 'hover:border-slate-300',
    borderStrong: 'hover:border-slate-400',
    borderIndigo: 'hover:border-indigo-300',
    borderBlue: 'hover:border-blue-300',
    borderEmerald: 'hover:border-emerald-300',
    borderRed: 'hover:border-red-300',
  },

  /** Selected / active state */
  selected: {
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-800',
  },

  // ── Form elements ──────────────────────────────────────────────────────
  input: {
    bg: 'bg-white',
    border: 'border-slate-300',
    text: 'text-slate-800',
    placeholder: 'placeholder-slate-400',
    focus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500',
  },

  textarea: {
    bg: 'bg-white',
    border: 'border-slate-300',
    text: 'text-slate-800',
  },

  select: {
    bg: 'bg-white',
    border: 'border-slate-300',
  },

  // ── Buttons ────────────────────────────────────────────────────────────
  button: {
    /** Default/secondary button */
    default: 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50',
    /** Primary action button */
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    /** Ghost / minimal button */
    ghost: 'text-slate-600 hover:bg-slate-100',
    /** Danger button */
    danger: 'bg-red-600 text-white hover:bg-red-700',
    /** Success button */
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    /** Disabled state */
    disabled: 'bg-slate-200 text-slate-400 cursor-not-allowed',
  },

  // ── Tab navigation ─────────────────────────────────────────────────────
  tab: {
    active: 'bg-[#4158D1] text-white shadow-md',
    inactive: 'bg-white text-slate-600 border border-slate-200',
  },

  // ── Score / result feedback ────────────────────────────────────────────
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-green-100 text-green-800',
  },

  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-800',
  },

  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },

  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },

  // ── Dividers ───────────────────────────────────────────────────────────
  divider: {
    default: 'border-slate-200',
    strong: 'border-slate-300',
  },

  // ── Scrollbar ──────────────────────────────────────────────────────────
  scrollbar: {
    track: 'bg-slate-100',
    thumb: 'bg-slate-300',
  },

  // ── SVG / diagram backgrounds ──────────────────────────────────────────
  diagram: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    grid: 'stroke-slate-200',
    axis: 'stroke-slate-400',
    label: 'fill-slate-600',
  },

  // ── Theory / prose section ─────────────────────────────────────────────
  theory: {
    heading: 'text-slate-800',
    subheading: 'text-slate-700',
    body: 'text-slate-600',
    muted: 'text-slate-500',
    emphasis: 'text-slate-800 font-semibold',
    code: 'bg-slate-100 text-slate-800',
    blockquote: 'border-slate-300 text-slate-600',
  },

  // ── Slider / range input ──────────────────────────────────────────────
  slider: {
    track: 'bg-slate-200',
    thumb: 'accent-indigo-600',
    label: 'text-slate-500',
    value: 'text-indigo-600',
  },

  // ── Modal / overlay ────────────────────────────────────────────────────
  overlay: {
    bg: 'bg-black/50',
    card: 'bg-white',
    border: 'border-slate-200',
  },

  // ── Tooltip / popover ─────────────────────────────────────────────────
  tooltip: {
    bg: 'bg-slate-800',
    text: 'text-white',
  },

  // ── Progress / loading ─────────────────────────────────────────────────
  progress: {
    track: 'bg-slate-200',
    bar: 'bg-indigo-600',
    text: 'text-slate-600',
  },
} as const;

// ── Convenience helper ──────────────────────────────────────────────────────
// Flatten all light mode tokens into a single string for quick use.
// Usage: l.page → "bg-slate-50", l.card → "bg-white border-slate-200 shadow-sm"

function flattenLightMode(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[prefix ? `${prefix}.${key}` : key] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenLightMode(value, prefix ? `${prefix}.${key}` : key));
    }
  }
  return result;
}

export const lightTokens = flattenLightMode(light);
export function getLightTokens(): Record<string, string> {
  return lightTokens;
}

/**
 * Get a combined class string from a theme section.
 * 
 * @example
 *   lightSection('card')  → "bg-white border-slate-200 shadow-sm"
 *   lightSection('page')  → "bg-slate-50 text-slate-800"
 */
export function lightSection(key: keyof typeof light): string {
  const section = light[key];
  if (typeof section === 'string') return section;
  return Object.values(section).join(' ');
}

/**
 * Merge light mode classes with custom overrides.
 * Useful when a lab needs to tweak a standard token.
 * 
 * @example
 *   lightWith('card', 'rounded-2xl p-6')
 *   // → "bg-white border-slate-200 shadow-sm rounded-2xl p-6"
 */
export function lightWith(key: keyof typeof light, ...extra: string[]): string {
  return `${lightSection(key)} ${extra.join(' ')}`.trim();
}
