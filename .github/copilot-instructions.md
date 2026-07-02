# Copilot Instructions for Cendronyx Labs

## Quick Reference

**Build & Development**
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - TypeScript check + Vite build (produces `dist/`)
- `npm run lint` - Run ESLint on all `.ts` and `.tsx` files
- `npm run preview` - Preview production build locally

## High-Level Architecture

### Core App Structure
- **React 19 + Vite** - PWA framework with tree-shaking and fast builds
- **Routing** - React Router v7, lazy-loads lab components via code splitting
- **State Management** - Context API (AuthProvider in `src/store.tsx`) handles user auth, progress, and history
- **Offline-First PWA** - Vite PWA plugin auto-caches lab chunks, 3D models, fonts, and DiceBear images with Workbox

### The Three-Column Lab Layout (Desktop)
Each lab component follows this structure:
1. **Theory & Setup Panel** (left) - Explains concepts, formulas, and provides interactive controls (sliders, dropdowns, buttons)
2. **Interactive Simulator** (center) - Canvas, SVG, or React Three Fiber 3D rendering that reacts in real-time to control inputs
3. **Data & Analysis Panel** (right) - Tables, charts (Recharts), and assessment/quiz logic

Mobile collapses this into **tab-based UI** (Theory ↔ Lab tabs at top).

### Data Flow
1. **User → Lab Component** - Adjusts sliders/inputs in Theory panel
2. **Lab State** - Updates local React state (voltage, resistor, etc.)
3. **Physics Simulation** - Calculates real-time results using physics utilities in `src/physics/`
4. **Visualization** - Renders simulator visually and updates data table
5. **Progress Tracking** - IndexedDB (`dbService.ts`) logs lab completion, score, time spent
6. **Background Sync** - Service Worker syncs offline progress to backend when reconnected

### Key Directories
- `src/components/LabX*.tsx` - 464 individual lab modules (organized by subject/grade prefix)
- `src/pages/` - Main navigation pages (ClassSelection, SubjectSelection, ModuleSelection, LabRunner)
- `src/services/` - IndexedDB, student auth, background sync logic
- `src/physics/` - Physics utility modules (kinematics, energy, gravitation, etc.)
- `src/store.tsx` - Auth context + global user/progress state
- `src/data/` - Lab metadata and curriculum data
- `src/hooks/` - Custom React hooks (if any)
- `src/utils/` - Helper functions (sessionId, etc.)

## Key Conventions

### Lab Component Naming & Structure
- **Filename**: `Lab[Grade][Subject][Topic].tsx` 
  - Grade: P=Physics, C=Chemistry, B=Biology, M=Math, CS=CompSci, E=English, S=Science (general)
  - Grade number: 6-12
  - Example: `LabP10OhmLaw.tsx` = Physics, Grade 10, Ohm's Law
- **Props**: Every lab accepts `onExit?: () => void` to handle back navigation
- **Mobile Responsiveness**: Use `lg:hidden` for mobile-only sections and `lg:flex` for desktop-only; Tailwind flexbox for responsive layout

### State Management in Lab Components
- Use React hooks (`useState`) for component-local state (sliders, toggles, data arrays)
- **Single source of truth**: Derived values like `measuredCurrent = voltage / resistor.value` are re-calculated each render
- **Data recording pattern**: Use `dataPoints` arrays, avoid duplicates by checking before pushing

### Physics Utilities (`src/physics/*.ts`)
- Each module exports TypeScript interfaces (e.g., `KinematicsState`, `KinematicsDataPoint`)
- Functions are pure and deterministic for consistent simulation results
- All units follow SI (meters, seconds, kg, Newtons)
- Gravity constants defined (Earth: 9.81, Mars: 3.72, Moon: 1.62 m/s²)

### Styling & Theming
- **Tailwind CSS with custom design tokens** - Dark/light modes via CSS custom properties (`--slate-*`, `--color-*`)
- **Color system**: Primary, secondary, tertiary + surface variants (`on-primary`, `on-secondary`, etc.)
- **Rounded corners**: `rounded-sm` (4px), `rounded` (8px), `rounded-md` (12px), `rounded-lg` (16px), `rounded-xl` (24px)
- **Dark mode**: Configured as `class` strategy; use `dark:` prefix for dark-specific styles
- **Font**: Inter (sans), Plus Jakarta Sans (outfit); use `font-sans` or `font-outfit` as needed

### Database & Persistence
- **IndexedDB** via `idb` library - persists locally, survives browser restarts
- **Tables**: `progress` (experiment records) and `history` (lab completions with scores)
- **Sync pattern**: Offline changes stored locally, tagged with `synced: 0` flag, then batch-synced when online via `/api/sync`
- **Background Sync** - Service Worker queues failed POSTs for retry (max 24 hrs)

### Authentication
- **Session Flow**: User logs in/registers via Login component → stored in IndexedDB + localStorage → AuthProvider restores on app load
- **Anonymous Mode**: If no user, `getAnonymousId()` generates session ID for offline-only usage
- **Protected Routes**: `ProtectedRoute` component gates progress/settings pages

### Code Splitting & Lazy Loading
- Lab components are **lazy-loaded per route** (`const LabRunnerInner = lazy(() => import(...))`), enabling 464 labs without bundle bloat
- Build produces separate `.js` chunks cached by service worker with 30-day TTL
- DiceBear API images cached separately (200 entries max)

