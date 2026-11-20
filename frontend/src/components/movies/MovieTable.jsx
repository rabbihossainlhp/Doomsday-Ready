import CustomCheckbox from '../common/CustomCheckbox';

export default function MovieTable({
  movies,
  onToggleWatched,
  onUpdatePrerequisites,
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-white">Movies</h3>
          <span className="font-mono-tech rounded bg-[#162336] px-2 py-0.5 text-[11px] text-slate-300">
            {movies.length} movies
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Live Ledger</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#0d1929]">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono-tech border-b border-slate-800/90 bg-[#101e30] text-[10px] tracking-wider text-slate-400 uppercase">
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Year</th>
              <th className="px-5 py-3.5">Runtime</th>
              <th className="px-5 py-3.5">Prerequisites</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-slate-800/25">
                <td className="px-5 py-4">
                  <CustomCheckbox
                    checked={movie.watched}
                    onChange={() => onToggleWatched(movie)}
                  />
                </td>
                <td className="px-5 py-4 font-medium text-slate-100">{movie.title}</td>
                <td className="font-mono-tech px-5 py-4 text-xs text-slate-300">{movie.year}</td>
                <td className="font-mono-tech px-5 py-4 text-xs text-slate-300">
                  {movie.runtime} mins
                </td>
                <td className="px-5 py-4">
                  {movie.prerequisites.length === 0 ? (
                    <span className="font-mono-tech text-xs italic text-slate-500">None</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {movie.prerequisites.map((prereq) => (
                        <span
                          key={prereq}
                          className="font-mono-tech rounded border border-slate-700/70 bg-[#162436] px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdatePrerequisites(
                        movie,
                        window.prompt(
                          'Enter prerequisite IDs or titles, separated by commas:',
                          movie.prerequisiteIds?.join(', ') || '',
                        ),
                      )
                    }
                    className="font-mono-tech text-[11px] text-slate-400 hover:text-white"
                  >
                    Edit Prerequisites
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}