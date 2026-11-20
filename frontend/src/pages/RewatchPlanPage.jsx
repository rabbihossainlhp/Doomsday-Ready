import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import TargetSelector from '../components/rewatch/TargetSelector';
import ProgressCard from '../components/rewatch/ProgressCard';
import SequenceList from '../components/rewatch/SequenceList';
import { movieApi } from '../services/api';

export default function RewatchPlanPage() {
  const [movies, setMovies] = useState([]);
  const [targetMovie, setTargetMovie] = useState('');
  const [sequence, setSequence] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await movieApi.getAll();
        setMovies(data);
        const target = data.find((movie) =>
          movie.title.toLowerCase().includes('doomsday'),
        );
        setTargetMovie(target?.id || data[0]?.id || '');
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (!targetMovie) return;

    const loadPlan = async () => {
      try {
        const data = await movieApi.getRewatchPlan(targetMovie);
        setSequence(data.sequence);
        setError('');
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    loadPlan();
  }, [targetMovie]);

  const handleToggle = async (movie) => {
    try {
      const updated = await movieApi.update(movie.id, {
        watched: !movie.watched,
      });
      setSequence((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-10">
      <div className="font-mono-tech flex items-center gap-1.5 text-[10px] tracking-widest text-[#f59e0b] uppercase">
        <Settings className="h-3 w-3" />
        <span>Mission Sequencing Protocol</span>
      </div>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white">
        Prerequisite Rewatch Plan
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Calibrated chronological and narrative prerequisites essential prior to target premiere entry.
      </p>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      <TargetSelector
        movies={movies}
        value={targetMovie}
        onChange={setTargetMovie}
      />
      <ProgressCard sequence={sequence} />
      <SequenceList sequence={sequence} onToggle={handleToggle} />
    </div>
  );
}