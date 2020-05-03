# Logical Query Operators

## `$and`

```js
{ $and: [ { <expression_1> }, { <expression_2> } , ... , { <expression_N> } ] }
```

`$and` performs a logical **AND** operation on an array of expressions and selects the entries that satisfy all the expressions. The `$and` operator uses short-circuit evaluation (i.e, if the first expression evaluates to false, `Fuse.js` will not evaluate the remaining expressions).

::: tip
Fuse.js provides an implicit **AND** operation when specifying a comma separated list of expressions. Using an explicit **AND** with the `$and` operator is necessary when the same field or operator has to be specified in multiple expressions.
:::

### Examples

```js
const result = fuse.search({
  $and: [{ author: 'abc' }, { title: 'xyz' }]
})
```

## `$or`

The `$or` operator performs a logical **OR** operation on an array of two or more `<expressions>` and selects the entries that satisfy at least one of the expressions.

### Examples

```js
const result = fuse.search({
  $or: [{ author: 'abc' }, { author: 'def' }]
})
```

<!--

```js
const result = fuse.search({
  $and: [{ author: 'abc' }, { $or: [{ title: 'nonfic' }, { title: 'html' }] }]
})
``` -->
