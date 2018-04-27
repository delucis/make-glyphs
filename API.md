# make-glyphs API documentation

- [`.build(builds)`](#buildbuilds)
- [`.expandComponents(fontdata, [options])`](#expandComponentsfontdata-options)
- [`.load(filepath)`](#loadfilepath)
- [`.map(fontdata, mapping, [options])`](#mapfontdata-mapping-options)
- [`.set(fontdata, key, value)`](#setfontdata-key-value)
- [`.subset(fontdata, subset)`](#subsetfontdata-subset)
- [`.validate(fontdata)`](#validatefontdata)
- [`.version(fontdata, [type])`](#versionfontdata-type)
- [`.write(filepath, fontdata, [options])`](#writefilepath-fontdata-options)


## .build(builds)

- `builds` — an `Object` specifying a full build task. It should contain at least one `Object`, defining a build:

  - Each object in `builds` should have the following properties:

    - `load` — a `String` specifying the source file to load
    - `process` (optional) — an `Array` of tasks to run. Each task should be defined as follows: `[ taskType, arguments... ]`, e.g. `['set', 'familyName', 'New Name']`.
    - `write` — a `String` specifying the path to write the new font to

`.build()` provides a way to specify an entire font-processing task, loading, processing, and saving a font, using a Javascript object to specify all the steps.

```js
const MY_BUILDS = {
  myBuild: {
    load: 'my-font.glyphs',
    process: [
      ['subset', [['0041', '0061']]],
      ['set', 'familyName', 'My Subset Font'],
      ['version']
    ],
    write: 'my-subset-font.glyphs'
  }
}

GLYPHS.build(MY_BUILDS)

// The above is equivalent to:
GLYPHS.load('my-font.glyphs')
  .then(font => GLYPHS.subset(font, [['0041', '0061']]))
  .then(font => GLYPHS.set(font, 'familyName', 'My Subset Font'))
  .then(GLYPHS.version)
  .then(font => GLYPHS.write('my-subset-font.glyphs', font))
```


## .expandComponents(fontdata, [options])

- `fontdata` — an `Object` representing a Glyphs file.

- `options` — an optional `Object` with any of the following properties:

  - `glyphs` — an `Array` of glyphs to expand components for, defaults to all glyphs in `fontdata`

  - `maxDepth` — the maximum `Number` of recursions before the expansion will stop following component references. Most fonts won’t have more than one or two levels of reference, but if you get an error you can try raising the `maxDepth` option. Defaults to `10`.

Expand any components in use by your glyphs to explicit paths.

```js
let expandedFont = GLYPHS.expandComponents(fontdata)
```


## .load(filepath)

- `filepath` — a `String` containing the path to a `.glyphs` file to load

Returns a `Promise` for the parsed and validated Glyphs file as a Javascript `Object`.

```js
GLYPHS.load('my-font.glyphs')
  .then(fontdata => {
    console.log(fontdata)
  })
```


## .map(fontdata, mapping, [options])

- `fontdata` — an `Object` representing a Glyphs file.

- `mapping` — an `Object` mapping source glyphs to destination glyphs. Keys should be unicode strings, e.g. `'0041'`, and values either a unicode string or an array of unicode strings, i.e. `'0061'` or `['0061', '0040']`.

- `options` — an optional `Object` with any of the following properties

  - `includeUnmappedGlyphs` — `Boolean` (default: `false`) If true, preserves any glyphs from the `fontdata` not included in `mapping`. Otherwise, these are discarded.

  - `renameGlyphs` — `Boolean` (default: `true`) If `true`, tries to rename a mapped glyph using [`readable-glyph-names`](https://github.com/delucis/readable-glyph-names).

  - `selectSourceByGlyphName` — `Boolean` (default: `false`) If `true`, uses the `glyphname` property to select source glyphs. Otherwise, the `unicode` property is used. When `true`, `mapping` might look like `{ A: '0061' }` instead of `{ '0041': '0061' }`.

Returns a font data `Object`, in which glyphs from the input `fontdata` are mapped to new unicode positions.

```js
let font = {
  glyphs: [
    {
      glyphname: 'A',
      layers: [ /* ... */ ],
      unicode: '0041'
    }
  ]
  /* ... */
}

let mappedFont = GLYPHS.map(font, { '0041': '007A' })
console.log(mappedFont)
// => {
//   glyphs: [
//     {
//       glyphname: 'z',
//       layers: [ /* ... */ ],
//       unicode: '007A'
//     }
//   ]
//   /* ... */
// }
```


## .set(fontdata, key, value)

- `fontdata` — an `Object` representing a Glyphs file

- `key` — the key in the `fontdata` to set as a `String`

- `value` — the value to set the key to, can be any Javascript type. If a `Function` is passed, it will be called with the current value (if present) as its first argument and the entire `fontdata` representation as its second argument.

This allows you to directly set a root property of the `fontdata`. This can also be achieved with simple assignment, i.e. `fontdata.familyName = 'New Name'`, but sometimes the `.set()` helper may be more convenient.

```js
let fontdata = { familyName: 'Lemons' }

GLYPHS.set(fontdata, 'designer', 'Proud Parent')
GLYPHS.set(fontdata, 'familyName', name => `Updated ${name}`)
// fontdata = {
//   designer: 'Proud Parent',
//   familyName: 'Updated Lemons'
// }
```


## .subset(fontdata, subset)

- `fontdata` — an `Object` representing a Glyphs file

- `subset` — an `Array` representing the glyph ranges to subset.
  Members of the array can be:

  - a two-member `Array`, e.g. `['0041', '0061']`, which specifies the start and end of a unicode range

  - a `String`, e.g. `'0041'`, which specifies a single unicode character

  - a `String`, e.g. `'Arabic'`, which specifies a range by its [unicode block name](https://en.wikipedia.org/wiki/Unicode_block)

Returns a font data `Object`, in which only the glyphs found in the `subset` range(s) are included from the input `fontdata`.

```js
let subset = ['Basic Latin', ['00A2', '00A5'], '2026']

let subsetFont = GLYPHS.subset(fontdata, subset)
// Returns glyphs in the ranges: U+0000..U+007F, U+00A2..U+00A5, U+2026
```


## .validate(fontdata)

- `fontdata` — an `Object` representing a Glyphs file

Validates that the passed `fontdata` `Object` is a valid representation of a Glyphs file, using [`joi`](https://github.com/hapijs/joi/). Called for you whenever you use `.load()` or `.write()`.

Returns a Promise-like object that can either be used using `Promise` syntax or as a simple object:

```js
// With Promise-like syntax:
let fontdata = { familyName: 'my font' }

GLYPHS.validate(fontdata)
  .then(value => console.log(value))
```

```js
// Using simple object:
let result = GLYPHS.validate(fontdata)

if (result.error) {
  console.error(result.error)
} else {
  console.log(result.value)
}
```


## .version(fontdata, [type])

- `fontdata` — an `Object` representing a Glyphs file

- `type` — either `'major'` or `'minor'` (defaults to `'minor'`)

Returns `fontdata` with its `versionMajor` and `versionMinor` properties incremented. For example:

```js
let newVersion = GLYPHS.version(oldVersion)
// if oldVersion had { versionMajor: 1, versionMinor: 2 },
// newVersion will have { versionMajor: 1, versionMinor: 3 }

let newMajorVersion = GLYPHS.version(oldVersion, 'major')
// newMajorVersion will be { versionMajor: 2, versionMinor: 0 }
```


## .write(filepath, fontdata, [options])

- `filepath` — a `String` specifying where the file should be written

- `fontdata` — an `Object` representing a Glyphs file

- `options` — an optional `Object` with the following properties:

  - `mode` — a `Number` specifying the [mode](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) used when writing the file (defaults to `0o666`)

Validates `fontdata`, converts it to a `String`, and writes it to disk.

Returns a `Promise` that resolves once the file has finished writing.

```js
let fontdata = { familyName: 'new font' /* ... */ }

GLYPHS.write('new-font.glyphs', fontdata)
  .then(() => {
    console.log('Done writing!')
  })
```
