export function solveBundleQuote(bundles, groupSize) {
  const target = Number(groupSize);
  const validBundles = [
    ...new Set(
      (bundles || [])
        .map(Number)
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= 500)
    ),
  ];

  if (validBundles.length === 0) {
    return {
      exactMatch: false,
      totalBundles: 0,
      breakdown: [],
      equation: 'No valid seat bundles configured for this cinema.',
    };
  }

  const dp = Array(target + 1).fill(Infinity);
  const chosenBundle = Array(target + 1).fill(-1);
  dp[0] = 0;

  for (let seats = 1; seats <= target; seats++) {
    for (const size of validBundles) {
      if (seats >= size && dp[seats - size] + 1 < dp[seats]) {
        dp[seats] = dp[seats - size] + 1;
        chosenBundle[seats] = size;
      }
    }
  }

  if (dp[target] === Infinity) {
    return {
      exactMatch: false,
      totalBundles: 0,
      breakdown: [],
      equation: `Cannot fulfill ${target} seats with bundles (${validBundles.join(', ')}) without wasted seats.`,
    };
  }

  const counts = new Map();
  const terms = [];
  let remaining = target;

  while (remaining > 0) {
    const size = chosenBundle[remaining];
    counts.set(size, (counts.get(size) || 0) + 1);
    terms.push(size);
    remaining -= size;
  }

  const breakdown = [...counts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);

  return {
    exactMatch: true,
    totalBundles: dp[target],
    breakdown,
    equation: `${terms.join(' + ')} = ${target} seats (0 wasted seats)`,
  };
}