import path from 'path'
import test from 'ava'
import tempy from 'tempy'
import makeGlyphs from '../'

const testGlyphs = path.join(__dirname, 'test.glyphs')

test('loading & writing a .glyphs file', test => {
  const tempPath = tempy.file({extension: 'glyphs'})
  let fontdata
  return makeGlyphs.load(testGlyphs)
    .then(font => {
      fontdata = font
      return makeGlyphs.write(tempPath, fontdata)
    })
    .then(() => makeGlyphs.load(tempPath))
    .then(font => test.deepEqual(font, fontdata))
})
