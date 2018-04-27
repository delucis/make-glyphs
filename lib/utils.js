const NAMES = Object.entries(require('readable-glyph-names')).reduce((names, [key, val]) => {
  names[val] = key
  return names
}, {})

/**
 * Convert a number to a unicode string: 0x007a -> '007A'
 * @param  {Number} h Number to convert.
 * @return {String}   Unicode string.
 */
module.exports.numberToUnicode = h => h.toString(16).padStart(4, 0).toUpperCase()

/**
 * Convert a unicode string to a number: '0055' -> 0x0055
 * @param  {String} u Unicode string to convert.
 * @return {Number}   Parsed number.
 */
module.exports.unicodeToNumber = u => parseInt(u, 16)

/**
 * Test if a string represents a unicode codepoint: '0061' -> true
 * @param  {String}  s String to test.
 * @return {Boolean}   True if string is a valid unicode codepoint.
 */
module.exports.isUnicodeString = s => /^[\da-f]{4}$/i.test(s)

/**
 * Get an array of the unicode codepoints in a string: 'A' -> ['0041']
 * @param  {String} s A string to get codepoints for
 * @return {String[]} An array of the codepoint of each character in the string
 */
module.exports.stringToCodepoints = s => s.split('').map(c => this.numberToUnicode(c.codePointAt()))

/**
 * Try to ensure that the input is interpreted as a unicode string.
 * @param  {Number|String} i The string or number to interpret as unicode
 * @return {String} A unicode string, e.g. '0041'
 */
module.exports.ensureUnicode = i => {
  if (typeof i === 'number') return this.numberToUnicode(i)
  if (this.isUnicodeString(i)) return i.toUpperCase()
  if (typeof i === 'string') {
    if (NAMES.hasOwnProperty(i)) return NAMES[i]
    if (i.length === 1) return this.stringToCodepoints(i)[0]
  }
  throw new Error(`Could not interpret “${i}” as a unicode character.`)
}
