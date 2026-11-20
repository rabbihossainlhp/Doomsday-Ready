import { store } from '../store/memoryStore.js';
import { solveBundleQuote } from '../services/bundleService.js';

export function getCinemas(req, res) {
  res.json(store.cinemas);
}

export function createCinema(req, res) {
  const { name, bundles } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Cinema name is required.' });
  }

  const normalizedName = name.trim().toLowerCase();
  const duplicate = store.cinemas.some(
    (cinema) => cinema.name.trim().toLowerCase() === normalizedName
  );

  if (duplicate) {
    return res.status(409).json({
      code: 'DUPLICATE_NAME',
      message: 'A cinema with this name already exists.',
    });
  }


  const parsedBundles = Array.isArray(bundles)
    ? bundles.map(Number)
    : String(bundles || '')
      .split(',')
      .map((s) => Number(s.trim()));

  if (parsedBundles.some((n) => !Number.isInteger(n) || n < 1 || n > 500)) {
    return res.status(400).json({
      message:
        'Provide 1 to 10 bundle sizes, each as a whole number between 1 and 500.',
    });
  }

  const sortedUnique = [...new Set(parsedBundles)].sort((a, b) => a - b);
  if (sortedUnique.length < 1 || sortedUnique.length > 10) {
    return res.status(400).json({
      message: 'Provide 1 to 10 different bundle sizes.',
    });
  }

  const newCinema = {
    id: `cinema-${Date.now()}-${store.cinemas.length}`,
    name: name.trim(),
    bundles: sortedUnique,
  };

  store.cinemas.push(newCinema);
  res.status(201).json(newCinema);
}


export function getBookingQuote(req, res) {
  const groupSize = Number(req.query.groupSize);

  if (
    !Number.isInteger(groupSize) ||
    groupSize < 1 ||
    groupSize > 10000
  ) {
    return res.status(400).json({
      message: 'Group size must be an integer between 1 and 10,000.',
    });
  }

  const cinema = store.cinemas.find(
    (item) => String(item.id) === String(req.params.id)
  );

  if (!cinema) {
    return res.status(404).json({ message: 'Cinema not found.' });
  }

  return res.json({
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    groupSize,
    ...solveBundleQuote(cinema.bundles, groupSize),
  });
}