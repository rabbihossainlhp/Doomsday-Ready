import assert from 'node:assert/strict';
import test from 'node:test';
import { store } from '../store/memoryStore.js';
import {
  buildRewatchSequence,
  hasCycle,
} from './dependencyService.js';
import { solveBundleQuote } from './bundleService.js';

test('rewatch plans include prerequisites once and in dependency order', () => {
  const sequence = buildRewatchSequence(store.movies, '8');
  const titles = sequence.map((movie) => movie.title);

  assert.equal(sequence.length, 7);
  assert.equal(new Set(sequence.map((movie) => movie.id)).size, 7);
  assert.ok(titles.indexOf('The Avengers') > titles.indexOf('Iron Man'));
  assert.ok(
    titles.indexOf('The Avengers') >
      titles.indexOf('Captain America: The First Avenger'),
  );
  assert.ok(!titles.includes('Avengers: Doomsday'));
});

test('rewatch ordering remains valid when release years are missing', () => {
  const movies = [
    { id: 'target', prerequisites: ['z', 'b'] },
    { id: 'z', year: null, prerequisites: [] },
    { id: 'b', year: undefined, prerequisites: ['a'] },
    { id: 'a', year: null, prerequisites: [] },
  ];

  assert.deepEqual(
    buildRewatchSequence(movies, 'target').map((movie) => movie.id),
    ['a', 'b', 'z'],
  );
});

test('cycle detection rejects direct and indirect dependencies', () => {
  assert.equal(hasCycle(store.movies, '1', ['1']), true);
  assert.equal(hasCycle(store.movies, '1', ['8']), true);
});

test('booking quote finds the fewest exact bundles or reports impossible', () => {
  assert.deepEqual(solveBundleQuote([1, 3, 4], 6).breakdown, [
    { size: 3, count: 2 },
  ]);
  assert.equal(solveBundleQuote([2, 5], 11).totalBundles, 4);
  assert.equal(solveBundleQuote([6, 9, 20], 44).totalBundles, 4);
  assert.equal(solveBundleQuote([4, 6], 7).exactMatch, false);
});
