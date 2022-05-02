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

test('ensure a number is unicode', test => {
  test.is(utils.ensureUnicode(65), '0041')
})

test('ensure a unicode string is unicode', test => {
  test.is(utils.ensureUnicode('007a'), '007A')
})

test('ensure a glyph name is unicode', test => {
  test.is(utils.ensureUnicode('Aacute'), '00C1')
})

test('ensure a character is unicode', test => {
  test.is(utils.ensureUnicode('%'), '0025')
})

test('ensuring an invalid character string throws', test => {
  const err = test.throws(() => { utils.ensureUnicode('%%') }, Error)
  test.is(err.message, 'Could not interpret “%%” as a unicode character.')
})

test('ensuring an array is unicode throws', test => {
  const err = test.throws(() => { utils.ensureUnicode(['X']) }, Error)
  test.is(err.message, 'Could not interpret “X” as a unicode character.')
})

test('ensuring an object is unicode throws', test => {
  const err = test.throws(() => { utils.ensureUnicode({}) }, Error)
  test.is(err.message, 'Could not interpret “[object Object]” as a unicode character.')
})
