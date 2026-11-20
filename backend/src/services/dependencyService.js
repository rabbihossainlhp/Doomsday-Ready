export function resolvePrerequisiteIds(movies, rawPrereqs = []) {
  if (!Array.isArray(rawPrereqs)) {
    return { error: 'Prerequisites must be an array.' };
  }

  const byId = new Map(movies.map((m) => [String(m.id), String(m.id)]));
  const byTitle = new Map(
    movies.map((m) => [m.title.trim().toLowerCase(), String(m.id)])
  );

  const resolved = [];
  for (const item of rawPrereqs) {
    const str = String(item).trim();
    if (byId.has(str)) {
      resolved.push(byId.get(str));
    } else if (byTitle.has(str.toLowerCase())) {
      resolved.push(byTitle.get(str.toLowerCase()));
    } else {
      return { error: `Unknown prerequisite: "${item}"` };
    }
  }

  return { ids: [...new Set(resolved)] };
}

export function hasCycle(movies, candidateId, newPrereqIds = []) {
  const targetId = String(candidateId);
  if (newPrereqIds.includes(targetId)) return true; // Self-loop

  const adj = new Map();
  for (const m of movies) {
    adj.set(String(m.id), (m.prerequisites || []).map(String));
  }
  adj.set(targetId, newPrereqIds.map(String));

  // 0 = unvisited, 1 = visiting (in current recursion stack), 2 = visited
  const state = new Map();

  function dfs(nodeId) {
    const current = state.get(nodeId) || 0;
    if (current === 1) return true;
    if (current === 2) return false;

    state.set(nodeId, 1);
    for (const nextId of adj.get(nodeId) || []) {
      if (dfs(nextId)) return true;
    }
    state.set(nodeId, 2);
    return false;
  }

  for (const nodeId of adj.keys()) {
    if (dfs(nodeId)) return true;
  }

  return false;
}

export function buildRewatchSequence(movies, targetMovieId) {
  const targetId = String(targetMovieId);
  const byId = new Map(movies.map((m) => [String(m.id), m]));
  if (!byId.has(targetId)) return null;

  // 1. Collect all transitive prerequisites (excluding target movie itself)
  const requiredIds = new Set();
  const stack = [...(byId.get(targetId).prerequisites || []).map(String)];

  while (stack.length > 0) {
    const id = stack.pop();
    if (id === targetId || requiredIds.has(id)) continue;
    const movie = byId.get(id);
    if (!movie) continue;

    requiredIds.add(id);
    for (const prereqId of movie.prerequisites || []) {
      stack.push(String(prereqId));
    }
  }

  // 2. Kahn's algorithm for topological ordering with release year tie-breaker
  const inDegree = new Map();
  const dependents = new Map();

  for (const id of requiredIds) {
    inDegree.set(id, 0);
    dependents.set(id, []);
  }

  for (const id of requiredIds) {
    const validPrereqs = (byId.get(id).prerequisites || [])
      .map(String)
      .filter((p) => requiredIds.has(p));

    inDegree.set(id, validPrereqs.length);
    for (const prereqId of validPrereqs) {
      dependents.get(prereqId).push(id);
    }
  }

  const queue = [...requiredIds]
    .filter((id) => inDegree.get(id) === 0)
    .sort((a, b) => byId.get(a).year - byId.get(b).year);

  const ordered = [];
  while (queue.length > 0) {
    const currentId = queue.shift();
    ordered.push(byId.get(currentId));

    for (const nextId of dependents.get(currentId) || []) {
      inDegree.set(nextId, inDegree.get(nextId) - 1);
      if (inDegree.get(nextId) === 0) {
        queue.push(nextId);
        queue.sort((a, b) => byId.get(a).year - byId.get(b).year);
      }
    }
  }

  return ordered;
}