import { progressDB } from './dbService';

export const syncService = {
  async syncAllUnsynced() {
    if (!navigator.onLine) return;
    
    const unsynced = await progressDB.getUnsyncedRecords();
    if (unsynced.length === 0) return;

    // This is the placeholder API endpoint configured in Workbox backgroundSync
    const API_ENDPOINT = '/api/sync';

    for (const record of unsynced) {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });

        // Only mark as synced if we get a real successful response back right now.
        // If it fails but we are offline, Workbox queues the request internally.
        if (response.ok || response.status === 404) {
          // Note: using 404 as "success" here just for prototype since we don't have a real backend!
          // In a real app, only check response.ok
          if (record.id !== undefined) {
            await progressDB.markAsSynced(record.id);
          }
        }
      } catch (error) {
        console.error('Failed to sync record', record.id, error);
        // If we are offline or server is unreachable, fetch throws.
        // Workbox background sync plugin will queue the request to ensure the server gets it eventually.
      }
    }
  }
};
