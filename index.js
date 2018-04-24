const LOAD_PLIST = require('load-nextstep-plist')
const WRITE_GLYPHS = require('write-glyphs-file')
const MAP = require('./lib/map')
const SUBSET = require('./lib/subset')
const VALIDATE = require('./lib/validate')
const VERSION = require('./lib/version')

const LOAD = async fp => LOAD_PLIST(fp).then(VALIDATE)
const WRITE = async (fp, g, o) => VALIDATE(g).then(g => WRITE_GLYPHS(fp, g, o))

module.exports.load = LOAD
module.exports.map = MAP
module.exports.subset = SUBSET
module.exports.validate = VALIDATE
module.exports.version = VERSION
module.exports.write = WRITE
