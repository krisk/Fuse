// Seeded PRNG (mulberry32) so every benchmark run, and both builds in an A/B
// comparison, generate the same corpus. Override with BENCH_SEED=<int>.
let state = Number(process.env.BENCH_SEED ?? 42) >>> 0

export function random() {
  state = (state + 0x6d2b79f5) >>> 0
  let t = state
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
