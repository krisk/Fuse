---
title: Using Fuse.js with React
description: Build a search-as-you-type React component with Fuse.js. Covers debouncing, match highlighting, and handling large lists with practical copy-paste examples.
sidebarDepth: 0
head:
  - - link
    - rel: canonical
      href: https://www.fusejs.io/articles/using-fuse-with-react.html
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Using Fuse.js with React",
        "description": "Build a search-as-you-type React component with Fuse.js. Covers debouncing, match highlighting, and handling large lists with practical copy-paste examples.",
        "url": "https://www.fusejs.io/articles/using-fuse-with-react.html",
        "datePublished": "2026-04-15",
        "author": {
          "@type": "Person",
          "name": "Kiro Risk"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fuse.js",
          "url": "https://www.fusejs.io"
        }
      }
---

# Using Fuse.js with React

<PublishDate date="2026-04-15" />

Fuse.js pairs naturally with React. Both are client-side and dependency-free in philosophy. This guide walks through building a practical search-as-you-type component, then layers on debouncing, match highlighting, and techniques for handling large datasets.

## Setup

Install both packages:

```bash
npm install fuse.js
```

All examples below assume React 18+ with hooks.

## Basic Search Component

Start with the simplest useful thing: a text input that filters a list using Fuse.js.

```jsx
import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'

const books = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { title: 'Brave New World', author: 'Aldous Huxley' },
]

function BookSearch() {
  const [query, setQuery] = useState('')

  // Create the Fuse instance once — the index is built at construction time
  const fuse = useMemo(() => {
    return new Fuse(books, {
      keys: ['title', 'author'], // fields to search
      threshold: 0.4,            // 0 = exact, 1 = match anything
    })
  }, [])

  const results = query ? fuse.search(query) : []

  // Show search results when there's a query, full list otherwise
  const displayItems = results.length > 0
    ? results.map(({ item }) => item)
    : books

  return (
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {displayItems.map((book) => (
          <li key={book.title}>
            {book.title} — {book.author}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Key points:

- **`useMemo`** ensures the Fuse instance is created once, not on every render. The index is built at construction time, so recreating it is wasteful.
- **Fallback to full list** when the query is empty. This is a UI choice -- when there's no query, show everything instead of search results.
- **`threshold: 0.4`** is stricter than the default `0.6`, which tends to feel too loose for search-as-you-type UIs.

## Debouncing the Search

For small lists, searching on every keystroke is fine. For larger lists or if you're doing additional work per search (like analytics), debounce the input:

```jsx
import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'

// Delays updating the value until the user stops typing
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // reset timer on each keystroke
  }, [value, delay])

  return debounced
}

