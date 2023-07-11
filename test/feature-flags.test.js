// use basic build so that errors are thrown
import Fuse from '../dist/fuse.basic.mjs'
import * as ErrorMsg from '../src/core/errorMessages'
import Books from './fixtures/books.json' assert { type: "json" }

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
