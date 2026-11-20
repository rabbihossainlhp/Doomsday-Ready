import { useState } from 'react';
import { Film } from 'lucide-react';
import CustomCheckbox from '../common/CustomCheckbox';

export default function AddMovieForm({ movies, onAddMovie }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [runtime, setRuntime] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);

  const togglePrereq = (name) => {
    setPrerequisites((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !year || !runtime) return;

    const created = await onAddMovie({
      title: title.trim(),
      year: Number(year),
      runtime: Number(runtime),
      prerequisites,
    });

    if (!created) return;
    setTitle('');
    setYear('');
    setRuntime('');
    setPrerequisites([]);
  };

  return (
    <section className="rounded-xl border border-slate-800/90 bg-[#0d1929] p-7">
      <h2 className="text-lg font-semibold text-white">Add Movie</h2>
      <p className="mt-1 text-xs text-slate-400">
        Register a new release into the canonical timeline and assign upstream required viewings.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label className="font-mono-tech mb-2 block text-[11px] text-slate-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Captain America: Brave New World"
              className="w-full rounded-md border border-slate-800 bg-[#152234] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="font-mono-tech mb-2 block text-[11px] text-slate-300">
              Release Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="font-mono-tech w-full rounded-md border border-slate-800 bg-[#152234] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="font-mono-tech mb-2 block text-[11px] text-slate-300">
              Runtime (minutes)
            </label>
            <input
              type="number"
              value={runtime}
              onChange={(e) => setRuntime(e.target.value)}
              placeholder="142"
              className="font-mono-tech w-full rounded-md border border-slate-800 bg-[#152234] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="font-mono-tech mb-2 block text-[11px] text-slate-300">
            Prerequisites (optional)
          </label>
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-800/80 bg-[#0b1523] p-4 sm:grid-cols-3">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-200 select-none"
              >
                <CustomCheckbox
                  checked={prerequisites.includes(movie.id)}
                  onChange={() => togglePrereq(movie.id)}
                />
                <span>{movie.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-800/70 pt-5 sm:flex-row sm:items-center">
          <span className="font-mono-tech text-[11px] text-slate-400">
            All inputs validate dependency trees automatically.
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-[#f59e0b] px-5 py-2.5 text-xs font-semibold text-[#07111e] transition hover:bg-[#fbbf24]"
          >
            <Film className="h-3.5 w-3.5" />
            Save Movie
          </button>
        </div>
      </form>
    </section>
  );
}