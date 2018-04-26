/**
 * Set a value for a key of an object
 * @param  {Object} fontdata A font data object
 * @param  {String} key      A key to set
 * @param  {Array}  args     Arguments: value to set, function to get value, etc
 * @return {Object}          An updated font data object
 */
module.exports = (fontdata, key, ...args) => {
  if (args.length > 1) {
    fontdata[key] = args
  } else if (typeof args[0] === 'function') {
    let currentVal = fontdata.hasOwnProperty(key) ? fontdata[key] : null
    fontdata[key] = args[0](currentVal, fontdata)
  } else {
    fontdata[key] = args[0]
  }
  return fontdata
}
