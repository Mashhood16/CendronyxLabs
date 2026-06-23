import { useState, useEffect, useCallback } from 'react';
import { progressDB } from '../services/dbService';
import type { ProgressRecord } from '../services/dbService';

export function useProgressDB(experimentId?: string) {
  const [currentRecord, setCurrentRecord] = useState<ProgressRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!experimentId) {
      setIsLoading(false);
      return;
    }

    const loadRecord = async () => {
      try {
        setIsLoading(true);
        const record = await progressDB.getRecordByExperiment(experimentId);
        setCurrentRecord(record);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load record'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRecord();
  }, [experimentId]);

  const startExperiment = useCallback(async (id: string) => {
    try {
      const newRecord: Omit<ProgressRecord, 'id'> = {
        experimentId: id,
        startTime: Date.now(),
        completionTime: null,
        score: null,
        synced: 0,
      };
      
      const recordId = await progressDB.addRecord(newRecord);
      const record = { ...newRecord, id: recordId };
      setCurrentRecord(record);
      return record;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start experiment'));
      throw err;
    }
  }, []);

  const completeExperiment = useCallback(async (score: number, dataPoints: any[] = []) => {
    if (!currentRecord) throw new Error('No active experiment');
    
    try {
      const updatedRecord: ProgressRecord = {
        ...currentRecord,
        completionTime: Date.now(),
        score,
        synced: 0, 
        dataPoints,
      };
      
      await progressDB.updateRecord(updatedRecord);
      setCurrentRecord(updatedRecord);
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update experiment'));
      throw err;
    }
  }, [currentRecord]);

  return {
    currentRecord,
    isLoading,
    error,
    startExperiment,
    completeExperiment
  };
}
