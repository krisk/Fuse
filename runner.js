Fuse = require('./src/fuse')

var books = require('./test/books.json')
var options = {
  keys: ['title']
}
var fuse = new Fuse(books, options)

fuse.search('the wooster code')

console.log()

return