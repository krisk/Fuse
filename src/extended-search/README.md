# Extended Searching

_Note: this is nspired by [fzf](https://github.com/junegunn/fzf/blob/master/README.md#search-syntax)._

Search with multiple terms delimited by spaces.

### Search syntax

| Token       | Match type                 | Description                            |
| ----------- | -------------------------- | -------------------------------------- |
| `jscript`   | fuzzy-match                | Items that match `jscript`             |
| `'python`   | exact-match                | Items that include `python`            |
| `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
| `^java`     | prefix-exact-match         | Items that start with `java`           |
| `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
| `.js$`      | suffix-exact-match         | Items that end with `.js`              |
| `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |

A white space acts as an **AND** operator, while a single pipe (`|`) character acts as an **OR** operator. For example, this search query:

```bash
"^core go$ | rb$ | py$ xy$"
```

is interpreted as the following logical expression:

```bash
("^core" AND "go%") OR "rb$" OR ("py$" AND "xy$")
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
