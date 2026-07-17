import { initDB, type CustomLab } from './dbService';

export const customLabService = {
  async saveLab(lab: CustomLab): Promise<void> {
    const db = await initDB();
    await db.put('custom_labs', lab);
  },

  async getLab(id: string): Promise<CustomLab | undefined> {
    const db = await initDB();
    return db.get('custom_labs', id);
  },

  async getUserLabs(userId: string): Promise<CustomLab[]> {
    const db = await initDB();
    const index = db.transaction('custom_labs').store.index('by-user');
    return index.getAll(userId);
  },

  async getPendingLabs(): Promise<CustomLab[]> {
    const db = await initDB();
    const index = db.transaction('custom_labs').store.index('by-status');
    return index.getAll('pending');
  },

  async getApprovedLabs(): Promise<CustomLab[]> {
    const db = await initDB();
    const index = db.transaction('custom_labs').store.index('by-status');
    return index.getAll('approved');
  },

  async deleteLab(id: string): Promise<void> {
    const db = await initDB();
    await db.delete('custom_labs', id);
  },

  async approveLab(id: string): Promise<void> {
    const db = await initDB();
    const lab = await db.get('custom_labs', id);
    if (lab) {
      lab.status = 'approved';
      await db.put('custom_labs', lab);
    }
  },

  async rejectLab(id: string): Promise<void> {
    const db = await initDB();
    const lab = await db.get('custom_labs', id);
    if (lab) {
      lab.status = 'rejected';
      await db.put('custom_labs', lab);
    }
  }
};
export type { CustomLab };
