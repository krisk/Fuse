---
title: Fuse.js vs Semantic Search
description: When to use client-side fuzzy search vs embeddings and semantic search. A practical comparison for developers building AI-powered applications.
sidebarDepth: 0
---

# Fuse.js vs Semantic Search

<PublishDate date="2026-04-04" />

If you're building an AI-powered application, you've probably considered embeddings and a service like Pinecone or Weaviate to power search. That's the right tool for some problems — but not all of them. Many search features that developers route through an embedding pipeline would be simpler, faster, and cheaper with client-side fuzzy search.

This guide helps you pick the right approach.

## The core difference

**Fuse.js** matches based on _characters_ — it finds strings that look like what the user typed, tolerating typos, transpositions, and partial input.

**Semantic search** matches based on _meaning_ — it converts text into high-dimensional vectors using a language model, then finds items whose vectors are close together in that space.

```
User types: "recpie"

Fuse.js:   "recpie" ≈ "recipe"         (character similarity)
Vector DB: "recpie" → [0.12, -0.84, …] (semantic embedding)
```

These are fundamentally different operations, and they're good at different things. The architecture reflects that — Fuse.js runs entirely in the browser, while semantic search requires multiple network hops:

<ArchitectureDiagram />

## When to use Fuse.js

Use Fuse.js when the user is **typing to find something they already know exists** — a name, a title, a setting, a command. This is the most common search interaction in applications.

**Good fits:**

- Searching a list of contacts, products, files, or settings
- Command palettes and autocomplete
- Filtering a table or dropdown by name
- Any dataset under ~100k items that lives in the browser
- Offline or privacy-sensitive contexts where data shouldn't leave the device

```js
import Fuse from 'fuse.js'

const products = [
  { name: 'MacBook Pro 16"', sku: 'MBP16', category: 'Laptops' },
  { name: 'Magic Keyboard', sku: 'MK', category: 'Accessories' },
  { name: 'Mac Mini M4', sku: 'MM4', category: 'Desktops' },
  // ... hundreds or thousands of items
]

const fuse = new Fuse(products, {
  keys: ['name', 'sku', 'category'],
  threshold: 0.4
})

// Typo-tolerant, instant, runs in the browser
fuse.search('mackbook')
// [{ item: { name: 'MacBook Pro 16"', ... }, ... }]
```

**Key advantages:**

- **Zero latency** — no network round-trip, no API call
- **Zero cost** — no embedding model, no vector database, no per-query fees
- **Zero dependencies** — works offline, no backend required
- **Privacy** — data never leaves the user's device
- **Tiny footprint** — ~5KB gzipped, no SDK or HTTP client needed
- **Simplicity** — `npm install fuse.js`, write 5 lines of code, done

## When to use semantic search

Use semantic search when the user is **describing what they want in natural language** and the answer requires understanding meaning, not matching characters.

**Good fits:**

- "Find articles about climate change" (even if they don't contain those words)
- Semantic document retrieval for RAG pipelines
- Finding similar images, products, or recommendations
- Cross-language search
- Large corpora (millions of documents) where meaning matters more than exact text

```js
// Pseudocode — requires an embedding model + vector database
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'lightweight search library'
})

const results = await vectorDB.query({
  vector: embedding.data[0].embedding,
  topK: 5
})
```

**Key costs:**

- Embedding model API calls (~$0.02 per 1M tokens, but it adds up)
- Vector database hosting ($20–500+/month)
- Indexing pipeline complexity
- Latency from network round-trips (50–500ms per query)
- Cold-start issues in serverless setups

## Side-by-side comparison

| | Fuse.js | Semantic search |
|---|---|---|
| **Matching** | Character similarity (fuzzy) | Semantic similarity (meaning) |
| **Runs on** | Client (browser/Node) | Server (API + database) |
| **Latency** | < 10ms | 50–500ms |
| **Cost** | Free | Embedding API + DB hosting |
| **Setup** | `npm install fuse.js` | Model + DB + indexing pipeline |
| **Handles typos** | Yes (core feature) | Poorly (embeddings are spelling-sensitive) |
| **Understands meaning** | No | Yes |
| **Offline** | Yes | No |
| **Dataset size** | Thousands to ~100k | Millions+ |
| **Dependencies** | Zero | Embedding model, vector DB, backend |

## Common mistake: using embeddings for simple lookup

A pattern I see frequently in AI applications:

```js
// Over-engineered: calling an API to search 200 items
const response = await fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({ query: userInput })
})
// Server: embeds query → queries Pinecone → returns results
// Total time: 300ms, cost: ~$0.001 per query
```

When all you needed was:

```js
// Simple: search 200 items in the browser in <1ms
const fuse = new Fuse(items, { keys: ['name', 'description'] })
const results = fuse.search(userInput)
```

Ask yourself: _Is the user searching by meaning, or searching by name?_ If the answer is "by name" (or by title, SKU, email, filename, etc.), you probably don't need embeddings.

## Using both together

The best AI applications often use both. Fuse.js handles the fast, interactive search layer while semantic search handles the semantic layer.

**Example: a documentation chatbot**

```js
import Fuse from 'fuse.js'

// Layer 1: Instant search-as-you-type for known pages
const fuse = new Fuse(docs, {
  keys: ['title', 'headings', 'slug'],
  threshold: 0.3
})

function handleSearchInput(query) {
  // Fast fuzzy search — instant results as the user types
  return fuse.search(query).slice(0, 5)
}

// Layer 2: Semantic search when the user asks a question
async function handleQuestion(question) {
  const embedding = await embed(question)
  const chunks = await vectorDB.query({ vector: embedding, topK: 10 })
  return await llm.answer(question, chunks)
}
```

**Example: an e-commerce app**

- **Product search bar** — Fuse.js for instant, typo-tolerant filtering
- **"Find similar products"** — Semantic search for recommendations
- **Category browsing with filter** — Fuse.js for filtering within a category
- **Natural language queries** ("warm jacket under $100") — Semantic search

## Decision checklist

Choose **Fuse.js** when:

- [ ] The dataset fits in memory (under ~100k items)
- [ ] Users search by typing names, titles, or known terms
- [ ] You need instant (< 10ms) results
- [ ] You want zero infrastructure cost
- [ ] The app needs to work offline
- [ ] Typo tolerance matters more than semantic understanding

Choose **semantic search** when:

- [ ] Users describe what they want in natural language
- [ ] You need to find semantically similar content
- [ ] The dataset is too large for client-side search
- [ ] You're building a RAG pipeline for an LLM
- [ ] Cross-language search is a requirement

## Getting started

If Fuse.js is the right fit, you can be up and running in under a minute:

```sh
npm install fuse.js
```

```js
import Fuse from 'fuse.js'

const fuse = new Fuse(yourData, {
  keys: ['name', 'description'],
  threshold: 0.4
})

const results = fuse.search('query')
```

See [Getting Started](getting-started.md) for installation options (CDN, ES modules, CommonJS) and [Fuzzy Search](fuzzy-search.md) to understand how scoring and thresholds work.

For large datasets that benefit from parallel search, see [Web Workers](web-workers.md).
