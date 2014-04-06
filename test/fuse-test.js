var assert = require('assert'),
  vows = require('vows'),
  Fuse = require('../src/fuse');

vows.describe('Flat list of strings: ["Apple", "Orange", "Banana"]').addBatch({
  'Flat:': {
    topic: function() {
      var fruits = ["Apple", "Orange", "Banana"];
      var fuse = new Fuse(fruits)
      return fuse;
    },
    'When searching for the term "Apple"': {
      topic: function(fuse) {
        var result = fuse.search("Apple");
        return result;
      },
      'we get a list of containing 1 item, which is an exact match': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the index 0, representing ["Apple"]': function(result) {
        assert.equal(result[0], 0);
      },
    },
    'When performing a fuzzy search for the term "ran"': {
      topic: function(fuse) {
        var result = fuse.search("ran");
        return result;
      },
      'we get a list of containing 2 items: [1, 2]': function(result) {
        assert.equal(result.length, 2);
      },
      'whose values represent the indices of ["Orange", "Banana"]': function(result) {
        assert.equal(result[0], 1);
        assert.equal(result[1], 2);
      },
    }
  }
}).export(module);

vows.describe('List of books - searching "title" and "author"').addBatch({
  'Books:': {
    topic: function() {
      var books = require('./books.json');
      var options = {
        keys: ["title", "author"]
      }
      var fuse = new Fuse(books, options);
      return fuse;
    },
    'When searching for the term "HTML5"': {
      topic: function(fuse) {
        var result = fuse.search("HTML5");
        return result;
      },
      'we get a list of containing 1 item, which is an exact match': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is { title: "HTML5", author: "Remy Sharp" }': function(result) {
        assert.deepEqual(result[0], {
          title: 'HTML5',
          author: 'Remy Sharp'
        });
      },
    },
    'When searching for the term "Woodhouse"': {
      topic: function(fuse) {
        var result = fuse.search("Woodhouse");
        return result;
      },
      'we get a list of containing 3 items': function(result) {
        assert.equal(result.length, 3);
      },
      'which are all the books written by "P.D. Woodhouse"': function(result) {
        assert.deepEqual(result[0], {
          title: 'Right Ho Jeeves',
          author: 'P.D. Woodhouse'
        });
        assert.deepEqual(result[1], {
          title: 'The Code of the Wooster',
          author: 'P.D. Woodhouse'
        });
        assert.deepEqual(result[2], {
          title: 'Thank You Jeeves',
          author: 'P.D. Woodhouse'
        });
      },
    },
    'When searching for the term "brwn"': {
      topic: function(fuse) {
        var result = fuse.search("brwn");
        return result;
      },
      'we get a list of containing at least 3 items': function(result) {
        assert.isTrue(result.length > 3);
      },
      'and the first 3 items should be all the books written by Dan Brown': function(result) {
        assert.deepEqual(result[0], {
          "title": "The DaVinci Code",
          "author": "Dan Brown"
        });
        assert.deepEqual(result[1], {
          "title": "Angels & Demons",
          "author": "Dan Brown"
        });
        assert.deepEqual(result[2], {
          "title": "The Lost Symbol",
          "author": "Dan Brown"
        });
      },
    }
  }
}).export(module);