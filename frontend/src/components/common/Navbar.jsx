const TABS = [
  { id: 'movies', label: 'Movies' },
  { id: 'rewatch', label: 'Rewatch Plan' },
  { id: 'booking', label: 'Booking' },
];

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <header className="border-b border-slate-800/80 bg-[#07111e]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={() => onTabChange('movies')}
          className="text-lg font-semibold tracking-tight text-white"
        >
          Doomsday Ready
        </button>

        <nav className="flex items-center gap-7">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative pb-1.5 transition-colors ${
                  active
                    ? 'text-sm font-medium text-white'
                    : 'font-mono-tech text-xs text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#f59e0b]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}