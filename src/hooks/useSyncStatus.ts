import { useState, useEffect } from 'react';
import { progressDB } from '../services/dbService';
import { syncService } from '../services/syncService';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkPending = async () => {
    try {
      const unsynced = await progressDB.getUnsyncedRecords();
      setPendingCount(unsynced.length);
    } catch (e) {
      console.error("Failed to check pending syncs", e);
    }
  };

  const triggerSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncService.syncAllUnsynced();
    await checkPending();
    setIsSyncing(false);
  };

  useEffect(() => {
    checkPending();
    // Poll for pending changes that might be added by components
    const interval = setInterval(checkPending, 3000); 

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync(); // Auto-sync when coming online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync attempt if online
    if (navigator.onLine) {
      triggerSync();
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, pendingCount, isSyncing, triggerSync, checkPending };
}
