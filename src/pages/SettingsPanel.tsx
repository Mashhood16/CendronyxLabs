import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../store';
import { progressDB } from '../services/dbService';
import { syncService } from '../services/syncService';
import Layout from '../components/Layout';

export default function SettingsPanel() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('virtuallab_fontsize') || '16');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('virtuallab_reduced_motion') === 'true');
  const [storageInfo, setStorageInfo] = useState<{ used: string; total: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('virtuallab_fontsize', fontSize);
  }, [fontSize]);

  // Reduced motion
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    localStorage.setItem('virtuallab_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  // Calculate storage usage
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        const totalMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageInfo({ used: `${usedMB} MB`, total: `${totalMB} MB` });
      });
    }
  }, []);

  // Check unsynced records
  useEffect(() => {
    progressDB.getUnsyncedRecords().then((records) => setUnsyncedCount(records.length));
  }, []);

  const handleSaveName = async () => {
    if (editName.trim() && user) {
      await updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleClearAllData = async () => {
    logout();
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('virtuallab_history_') || key === 'virtuallab_user_id') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('virtuallab_fontsize');
    localStorage.removeItem('virtuallab_reduced_motion');
    indexedDB.deleteDatabase('VirtualLabDB');
    indexedDB.deleteDatabase('VirtualLabStudents');
    setTimeout(() => window.location.reload(), 200);
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
    setTimeout(() => window.location.reload(), 200);
  };

  const handleSyncNow = async () => {
    setSyncStatus('syncing');
    try {
      await syncService.syncAllUnsynced();
      setSyncStatus('done');
      const records = await progressDB.getUnsyncedRecords();
      setUnsyncedCount(records.length);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Settings</h1>

        {/* Profile & Account */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile & Account
          </h2>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <button onClick={handleSaveName} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-800 font-semibold">{user.name}</span>
                      <button onClick={() => { setEditName(user.name); setIsEditing(true); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class</span>
                    <p className="text-sm font-semibold text-slate-700">Class {user.classLevel}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section</span>
                    <p className="text-sm font-semibold text-slate-700">{user.section}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 mb-3">You are not signed in.</p>
              <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">Log In</button>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Theme</span>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >☀️ Light</button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >🌙 Dark</button>
            </div>
          </div>
        </div>

        {/* Storage & Cache */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            Storage & Cache
          </h2>
          <div className="space-y-4">
            {storageInfo && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Local Storage Used</span>
                  <span className="font-semibold text-slate-800">{storageInfo.used} / {storageInfo.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((parseFloat(storageInfo.used) / parseFloat(storageInfo.total)) * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear Cached Labs
            </button>
            <button
              onClick={handleClearAllData}
              className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Clear All Data & Reset
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Sync Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Pending Records</p>
                <p className="text-xs text-slate-500">{unsyncedCount} experiment{unsyncedCount !== 1 ? 's' : ''} waiting to sync</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${unsyncedCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            </div>
            <button
              onClick={handleSyncNow}
              disabled={syncStatus === 'syncing' || unsyncedCount === 0}
              className={`w-full px-4 py-3 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${syncStatus === 'syncing' ? 'bg-blue-100 text-blue-600 cursor-wait' :
                  syncStatus === 'done' ? 'bg-emerald-100 text-emerald-700' :
                    syncStatus === 'error' ? 'bg-rose-100 text-rose-600' :
                      unsyncedCount === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                        'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'done' ? '✓ Synced!' : syncStatus === 'error' ? '✗ Sync Failed' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Accessibility
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Font Size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize(String(Math.max(12, parseInt(fontSize) - 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A-</button>
                <span className="text-sm font-semibold text-slate-800 w-12 text-center">{fontSize}px</span>
                <button onClick={() => setFontSize(String(Math.min(24, parseInt(fontSize) + 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A+</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Reduce Animations</span>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${reducedMotion ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
