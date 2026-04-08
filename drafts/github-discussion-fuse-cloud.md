**Title:** Fuse Cloud — would you use hosted Fuse.js search?

---

I'm exploring a hosted version of Fuse.js and want to gauge interest before building anything.

**The idea:** upload a JSON dataset, get a search API. Same fuzzy search, same scoring, same results format — but hosted, so you don't need to load the data client-side.

```js
import { FuseCloud } from "@fusejs/cloud"

const client = new FuseCloud({
  publicKey: "pk_abc123",
  index: "products"
})

const { results } = await client.search("iphone")
```

**Why?** Fuse.js works great for small-to-medium datasets in the browser. But when your data grows — 10K+ records, multiple users searching the same data, mobile performance concerns — the only options today are Algolia, Elasticsearch, or Meilisearch. All powerful, but all a completely different mental model.

Fuse Cloud would fill the gap: scale your search without switching tools.

**Thinking about pricing like:**
- Free: 10K queries/month, 1 index
- $19/mo: 1M queries, 5 indexes
- $49/mo: 5M queries, 20 indexes

**Before I build anything, I'd love to know:**
1. Would this be useful to you?
2. What's your use case? (docs search, product catalog, internal tool, etc.)
3. What would make you pay for this vs rolling your own?
4. What's missing from this idea?

Landing page with more details: https://www.fusejs.io/cloud.html
