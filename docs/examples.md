# Examples

## Search String Array

:::: tabs
::: tab List

```js
const list = [
  {
    title: "Old Man's War",
    author: 'John Scalzi',
    tags: ['fiction']
  },
  {
    title: 'The Lock Artist',
    author: 'Steve',
    tags: ['thriller']
  }
]
```

:::
::: tab JS

```javascript
const options = {
  includeScore: true,
  // Search in `author` and in `tags` array
  keys: ['author', 'tags']
}

const fuse = new Fuse(list, options)

const result = fuse.search('tion')
```

:::

::: tab Output

```json
[
  {
    "item": {
      "title": "Old Man's War",
      "author": "John Scalzi",
      "tags": ["fiction"]
    },
    "refIndex": 0,
    "score": 0.03
  }
]
```

:::
::::

<!-- ::: tip
For very large datasets, especially those with large strings, consider pre-generating the index with `Fuse.createIndex`. This will speed up instantiation.
::: -->

## Nested Search

:::: tabs
::: tab List

```js
const list = [
  {
    title: "Old Man's War",
    author: {
      name: 'John Scalzi',
      tags: [
        {
          value: 'American'
        }
      ]
    }
  },
  {
    title: 'The Lock Artist',
    author: {
      name: 'Steve Hamilton',
      tags: [
        {
          value: 'English'
        }
      ]
    }
  }
]
```

:::
::: tab JS

```javascript
const options = {
  includeScore: true,
  keys: ['author.tags.value']
}

const fuse = new Fuse(list, options)

const result = fuse.search('engsh')
```

:::

::: tab Output

```json
[
  {
    "item": {
      "title": "The Lock Artist",
      "author": {
        "name": "Steve Hamilton",
        "tags": [
          {
            "value": "English"
          }
        ]
      }
    },
    "refIndex": 1,
    "score": 0.4
  }
]
```

:::
::::

::: warning IMPORTANT
The path has to eventually point to a string, otherwise you will not get any results.
:::

## Weighted Search

You can allocate a weight to keys to give them higher (or lower) values in search results. The `weight` value has to be greater than `0`.

:::: tabs
::: tab List

```js
const books = [
  {
    title: "Old Man's War fiction",
    author: 'John X',
    tags: ['war']
  },
  {
    title: 'Right Ho Jeeves',
    author: 'P.D. Mans',
    tags: ['fiction', 'war']
  }
]
```

:::
::: tab JS

```javascript
const options = {
  includeScore: true,
  keys: [
    {
      name: 'title',
      weight: 0.3
    },
    {
      name: 'author',
      weight: 0.7
    }
  ]
}

// Create a new instance of Fuse
const fuse = new Fuse(books, options)

// Now search for 'Man'
const result = fuse.search('Man')
```

:::

::: tab Output

```json
[
  {
    "item": {
      "title": "Right Ho Jeeves",
      "author": "P.D. Mans",
      "tags": ["fiction", "war"]
    },
    "refIndex": 1, // index in the original list
    "score": 0.12282280261157906
  },
  {
    "item": {
      "title": "Old Man's War fiction",
      "author": "John X",
      "tags": ["war"]
    },
    "refIndex": 0,
    "score": 0.3807307877431757
  }
]
```

:::
::::

### Default `weight`

When a `weight` isn't provided, it will default to `1`. In the following example, while `author` has been given a weight of `2`, `title` will be assigned a weight of `1`.

```js
const fuse = new Fuse(books, {
  keys: [
    'title', // will be assigned a `weight` of 1
    {
      name: 'author',
      weight: 2
    }
  ]
})
```

Note that internally Fuse will normalize the weights to be within `0` and `1` exclusive.

## Extended Search <Badge text="beta" type="warning"/>

This form of advanced searching allows you to fine-tune results.

White space acts as an **AND** operator, while a single pipe (`|`) character acts as an **OR** operator.

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

:::: tabs
::: tab List

```js
const books = [
  {
    title: "Old Man's War",
    author: 'John Scalzi'
  },
  {
    title: 'The Lock Artist',
    author: 'Steve'
  },
  {
    title: 'Artist for Life',
    author: 'Michelangelo'
  }
]
```

:::
::: tab JS

```javascript
const options = {
  includeScore: true,
  useExtendedSearch: true,
  keys: ['author']
}

const fuse = new Fuse(books, options)

// Search for items that include "Man" and "Old",
// OR end with "Artist"
fuse.search("'Man 'Old | Artist$")
```

:::

::: tab Output

```json
[
  {
    "item": {
      "title": "Old Man's War",
      "author": "John Scalzi"
    },
    "refIndex": 0,
    "score": 2.220446049250313e-16
  },
  {
    "item": {
      "title": "The Lock Artist",
      "author": "Steve"
    },
    "refIndex": 1,
    "score": 2.220446049250313e-16
  }
]
```

:::
::::

<!-- ```js
const result = fuse.search({
  $and: [
    { title: 'old war' }, // Fuzzy "old war"
    { color: "'blue" }, // Exact match for blue
    {
      $or: [
        { title: '!arts' }, // Does not have "arts"
        { title: '^lock' } // Starts with "lock"
      ]
    }
  ]
})
``` -->
