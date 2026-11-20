import CustomCheckbox from '../common/CustomCheckbox';

export default function SequenceList({ sequence, onToggle }) {
  return (
    <div className="mt-8">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
          Topological Prerequisite Sequence
        </h2>
        <span className="font-mono-tech text-[11px] text-slate-400">
          {sequence.length} Chrono-Narrative Milestones
        </span>
      </div>

      <div className="space-y-2.5">
        {sequence.map((movie, idx) => (
          <div
            key={movie.id}
            className="flex items-center justify-between rounded-lg border border-slate-800/90 bg-[#0d1929] px-5 py-3.5 hover:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono-tech text-xs text-slate-500">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-sm font-medium text-white">{movie.title}</h3>
                <p className="font-mono-tech mt-0.5 text-[11px] text-slate-400">
                  {movie.runtime} mins • {movie.releaseDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-mono-tech rounded px-2 py-0.5 text-[10px] ${
                  movie.watched
                    ? 'bg-[#102a2e] text-emerald-400'
                    : 'bg-[#152234] text-slate-400'
                }`}
              >
                {movie.watched ? 'Watched' : 'Unwatched'}
              </span>
              <CustomCheckbox checked={movie.watched} onChange={() => onToggle(movie)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}