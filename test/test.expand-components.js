import path from 'path'
import test from 'ava'
import makeGlyphs from '../'
import expandComponents from '../lib/expand-components'

const testGlyphs = path.join(__dirname, 'test.glyphs')

test('expand components', async test => {
  const sourceFont = await makeGlyphs.load(testGlyphs)
  const expandedFont = expandComponents(sourceFont)
  test.is(expandedFont.glyphs.filter(g => {
    let hasComponents = false
    g.layers.forEach(l => {
      if (l.hasOwnProperty('components')) hasComponents = true
    })
    return hasComponents
  }).length, 0)
})

test('expand components for specific glyphs', async test => {
  const sourceFont = await makeGlyphs.load(testGlyphs)
  const expandedFont = expandComponents(sourceFont, { glyphs: [ 'ellipsis' ] })
  let expandedGlyph = expandedFont.glyphs.find(g => g.glyphname === 'ellipsis')
  let unexpandedGlyph = expandedFont.glyphs.find(g => g.glyphname === 'exclam')
  let hasComponents = false
  expandedGlyph.layers.forEach(l => {
    if (l.hasOwnProperty('components')) hasComponents = true
  })
  test.false(hasComponents)
  unexpandedGlyph.layers.forEach(l => {
    if (l.hasOwnProperty('components')) hasComponents = true
  })
  test.true(hasComponents)
})

test('expand components throws if maxDepth is too low', async test => {
  const sourceFont = await makeGlyphs.load(testGlyphs)
  const err = test.throws(() => { expandComponents(sourceFont, { maxDepth: 0 }) }, Error)
  test.is(err.message, 'Tried expanding components, but stopped after 10 recursions. The font may be corrupt or you can try increasing the maxDepth option.')
})
