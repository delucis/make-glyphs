const LOAD_PLIST = require('load-nextstep-plist')
const VALIDATE = require('./validate')

module.exports = async fp => LOAD_PLIST(fp).then(VALIDATE)
