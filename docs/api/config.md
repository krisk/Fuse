# Accessing Default Options

You can access all [options](/api/options.html) above via `Fuse.config`. This is useful if you want to override default options for all Fuse instances.

**Example**:

```js
const options = {
  getFn: (obj, path) => {
    // Use the default `get` function
    const value = Fuse.config.getFn(obj, path)
    // ... do something with `value`
    return value
  }
}
```
