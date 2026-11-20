import { ChevronDown, Info } from 'lucide-react';

export default function TargetSelector({ movies, value, onChange }) {
  return (
    <div className="mt-7 rounded-xl border border-slate-800/90 bg-[#0d1929] p-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-200">Target Movie</label>
        <span className="font-mono-tech rounded border border-slate-700/80 bg-[#142337] px-2 py-0.5 text-[10px] text-slate-300">
          PHASE 6 CLIMAX
        </span>
      </div>

      <div className="relative mt-2.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-700/80 bg-[#08121f] px-4 py-3 text-sm font-medium text-white focus:border-[#f59e0b] focus:outline-none"
        >
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.year})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="font-mono-tech mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="h-3.5 w-3.5 text-[#f59e0b]" />
        <span>Note: The target movie itself is excluded from prerequisite rewatch calculations.</span>
      </div>
    </div>
  );
}