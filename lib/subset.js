const UTILS = require('./utils')
const MAP = require('./map')
const BLOCKS = require('unicode-blocks').reduce((map, { name, start, end }) => {
  map[name] = [ UTILS.numberToUnicode(start), UTILS.numberToUnicode(end) ]
  return map
}, {})

/**
 * Get the type of a range parameter: 'range', 'char' or 'unicode-range'
 * @param  {Array|String} range Range to test
 * @return {String}       Type: 'range', 'char' or 'unicode-range'
 */
const typeOfRange = range => Array.isArray(range) ? 'range' : UTILS.isUnicodeString(range) ? 'char' : 'unicode-range'

/**
 * Get a the start and end points of a unicode block by its name.
 * @param  {String} name The name of the unicode block to get range for
 * @return {String[]}    A 2-tuple array containing start and end codepoints
 */
const getBlockRange = name => {
  let block = BLOCKS[name]
  if (block) return block
  throw new RangeError(`"${name}" is not a valid unicode block name`)
}

/**
 * Get an array of all the codepoints between two codepoints, inclusive
 * @param  {String[]} range A 2-tuple array containing start and end codepoints
 * @return {String[]}       An array of all the codepoints in range
 */
const getCodepointsForRange = range => {
  [start, end] = range.map(UTILS.unicodeToNumber)
  return Array(end - start + 1).fill().map(
    (_, i) => UTILS.numberToUnicode(start + i)
  )
}

/**
 * Subset some glyphs within a font data object, discarding those not included
 * in the subset.
 * Examples of subsets: '0041'; ['0041', '0060']; [['0041', '0060']];
 * ['Latin Extended-A']; ['0041', ['0061', '007A'], 'General Punctuation']
 * @param  {Object}       fontdata  Font data
 * @param  {String|Array} subset    The subset of glyphs to subset:
 * @return {Object}                 Updated font data
 */
module.exports = (fontdata, subset) => {
  subset = Array.isArray(subset) ? subset : [subset]

  const codepoints = subset.reduce((codepoints, range) => {
    const type = typeOfRange(range)
    if (type === 'char') {
      codepoints.push(range)
    } else {
      range = type === 'range' ? range : getBlockRange(range)
      codepoints.push(...getCodepointsForRange(range))
    }
    return codepoints
  }, [])

  const map = codepoints.reduce((map, point) => {
    map[point] = point
    return map
  }, {})

  return MAP(fontdata, map)
}
