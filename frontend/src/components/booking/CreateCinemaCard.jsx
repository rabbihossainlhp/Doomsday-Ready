import { useState } from 'react';
import { Theater, PlusCircle } from 'lucide-react';

export default function CreateCinemaCard({ onCreate }) {
  const [name, setName] = useState('');
  const [bundlesText, setBundlesText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !bundlesText.trim()) return;

    const bundles = bundlesText
      .split(',')
      .map((n) => Number(n.trim()))
      .sort((a, b) => b - a);

    const created = await onCreate({ name: name.trim(), bundles });
    if (!created) return;
    setName('');
    setBundlesText('');
  };

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#0d1929] p-6">
      <div className="flex items-start justify-between border-b border-slate-800/70 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Create Cinema</h2>
          <p className="font-mono-tech mt-0.5 text-[11px] text-slate-400">
            Register facility capacity blocks
          </p>
        </div>
        <Theater className="h-4 w-4 text-slate-400" />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="font-mono-tech mb-1.5 block text-[11px] text-slate-300">
            Cinema Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AMC Lincoln Square IMAX"
            className="w-full rounded-md border border-slate-800 bg-[#07111e] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#f59e0b] focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono-tech mb-1.5 block text-[11px] text-slate-300">
            Bundle Sizes
          </label>
          <input
            type="text"
            value={bundlesText}
            onChange={(e) => setBundlesText(e.target.value)}
            placeholder="e.g. 6, 9, 20"
            className="font-mono-tech w-full rounded-md border border-slate-800 bg-[#07111e] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#f59e0b] focus:outline-none"
          />
          <p className="font-mono-tech mt-1.5 text-[10px] text-slate-400">
            1 to 10 sizes, each 1-500 seats (comma-separated)
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#f59e0b] py-2.5 text-xs font-semibold text-[#07111e] transition hover:bg-[#fbbf24]"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Save Cinema
        </button>
      </form>
    </div>
  );
}