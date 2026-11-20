import { indexMoviesById, compareMoviesByYear } from '../utils/movieUtils.js';

export function resolvePrerequisiteIds(movies, rawPrereqs = []) {
  if (!Array.isArray(rawPrereqs)) {
    return { error: 'Prerequisites must be an array.' };
  }

  const byId = new Map(movies.map((m) => [String(m.id), String(m.id)]));
  const byTitle = new Map(
    movies.map((m) => [m.title.trim().toLowerCase(), String(m.id)])
  );

  const ids = [];
  for (const item of rawPrereqs) {
    const key = String(item).trim();
    const matchedId = byId.get(key) || byTitle.get(key.toLowerCase());
    if (!matchedId) return { error: `Unknown prerequisite: "${item}"` };
    ids.push(matchedId);
  }

  return { ids: [...new Set(ids)] };
}

export function hasCycle(movies, candidateId, newPrereqIds = []) {
  const targetId = String(candidateId);
  const nextPrereqs = newPrereqIds.map(String);
  if (nextPrereqs.includes(targetId)) return true;

  const adj = new Map(
    movies.map((m) => [String(m.id), (m.prerequisites || []).map(String)])
  );
  adj.set(targetId, nextPrereqs);

  // 0 = unvisited, 1 = visiting (active path), 2 = visited (safe)
  const state = new Map();

  function dfs(nodeId) {
    const status = state.get(nodeId) || 0;
    if (status === 1) return true;
    if (status === 2) return false;

    state.set(nodeId, 1);
    for (const prereqId of adj.get(nodeId) || []) {
      if (dfs(prereqId)) return true;
    }
    state.set(nodeId, 2);
    return false;
  }

  return [...adj.keys()].some((nodeId) => dfs(nodeId));
}

export function buildRewatchSequence(movies, targetMovieId) {
  const targetId = String(targetMovieId);
  const byId = indexMoviesById(movies);
  if (!byId.has(targetId)) return null;

  // 1. Gather all prerequisite movies needed before target (excluding target itself)
  const needed = new Set();
  const stack = [...(byId.get(targetId).prerequisites || []).map(String)];

  while (stack.length > 0) {
    const id = stack.pop();
    if (id === targetId || needed.has(id) || !byId.has(id)) continue;
    needed.add(id);
    for (const prereqId of byId.get(id).prerequisites || []) {
      stack.push(String(prereqId));
    }
  }

  // 2. Visit prerequisites before dependents so watch order is always valid
  const ordered = [];
  const visited = new Set();

  function addWithPrerequisites(id) {
    if (visited.has(id)) return;
    visited.add(id);

    const movie = byId.get(id);
    const prereqs = (movie.prerequisites || [])
      .map(String)
      .filter((pid) => needed.has(pid) && byId.has(pid))
      .sort((a, b) => compareMoviesByYear(byId.get(a), byId.get(b)));

    for (const prereqId of prereqs) {
      addWithPrerequisites(prereqId);
    }
    ordered.push(movie);
  }

  const sortedNeeded = [...needed].sort((a, b) =>
    compareMoviesByYear(byId.get(a), byId.get(b))
  );

  for (const id of sortedNeeded) {
    addWithPrerequisites(id);
  }

  return ordered;
}