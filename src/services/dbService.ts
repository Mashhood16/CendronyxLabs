import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface ProgressRecord {
  id?: number;
  experimentId: string;
  startTime: number;
  completionTime: number | null;
  score: number | null;
  synced: number; // 0 for false, 1 for true
  dataPoints?: any[]; // Store recorded experimental data
}

interface VirtualLabDB extends DBSchema {
  progress: {
    key: number;
    value: ProgressRecord;
    indexes: {
      'by-experiment': string;
      'by-sync-status': number;
    };
  };
}

const DB_NAME = 'VirtualLabDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<VirtualLabDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<VirtualLabDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('progress')) {
          const store = db.createObjectStore('progress', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-experiment', 'experimentId');
          store.createIndex('by-sync-status', 'synced');
        }
      },
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
  
  async getRecordByExperiment(experimentId: string) {
    const db = await initDB();
    const records = await db.getAllFromIndex('progress', 'by-experiment', experimentId);
    return records.length ? records[records.length - 1] : null;
  },
  
  async getAllRecords() {
    const db = await initDB();
    return db.getAll('progress');
  },
  
  async getUnsyncedRecords() {
    const db = await initDB();
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
