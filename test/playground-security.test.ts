import { describe, expect, it } from 'vitest'
import { highlightMatch } from '../docs/.vitepress/theme/components/playgroundHighlight'

const payload = '<img src=x onerror="document.body.dataset.xss=1">'

describe('documentation playground result highlighting', () => {
  it('escapes values when match highlighting is disabled', () => {
    const html = highlightMatch({ item: { title: payload } }, 'title', false)

    expect(html).toBe(
      '&lt;img src=x onerror="document.body.dataset.xss=1"&gt;'
    )
  })

  it('escapes an unmatched field when another field produced the result', () => {
    const html = highlightMatch(
      {
        item: { title: 'match', author: { firstName: payload } },
        matches: [{ key: 'title', indices: [[0, 4]] }]
      },
      'author.firstName',
      true
    )

    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })

  it('keeps only generated mark elements in highlighted output', () => {
    const html = highlightMatch(
      {
        item: { title: `match ${payload}` },
        matches: [{ key: 'title', indices: [[0, 4]] }]
      },
      'title',
      true
    )

    expect(html).toBe(
      '<mark>match</mark> &lt;img src=x onerror="document.body.dataset.xss=1"&gt;'
    )
  })
})
