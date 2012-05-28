Fuse
====

Fuzzy search over models

#### Usage

Suppose you have the following data:

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
  values: ['author', 'title'],
  id: 'id'
}
var f = new Fuse(data, options);
var result = f.search('brwn');

==> [2, 3];
```

##### Example 2

```javascript
var options = {
  values: ['author', 'title']
}
var f = new Fuse(data, options);
var result = f.search('brwn');

==>
[{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
}, {
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];
```
