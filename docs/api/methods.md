# Methods

### `search`

Searches the entire collection of documents, and returns a list of search results.

```js
fuse.search(/* pattern , options*/)
```

The pattern can be one of:

- [String](/examples.html#search-string-array)
- [Path](/examples.html#nested-search)
- [Extended query](/examples.html#extended-search)
- [Logical query](/api/query.html)

The options:

- `limit` (type: `number`): Denotes the max number of returned search results.

### `setCollection`

Set/replace the entire collection of documents. If no index is provided, one will be generated. Example:

```js
const fruits = ['apple', 'orange']
const fuse = new Fuse(fruits)

fuse.setCollection(['banana', 'pear'])
```

### `add`

Adds a doc to the collection. Example:

```js
const fruits = ['apple', 'orange']
const fuse = new Fuse(fruits)

fuse.add('banana')

console.log(fruits.length)
// => 3
```

### `remove`

Removes all documents from the list which the predicate returns truthy for, and returns an array of the removed docs. The predicate is invoked with two arguments: `(doc, index)`. Example:

```js
const fruits = ['apple', 'orange', 'banana', 'pear']
const fuse = new Fuse(fruits)

const results = fuse.remove((doc) => {
  return doc === 'banana' || doc === 'pear'
})

console.log(fruits.length)
// => 2

console.log(results)
// => ['banana', 'pear']
```

### `removeAt`

Removes the doc at the specified index. Example:

```js
const fruits = ['apple', 'orange', 'banana', 'pear']
const fuse = new Fuse(fruits)

fuse.removeAt(1)

console.log(fruits)
// => ['apple', 'banana', 'pear']
```

### `getIndex`

Returns the generated Fuse index. Example:

```js
const fruits = ['apple', 'orange', 'banana', 'pear']
const fuse = new Fuse(fruits)

console.log(fuse.getIndex().size())
// => 4
```

<Donate />
