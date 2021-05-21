// use basic build so that errors are thrown
const Fuse = require('../dist/fuse.basic')
import { LogicalSearchUnavailableException } from "../src/core/error.js";
import { ExtendedSearchUnavailableException } from "../src/core/error.js";
const Books = require('./fixtures/books.json')

describe('Initialization errors', () => {
  test('Errors are thrown', () => {
    expect(() => {
      new Fuse(Books, {
        useExtendedSearch: true,
        keys: ['title']
      })
    }).toThrowError((new ExtendedSearchUnavailableException()).message)

    expect(() => {
      let fuse = new Fuse(Books, {
        keys: ['title']
      })
      fuse.search({ title: 'hello' })
    }).toThrowError((new LogicalSearchUnavailableException()).message)
  })
})
