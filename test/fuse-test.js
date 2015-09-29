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
    },
    'When performing a fuzzy search for the term "nan"': {
      topic: function(fuse) {
        var result = fuse.search("nan");
        return result;
      },
      'we get a list of containing 2 items: [2, 1]': function(result) {
        assert.equal(result.length, 2);
      },
      'whose values represent the indices of ["Banana", "Orange"]': function(result) {
        assert.equal(result[0], 2);
        assert.equal(result[1], 1);
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

vows.describe('Deep key search, with ["title", "author.firstName"]').addBatch({
  'Deep:': {
    topic: function() {
      var books = [{
        "title": "Old Man's War",
        "author": {
          "firstName": "John",
          "lastName": "Scalzi"
        }
      }, {
        "title": "The Lock Artist",
        "author": {
          "firstName": "Steve",
          "lastName": "Hamilton"
        }
      }, {
        "title": "HTML5",
      }];
      var options = {
        keys: ["title", "author.firstName"]
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list of containing at least 1 item': function(result) {
        assert.isTrue(result.length > 0);
      },
      'whose first value is found': function(result) {
        assert.deepEqual(result[0], {
          "title": "The Lock Artist",
          "author": {
            "firstName": "Steve",
            "lastName": "Hamilton"
          }
        });
      },
    }
  }
}).export(module);

vows.describe('Custom search function, with ["title", "author.firstName"]').addBatch({
  'Deep:': {
    topic: function() {
      var books = [{
        "title": "Old Man's War",
        "author": {
          "firstName": "John",
          "lastName": "Scalzi"
        }
      }, {
        "title": "The Lock Artist",
        "author": {
          "firstName": "Steve",
          "lastName": "Hamilton"
        }
      }];
      var options = {
        keys: ["title", "author.firstName"],
        getFn: function(obj, path) {
          if (!obj) {
            return null;
          }
          obj = obj.author.lastName;
          return obj;
        }
      };
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Hmlt"': {
      topic: function(fuse) {
        var result = fuse.search("Hmlt");
        return result;
      },
      'we get a list of containing at least 1 item': function(result) {
        assert.isTrue(result.length > 0);
      },
      'whose first value is found': function(result) {
        assert.deepEqual(result[0], {
          "title": "The Lock Artist",
          "author": {
            "firstName": "Steve",
            "lastName": "Hamilton"
          }
        });
      },
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list of containing at least no items': function(result) {
        // assert.isTrue(result.length > 0);
        assert.equal(result.length, 0);
      },
    }
  }
}).export(module);

vows.describe('Include score in result list: ["Apple", "Orange", "Banana"]').addBatch({
  'Options:': {
    topic: function() {
      var fruits = ["Apple", "Orange", "Banana"];
      var fuse = new Fuse(fruits, {
        include: ['score']
      });
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
      'whose value and score exist': function(result) {
        assert.equal(result[0].item, 0);
        assert.equal(result[0].score, 0);
      },
    },
    'When performing a fuzzy search for the term "ran"': {
      topic: function(fuse) {
        var result = fuse.search("ran");
        return result;
      },
      'we get a list of containing 2 items': function(result) {
        assert.equal(result.length, 2);
      },
      'whose items represent the indices, and have non-zero scores': function(result) {
        assert.equal(result[0].item, 1);
        assert.equal(result[1].item, 2);
        assert.isNotZero(result[0].score);
        assert.isNotZero(result[1].score);
      },
    }
  }
}).export(module);

vows.describe('Only include ID in results list, with "ISBN"').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": "0765348276",
        "title": "Old Man's War",
        "author": "John Scalzi"
      }, {
        "ISBN": "0312696957",
        "title": "The Lock Artist",
        "author": "Steve Hamilton"
      }];
      var options = {
        keys: ["title", "author"],
        id: "ISBN"
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.equal(result, '0312696957');
      },
    }
  }
}).export(module);

vows.describe('Include both ID and score in results list').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": "0765348276",
        "title": "Old Man's War",
        "author": "John Scalzi"
      }, {
        "ISBN": "0312696957",
        "title": "The Lock Artist",
        "author": "Steve Hamilton"
      }];
      var options = {
        keys: ["title", "author"],
        id: "ISBN",
        include: ['score']
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.equal(result[0].item, '0312696957');
      },
      'and has a score different than zero': function(result) {
        assert.isNotZero(result[0].score);
      }
    }
  }
}).export(module);

