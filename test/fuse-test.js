var assert = require('assert'),
  vows = require('vows'),
  Fuse = require('../fuse'),
  books = require('./books.json');

var pages = ["Apple", "Orange", "Banana"];
var fuse = new Fuse(pages)
console.log(pages);
var f = fuse.search("ple");
console.log("len:", f.length);

// BASIC TESTS
vows.describe('Basic Instantiation').addBatch({
  'When initializing a Fiber class via <Fiber.extend>': {
    topic: function() {
      var f = fuse.search("ple");
      return f;
    },
    'the <init> function should execute': function(result) {
      assert.equal(result.length, 1);
    }
  }
}).export(module);