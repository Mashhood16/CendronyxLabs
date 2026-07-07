import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StudentAccount } from './services/studentService';
import { studentService } from './services/studentService';
import { historyDB } from './services/dbService';
import type { LabRecord } from './services/dbService';
import { getAnonymousId } from './utils/sessionId';

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  classLevel: string;
  section: string;
}

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  register: (name: string, email: string, classLevel: string, section: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'classLevel' | 'section'>>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function accountToUser(account: StudentAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    classLevel: account.classLevel,
    section: account.section,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore session from IndexedDB on mount
  useEffect(() => {
    const storedId = localStorage.getItem('virtuallab_user_id');
    if (storedId) {
      studentService.getAccount(storedId).then((account) => {
        if (account) {
          setUser(accountToUser(account));
        } else {
          localStorage.removeItem('virtuallab_user_id');
        }
        setIsLoaded(true);
      }).catch(() => {
        localStorage.removeItem('virtuallab_user_id');
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, classLevel: string, section: string, password: string) => {
    const account = await studentService.register(name, email, classLevel, section, password);
    setUser(accountToUser(account));
    localStorage.setItem('virtuallab_user_id', account.id);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const account = await studentService.login(email, password);
    setUser(accountToUser(account));
    localStorage.setItem('virtuallab_user_id', account.id);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('virtuallab_user_id');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'classLevel' | 'section'>>) => {
    if (!user) throw new Error('Not logged in');
    await studentService.updateProfile(user.id, updates);
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  }, [user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not logged in');
    await studentService.changePassword(user.id, currentPassword, newPassword);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoaded, register, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- History Context ---
interface HistoryContextType {
  history: LabRecord[];
  addRecord: (record: Omit<LabRecord, 'timestamp'>) => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<LabRecord[]>([]);

  // Load history scoped to current user (or anonymous session) from IndexedDB
  useEffect(() => {
    const userId = user?.id || getAnonymousId();
    historyDB.getRecords(userId).then(setHistory).catch(() => setHistory([]));
  }, [user?.id]);

  const addRecord = useCallback(async (record: Omit<LabRecord, 'timestamp'>) => {
    const userId = user?.id || getAnonymousId();
    try {
      await historyDB.addRecord(userId, record);
      const updated = await historyDB.getRecords(userId);
      setHistory(updated);
    } catch (err) {
      console.error('Failed to save history record', err);
    }
  }, [user?.id, user]);

  const refreshHistory = useCallback(async () => {
    const userId = user?.id || getAnonymousId();
    try {
      const records = await historyDB.getRecords(userId);
      setHistory(records);
    } catch {
      setHistory([]);
    }
  }, [user?.id]);

  return (
    <HistoryContext.Provider value={{ history, addRecord, refreshHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};

// --- Theme Context ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('virtuallab_theme') as Theme) || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('virtuallab_theme', theme);
  }, [theme]);

  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// --- Lab Context (for hiding calculator, English lab mode, and module ID) ---
interface LabContextType {
  hideCalculator: boolean;
  isEnglishLab: boolean;
  moduleId?: string;
}

const LabContext = createContext<LabContextType>({ hideCalculator: false, isEnglishLab: false });

export function LabProvider({ children, value }: { children: React.ReactNode, value?: any }) {
  // Pass value through if provided, else use default context value
  return <LabContext.Provider value={value || { hideCalculator: false, isEnglishLab: false }}>{children}</LabContext.Provider>;
}
export const useLab = () => useContext(LabContext);

// --- Unified Store Provider ---
import { LanguageProvider } from './i18n';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
