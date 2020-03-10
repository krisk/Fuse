# Extended Search

I recently added [extended search](https://github.com/krisk/Fuse/tree/extended-search/src/extended-search) (inspired by [fzf](https://github.com/junegunn/fzf/blob/master/README.md#search-syntax)).

### Why?

This form of advanced searching allows the user to fine-tune their results. It can be used to immediately exclude a large part of their search body before doing the final fuzzy matching. It's reminiscent of Unix-like terminal commands.

### Search syntax

Fuse.js will work exactly as before, and if you give the option `useExtendedSearch:true`, you can use the following syntax in the search query:

| Token       | Match type                 | Description                            |
| ----------- | -------------------------- | -------------------------------------- |
| `jscript`   | fuzzy-match                | Items that match `jscript`             |
| `'python`   | exact-match                | Items that include `python`            |
| `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
| `^java`     | prefix-exact-match         | Items that start with `java`           |
| `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
| `.js$`      | suffix-exact-match         | Items that end with `.js`              |
| `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |

White space acts as an **AND** operator, while a single pipe (`|`) character acts as an **OR** operator.

For example, this search query:

```bash
"^core go$ | js$ | py$ xy$"
```

is interpreted as the following logical expression:

```bash
("^core" AND "go$") OR "js$" OR ("py$" AND "xy$")
```

### Usage

```js
const options = {
  // Enable extended search
  useExtendedSearch: true,
  keys: [
    /*...*/
  ],
}

const fuse = new Fuse(/*...*/)
fuse.search('^jscript .python$ | ruby | !java')
```
