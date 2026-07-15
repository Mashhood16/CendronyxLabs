import '@testing-library/jest-dom';
import { vi, afterAll } from 'vitest';

// ====== Mock `idb` library for in-memory IndexedDB ======

interface MockStore {
  data: Map<any, any>;
  indexes: Map<string, Map<string, any[]>>;
  autoIncrement: number;
  keyPath: string;
}

const INDEX_KEY: Record<string, string> = {
  'by-experiment': 'experimentId',
  'by-sync-status': 'synced',
  'by-user': 'userId',
  'by-history-user': 'userId',
  'by-email': 'email',
};

// Shared state between __clearIDBMock and vi.mock factory
const { stores, clearStores } = vi.hoisted(() => {
  const stores = new Map<string, MockStore>();
  return { stores, clearStores: () => stores.clear() };
});
(globalThis as any).__clearIDBMock = clearStores;

// Helper to resolve store name from transaction arg
const resolveStoreName = (arg: string | string[] | undefined): string =>
  Array.isArray(arg) ? arg[0] : (arg || '');

// Create storeObj with all methods (used both in transaction and DB-level shortcuts)
function createStoreObj(storeName: string) {
  return {
    add: async (value: any) => {
      const store = stores.get(storeName);
      if (!store) throw new Error(`Store '${storeName}' not found`);
      const key = store.autoIncrement ? store.autoIncrement++ : value[store.keyPath];
      store.data.set(key, { ...value, id: key });
      for (const [indexName, indexMap] of store.indexes) {
        const prop = INDEX_KEY[indexName];
        const idxVal = prop ? value[prop] : undefined;
        if (idxVal !== undefined) {
          const strVal = String(idxVal);
          if (!indexMap.has(strVal)) indexMap.set(strVal, []);
          indexMap.get(strVal)!.push(key);
        }
      }
      return key;
    },
    put: async (value: any) => {
      const store = stores.get(storeName)!;
      store.data.set(value.id ?? value[store.keyPath], value);
    },
    get: async (key: any) => stores.get(storeName)?.data.get(key) ?? null,
    delete: async (key: any) => { stores.get(storeName)?.data.delete(key); },
    clear: async () => { stores.get(storeName)?.data.clear(); },
    getAll: async () => Array.from(stores.get(storeName)?.data.values() || []),
    getAllFromIndex: async (indexName: string, query?: any) => {
      const store = stores.get(storeName);
      if (!store) return [];
      const indexMap = store.indexes.get(indexName);
      if (!indexMap) return [];
      const keys = query === undefined
        ? new Set([...indexMap.values()].flat())
        : (indexMap.get(String(query)) || []);
      return Array.from(keys).map(k => store.data.get(k)).filter(Boolean);
    },
    get indexNames() { return new Set(stores.get(storeName)?.indexes.keys() || []); },
  };
}

vi.mock('idb', () => ({
  openDB: async (_dbName: string, _version: number, { upgrade }: any) => {
    const mockDb: any = {
      objectStoreNames: { contains: (name: string) => stores.has(name) },
      createObjectStore: (name: string, opts: any) => {
        const store: MockStore = {
          data: new Map(),
          indexes: new Map(),
          autoIncrement: opts?.autoIncrement ? 1 : 0,
          keyPath: opts?.keyPath || '',
        };
        stores.set(name, store);
        return {
          createIndex: (indexName: string) => {
            store.indexes.set(indexName, new Map());
          },
          get indexNames() { return new Set(store.indexes.keys()); },
        };
      },
      // DB-level shortcuts (idb library API: db.add(storeName, value), db.get(storeName, key), etc.)
      add: async (storeName: string, value: any) => createStoreObj(storeName).add(value),
      put: async (storeName: string, value: any) => createStoreObj(storeName).put(value),
      get: async (storeName: string, key: any) => createStoreObj(storeName).get(key),
      getAll: async (storeName: string) => createStoreObj(storeName).getAll(),
      getAllFromIndex: async (storeName: string, indexName: string, query?: any) =>
        createStoreObj(storeName).getAllFromIndex(indexName, query),
      delete: async (storeName: string, key: any) => createStoreObj(storeName).delete(key),
      clear: async (storeName: string) => createStoreObj(storeName).clear(),
      transaction: (_storeNames: string | string[]) => {
        const sn = resolveStoreName(_storeNames);
        const storeObj = createStoreObj(sn);
        return {
          objectStore: () => storeObj,
          get store() { return storeObj; },
          get done() { return Promise.resolve(); },
        };
      },
      close: () => {},
    };
    // Run upgrade callback with oldVersion = 0 (fresh database)
    if (upgrade) {
      upgrade(mockDb, 0, _version, mockDb.transaction());
    }
    return mockDb;
  },
}));

// ====== Other Mocks ======

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
        return arr;
      },
      subtle: {
        importKey: async () => ({}),
        deriveBits: async () => {
          const bytes = new Uint8Array(32);
          for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
          return bytes.buffer;
        },
      } as unknown as SubtleCrypto,
    },
    writable: true,
  } as PropertyDescriptor);
}

const lsStore = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => lsStore.get(key) ?? null,
    setItem: (key: string, value: string) => lsStore.set(key, value),
    removeItem: (key: string) => lsStore.delete(key),
    clear: () => lsStore.clear(),
    get length() { return lsStore.size; },
    key: (index: number) => Array.from(lsStore.keys())[index] ?? null,
  },
  writable: true,
});

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: (_query: string) => ({
    matches: false, media: '', onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

let consoleErrorSpy: ReturnType<typeof vi.spyOn> | null = null;
consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
afterAll(() => consoleErrorSpy?.mockRestore());
