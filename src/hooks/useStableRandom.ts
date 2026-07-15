import { useMemo } from 'react';

/**
 * Seeded PRNG (mulberry32) — deterministic, fast, good distribution.
 * Returns a function that produces random numbers in [0, 1) from a seed.
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns an array of `count` stable pseudo-random numbers in [0, 1).
 * Values are computed once via useMemo and won't change on re-render.
 *
 * @param count - How many random values to generate
 * @param seed  - Deterministic seed (default 42). Derive from props/state for variation.
 *
 * @example
 *   const r = useStableRandom(10, index);
 *   const top = `${r[0] * 85 + 5}%`;
 *   const left = `${r[1] * 85 + 5}%`;
 */
export function useStableRandom(count: number, seed: number = 42): number[] {
  return useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, () => rng());
  }, [count, seed]);
}
