---
title: Fuse Cloud
description: Hosted fuzzy search powered by Fuse.js. Upload JSON, get a search API. Same search you know, without managing infrastructure.
---

# Fuse Cloud <Badge type="warning" text="Coming Soon" />

**Upload JSON. Get a search API. Same fuzzy search you know.**

Fuse Cloud turns your Fuse.js setup into a hosted search service. No infrastructure, no new mental model — if you know Fuse.js, you already know how this works.

---

## The Problem

Fuse.js works great until your dataset outgrows the browser — too many records, too slow on mobile, or multiple users need to search the same data. At that point, the options are Algolia, Elasticsearch, or Meilisearch — all powerful, all complex, all a completely different system to learn.

**Fuse Cloud fills the gap:** scale your search without switching your mental model.

---

## How It Works

1. **Upload your data** — Push a JSON array, the same format you already use with Fuse.js.
2. **Get a search API** — Fuse Cloud indexes your data and gives you a public key.
3. **Search from the client** — Call the API directly from your frontend. No backend required.

---

## What It Looks Like

```js
import { FuseCloud } from "@fusejs/cloud"

const client = new FuseCloud({
  publicKey: "pk_abc123",
  index: "products"
})

const { results } = await client.search("iphone")
// → [{ id: "1", score: 0.02, item: { title: "iPhone 16 Pro", ... } }]
```

Same results format as Fuse.js. Same scoring. Same fuzzy matching.

---

## Why Fuse Cloud

| | Fuse.js (local) | Fuse Cloud | Algolia / Meilisearch |
|---|---|---|---|
| Setup time | Minutes | Minutes | Hours |
| Infrastructure | None | Managed | Self-hosted or vendor |
| Mental model | Fuse.js | Fuse.js | New system |
| Best for | Small datasets | Medium–large datasets | Large-scale search |
| Pricing | Free | Free tier + paid plans | Varies |

---

## Pricing

**Free tier included.** Paid plans for higher usage. Pricing details coming soon.

---

## Who This Is For

- **Documentation sites** — power your search bar without loading the full dataset client-side
- **Product catalogs** — fuzzy search across thousands of products from a static site or SPA
- **Internal tools** — search across company data without building a search backend
- **Content libraries** — articles, recipes, courses — anything you'd search with Fuse.js today

## Who This Is Not For

- **Enterprise search** — if you need faceting, analytics, A/B testing, and dedicated support, look at Algolia or Typesense
- **Real-time data** — if your data changes every second, you need a different architecture
- **Sensitive/regulated data** — if compliance requirements (HIPAA, SOC2) are a blocker, this isn't ready for that yet

---

## Interested?

Fuse Cloud is in early development. Get early access and help shape what gets built.

<div class="cloud-signup">
  <a href="https://tally.so/r/Zjz8qo" class="cloud-btn" target="_blank" rel="noopener">Get Early Access</a>
  <p class="cloud-note">Or share your use case in the <a href="https://github.com/krisk/Fuse/discussions">GitHub Discussion</a>.</p>
</div>

<style>
.cloud-signup {
  margin: 2rem 0;
  text-align: center;
}

.cloud-btn {
  display: inline-block;
  background: #9066b8;
  color: #fff !important;
  font-weight: 700;
  text-decoration: none !important;
  border-radius: 20px;
  padding: 14px 40px;
  font-size: 1.15rem;
  transition: background-color 250ms;
}

.cloud-btn:hover {
  background-color: #a684c6;
}

.cloud-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

table {
  width: 100%;
}
</style>
