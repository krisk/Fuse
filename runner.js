Fuse = require('./src/fuse')

var items = [
  // 'Borwaila hamlet',
  // 'Bobe hamlet',
  'Boma',
  'Bo']
var fuse = new Fuse(items, {
  include: ['score'],
  verbose: true
})
var result = fuse.search('Bosdflkj sdlkfjs dlkfjsdlkfjsldkfj sldkfj slkdjflksdjflksdjf lkdsjf lksjdf lksjdflkjsd lkfj ')

// var items = ['FH Mannheim', 'University Mannheim']
// var fuse = new Fuse(items, {
//   verbose: true
// })
// var result = fuse.search('Uni Mannheim')

return
