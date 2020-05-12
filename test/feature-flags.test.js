// use basic build so that errors are thrown
const Fuse = require('../dist/fuse.basic')
import * as ErrorMsg from '../src/core/errorMessages'
const Books = require('./fixtures/books.json')

describe('Initialization errors', () => {
  test('Errors are thrown', () => {
    expect(() => {
      new Fuse(Books, {
        useExtendedSearch: true,
        keys: ['title']
      })
    }).toThrowError(ErrorMsg.EXTENDED_SEARCH_UNAVAILABLE)

    expect(() => {
      let fuse = new Fuse(Books, {
        keys: ['title']
      })
      fuse.search({ title: 'hello' })
    }).toThrowError(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
  })
})
