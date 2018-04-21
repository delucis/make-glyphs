import path from 'path'
import test from 'ava'
import makeGlyphs from '../'

const testGlyphs = path.join(__dirname, 'test.glyphs')
const testPlist = path.join(__dirname, 'test.plist')

test('load & validate file', async test => {
  const data = await makeGlyphs.load(testGlyphs)
  test.is(data.familyName, 'Test Font')
})

test('fail to validate', async test => {
  const err = await test.throws(makeGlyphs.load(testPlist))
  test.is(err.name, 'ValidationError')
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
