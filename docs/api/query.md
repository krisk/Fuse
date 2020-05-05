# Logical Query Operators

## `$and`

```js
{ $and: [ { <expression_1> }, { <expression_2> } , ... , { <expression_N> } ] }
```

The `$and` operator performs a logical **AND** operation on an array of expressions and selects the entries that satisfy all the expressions. The `$and` operator uses short-circuit evaluation (i.e, if the first expression evaluates to false, Fuse.js will not evaluate the remaining expressions).

::: tip
Fuse.js provides an implicit **AND** operation when specifying a comma separated list of expressions. Using an explicit **AND** with the `$and` operator is necessary when the same field or operator has to be specified in multiple expressions.
:::

#### Examples

```js
const result = fuse.search({
  $and: [{ author: 'abc' }, { title: 'xyz' }]
})
```

## `$or`

The `$or` operator performs a logical **OR** operation on an array expressions and selects the entries that satisfy at least one of the expressions.
The `$or` operator uses short-circuit evaluation (i.e, if the first expression evaluates to true, Fuse.js will not evaluate the remaining expressions).

#### Examples

```js
const result = fuse.search({
  $or: [{ author: 'abc' }, { author: 'def' }]
})
```

---

### Use with Extended Searching

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
