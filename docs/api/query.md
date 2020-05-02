# Logical Query Operators

## `$and`

```js
{ $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
```

`$and`performs a logical **AND** operation on an array of one or more expressions (e.g. `<expression1>,` `<expression2>`, etc.) and selects the documents that satisfy all the expressions in the array. The `$and` operator uses short-circuit evaluation. If the first expression (e.g. `<expression1>`) evaluates to false, Fuse.js will not evaluate the remaining expressions.

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

The `$or` operator performs a logical **OR** operation on an array of two or more `<expressions>` and selects the documents that satisfy at least one of the `<expressions>`.

### Examples

```js
const result = fuse.search({
  $or: [{ author: 'abc' }, { author: 'def' }]
})
```
