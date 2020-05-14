---
tags:
  - indexing
---

# Indexing

Use `Fuse.createIndex` to pre-generate the index from the list, and pass it directly into the Fuse instance.

```typescript
const list: MyType[] = [myType1, myType2, etc...]

const index = Fuse.createIndex<MyType>(
 keys: ['key1', 'key2']
 list: list
)

const options: Fuse.IFuseOptions<MyType> = {
 keys: ['key1', 'key2']
}

const myFuse = new Fuse(list, options, index)
```

::: tip
For very large datasets, especially those with large strings, consider pre-generating the index with `Fuse.createIndex`. This will speed up instantiation.
:::
