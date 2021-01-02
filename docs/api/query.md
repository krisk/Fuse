# Logical Query Operators

Fuse.js supports logical query operators. These operators are used for filtering the data and getting precise results based on the given conditions. The following table contains the logical query operators:

| Name          | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| [\$and](#and) | Returns all documents that match the conditions of **all** clauses. |
| [\$or](#or)   | Returns all documents that match the conditions of **any** clause.  |

## `$and`

```js
{ $and: [ { <expression_1> }, { <expression_2> } , ... , { <expression_N> } ] }
```

The `$and` operator performs a logical **AND** operation on an array of expressions and selects the entries that satisfy all the expressions. The `$and` operator uses short-circuit evaluation (i.e, if the first expression evaluates to false, Fuse.js will not evaluate the remaining expressions).

::: tip
Fuse.js provides an implicit **AND** operation when specifying a comma separated list of expressions. Using an explicit **AND** with the `$and` operator is necessary when the same field or operator has to be specified in multiple expressions.
:::

#### Example

```js
const result = fuse.search({
  $and: [{ author: 'abc' }, { title: 'xyz' }]
})
```

## `$or`

The `$or` operator performs a logical **OR** operation on an array expressions and selects the entries that satisfy at least one of the expressions.
The `$or` operator uses short-circuit evaluation (i.e, if the first expression evaluates to true, Fuse.js will not evaluate the remaining expressions).

#### Example

```js
const result = fuse.search({
  $or: [{ author: 'abc' }, { author: 'def' }]
})
```

## Logical search with dotted keys

To handle keys that contain dots, you can use the `$path` and `$val` properties when building the query.

#### Example

:::: tabs
::: tab List

```json
[
  {
    "title": "Old Man's War",
    "author": {
      "first.name": "John",
      "last.name": "Scalzi",
      "age": "61"
    }
  }
]
```

:::

::: tab JS

```javascript
const options = {
  useExtendedSearch: true,
  includeScore: true,
  keys: [
    'title',
    ['author', 'first.name'],
    ['author', 'last.name'],
    'author.age'
  ]
}

const query = {
  $and: [
    {
      $path: ['author', 'first.name'],
      $val: 'jon'
    },
    {
      $path: ['author', 'last.name'],
      $val: 'scazi'
    }
  ]
}
```

:::
::::

## Use with Extended Searching

Logical query operations pair quite nicely with [extended searching](/examples.html#extended-search).

```js
const result = fuse.search({
  $and: [
    { title: 'old war' }, // Fuzzy "old war"
    { color: "'blue" }, // Exact match for blue
    {
      $or: [
        { title: '^lock' }, // Starts with "lock"
        { title: '!arts' } // Does not have "arts"
      ]
    }
  ]
})
```

<Donate />
