const CLONE_DEEP = require('lodash.clonedeep')
const GLYPHNAMES = require('readable-glyph-names')

/**
 * Map glyphs of a font data object to different unicode positions.
 * @param  {Object}  fontdata                        Font data
 * @param  {Object}  map                             Source to dest. glyph map
 * @param  {Object}  [options]                       Options object
 * @param  {Boolean} [options.renameGlyphs=true]
 * @param  {Boolean} [options.selectSourceByGlyphName=false]
 * @param  {Boolean} [options.includeUnmappedGlyphs=false]
 * @return {Object}                                  Font data
 */
module.exports = (
  fontdata,
  map,
  {
    renameGlyphs = true,
    selectSourceByGlyphName = false,
    includeUnmappedGlyphs = false
  } = {}
) => {
  fontdata = CLONE_DEEP(fontdata)
  let srcKey = selectSourceByGlyphName ? 'glyphname' : 'unicode'

  let glyphMap = fontdata.glyphs.reduce((glyphs, glyph) => {
    glyphs[glyph[srcKey]] = glyph
    return glyphs
  }, {})

  let newGlyphs = Object.entries(map).reduce((newGlyphs, [ src, dest ]) => {
    let srcGlyph = glyphMap[src]
    dest = Array.isArray(dest) ? dest : [dest]

    dest.forEach(d => {
      let glyph = CLONE_DEEP(srcGlyph)
      glyph.unicode = d

      if (renameGlyphs && GLYPHNAMES[d]) glyph.glyphname = GLYPHNAMES[d]

      if (includeUnmappedGlyphs) {
        let glyphAtDest
        if (selectSourceByGlyphName) {
          glyphAtDest = fontdata.glyphs.find(g => g.unicode === d)
        } else {
          glyphAtDest = glyphMap[d]
        }
        if (glyphAtDest) delete glyphMap[glyphAtDest[srcKey]]
      }

      newGlyphs.push(glyph)
    })

    if (includeUnmappedGlyphs) delete glyphMap[src]

    return newGlyphs
  }, [])

  if (includeUnmappedGlyphs) newGlyphs.push(...Object.values(glyphMap))

  fontdata.glyphs = newGlyphs
  return fontdata
}
