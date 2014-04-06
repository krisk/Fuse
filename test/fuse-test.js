var assert = require('assert'),
  vows = require('vows'),
  Fuse = require('../src/fuse'),
  books = require('./books.json');

var fruits = ["Apple", "Orange", "Banana"];
var fuse = new Fuse(fruits)

vows.describe('Flat list of strings: ["Apple", "Orange", "Banana"]').addBatch({
  'Flat:': {
    topic: function() {
      var fruits = ["Apple", "Orange", "Banana"];
      var fuse = new Fuse(fruits)
      return fuse;
    },
    'When searching for the term "Apple"': {
      topic: function() {
        var result = fuse.search("Apple");
        return result;
      },
      'we get a list of containing 1 item, which is an exact match': function(result) {
        assert.equal(result.length, 1);
      },
      'whose value is the index 0 of ["Apple"]': function(result) {
        assert.equal(result[0], 0);
      },
    },
    'When performing a fuzzy search for the term "ran"': {
      topic: function() {
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