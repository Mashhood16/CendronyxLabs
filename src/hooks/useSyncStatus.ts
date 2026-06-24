import { useState, useEffect, useCallback } from 'react';
import { progressDB } from '../services/dbService';
import { syncService } from '../services/syncService';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkPending = useCallback(async () => {
    try {
      const unsynced = await progressDB.getUnsyncedRecords();
      setPendingCount(unsynced.length);
    } catch (e) {
      console.error("Failed to check pending syncs", e);
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncService.syncAllUnsynced();
    await checkPending();
    setIsSyncing(false);
  }, [checkPending]);

  useEffect(() => {
    checkPending();

    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(checkPending, 10000);
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    // Only poll when tab is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
        // Also trigger a pending check and sync when becoming visible
        checkPending();
        if (navigator.onLine) {
          triggerSync();
        }
      }
    };

    // Only start polling if online and visible
    if (navigator.onLine && !document.hidden) {
      startPolling();
    }

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
      if (!document.hidden) {
        startPolling();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      stopPolling();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial sync attempt if online
    if (navigator.onLine) {
      triggerSync();
    }

    return () => {
      stopPolling();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkPending, triggerSync]);

  return { isOnline, pendingCount, isSyncing, triggerSync, checkPending };
}
