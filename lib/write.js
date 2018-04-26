const WRITE_GLYPHS = require('write-glyphs-file')
const VALIDATE = require('./validate')

module.exports = async (fp, g, o) => VALIDATE(g).then(g => WRITE_GLYPHS(fp, g, o))
