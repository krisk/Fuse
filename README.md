Fuse
====

[![Build Status](https://secure.travis-ci.org/krisk/Fuse.png?branch=master)](http://travis-ci.org/krisk/Fuse)

Fuse is a full JavaScript fuzzy-search implementation that searches accross the keys of every record in a list.

- [Demo & usage](http://kiro.me/exp/fuse.html)
- [Project page](http://kiro.me/projects/fuse.html)

## Options

**keys** (*type*: `Array`)

List of properties that will be searched.  This also supports nested properties:

```javascript
var books = [{
  title: "Old Man's War"
  author: {
    firstName: "John",
    lastName: "Scalzi"
  }
}];
var fuse = new Fuse(books, { keys: ["title", "author.firstName"] });
```

---

**id** (*type*: `String`)

The name of the identifier property. If specified, the returned result will be a list of the items' identifiers, otherwise it will be a list of the items.

---

**caseSensitive** (*type*: `Boolean`, *default*: `false`)

Indicates whether comparisons should be case sensitive.

---

**includeScore** (*type*: `Boolean`, *default*: `true`)

Whether the score should be included in the result set. When `true`, each result in the list will be of the form `{ item: ..., score: ... }`

---

**shouldSort** (*type*: `Boolean`, *default*: `true`)

Whether to sort the result list, by score.

---

**searchFn** (*type*: `Function`, *default*: `BitapSearcher`)

The search function to use.  Note that the search function (`[[Function]]`) must conform the following API:

```javascript
/*
@param pattern The pattern string to search
@param options The search option
*/
[[Function]].constructor = function(pattern, options) { ... }

/*
@param text: the string to search in for the pattern
@return Object in the form of:
 - isMatch: boolean
 - score: Int
 */
[[Function]].prototype.search = function(text) { ... }
```

---

**getFn** (*type*: `Function`, *default*: `Utils.deepValue`)

The get function to use when fetching an objects properties.  The default will search nested paths *ie foo.bar.baz*

```javascript
/*
@param obj The object being searched
@param path The path to the target property
*/

// example using an object with a `getter` method
getFn: function (obj, path) {
  return obj.get(path);
}
```
---

**sortFn** (*type*: `Function`, *default*: `Array.prototype.sort`)

The function that is used for sorting the result list.

### Bitap specific options

**location** (*type*: `Integer`, *default*: `0`)

Determines approximately where in the text is the pattern expected to be found.

---

**threshold** (*type*: `Decimal`, *default*: `0.6`)

At what point does the match algorithm give up. A threshold of `0.0` requires a perfect match (of both letters and location), a threshold of `1.0` would match anything.

---

**distance** (*type*: `Integer`, *default*: `100`)

Determines how close the match must be to the fuzzy location (specified by `location`). An exact letter match which is `distance` characters away from the fuzzy location would score as a complete mismatch. A `distance` of `0` requires the match be at the exact `location` specified, a `threshold` of `1000` would require a perfect match to be within 800 characters of the `location` to be found using a `threshold` of `0.8`.

---

**maxPatternLength** (*type*: `Integer`, *default*: `32`)

The maximum length of the pattern. The longer the pattern, the more intensive the search operation will be.  Whenever the pattern exceeds the `maxPatternLength`, an error will be thrown.  Why is this important? Read [this](http://en.wikipedia.org/wiki/Word_(computer_architecture)#Word_size_choice).

## Contributing to Fuse

Before submitting a pull request, please add relevant tests in `test/fuse-test.js`, and execute them via `npm test`.

Note that **ALL TESTS MUST PASS**, otherwise the pull request will be automatically rejected.