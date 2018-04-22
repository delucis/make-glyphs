# make-glyphs [![Build Status](https://travis-ci.org/delucis/make-glyphs.svg?branch=master)](https://travis-ci.org/delucis/make-glyphs) [![Coverage Status](https://coveralls.io/repos/github/delucis/make-glyphs/badge.svg?branch=master)](https://coveralls.io/github/delucis/make-glyphs?branch=master)

> Tools for working with `.glyphs` font files

Load, validate, manipulate, and write font files for [Glyphs](http://glyphsapp.com/) using Javascript.


## ⚠️ Work in Progress ⚠️

The API described below is functional but may change. Testing and contributions are welcome. Planned features include merging multiple files and subsetting glyphs.


## Install

    npm install --save make-glyphs


## Usage

```js
const GLYPHS = require('make-glyphs')

GLYPHS.load('my-font.glyphs')
  .then(font => GLYPHS.version(font)) // bumps versionMinor of font
  .then(font => GLYPHS.write('my-font.glyphs', font))
```


## API

- [`.load(filepath)`](#loadfilepath)
- [`.map(fontdata, mapping, [options])`](#mapfontdata-mapping-options)
- [`.validate(fontdata)`](#validatefontdata)
- [`.version(fontdata, [type])`](#versionfontdata-type)
- [`.write(filepath, fontdata, [options])`](#writefilepath-fontdata-options)


### .load(filepath)

- `filepath` — a `String` containing the path to a `.glyphs` file to load

Returns a `Promise` for the parsed and validated Glyphs file as a Javascript `Object`.

```js
GLYPHS.load('my-font.glyphs')
  .then(fontdata => {
    console.log(fontdata)
  })
```


### .map(fontdata, mapping, [options])

- `fontdata` — an `Object` representing a Glyphs file.

- `mapping` — an `Object` mapping source glyphs to destination glyphs. Keys should be unicode strings, e.g. `'0041'`, and values either a unicode string or an array of unicode strings, i.e. `'0061'` or `['0061', '0040']`.

- `options` — an optional `Object` with any of the following properties

  - `includeUnmappedGlyphs` — `Boolean` (default: `false`) If true, preserves any glyphs from the `fontdata` not included in `mapping`. Otherwise, these are discarded.

  - `renameGlyphs` — `Boolean` (default: `true`) If `true`, tries to rename a mapped glyph using [`readable-glyph-names`](https://github.com/delucis/readable-glyph-names).

  - `selectSourceByGlyphName` — `Boolean` (default: `false`) If `true`, uses the `glyphname` property to select source glyphs. Otherwise, the `unicode` property is used. When `true`, `mapping` might look like `{ A: '0061' }` instead of `{ '0041': '0061' }.`

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


### .validate(fontdata)

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


### .version(fontdata, [type])

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


### .write(filepath, fontdata, [options])

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


## See also

- [write-glyphs-file](https://github.com/delucis/write-glyphs-file) - Stringify and write a `.glyphs` font file atomically


## License

This software is free to use, modify, and redistribute under a [GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.txt).
