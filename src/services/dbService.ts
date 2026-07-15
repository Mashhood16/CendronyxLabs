import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface DataPoint {
  key: string;
  value: string | number;
  timestamp?: number;
}

export interface ProgressRecord {
  id?: number;
  userId: string;
  experimentId: string;
  startTime: number;
  completionTime: number | null;
  score: number | null;
  synced: number; // 0 for false, 1 for true
  dataPoints?: DataPoint[]; // Store recorded experimental data
}

export interface LabRecord {
  labId: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  timestamp: number;
  experimentData?: Record<string, string | number>;
}

interface VirtualLabDB extends DBSchema {
  progress: {
    key: number;
    value: ProgressRecord;
    indexes: {
      'by-experiment': string;
      'by-sync-status': number;
      'by-user': string;
    };
  };
  history: {
    key: number;
    value: LabRecord & { id: number; userId: string };
    indexes: {
      'by-history-user': string;
    };
  };
}

const DB_NAME = 'VirtualLabDB';
const DB_VERSION = 5;

let dbPromise: Promise<IDBPDatabase<VirtualLabDB>> | null = null;

export const resetDB = () => {
  dbPromise = null;
};

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<VirtualLabDB>(DB_NAME, DB_VERSION, {
      async upgrade(db, oldVersion, _newVersion, transaction) {
        // --- Version 1: Create progress store with all indexes ---
        if (oldVersion < 1) {
          const store = db.createObjectStore('progress', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-experiment', 'experimentId');
          store.createIndex('by-sync-status', 'synced');
          store.createIndex('by-user', 'userId');
        }

        // --- Version 2: Ensure 'by-user' index exists on progress ---
        if (oldVersion < 2 && oldVersion >= 1) {
          const store = transaction.objectStore('progress');
          if (!store.indexNames.contains('by-user')) {
            store.createIndex('by-user', 'userId');
          }
        }

        // --- Version 3+: Create history store ---
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', {
            keyPath: 'id',
            autoIncrement: true,
          });
          historyStore.createIndex('by-history-user', 'userId');
        }
      },
    }).catch((err) => {
      console.error('Failed to open IndexedDB, retrying...', err);
      dbPromise = null; // Reset so next call retries
      throw err;
    });
  }
  return dbPromise;
};

export const progressDB = {
  async addRecord(record: Omit<ProgressRecord, 'id'>) {
    const db = await initDB();
    return db.add('progress', record as ProgressRecord);
  },
  
  async updateRecord(record: ProgressRecord) {
    const db = await initDB();
    return db.put('progress', record);
  },
  
  async getRecordByExperiment(experimentId: string, userId?: string) {
    const db = await initDB();
    if (userId) {
      // Get all records for this experiment + user
      const allRecords = await db.getAll('progress');
      const filtered = allRecords.filter(r => r.experimentId === experimentId && r.userId === userId);
      return filtered.length ? filtered[filtered.length - 1] : null;
    }
    const records = await db.getAllFromIndex('progress', 'by-experiment', experimentId);
    return records.length ? records[records.length - 1] : null;
  },
  
  async getAllRecords(userId?: string) {
    const db = await initDB();
    if (userId) {
      return db.getAllFromIndex('progress', 'by-user', userId);
    }
    return db.getAll('progress');
  },
  
  async getUnsyncedRecords(userId?: string) {
    const db = await initDB();
    if (userId) {
      const all = await db.getAllFromIndex('progress', 'by-user', userId);
      return all.filter(r => r.synced === 0);
    }
    return db.getAllFromIndex('progress', 'by-sync-status', 0);
  },
  
  async markAsSynced(id: number) {
    const db = await initDB();
    const record = await db.get('progress', id);
    if (record) {
      record.synced = 1;
      await db.put('progress', record);
    }
  }
};

// --- History DB ---

export const historyDB = {
  async addRecord(userId: string, record: Omit<LabRecord, 'timestamp'>) {
    const db = await initDB();
    const fullRecord = { ...record, timestamp: Date.now(), userId };
    return db.add('history', fullRecord as LabRecord & { id: number; userId: string });
  },

  async getRecords(userId: string): Promise<LabRecord[]> {
    const db = await initDB();
    const records = await db.getAllFromIndex('history', 'by-history-user', userId);
    // Sort by timestamp descending (newest first)
    return records.sort((a, b) => b.timestamp - a.timestamp);
  },

  async clearUserRecords(userId: string) {
    const db = await initDB();
    const records = await db.getAllFromIndex('history', 'by-history-user', userId);
    const tx = db.transaction('history', 'readwrite');
    for (const record of records) {
      await tx.store.delete(record.id);
    }
    await tx.done;
  }
};
