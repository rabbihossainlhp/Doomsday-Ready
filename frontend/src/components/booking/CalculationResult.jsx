import { LayoutGrid } from 'lucide-react';

export default function CalculationResult({ result, activeSeats, onSelectExample }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-800/90 bg-[#0d1929] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/70 pb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-white">Calculation Result</h3>
        </div>

        <div className="font-mono-tech flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => onSelectExample(44)}
            className={`rounded px-2.5 py-1 ${
              Number(activeSeats) === 44 ? 'bg-[#1a293d] text-white' : 'bg-[#0a1422] text-slate-400'
            }`}
          >
            Example: 44 seats
          </button>
          <button
            type="button"
            onClick={() => onSelectExample(7)}
            className={`rounded px-2.5 py-1 ${
              Number(activeSeats) === 7 ? 'bg-[#1a293d] text-white' : 'bg-[#0a1422] text-slate-400'
            }`}
          >
            Example: 7 seats (No Match)
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-800/80 bg-[#07111e] p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono-tech text-[10px] tracking-wider text-slate-400 uppercase">
              Fewest Bundles Needed
            </span>
            <p className="mt-1 text-2xl font-bold text-[#f59e0b]">
              {result.exactMatch ? `${result.totalBundles} bundles total` : 'No exact match'}
            </p>
          </div>

          <div className="font-mono-tech flex items-center gap-1.5 text-[11px]">
            <span
              className={`h-2 w-2 rounded-full ${
                result.exactMatch ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span className={result.exactMatch ? 'text-emerald-400' : 'text-rose-400'}>
              Optimization: {result.exactMatch ? 'Exact Match' : 'Impossible'}
            </span>
          </div>
        </div>
      </div>

      {result.exactMatch && result.breakdown.length > 0 && (
        <div className="mt-5">
          <span className="font-mono-tech text-[10px] tracking-wider text-slate-400 uppercase">
            Count Per Bundle Size
          </span>
          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {result.breakdown.map((item) => (
              <div
                key={item.size}
                className="flex items-center justify-between rounded-md border border-slate-800/80 bg-[#132033] px-4 py-2.5"
              >
                <span className="text-xs text-slate-200">{item.size}-seat bundle</span>
                <span className="font-mono-tech rounded bg-[#07111e] px-2 py-0.5 text-xs font-semibold text-[#f59e0b]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="font-mono-tech mt-4 rounded-md border border-slate-800/80 bg-[#07111e] px-4 py-3 text-xs text-slate-200">
        {result.exactMatch ? (
          <>
            <span className="font-semibold text-[#f59e0b]">Exact match:</span> {result.equation}
          </>
        ) : (
          <>
            <span className="font-semibold text-rose-400">No match:</span> {result.equation}
          </>
        )}
      </div>
    </div>
  );
}