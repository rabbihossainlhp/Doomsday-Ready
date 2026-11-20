import { Calculator, Ticket, ChevronDown } from 'lucide-react';

export default function BookingQuoteCard({
  cinemas,
  selectedCinemaId,
  onSelectCinema,
  groupSize,
  onGroupSizeChange,
  onCalculate,
}) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#0d1929] p-6">
      <div className="flex items-start justify-between border-b border-slate-800/70 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Booking Quote</h2>
          <p className="font-mono-tech mt-0.5 text-[11px] text-slate-400">
            Calculate exact-fit bundle distribution
          </p>
        </div>
        <Calculator className="h-4 w-4 text-slate-400" />
      </div>

      <form onSubmit={onCalculate} className="mt-5 space-y-4">
        <div>
          <label className="font-mono-tech mb-1.5 block text-[11px] text-slate-300">
            Select Cinema
          </label>
          <div className="relative">
            <select
              value={selectedCinemaId}
              onChange={(e) => onSelectCinema(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-800 bg-[#07111e] py-2.5 pr-9 pl-3.5 text-xs text-white focus:border-[#f59e0b] focus:outline-none"
            >
              {cinemas.length === 0 && (
                <option value="">Create a cinema first</option>
              )}
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Bundles: {c.bundles.join(', ')})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="font-mono-tech mb-1.5 block text-[11px] text-slate-300">
            Group Size
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={groupSize}
            onChange={(e) => onGroupSizeChange(e.target.value)}
            className="font-mono-tech w-full rounded-md border border-slate-800 bg-[#07111e] px-3.5 py-2.5 text-xs text-white focus:border-[#f59e0b] focus:outline-none"
          />
          <p className="font-mono-tech mt-1.5 text-[10px] text-slate-400">
            Group range: 1-10,000 attendees
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#f59e0b] py-2.5 text-xs font-semibold text-[#07111e] transition hover:bg-[#fbbf24]"
        >
          <Ticket className="h-3.5 w-3.5" />
          Get Quote
        </button>
      </form>
    </div>
  );
}