vows.describe('Search when IDs are numbers').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": 1111,
        "title": "Old Man's War",
        "author": "John Scalzi"
      }, {
        "ISBN": 2222,
        "title": "The Lock Artist",
        "author": "Steve Hamilton"
      }];
      var options = {
        keys: ["title", "author"],
        id: "ISBN",
        include: ['score']
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.equal(result[0].item, 2222);
      },
      'and has a score different than zero': function(result) {
        assert.isNotZero(result[0].score);
      }
    }
  }
}).export(module);

vows.describe('Recurse into arrays').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": "0765348276",
        "title": "Old Man's War",
        "author": "John Scalzi",
        "tags": ["fiction"]
      }, {
        "ISBN": "0312696957",
        "title": "The Lock Artist",
        "author": "Steve Hamilton",
        "tags": ["fiction"]
      }, {
        "ISBN": "0321784421",
        "title": "HTML5",
        "author": "Remy Sharp",
        "tags": ["nonfiction"]
      }];
      var options = {
        keys: ["tags"],
        id: "ISBN",
        threshold: 0
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the tag "nonfiction"': {
      topic: function(fuse) {
        var result = fuse.search("nonfiction");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.equal(result[0], '0321784421');
      }
    }
  }
}).export(module);

vows.describe('Recurse into objects in arrays').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": "0765348276",
        "title": "Old Man's War",
        "author": {
          "name": "John Scalzi",
          "tags": [{
            value: "American"
          }]
        }
      }, {
        "ISBN": "0312696957",
        "title": "The Lock Artist",
        "author": {
          "name": "Steve Hamilton",
          "tags": [{
            value: "American"
          }]
        }
      }, {
        "ISBN": "0321784421",
        "title": "HTML5",
        "author": {
          "name": "Remy Sharp",
          "tags": [{
            value: "British"
          }]
        }
      }];
      var options = {
        keys: ["author.tags.value"],
        id: "ISBN",
        threshold: 0
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the author tag "British"': {
      topic: function(fuse) {
        var result = fuse.search("British");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.equal(result[0], '0321784421');
      }
    }
  }
}).export(module);



vows.describe('Searching by ID').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": "A",
        "title": "Old Man's War",
        "author": "John Scalzi"
      }, {
        "ISBN": "B",
        "title": "The Lock Artist",
        "author": "Steve Hamilton"
      }];
      var options = {
        keys: ["title", "author"],
        id: "ISBN"
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.isString(result[0]);
        assert.equal(result[0], "B");
      },
    }
  }
}).export(module);

vows.describe('Set new list on Fuse').addBatch({
  'Options:': {
    topic: function() {
      var fruits = ["Apple", "Orange", "Banana"];
      var vegetables = ["Onion", "Lettuce", "Broccoli"];

      var fuse = new Fuse(fruits);
      fuse.set(vegetables);
      return fuse;
    },
    'When searching for the term "Apple"': {
      topic: function(fuse) {
        var result = fuse.search("Lettuce");
        return result;
      },
      'we get a list of containing 1 item, which is an exact match': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the index 0, representing ["Lettuce"]': function(result) {
        assert.equal(result[0], 1);
      },
    }
  }
}).export(module);

vows.describe('Searching by nested ID').addBatch({
  'Options:': {
    topic: function() {
      var books = [{
        "ISBN": {
          "name": "A"
        },
        "title": "Old Man's War",
        "author": "John Scalzi"
      }, {
        "ISBN": {
          "name": "B"
        },
        "title": "The Lock Artist",
        "author": "Steve Hamilton"
      }];
      var options = {
        keys: ["title", "author"],
        id: "ISBN.name"
      }
      var fuse = new Fuse(books, options)
      return fuse;
    },
    'When searching for the term "Stve"': {
      topic: function(fuse) {
        var result = fuse.search("Stve");
        return result;
      },
      'we get a list containing 1 item': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the ISBN of the book': function(result) {
        assert.isString(result[0])
        assert.equal(result[0], "B");
      },
    }
  }
}).export(module);
