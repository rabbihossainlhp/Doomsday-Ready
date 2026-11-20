export function indexMoviesById(movies) {
  return new Map(movies.map((movie) => [String(movie.id), movie]));
}

export function compareMoviesByYear(a, b) {
  const yearA = Number.isFinite(a?.year) ? a.year : Infinity;
  const yearB = Number.isFinite(b?.year) ? b.year : Infinity;

  if (yearA !== yearB) return yearA - yearB;
  return String(a?.id ?? '').localeCompare(String(b?.id ?? ''));
}