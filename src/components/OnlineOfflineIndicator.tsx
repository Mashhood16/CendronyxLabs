import { useSyncStatus } from '../hooks/useSyncStatus';

export default function OnlineOfflineIndicator() {
  const { isOnline, pendingCount, isSyncing, triggerSync } = useSyncStatus();

  return (
    <div className="flex flex-col items-end gap-1">
      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${isOnline ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200 shadow-sm shadow-red-100'}`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
        {isOnline ? 'Online' : 'Offline'}
      </div>
      
      {pendingCount > 0 && (
        <div className="text-xs font-medium text-amber-600 flex items-center gap-1.5 px-1">
          {isSyncing ? (
            <svg className="animate-spin w-3 h-3 text-amber-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
          <span>
            {pendingCount} item{pendingCount !== 1 ? 's' : ''} pending
          </span>
          {isOnline && !isSyncing && (
             <button 
                onClick={triggerSync} 
                className="ml-1 text-amber-700 underline hover:text-amber-900 cursor-pointer focus:outline-none transition-colors"
             >
                Sync now
             </button>
          )}
        </div>
      )}
    </div>
  );
}
