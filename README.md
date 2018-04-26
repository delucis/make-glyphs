# make-glyphs [![Build Status](https://travis-ci.org/delucis/make-glyphs.svg?branch=master)](https://travis-ci.org/delucis/make-glyphs) [![Coverage Status](https://coveralls.io/repos/github/delucis/make-glyphs/badge.svg?branch=master)](https://coveralls.io/github/delucis/make-glyphs?branch=master)

> Tools for working with `.glyphs` font files

Load, validate, manipulate, and write font files for [Glyphs](http://glyphsapp.com/) using Javascript.


## ⚠️ Work in Progress ⚠️

The API described below is functional but may change. Testing and contributions are welcome. See [issues](https://github.com/delucis/make-glyphs/issues) for known problems and to report any bugs or feature requests.


## Install

    npm install --save make-glyphs


## Programmatic Usage

```js
const GLYPHS = require('make-glyphs')

// load a .glyphs file
GLYPHS.load('my-font.glyphs')
  // subset '!' and all capital letters
  .then(font => GLYPHS.subset(font, ['0021', ['0041', '005A']]))
  // increment the minor version
  .then(font => GLYPHS.version(font))
  // rename the font
  .then(font => GLYPHS.set(font, 'familyName', 'New Font'))
  // write the changes to a new font file
  .then(font => GLYPHS.write('new-font.glyphs', font))
```

### [Full API Documentation →](https://github.com/delucis/make-glyphs/blob/master/API.md)


## Using `make-glyphs` as a build tool

Installing this package will also install a `make-glyphs` command that you can use to set up builds for your project. To use this, you will need to create a `glyphs.config.js` file in your project root, describing your builds. Here’s an example:

```js
// glyphs.config.js
module.exports = {
  builds: {
    'basic-latin': {
      load: 'src/my-font.glyphs',
      process: [
        ['subset', ['Basic Latin']],
        ['set', 'familyName', (name) => `${name} Basic`]
      ],
      write: 'build/my-font-basic-latin.glyphs'
    },
    version: {
      load: 'src/my-font.glyphs',
      process: [
        ['version']
      ],
      write: 'src/my-font.glyphs'
    }
  }
}
```

See [documentation for the `.build()` method](https://github.com/delucis/make-glyphs/blob/master/API.md#buildbuilds) for more details.

Now you can set up npm scripts to run these builds in your `package.json`…
```json
/* package.json */
{
  "scripts": {
    "subset": "make-glyphs --build basic-latin",
    "version": "make-glyphs --build version"
  }
}
```

…and then run the scripts from the command line:
```sh
npm run subset                    # runs the 'basic-latin' build
npm run version                   # runs the 'version' build
```


## See also

- [readable-glyph-names](https://github.com/delucis/readable-glyph-names) — Unicode string to readable character name mapping as JSON
- [write-glyphs-file](https://github.com/delucis/write-glyphs-file) — Stringify and write a `.glyphs` font file atomically


## License

This software is free to use, modify, and redistribute under a [GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.txt).
