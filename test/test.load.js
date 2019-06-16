import path from 'path'
import test from 'ava'
import load from '../lib/load'

const testGlyphs = path.join(__dirname, 'test.glyphs')
const testPlist = path.join(__dirname, 'test.plist')

test('load & validate file', async test => {
  const data = await load(testGlyphs)
  test.is(data.familyName, 'Test Font')
})

test('load & fail to validate', async test => {
  const err = await test.throwsAsync(load(testPlist))
  test.is(err.name, 'ValidationError')
})
