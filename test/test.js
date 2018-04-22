import path from 'path'
import test from 'ava'
import makeGlyphs from '../'

const testGlyphs = path.join(__dirname, 'test.glyphs')
const testPlist = path.join(__dirname, 'test.plist')

test('load & validate file', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  test.is(data.familyName, 'Test Font')
})

test('load & fail to validate', async test => {
  const err = await test.throws(makeGlyphs.load(testPlist))
  test.is(err.name, 'ValidationError')
})

test('map A to a by unicode', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const A = data.glyphs.find(g => g.unicode === '0041')
  const { glyphs } = makeGlyphs.map(data, { '0041': '0061' })
  test.deepEqual(glyphs.find(g => g.glyphname === 'a').layers, A.layers)
})

test('map B to z by glyphname', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const B = data.glyphs.find(g => g.glyphname === 'B')
  const { glyphs } = makeGlyphs.map(data, { B: '007A' }, { selectSourceByGlyphName: true })
  test.deepEqual(glyphs.find(g => g.glyphname === 'z').layers, B.layers)
})

test('map A to a and z by unicode', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const A = data.glyphs.find(g => g.unicode === '0041')
  const { glyphs } = makeGlyphs.map(data, { '0041': ['0061', '007A'] })
  test.deepEqual(glyphs.find(g => g.glyphname === 'a').layers, A.layers)
  test.deepEqual(glyphs.find(g => g.glyphname === 'z').layers, A.layers)
})

test('map B to z but don’t rename', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const B = data.glyphs.find(g => g.glyphname === 'B')
  const { glyphs } = makeGlyphs.map(data, { '0042': '007A' }, { renameGlyphs: false })
  test.deepEqual(glyphs.find(g => g.unicode === '007A').layers, B.layers)
})

test('empty map returns empty glyphs', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const { glyphs } = makeGlyphs.map(data, {})
  test.is(glyphs.length, 0)
})

test('includeUnmappedGlyphs preserves unmapped glyphs with empty map', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const length = data.glyphs.length
  const K = data.glyphs.find(g => g.unicode === '004B')
  const { glyphs } = makeGlyphs.map(data, {}, { includeUnmappedGlyphs: true })
  test.is(glyphs.length, length)
  test.deepEqual(glyphs.find(g => g.glyphname === 'K'), K)
})

test('includeUnmappedGlyphs preserves unmapped glyphs when mapping other glyphs', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const length = data.glyphs.length
  const A = data.glyphs.find(g => g.unicode === '0041')
  const K = data.glyphs.find(g => g.unicode === '004B')
  const { glyphs } = makeGlyphs.map(data, { '0041': '0061' }, { includeUnmappedGlyphs: true })
  test.is(glyphs.length, length)
  test.deepEqual(glyphs.find(g => g.glyphname === 'K'), K)
  test.deepEqual(glyphs.find(g => g.glyphname === 'a').layers, A.layers)
})

test('glyph mapping overwrites existing glyphs with includeUnmappedGlyphs', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const length = data.glyphs.length
  const A = data.glyphs.find(g => g.unicode === '0041')
  const { glyphs } = makeGlyphs.map(data, { '0041': '004B' }, { includeUnmappedGlyphs: true })
  test.is(glyphs.length, length - 1)
  test.is(glyphs.filter(g => g.glyphname === 'K').length, 1)
  test.deepEqual(glyphs.find(g => g.glyphname === 'K').layers, A.layers)
})

test('glyph mapping overwrites existing glyphs with includeUnmappedGlyphs and selectSourceByGlyphName', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  const length = data.glyphs.length
  const A = data.glyphs.find(g => g.unicode === '0041')
  const { glyphs } = makeGlyphs.map(data, { A: '004B' }, { includeUnmappedGlyphs: true, selectSourceByGlyphName: true })
  test.is(glyphs.length, length - 1)
  test.is(glyphs.filter(g => g.glyphname === 'K').length, 1)
  test.deepEqual(glyphs.find(g => g.glyphname === 'K').layers, A.layers)
})

test('increment versions', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  test.is(data.versionMajor, 1)
  test.is(data.versionMinor, 0)
  const minorVersionBumped = makeGlyphs.version(data)
  test.is(minorVersionBumped.versionMajor, 1)
  test.is(minorVersionBumped.versionMinor, 1)
  const majorVersionBumped = makeGlyphs.version(minorVersionBumped, 'major')
  test.is(majorVersionBumped.versionMajor, 2)
  test.is(majorVersionBumped.versionMinor, 0)
  // original data should still have original versions:
  test.is(data.versionMajor, 1)
  test.is(data.versionMinor, 0)
})

test('increment non-zero minor versions', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  data.versionMinor = 1
  const versioned = makeGlyphs.version(data)
  test.is(versioned.versionMajor, 1)
  test.is(versioned.versionMinor, 2)
})

test('fail .version() if type is wrong', test => {
  test.throws(() => { makeGlyphs.version({}, 'phrygian') }, TypeError)
})

test('missing version properties on .version()', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  delete data.versionMajor
  delete data.versionMinor
  const versioned = makeGlyphs.version(data)
  test.is(versioned.versionMajor, 0)
  test.is(versioned.versionMinor, 1)
})

test('missing version properties on major .version()', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  delete data.versionMajor
  delete data.versionMinor
  const versioned = makeGlyphs.version(data, 'major')
  test.is(versioned.versionMajor, 1)
  test.is(versioned.versionMinor, 0)
})
