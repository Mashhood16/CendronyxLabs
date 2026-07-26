import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './store'
import { setupConnectivityMonitor } from './utils/cacheExpiry'

// Apply persisted accessibility preferences immediately on startup
// (before React renders, so there's no flash of wrong state)
const savedFontSize = localStorage.getItem('virtuallab_fontsize');
if (savedFontSize) {
  document.documentElement.style.fontSize = `${savedFontSize}px`;
}
if (localStorage.getItem('virtuallab_reduced_motion') === 'true') {
  document.documentElement.classList.add('reduce-motion');
}

// Initialize cache expiry monitor — clears all caches after 3 days offline
setupConnectivityMonitor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
)
