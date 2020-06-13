# Methods

### `setCollection(docs: T[], index?: FuseIndex<T>): void`

Set/replace the entire collection of documents. If no index is provided, one will be generated.

**Example**

```js
const fruits = ['apple', 'orange']
const fuse = new Fuse(fruits)

fuse.setCollection(['banana', 'pear'])
```

### `add(doc: T): void`

Adds a doc to the collection.

**Example**

```js
const fruits = ['apple', 'orange']
const fuse = new Fuse(fruits)

fuse.add('banana')

console.log(fruits.length)
// => 3
```

### `remove(predicate: (doc: T, idx: number) => boolean): T[]`

Removes all documents from the list which the predicate returns truthy for, and returns an array of the removed docs. The predicate is invoked with two arguments: `(doc, index)`.

**Example**

```js
const fruits = ['apple', 'orange', 'banana', 'pear']
const fuse = new Fuse(fruits)

const results = fuse.remove((doc) => {
  return doc === 'banana' || doc === 'pear'
})

console.log(fruits.length)
// => 1

console.log(results)
// => ['banana', 'pear']
```

### `removeAt(idx: number): void`

Removes the doc at the specified index.

**Example**

```js
const fruits = ['apple', 'orange', 'banana', 'pear']
const fuse = new Fuse(fruits)

fuse.removeAt(1)

console.log(fruits)
// => ['apple', 'banana', 'pear']
```

### `getIndex(): FuseIndex<T>`

Returns the generated Fuse index.
