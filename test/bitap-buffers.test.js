import { describe, test, expect } from 'vitest'
import Fuse from '../dist/fuse.mjs'

describe('Bitap search reuses its bit arrays between texts', () => {
  test('a short text searched after a long one is not affected by leftover bits', () => {
    const long = 'x'.repeat(500) + ' wooden chair ' + 'y'.repeat(500)
    const short = 'chiar'
    const fresh = Fuse.match('chair', short, { includeMatches: true })
    Fuse.match('chair', long, { includeMatches: true, findAllMatches: true })
    expect(Fuse.match('chair', short, { includeMatches: true })).toEqual(fresh)
  })

  test('texts longer than the initial buffer are searched', () => {
    const text = 'a'.repeat(5000) + 'needle'
    const result = Fuse.match('needle', text, {
      ignoreLocation: true,
      includeMatches: true
    })
    expect(result.isMatch).toBe(true)
    expect(result.indices).toEqual([[5000, 5005]])
  })

  test('texts past the shared-buffer cap use one-off arrays and still match', () => {
    const short = 'chiar'
    const fresh = Fuse.match('chair', short, { includeMatches: true })
    const text = 'b'.repeat(100000) + 'needle'
    const result = Fuse.match('needle', text, {
      ignoreLocation: true,
      includeMatches: true
    })
    expect(result.indices).toEqual([[100000, 100005]])
    expect(Fuse.match('chair', short, { includeMatches: true })).toEqual(fresh)
  })

  test('characters outside the Basic Latin range match', () => {
    const fuse = new Fuse(['東京タワー', 'Zürich', 'São Paulo', '😀 smile'])
    expect(fuse.search('東京')[0].item).toBe('東京タワー')
    expect(fuse.search('zürich')[0].item).toBe('Zürich')
    expect(fuse.search('😀')[0].item).toBe('😀 smile')
  })
})
