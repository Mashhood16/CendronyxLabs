import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { progressDB, historyDB, resetDB } from '../../services/dbService';

describe('progressDB', () => {
  beforeEach(() => {
    (globalThis as any).__clearIDBMock();
    resetDB();
  });

  afterEach(() => {
    (globalThis as any).__clearIDBMock();
  });

  it('adds a progress record and returns an id', async () => {
    const id = await progressDB.addRecord({
      userId: 'user1',
      experimentId: 'exp1',
      startTime: Date.now(),
      completionTime: null,
      score: null,
      synced: 0,
    });
    expect(id).toBeGreaterThanOrEqual(1);
  });

  it('retrieves a record by experiment and user', async () => {
    await progressDB.addRecord({
      userId: 'user1',
      experimentId: 'exp1',
      startTime: 1000,
      completionTime: null,
      score: null,
      synced: 0,
    });

    const record = await progressDB.getRecordByExperiment('exp1', 'user1');
    expect(record).not.toBeNull();
    expect(record!.experimentId).toBe('exp1');
    expect(record!.startTime).toBe(1000);
  });

  it('returns null for non-existent experiment', async () => {
    const record = await progressDB.getRecordByExperiment('nonexistent', 'user1');
    expect(record).toBeNull();
  });

  it('updates an existing record', async () => {
    const id = await progressDB.addRecord({
      userId: 'user1',
      experimentId: 'exp2',
      startTime: 2000,
      completionTime: null,
      score: null,
      synced: 0,
    });

    await progressDB.updateRecord({
      id: id as number,
      userId: 'user1',
      experimentId: 'exp2',
      startTime: 2000,
      completionTime: 5000,
      score: 85,
      synced: 0,
    });

    const updated = await progressDB.getRecordByExperiment('exp2', 'user1');
    expect(updated!.score).toBe(85);
    expect(updated!.completionTime).toBe(5000);
  });

  it('finds unsynced records', async () => {
    await progressDB.addRecord({
      userId: 'user1', experimentId: 'exp1',
      startTime: 100, completionTime: null, score: null, synced: 0,
    });
    await progressDB.addRecord({
      userId: 'user1', experimentId: 'exp2',
      startTime: 200, completionTime: null, score: null, synced: 1,
    });

    const unsynced = await progressDB.getUnsyncedRecords('user1');
    expect(unsynced).toHaveLength(1);
    expect(unsynced[0].experimentId).toBe('exp1');
  });

  it('marks record as synced', async () => {
    const id = await progressDB.addRecord({
      userId: 'user1', experimentId: 'exp1',
      startTime: 100, completionTime: null, score: null, synced: 0,
    });

    await progressDB.markAsSynced(id as number);

    const unsynced = await progressDB.getUnsyncedRecords('user1');
    expect(unsynced).toHaveLength(0);
  });
});

describe('historyDB', () => {
  beforeEach(() => {
    (globalThis as any).__clearIDBMock();
    resetDB();
  });

  afterEach(() => {
    (globalThis as any).__clearIDBMock();
  });

  it('adds and retrieves history records sorted by timestamp desc', async () => {
    await historyDB.addRecord('user1', {
      labId: 'lab1', title: 'First Lab', subject: 'physics',
      score: 80, maxScore: 100, timeSpentSeconds: 300,
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    await historyDB.addRecord('user1', {
      labId: 'lab2', title: 'Second Lab', subject: 'chemistry',
      score: 90, maxScore: 100, timeSpentSeconds: 600,
    });

    const records = await historyDB.getRecords('user1');
    expect(records).toHaveLength(2);
    expect(records[0].labId).toBe('lab2');
    expect(records[1].labId).toBe('lab1');
  });

  it('returns empty array for user with no records', async () => {
    const records = await historyDB.getRecords('nobody');
    expect(records).toEqual([]);
  });

  it('clears all records for a user', async () => {
    await historyDB.addRecord('user1', {
      labId: 'lab1', title: 'Test', subject: 'physics',
      score: 80, maxScore: 100, timeSpentSeconds: 300,
    });

    await historyDB.clearUserRecords('user1');
    const records = await historyDB.getRecords('user1');
    expect(records).toEqual([]);
  });
});
