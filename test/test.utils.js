import test from 'ava'
import utils from '../lib/utils'

test('convert number to unicode', test => {
  test.is(utils.numberToUnicode(0x007A), '007A')
})

test('convert unicode to number', test => {
  test.is(utils.unicodeToNumber('0041'), 0x0041)
})

test('convert number to unicode and back', test => {
  let u = utils.numberToUnicode(0x0061)
  test.is(utils.unicodeToNumber(u), 0x0061)
})

test('convert unicode to number and back', test => {
  let u = utils.unicodeToNumber('00BB')
  test.is(utils.numberToUnicode(u), '00BB')
})

test('"007a" is a unicode string', test => {
  test.true(utils.isUnicodeString('007a'))
})

test('"XO90" is not a unicode string', test => {
  test.true(utils.isUnicodeString('0075'))
})

test('get codepoints from a string', test => {
  test.deepEqual(utils.stringToCodepoints('AB'), ['0041', '0042'])
})
