import norm from '../src/tools/fieldNorm'

describe('fieldNorm', () => {
  test('returns a valid norm for a normal string', () => {
    const n = norm(1, 3)
    expect(n.get('hello world')).toBeCloseTo(0.707, 3)
  })

  test('does not throw on an empty string', () => {
    const n = norm(1, 3)
    // Empty string has no word tokens — should fall back to 1 token, not crash
    expect(() => n.get('')).not.toThrow()
    expect(n.get('')).toBe(1)
  })

  test('caches results for the same token count', () => {
    const n = norm(1, 3)
    const a = n.get('one two three')
    const b = n.get('foo bar baz')
    expect(a).toBe(b)
  })
})
