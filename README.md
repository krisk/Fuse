Fuse
====

Fuse is a full JavaScript fuzzy-search implementation that searches accross the keys of every record in a list.

#### Usage

Suppose you have the following data structure:

```javascript
// List of books
var books = [{
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
  keys: ['author', 'title'],   // keys to search in
  id: 'id'                     // return a list of identifiers only
}
var f = new Fuse(data, options);
var result = f.search('brwn'); // Fuzzy-search for pattern 'brwn'

// Output:
==> [2, 3]; // The list of identifiers
```

##### Example 2

```javascript
var options = {
  keys: ['author', 'title']
}
var f = new Fuse(books, options);
var result = f.search('brwn');

// Output:
==>
[{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
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

`threshold`
A decimal value indicating at which point the match algorithm gives up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.

`caseSensitive`
A boolean value indicating whether comparisons should be case sensitive.  False by default.

#### Limitations

This isn't meant to work across hundreds of thousands, or millions of records.  If you have that many records at once on the client, then you probably have bigger problems to worry about.  To give you an idea of performance, searching over 2 keys in 20,000 records takes approximitaly 1 second.  Still, 20k records is an awful lot.  Ideally, a client-side fuzzy-search solution is only acceptable if the record-set is small, and the pattern string and keys' short.

The pattern string cannot exceed 32 characters.

#### How does it do it?

Currently, it uses a full [Bitap algorithm](http://en.wikipedia.org/wiki/Bitap_algorithm "Bitap algorithm - wiki"), leveraging a modified version of the [Diff, Match & Patch](http://code.google.com/p/google-diff-match-patch/ "Diff, Match & Patch") tool by Google.

#### To do

Currently planning to make it faster, and work for larger sets of data. Let me know your thoughts, ideas, or anything else.