function BookSearch({ books }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200) // wait 200ms after last keystroke

  // Rebuild the Fuse instance when the book list changes
  const fuse = useMemo(() => {
    return new Fuse(books, {
      keys: ['title', 'author'],
      threshold: 0.4,
    })
  }, [books])

  // Search only fires after debounce settles
  const results = debouncedQuery ? fuse.search(debouncedQuery) : []

  const displayItems = results.length > 0
    ? results.map(({ item }) => item)
    : books

  return (
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {displayItems.map((book) => (
          <li key={book.title}>
            {book.title} — {book.author}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

200ms is a good default. Users won't notice the delay, but it eliminates redundant searches during fast typing.

## Highlighting Matches

Fuse.js can return the exact character ranges that matched. Enable `includeMatches` and use the indices to wrap matched characters in a `<mark>` tag:

```jsx
import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'

// Splits text into plain strings and <mark> elements based on match regions
function highlightMatches(text, regions = []) {
  if (!regions.length) return text

  const chunks = []
  let lastIndex = 0

  // Fuse.js returns sorted, non-overlapping [start, end] pairs
  for (const [start, end] of regions) {
    // Add any unmatched text before this region
    if (start > lastIndex) {
      chunks.push(text.slice(lastIndex, start))
    }
    // Wrap the matched range in a <mark> tag
    chunks.push(<mark key={start}>{text.slice(start, end + 1)}</mark>)
    lastIndex = end + 1
  }

  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    chunks.push(text.slice(lastIndex))
  }

  return chunks
}

function BookSearch({ books }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => {
    return new Fuse(books, {
      keys: ['title', 'author'],
      includeMatches: true, // return character-level match positions
      threshold: 0.4,
    })
  }, [books])

  const results = query ? fuse.search(query) : []

  return (
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map(({ item, matches }) => {
          // Find match data for each field we want to highlight
          const titleMatch = matches?.find((m) => m.key === 'title')
          const authorMatch = matches?.find((m) => m.key === 'author')

          return (
            <li key={item.title}>
              {highlightMatches(item.title, titleMatch?.indices)} —{' '}
              {highlightMatches(item.author, authorMatch?.indices)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

The `matches` array contains one entry per matched key, each with an `indices` array of `[start, end]` pairs. The end index is **inclusive**, so use `end + 1` when slicing.

Style the highlights with CSS:

```css
mark {
  background-color: #fef08a;
  padding: 0;
}
```

## Handling Large Lists

Fuse.js indexes data in memory, so the search itself is fast. The bottleneck with large lists is usually React rendering thousands of DOM nodes. Two strategies help:

### 1. Limit Displayed Results

The simplest approach. Fuse.js results are already sorted by relevance, so taking the top N gives users the best matches:

```jsx
const results = query ? fuse.search(query, { limit: 20 }) : []
```

Fuse.js still scans all indexed records, but `limit` reduces the number of results returned and the sorting overhead. For the biggest gains, combine it with the strategies below.

### 2. Memoize the Fuse Index

If your data changes frequently and the list is large, you can pre-build and cache the index:

```jsx
import { useMemo } from 'react'
import Fuse from 'fuse.js'

function useSearch(items, keys, query) {
  const fuse = useMemo(() => {
    // Pre-build the index so Fuse doesn't rebuild it on every new instance
    const index = Fuse.createIndex(keys, items)
    // pass pre-built index
    return new Fuse(items, { keys, threshold: 0.4 }, index)
  }, [items, keys])

  return query ? fuse.search(query) : []
}
```

`Fuse.createIndex()` builds the index separately, which is useful if you need to serialize it or reuse it across multiple Fuse instances.

### 3. Virtualized Rendering

For datasets where you want to display many results, pair Fuse.js with a virtualization library like [`react-window`](https://www.npmjs.com/package/react-window):

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window'

function SearchResults({ results }) {
  // Only the visible rows are rendered — the rest are virtualized
  const Row = ({ index, style }) => (
    <div style={style}>
      {results[index].item.title}
    </div>
  )

  return (
    <FixedSizeList
      height={400}
      itemCount={results.length}
      itemSize={40}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

This renders only the visible rows, keeping DOM size constant regardless of result count.

## Putting It All Together

Here's a complete search component combining everything above:

```jsx
import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function highlightMatches(text, regions = []) {
  if (!regions.length) return text
  const chunks = []
  let lastIndex = 0
  for (const [start, end] of regions) {
    if (start > lastIndex) chunks.push(text.slice(lastIndex, start))
    chunks.push(<mark key={start}>{text.slice(start, end + 1)}</mark>)
    lastIndex = end + 1
  }
  if (lastIndex < text.length) chunks.push(text.slice(lastIndex))
  return chunks
}

function FuzzySearch({ items, keys, itemKey, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  // Recreate Fuse only when items or keys change
  const fuse = useMemo(
    () => new Fuse(items, { keys, includeMatches: true, threshold: 0.4 }),
    [items, keys]
  )

  // Cap results to keep rendering fast
  const results = debouncedQuery
    ? fuse.search(debouncedQuery, { limit: 50 })
    : []

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.length > 0
          ? results.map(({ item, matches }) => (
              <li key={item[itemKey]}>
                {keys.map((key) => {
                  const match = matches?.find((m) => m.key === key)
                  return (
                    <span key={key}>
                      {highlightMatches(item[key], match?.indices)}{' '}
                    </span>
                  )
                })}
              </li>
            ))
          : items.slice(0, 50).map((item) => (
              <li key={item[itemKey]}>
                {keys.map((key) => (
                  <span key={key}>{item[key]} </span>
                ))}
              </li>
            ))}
      </ul>
    </div>
  )
}
```

Usage:

```jsx
<FuzzySearch
  items={products}
  keys={['name', 'description']}
  itemKey="id"
  placeholder="Search products..."
/>
```

## Tips

- **Set `threshold` lower for search-as-you-type.** The default `0.6` returns too many loose matches when users are typing partial words. Start with `0.3`-`0.4` and adjust.
- **Use `includeScore`** during development to see how tight your matches are. Remove it in production if you don't need it.
- **Don't recreate the Fuse instance on every render.** Always wrap it in `useMemo` with appropriate dependencies.
- **For nested keys**, use dot notation: `keys: ['address.city']`.
- **Weight your keys** to prioritize certain fields: `keys: [{ name: 'title', weight: 2 }, { name: 'description', weight: 1 }]`.

See [Getting Started](../getting-started.md) for installation options (CDN, ES modules, CommonJS) and [Fuzzy Search](../fuzzy-search.md) to understand how scoring and thresholds work.
