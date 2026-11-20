const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export const movieApi = {
  getAll: () => apiRequest('/movies'),
  create: (movie) =>
    apiRequest('/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
    }),
  update: (id, changes) =>
    apiRequest(`/movies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }),
  getRewatchPlan: (movieId) =>
    apiRequest(`/movies/${movieId}/rewatch-order`),
};

export const bookingApi = {
  getCinemas: () => apiRequest('/cinemas'),
  createCinema: (cinema) =>
    apiRequest('/cinemas', {
      method: 'POST',
      body: JSON.stringify(cinema),
    }),
  getQuote: (cinemaId, groupSize) =>
    apiRequest(
      `/cinemas/${cinemaId}/booking?groupSize=${encodeURIComponent(groupSize)}`
    ),
};