import { useState, useEffect } from 'react';
import AddMovieForm from '../components/movies/AddMovieForm';
import MovieTable from '../components/movies/MovieTable';
import { movieApi } from '../services/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await movieApi.getAll();
        setMovies(data);
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    loadMovies();
  }, []);

  const handleAddMovie = async (movieInput) => {
    setError('');
    try {
      const saved = await movieApi.create(movieInput);
      setMovies((prev) => [...prev, saved]);
      return true;
    } catch (apiError) {
      setError(apiError.message);
      return false;
    }
  };

  const handleToggleWatched = async (movie) => {
    const nextStatus = !movie.watched;
    setError('');
    try {
      const updated = await movieApi.update(movie.id, { watched: nextStatus });
      setMovies((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleUpdatePrerequisites = async (movie, ids) => {
    if (ids === null) return;
    const prerequisites = ids
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    setError('');
    try {
      const updated = await movieApi.update(movie.id, { prerequisites });
      setMovies((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-10">
      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      <AddMovieForm movies={movies} onAddMovie={handleAddMovie} />
      <MovieTable
        movies={movies}
        onToggleWatched={handleToggleWatched}
        onUpdatePrerequisites={handleUpdatePrerequisites}
      />
    </div>
  );
}