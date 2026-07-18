/**
 * Cache Expiry Manager
 * 
 * Tracks the last successful server connection timestamp.
 * If the user hasn't connected to the server for 3 days,
 * all caches and offline support are cleared on next visit.
 */

const LAST_CONNECTION_KEY = 'cendronyx_last_server_connection';
const CACHE_EXPIRY_DAYS = 3;
const CACHE_EXPIRY_MS = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Update the last server connection timestamp.
 * Call this whenever the app successfully connects to the server.
 */
export function updateLastConnection(): void {
  try {
    localStorage.setItem(LAST_CONNECTION_KEY, String(Date.now()));
  } catch {
    // localStorage might be unavailable in private browsing
  }
}

/**
 * Get the last server connection timestamp.
 */
export function getLastConnection(): number | null {
  try {
    const stored = localStorage.getItem(LAST_CONNECTION_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}

/**
 * Check if cache has expired (no server connection for 3+ days).
 */
export function isCacheExpired(): boolean {
  const lastConnection = getLastConnection();
  if (!lastConnection) {
    // First connection: initialize it so it is not considered expired
    updateLastConnection();
    return false;
  }
  return Date.now() - lastConnection > CACHE_EXPIRY_MS;
}

/**
 * Clear all service worker caches.
 */
async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((name) => caches.delete(name))
    );
    console.log(`[CacheExpiry] Cleared ${cacheNames.length} caches`);
  }
}

/**
 * Unregister all service workers.
 */
async function unregisterServiceWorkers(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((reg) => reg.unregister())
    );
    console.log(`[CacheExpiry] Unregistered ${registrations.length} service workers`);
  }
}

/**
 * Main function: Check if cache is expired and clear everything if so.
 * Returns true if cache was cleared (user should reload).
 */
export async function checkAndClearExpiredCache(): Promise<boolean> {
  if (!isCacheExpired()) {
    // Not expired, just update the connection timestamp
    updateLastConnection();
    return false;
  }

  console.log('[CacheExpiry] Cache expired (3+ days without server connection). Clearing all caches...');
  
  try {
    await clearAllCaches();
    await unregisterServiceWorkers();
    
    // Clear the stored timestamp after cleanup
    try {
      localStorage.removeItem(LAST_CONNECTION_KEY);
    } catch {
      // Ignore
    }
    
    // Force a hard reload to get fresh content from server
    console.log('[CacheExpiry] Reloading page to fetch fresh content...');
    window.location.reload();
    
    return true;
  } catch (err) {
    console.error('[CacheExpiry] Error clearing caches:', err);
    return false;
  }
}

/**
 * Set up periodic connectivity check.
 * Updates the connection timestamp when online, and checks for expiry periodically.
 */
export function setupConnectivityMonitor(): void {
  // Check expiry first, then update timestamp (order matters!)
  // If we update timestamp before checking, the cache will never appear expired.
  
  // On app load: check if expired, only clear when online so reload fetches fresh content
  if (navigator.onLine) {
    checkAndClearExpiredCache();
  } else {
    // If offline and expired, mark for cleanup on next online event
    if (isCacheExpired()) {
      console.log('[CacheExpiry] Cache expired while offline. Will clear on next connection.');
    }
  }

  // Update timestamp when browser comes back online
  window.addEventListener('online', () => {
    console.log('[CacheExpiry] Browser came online');
    // Check expiry BEFORE updating timestamp
    if (isCacheExpired()) {
      console.log('[CacheExpiry] Cache expired, clearing...');
      checkAndClearExpiredCache();
    } else {
      updateLastConnection();
    }
  });

  // Also update on visibility change (user returns to tab) — only if not expired
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      if (!isCacheExpired()) {
        updateLastConnection();
      }
    }
  });
}
