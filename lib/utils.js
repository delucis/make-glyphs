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
