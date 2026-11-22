import { calcScore, type BitapChunk } from './search'

// Sound reject filter for the bitap kernel. Myers' bit-vector algorithm, run
// right to left with the chunk's alphabet as Peq, yields the exact minimum edit
// count D(p) for an occurrence starting at each text position p. Bitap only
// accepts a hit at level i >= D(p) scoring <= threshold (positions past the
// text end only cost edits), so when no p passes with D(p) the kernel cannot
// match. Returns 0 only in that case; nonzero is always a safe answer. With
// ignoreLocation the nonzero answer is ~(minimum edit count), see below.
export default function canMatch(
  text: string,
  { pattern, alphabet, table, startIndex }: BitapChunk,
  {
    location,
    distance,
    threshold,
    ignoreLocation
  }: {
    location: number
    distance: number
    threshold: number
    ignoreLocation: boolean
  },
  // The caller only tests the result for truth: stop at the first passing
  // start with ignoreLocation too, instead of finding the minimum count.
  any?: boolean
): number {
  const n = text.length
  const m = pattern.length
  const expected = Math.max(0, Math.min(location + startIndex, n))
  // Location window, as in the kernel: a start p can only score <= threshold
  // if |p - expected| <= threshold * distance (+1 absorbs float rounding), and
  // an alignment with fewer than m edits spans fewer than 2m characters, so the
  // text past expected + w + 2m never matters. Scan the whole text when the
  // window is unbounded: ignoreLocation, negative distance (far positions score
  // lower) or a NaN product (0 * Infinity, NaN distance). Clamp to n before
  // | 0 so j stays a small integer even for distance 1e12.
  const w = ignoreLocation || distance < 0 ? n : threshold * distance + 1 || n
  let j = Math.min(n, expected + w + 2 * m) | 0
  const stop = expected > w ? expected - w : 0
  const last = 1 << (m - 1)
  let pv = -1
  let mv = 0
  let score = m
  let best = m
  // A start p with D(p) = d can only pass if d / m <= threshold (the location
  // term adds a nonnegative amount when distance > 0), so compare the running
  // count with kmax, the largest such d, before calling calcScore.
  let kmax = -1
  while (kmax < m && (kmax + 1) / m <= threshold) kmax++
  if (ignoreLocation) {
    if (kmax >= m) kmax = m - 1
  } else if (!(distance > 0)) kmax = m
  // An exact copy inside [stop, j) has D = 0: accept without walking the
  // window down to it. Past 32 positions the native substring search is cheaper
  // than the bit-vector walk.
  if (
    j - stop > 32 &&
    threshold >= 0 &&
    (j < n
      ? text.slice(stop, j).includes(pattern)
      : text.includes(pattern, stop))
  ) {
    return ~0
  }
  while (j-- > stop) {
    const c = text.charCodeAt(j)
    const eq = table[c] ?? alphabet[c] | 0
    const xv = eq | mv
    const xh = (((eq & pv) + pv) ^ pv) | eq
    let ph = mv | ~(xh | pv)
    let mh = pv & xh
    if (ph & last) score++
    else if (mh & last) score--
    ph <<= 1
    mh <<= 1
    pv = mh | ~(xv | ph)
    mv = ph & xv
    if (score <= kmax) {
      if (!ignoreLocation) {
        if (calcScore(score, j, m, expected, distance, false) <= threshold) {
          return 1
        }
      } else if (score < best) {
        best = score
        if (any || !score) break
      }
    }
  }
  // With ignoreLocation every start scores errors / m, so the kernel matches
  // iff the minimum edit count `best` over all starts is below m and scores
  // <= threshold; it then reports exactly best / m. Return ~best (always
  // truthy) so the caller can answer without entering the multi-pass kernel.
  return best < m && best / m <= threshold ? ~best : 0
}
