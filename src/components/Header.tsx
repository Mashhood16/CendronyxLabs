import OnlineOfflineIndicator from './OnlineOfflineIndicator';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          V
        </div>
        <h1 className="text-xl font-semibold text-gray-800">VirtualLab Dashboard</h1>
      </div>
      <OnlineOfflineIndicator />
    </header>
  );
}
