# Fuse.js

![Node.js CI](https://github.com/krisk/Fuse/workflows/Node.js%20CI/badge.svg)
[![Version](https://img.shields.io/npm/v/fuse.js.svg)](https://www.npmjs.com/package/fuse.js)
[![Downloads](https://img.shields.io/npm/dm/fuse.js.svg)](https://npmcharts.com/compare/fuse.js?minimal=tru)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Contributors](https://img.shields.io/github/contributors/krisk/fuse.svg)](https://github.com/krisk/Fuse/graphs/contributors)
![License](https://img.shields.io/npm/l/fuse.js.svg)

## Supporting Fuse.js

Through contributions, donations, and sponsorship, you allow Fuse.js to thrive. Also, you will be recognized as a beacon of support to open-source developers.

- [Become a backer or sponsor on **GitHub**.](https://github.com/sponsors/krisk)
- [Become a backer or sponsor on **Patreon**.](https://patreon.com/fusejs)
- [One-time donation via **PayPal**.](https://www.paypal.me/kirorisk)

---

<h3 align="center">Sponsors</h3>
<table>
<tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://www.worksome.com" target="_blank">
          <img width="222px" src="https://raw.githubusercontent.com/krisk/Fuse/7a0d77d85ac90063575613b6a738f418b624357f/docs/.vuepress/public/assets/img/sponsors/worksome.svg">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.bairesdev.com/sponsoring-open-source-projects/" target="_blank">
          <img width="222px" src="https://github.com/krisk/Fuse/blob/gh-pages/assets/img/sponsors/bairesdev.png?raw=true">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://litslink.com/" target="_blank">
          <img width="222px" src="https://github.com/krisk/Fuse/blob/gh-pages/assets/img/sponsors/litslink.svg?raw=true">
        </a>
      </td>
    </tr>
</body>
</table>

---

## Introduction

Fuse.js is a lightweight fuzzy-search library, written in TypeScript, with zero dependencies.

## Token Search

Fuse.js now supports multi-word fuzzy search with relevance ranking. Enable `useTokenSearch` to split queries into individual terms, fuzzy-match each independently, and rank results using IDF weighting — so rare terms matter more than common ones.

```js
const fuse = new Fuse(docs, {
  useTokenSearch: true,
  keys: ['title', 'author', 'description']
})

// Typos + multiple words just work
fuse.search('javascrpt paterns')
// → [{ item: { title: 'JavaScript Patterns', ... } }]
```

- **Typo tolerance per word** — each term is fuzzy-matched independently
- **Relevance ranking** — rare terms are weighted higher using BM25-style IDF
- **Word order doesn't matter** — "patterns javascript" and "javascript patterns" return identical results
- **No query length limit** — long multi-word queries work naturally since each term is searched separately

Available in the full build. See [TOKEN_SEARCH.md](TOKEN_SEARCH.md) for details and performance benchmarks.

## Documentation

To check out a [live demo](https://fusejs.io/demo.html) and docs, visit [fusejs.io](https://fusejs.io).

## Develop

See [DEVELOPERS.md](DEVELOPERS.md) for setup, scripts, and project structure.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on issues and pull requests.
