Fuse
====

(info on Fuzzy-search: <http://en.wikipedia.org/wiki/Approximate_string_matching>)

Fuse is a full JavaScript fuzzy-search implementation that searches accross the keys of every record in a list.

#### Usage

Suppose you have the following data structure:

```javascript
data = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
},{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];
```

##### Example 1

```javascript
var options = {
  keys: ['author', 'title'],  // Properties to search in
  id: 'id'
}
var f = new Fuse(data, options);
var result = f.search('brwn');

// Output:
==> [2, 3]; // The list of identifiers
```

##### Example 2

```javascript
var options = {
  keys: ['author', 'title']
}
var f = new Fuse(data, options);
var result = f.search('brwn');  // Fuzzy-search for 'brwn'

// Output:
==>
[{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
}, {
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];   // List of the items
```

##### Options

`keys`
List of keys (properties) that will be searched.

`id`
The name of identifier key.  If specified, the returned result will be a list of the items' identifiers, otherwise it will be a list of the items.

#### Limitations

This isn't meant to work across hundreds of thousands, or millions of records.  If you have that many records at once on the client, then you probably have bigger problems to worry about.  To give you an idea of performance, searching over 2 keys in 20,000 records takes approximitaly 1 second.  Still, 20k records is an awful lot.  Ideally, a client-side fuzzy-search solution is only acceptable if the record-set is small, and the pattern string and keys' short.

The pattern string cannot exceed 32 characters.

#### How does it do it?

Currently, it uses a full Bitap algorithm [<http://en.wikipedia.org/wiki/Bitap_algorithm>], leveraging a modified version of the "Diff, Match & Patch" tool by Google [<http://code.google.com/p/google-diff-match-patch/>].