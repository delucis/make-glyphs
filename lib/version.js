const CLONE_DEEP = require('lodash.clonedeep')

/**
 * Increment the version properties of a Glyphs file representation
 * @param  {Object} g           A Glyphs file representation
 * @param  {String} [v='minor'] Version type to increment: 'minor' or 'major'
 * @return {Object}             A Glyphs file representation with incremented version properties
 */
module.exports = (g, v = 'minor') => {
  if (v !== 'minor' && v !== 'major') throw new TypeError('Second argument should be "major" or "minor"')
  g = CLONE_DEEP(g)
  if (v === 'major') {
    g.versionMajor ? g.versionMajor++ : g.versionMajor = 1
    g.versionMinor = 0
  } else {
    g.versionMinor ? g.versionMinor++ : g.versionMinor = 1
  }
  return g
}
