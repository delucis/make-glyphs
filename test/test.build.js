import path from 'path'
import test from 'ava'
import tempy from 'tempy'
import makeGlyphs from '../'

const testGlyphs = path.join(__dirname, 'test.glyphs')

test('run a simple build', async test => {
  const builds = {
    'run a simple build': {
      load: {
        'test/test.glyphs': [
          ['subset', ['0041', '0042']],
          ['set', 'familyName', 'Subset Font'],
          ['version']
        ]
      },
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a simple build'].write)
  test.is(subsetFont.glyphs.length, 2)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
  test.is(subsetFont.familyName, 'Subset Font')
  test.is(subsetFont.versionMinor, sourceFont.versionMinor + 1)
})

test('builds without a load property throw', async test => {
  const builds = {
    'builds without a load property throw': { write: '' }
  }
  const err = await test.throwsAsync(makeGlyphs.build(builds))
  test.is(err.name, 'TypeError')
  test.true(err.message.endsWith('must have a load property!'))
})

test('builds without a write property throw', async test => {
  const builds = {
    'builds without a write property throw': { load: 'test/test.glyphs' }
  }
  const err = await test.throwsAsync(makeGlyphs.build(builds))
  test.is(err.name, 'TypeError')
  test.true(err.message.endsWith('must have a write property!'))
})

test('run a build with a bad task', async test => {
  const builds = {
    'run a build with a bad task': {
      load: {
        'test/test.glyphs': [
          ['blame', ['0041', '0042']]
        ]
      },
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a build with a bad task'].write)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
})

test('run a build with a process property', async test => {
  const builds = {
    'run a build with a process property': {
      load: { 'test/test.glyphs': [] },
      process: [
        ['subset', ['0041', '0042']],
        ['set', 'familyName', 'Subset Font'],
        ['version']
      ],
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a build with a process property'].write)
  test.is(subsetFont.glyphs.length, 2)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
  test.is(subsetFont.familyName, 'Subset Font')
  test.is(subsetFont.versionMinor, sourceFont.versionMinor + 1)
})

test('run a build where load is an array', async test => {
  const builds = {
    'run a build where load is an array': {
      load: [ 'test/test.glyphs' ],
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a build where load is an array'].write)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
  test.is(subsetFont.familyName, sourceFont.familyName)
})

test('run a build where load is a string', async test => {
  const builds = {
    'run a build where load is a string': {
      load: 'test/test.glyphs',
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a build where load is a string'].write)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
  test.is(subsetFont.familyName, sourceFont.familyName)
})

test.failing('run a build with more than one input file', async test => {
  const builds = {
    'run a build with more than one input file': {
      load: [ 'test/test.glyphs', 'test/test.glyphs' ],
      write: tempy.file({extension: 'glyphs'})
    }
  }
  const sourceFont = await makeGlyphs.load(testGlyphs)
  await makeGlyphs.build(builds)
  const subsetFont = await makeGlyphs.load(builds['run a build with more than one input file'].write)
  test.deepEqual(
    subsetFont.glyphs.find(g => g.unicode === '0041'),
    sourceFont.glyphs.find(g => g.unicode === '0041')
  )
  test.is(subsetFont.familyName, sourceFont.familyName)
})
