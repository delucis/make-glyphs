# make-glyphs [![Build Status](https://travis-ci.org/delucis/make-glyphs.svg?branch=master)](https://travis-ci.org/delucis/make-glyphs) [![Coverage Status](https://coveralls.io/repos/github/delucis/make-glyphs/badge.svg?branch=master)](https://coveralls.io/github/delucis/make-glyphs?branch=master)

> Tools for working with `.glyphs` font files

Load, validate, manipulate, and write font files for [Glyphs](http://glyphsapp.com/) using Javascript.


## ⚠️ Work in Progress ⚠️

The API described below is functional but may change. Testing and contributions are welcome. See [issues](https://github.com/delucis/make-glyphs/issues) for known problems and to report any bugs or feature requests.


## Install

    npm install --save make-glyphs


## Usage

```js
const GLYPHS = require('make-glyphs')

// load a .glyphs file
GLYPHS.load('my-font.glyphs')
  // subset '!' and all capital letters
  .then(font => GLYPHS.subset(font, ['0021', ['0041', '005A']]))
  // increment the minor version
  .then(font => GLYPHS.version(font))
  // write the changes to a new font file
  .then(font => GLYPHS.write('new-font.glyphs', font))
```

### [Full API Documentation →](https://github.com/delucis/make-glyphs/blob/master/API.md)




```js
    }
}
```


}
```

```


## See also

- [readable-glyph-names](https://github.com/delucis/readable-glyph-names) — Unicode string to readable character name mapping as JSON
- [write-glyphs-file](https://github.com/delucis/write-glyphs-file) — Stringify and write a `.glyphs` font file atomically


## License

This software is free to use, modify, and redistribute under a [GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.txt).
