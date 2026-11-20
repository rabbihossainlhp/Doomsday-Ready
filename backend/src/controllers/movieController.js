import { store } from '../store/memoryStore.js';
import {
  resolvePrerequisiteIds,
  hasCycle,
  buildRewatchSequence,
} from '../services/dependencyService.js';

function formatMovie(movie, allMovies) {
  const titleById = new Map(allMovies.map((item) => [String(item.id), item.title]));
  const prerequisiteIds = movie.prerequisites || [];

  return {
    ...movie,
    prerequisiteIds,
    prerequisites: prerequisiteIds
      .map((id) => titleById.get(String(id)))
      .filter(Boolean),
  };
}

export function updateMovie(req, res) {
  const movie = store.movies.find(
    (item) => String(item.id) === String(req.params.id)
  );

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found.' });
  }

  const { title, year, runtime, watched, prerequisites } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Movie title is required.' });
    }

    const duplicate = store.movies.some(
      (item) =>
        item.id !== movie.id &&
        item.title.trim().toLowerCase() === title.trim().toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        code: 'DUPLICATE_TITLE',
        message: 'A movie with this title already exists.',
      });
    }
  }

  if (
    runtime !== undefined &&
    (!Number.isInteger(Number(runtime)) ||
      Number(runtime) < 1 ||
      Number(runtime) > 300)
  ) {
    return res.status(400).json({
      message: 'Runtime must be an integer between 1 and 300 minutes.',
    });
  }

  if (
    year !== undefined &&
    (!Number.isInteger(Number(year)) ||
      Number(year) < 1888 ||
      Number(year) > 2100)
  ) {
    return res.status(400).json({ message: 'Valid release year is required.' });
  }

  if (watched !== undefined && typeof watched !== 'boolean') {
    return res.status(400).json({
      message: 'Watched must be true or false.',
    });
  }

  if (prerequisites !== undefined) {
    const resolved = resolvePrerequisiteIds(store.movies, prerequisites);

    if (resolved.error) {
      return res.status(400).json({ message: resolved.error });
    }

    if (hasCycle(store.movies, movie.id, resolved.ids)) {
      return res.status(409).json({
        code: 'CIRCULAR_DEPENDENCY',
        message: 'This update would create a circular dependency.',
      });
    }

    movie.prerequisites = resolved.ids;
  }

  if (title !== undefined) movie.title = title.trim();
  if (year !== undefined) movie.year = Number(year);
  if (runtime !== undefined) movie.runtime = Number(runtime);
  if (watched !== undefined) movie.watched = watched;

  return res.json(formatMovie(movie, store.movies));
}




export function getMovies(req, res) {
  const formatted = store.movies.map((m) => formatMovie(m, store.movies));
  res.json(formatted);
}

export function createMovie(req, res) {
  const { title, year, runtime, releaseDate, prerequisites = [] } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Movie title is required.' });
  }
  const normalizedTitle = title.trim().toLowerCase();
  const titleExists = store.movies.some(
    (movie) => movie.title.trim().toLowerCase() === normalizedTitle
  );

  if (titleExists) {
    return res.status(409).json({
      code: 'DUPLICATE_TITLE',
      message: 'A movie with this title already exists.',
    });
  }


  if (
  Array.isArray(prerequisites) &&
  prerequisites.some(
    (item) => String(item).trim().toLowerCase() === normalizedTitle
  )

  
) {
  return res.status(409).json({
    code: 'CIRCULAR_DEPENDENCY',
    message: 'A movie cannot depend on itself.',
  });
}


  const numericYear = Number(year);
  const numericRuntime = Number(runtime);

  if (
    !Number.isInteger(numericRuntime) ||
    numericRuntime < 1 ||
    numericRuntime > 300
  ) {
    return res.status(400).json({
      message: 'Runtime must be an integer between 1 and 300 minutes.',
    });
  }


  if (!Number.isInteger(numericYear) || numericYear < 1888 || numericYear > 2100) {
    return res.status(400).json({ message: 'Valid release year is required.' });
  }

  const { ids, error } = resolvePrerequisiteIds(store.movies, prerequisites);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const newId = `${Date.now()}-${store.movies.length}`;
  if (hasCycle(store.movies, newId, ids)) {
    return res.status(409).json({
      code: 'CIRCULAR_DEPENDENCY',
      message: 'Circular prerequisite detected. Dependency tree must be a DAG.',
    });
  }

  const newMovie = {
    id: newId,
    title: title.trim(),
    year: numericYear,
    runtime: numericRuntime,
    releaseDate: releaseDate?.trim() || `${numericYear}`,
    prerequisites: ids,
    watched: false,
  };

  store.movies.push(newMovie);
  res.status(201).json(formatMovie(newMovie, store.movies));
}

export function getRewatchPlan(req, res) {
  const { id } = req.params;

  // Support matching either movie ID or slug like "doomsday" / "secret-wars"
  let target = store.movies.find((m) => String(m.id) === String(id));
  if (!target && id.toLowerCase() === 'doomsday') {
    target = store.movies.find((m) =>
      m.title.toLowerCase().includes('doomsday')
    );
  }
  if (!target && id.toLowerCase() === 'secret-wars') {
    target = store.movies.find((m) =>
      m.title.toLowerCase().includes('secret wars')
    );
  }

  if (!target) {
    return res.status(404).json({ message: 'Target movie not found.' });
  }

  const sequence = buildRewatchSequence(store.movies, target.id)
    .map((movie) => formatMovie(movie, store.movies));
  const watchedCount = sequence.filter((m) => m.watched).length;
  const remainingMinutes = sequence
    .filter((m) => !m.watched)
    .reduce((sum, m) => sum + m.runtime, 0);

  return res.json({
    targetMovie: {
      id: target.id,
      title: target.title,
      year: target.year,
    },
    sequence,
    totalCount: sequence.length,
    watchedCount,
    remainingMinutes,
  });
}