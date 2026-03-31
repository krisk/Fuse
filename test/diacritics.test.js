import { stripDiacritics } from '../src/helpers/diacritics.js'

const NON_DECOMPOSABLE_CASES = [
  ['ł', 'l'],
  ['Ł', 'L'],
  ['đ', 'd'],
  ['Đ', 'D'],
  ['ø', 'o'],
  ['Ø', 'O'],
  ['ħ', 'h'],
  ['Ħ', 'H'],
  ['ŧ', 't'],
  ['Ŧ', 'T'],
  ['ı', 'i'],
  ['ß', 'ss'],
]

describe('stripDiacritics', () => {
  describe('non-decomposable characters', () => {
    it.each(NON_DECOMPOSABLE_CASES)(
      'should replace "%s" with "%s"',
      (input, expected) => {
        expect(stripDiacritics(input)).toBe(expected)
      }
    )
  })
})