### ESLint Configuration
- Modern flat config in `eslint.config.js`
- Recommended rules: ESLint base, TypeScript ESLint, React Hooks, React Refresh (HMR)
- Ignores: `dist/` folder (production builds)

### PWA Caching Strategy (Workbox)
- **Lab chunks** (`/assets/*.js|css`) - CacheFirst (instant offline loads)
- **External images** (DiceBear avatars) - CacheFirst, 200 max, 30-day expiration
- **Google Fonts** - StaleWhileRevalidate (stylesheets), CacheFirst (webfonts)
- **3D models** (`*.gltf|glb|obj|mtl`) - CacheFirst, 10 max (size-limited for storage)
- **Sync queue** - NetworkOnly with 24-hr background retry for `/api/sync` POSTs

### TypeScript Configuration
- **Two separate configs**: `tsconfig.app.json` (app code), `tsconfig.node.json` (Vite config)
- **Global config** references both via "references" field
- Node types included, browser globals configured

## Adding a New Lab Component

1. **Create file**: `src/components/Lab[Grade][Subject][Topic].tsx`
2. **Use standard template**:
   ```tsx
   import { useState } from 'react';
   import LabHeader from './LabHeader';
   import { ICON } from 'lucide-react';
   
   interface LabProps { onExit?: () => void; }
   
   export default function LabName({ onExit }: LabProps) {
     const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
     // ... state for sliders, data, etc.
     
     return (
       <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-black">
         <LabHeader onExit={onExit} title="Title" subtitle="Description" />
         
         {/* Mobile Tabs */}
         <div className="lg:hidden flex gap-2 px-4 py-4">
           {/* Tab buttons */}
         </div>
         
         {/* Main Layout */}
         <div className="flex flex-1 gap-4 px-4 lg:gap-6 lg:px-6">
           {/* Theory Panel - hidden on mobile */}
           <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-lg p-4">
             {/* Input controls, sliders, info */}
           </div>
           
           {/* Simulator - hidden on mobile via tab state */}
           {(activeMobileTab === 'lab' || true) && (
             <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-4">
               {/* Canvas, SVG, or 3D render */}
             </div>
           )}
           
           {/* Data Panel - hidden on mobile via tab state */}
           {(activeMobileTab === 'lab' || true) && (
             <div className="hidden lg:flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-lg p-4">
               {/* Tables, charts, quizzes */}
             </div>
           )}
         </div>
       </div>
     );
   }
   ```
3. **Register route** in `src/pages/LabRunner.tsx` if needed (usually auto-discovered via lazy loading)
4. **Add physics logic** if required (use utilities from `src/physics/`)
5. **Test offline** - Dev server + PWA caching works automatically

## Common Patterns

### Recording Experimental Data
```tsx
const recordData = () => {
  if (dataPoints.find(p => p.V === voltage)) return; // Avoid duplicates
  setDataPoints(prev => [...prev, { V: voltage, I: measuredCurrent }].sort((a, b) => a.V - b.V));
};
```

### Toggle Mobile/Desktop Views
```tsx
<div className="hidden lg:flex">Desktop-only panel</div>
{(activeMobileTab === 'lab' || true) && <div>Mobile-visible panel</div>}
```

### Measurement Noise (Realism)
```tsx
const getMeasurementNoise = (v: number) => {
  const pseudoRandom = Math.sin(v * 10 + noiseSeed) * 0.02; // 2% noise
  return pseudoRandom;
};
const measured = value * (1 + getMeasurementNoise(value));
```

### Validation & Feedback
```tsx
const checkAnswer = () => {
  const user = parseFloat(input);
  if (isNaN(user)) {
    setFeedback('Please enter a valid number.');
    return;
  }
  const error = Math.abs((user - expected) / expected) * 100;
  if (error < 5) setFeedback('Correct!');
  else setFeedback(`Incorrect. Error: ${error.toFixed(1)}%`);
};
```

## Performance & Caching Notes

- **Lazy load labs**: React Router code splitting automatically chunks each lab
- **Service Worker auto-activates** - no manual registration needed (Vite PWA plugin handles it)
- **Max cache sizes**: 300 lab chunks, 200 images, 10 3D models (storage efficient for low-end devices)
- **CSS-in-JS**: Tailwind purges unused styles during build (no bloat)
- **Three.js optimization**: Use React Three Fiber for declarative 3D; avoid creating meshes per frame

## Debugging Tips

- **Dev Mode**: `npm run dev` enables HMR; changes reflect instantly
- **Type Errors**: `npm run build` catches TypeScript issues before production
- **Offline Testing**: DevTools → Network → Offline (simulates offline mode)
- **IndexedDB Inspection**: DevTools → Storage → IndexedDB → virtuallab_db
- **Service Worker**: DevTools → Application → Service Workers (check registration & caching)

## MCP Servers

Copilot's environment is configured with:
- **Node.js** (v20) - Runtime and npm package management for scripts, testing, and builds
- **Playwright** - Browser automation for testing interactive lab UI, PWA installation, and offline scenarios

Configuration is in `.github/workflows/copilot-setup-steps.yml`. When Copilot runs in cloud agent mode, this setup ensures all dependencies and testing tools are pre-installed.
