const Fuse = require('../dist/fuse')

const defaultList = ['Stove', 'My good friend Steve from college']
const defaultOptions = {}

const setup = (itemList, overwriteOptions) => {
  const list = itemList || defaultList
  const options = { ...defaultOptions, ...overwriteOptions }

  return new Fuse(list, options)
}

describe('Flat list of strings: ["Stove", "My good friend Steve from college"]', () => {

  describe('When performing a fuzzy search for the term "Steve" with ignoreFieldNorm off', () => {
    let result, fuse
    beforeEach(() => {
      fuse = setup()
      result = fuse.search('Steve')
    })

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["Stove", "My good friend Steve from college"]', () => {
      expect(result[0].refIndex).toBe(0)
      expect(result[1].refIndex).toBe(1)
    })
  })

  describe('When performing a fuzzy search for the term "Steve" with ignoreFieldNorm on', () => {
    let result, fuse
    beforeEach(() => {
      fuse = setup(null, { ignoreFieldNorm: true })
      result = fuse.search('Steve')
    })

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["My good friend Steve from college", "Stove"]', () => {
      expect(result[0].refIndex).toBe(1)
      expect(result[1].refIndex).toBe(0)
    })
  })

  describe('When performing a fuzzy search for the term "Steve" with ignoreFieldNorm off and fieldNormWeight decreased', () => {
    let result, fuse
    beforeEach(() => {
      fuse = setup(null, { fieldNormWeight: 0.15 })
      result = fuse.search('Steve')
    })

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["My good friend Steve from college", "Stove"]', () => {
      expect(result[0].refIndex).toBe(1)
      expect(result[1].refIndex).toBe(0)
    })
  })
})
