export default function ProgressCard({ sequence }) {
  const watched = sequence.filter((m) => m.watched).length;
  const total = sequence.length;
  const percent = total ? Math.round((watched / total) * 100) : 0;

  const remainingMins = sequence.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0);
  const hours = Math.floor(remainingMins / 60);
  const mins = remainingMins % 60;

  return (
    <div className="mt-5 rounded-xl border border-slate-800/90 bg-[#0d1929] p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono-tech text-[10px] tracking-wider text-slate-400 uppercase">
            Preparation Progress
          </span>
          <p className="mt-1 text-lg font-semibold text-white">
            {watched} of {total} watched
          </p>
        </div>

        <div className="sm:text-right">
          <span className="font-mono-tech text-[10px] tracking-wider text-slate-400 uppercase">
            Remaining Clearance
          </span>
          <p className="mt-1 text-sm font-semibold text-[#f59e0b]">
            {remainingMins} minutes ({hours} hrs {mins} mins) remaining
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#1a293d]">
        <div
          className="h-full rounded-full bg-[#f59e0b] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="font-mono-tech mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span>0%</span>
        <span className="text-slate-200">{percent}% Completed</span>
        <span>100%</span>
      </div>
    </div>
  );
}