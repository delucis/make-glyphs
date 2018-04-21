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
