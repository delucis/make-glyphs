import path from 'path'
import test from 'ava'
import makeGlyphs from '../'
import subset from '../lib/subset'

const testGlyphs = path.join(__dirname, 'test.glyphs')

test('subsetting a single glyph', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  let subsetFont = subset(data, ['0041'])
  test.is(subsetFont.glyphs.length, 1)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    data.glyphs.find(g => g.unicode === '0041')
  )
  test.is(makeGlyphs.validate(subsetFont).error, null)
})

test('subsetting with a string as the subset', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  let subsetFont = subset(data, '0041')
  test.is(subsetFont.glyphs.length, 1)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    data.glyphs.find(g => g.unicode === '0041')
  )
  test.is(makeGlyphs.validate(subsetFont).error, null)
})

test('subsetting a glyph range', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const cp = ['0041', '0042', '0043', '0044', '0045', '0046', '0047']
  let subsetFont = subset(data, [['0041', '0047']])
  test.is(subsetFont.glyphs.length, 7)
  cp.forEach(p => test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === p),
    data.glyphs.find(g => g.unicode === p)
  ))
  test.is(makeGlyphs.validate(subsetFont).error, null)
})

test.failing('subsetting a unicode block by name', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  let subsetFont = subset(data, ['General Punctuation'])
  test.is(subsetFont.glyphs.find(g => g.unicode === '2026').glyphname, 'ellipsis')
  test.is(makeGlyphs.validate(subsetFont).error, null)
})

test('subsetting a non-existent block name throws an error', async test => {
  test.throws(() => { subset({}, ['Made Up Block']) }, RangeError)
})
