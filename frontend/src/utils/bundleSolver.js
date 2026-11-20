export function calculateExactBundles(bundles, targetSeats) {
  const dp = Array(targetSeats + 1).fill(Infinity);
  const choice = Array(targetSeats + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= targetSeats; i++) {
    for (const size of bundles) {
      if (i >= size && dp[i - size] + 1 < dp[i]) {
        dp[i] = dp[i - size] + 1;
        choice[i] = size;
      }
    }
  }

  if (dp[targetSeats] === Infinity) {
    return {
      exactMatch: false,
      totalBundles: 0,
      breakdown: [],
      equation: `Cannot fulfill ${targetSeats} seats with bundles (${bundles.join(', ')}) without wasted seats.`,
    };
  }

  const counts = {};
  const used = [];
  let current = targetSeats;

  while (current > 0) {
    const size = choice[current];
    counts[size] = (counts[size] || 0) + 1;
    used.push(size);
    current -= size;
  }

  const breakdown = Object.entries(counts)
    .map(([size, count]) => ({ size: Number(size), count }))
    .sort((a, b) => b.size - a.size);

  return {
    exactMatch: true,
    totalBundles: dp[targetSeats],
    breakdown,
    equation: `${used.join(' + ')} = ${targetSeats} seats (0 wasted seats)`,
  };
}