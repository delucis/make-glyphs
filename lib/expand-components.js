const CLONE_DEEP = require('lodash.clonedeep')
const UTILS = require('./utils')

/**
 * Parse a string describing a matrix to an array of floats
 * @param  {String} s Affine transform matrix, e.g. '{1, 0, 0, 1, 220, 0}'
 * @return {Array}    Matrix as an array, e.g. [1, 0, 0, 1, 220, 0]
 */
const matrixFromString = s => s.replace(/[^\d-,]/g, '').split(',').map(parseFloat)

/**
 * Parse a string describing a path node
 * @param  {String} s Node definition, e.g. '0 226 LINE'
 * @return {Array}    Node as an array, e.g. [0, 226, 'LINE']
 */
const nodeFromString = s => s.split(' ').map(i => parseFloat(i) || i)

/**
 * Convert a node array back to a string
 * @param  {Array} node Node array, e.g. [0, 226, 'LINE']
 * @return {String}     Node as a string, e.g. '0 226 LINE'
 */
const nodeToString = node => node.join(' ')

/**
 * Apply an affine transformation matrix to a node
 * @param  {Array} n Node definition, e.g. [0, 226, 'LINE']
 * @param  {Array} t Transform definition, e.g. [1, 0, 0, 1, 220, 0]
 * @return {Array}   Transformed node definition, e.g. [220, 226, 'LINE']
 */
const transformNode = (n, t) => [
  n[0] * t[0] + n[1] * t[2] + t[4],
  n[0] * t[1] + n[1] * t[3] + t[5],
  ...n.slice(2)
]

/**
 * Apply an affine transformation matrix to a path (an array of nodes)
 * @param  {Object} path   A path object including a nodes property
 * @param  {String} matrix A string describing a transformation matrix
 * @return {Object}        A path object with the transform applied to its nodes
 */
const transformPath = (path, matrix) => {
  const t = matrixFromString(matrix)
  let nodes = path.nodes.map(node => {
    const n = nodeFromString(node)
    return nodeToString(transformNode(n, t))
  })
  return Object.assign({}, path, { nodes })
}

/**
 * Expand component references for a glyph object
 * @param  {Object} glyph        A glyph object
 * @param  {Object} fontdata     The font data the glyph come from
 * @param  {Object} [options]
 * @param  {Number} [options.depth=0] The current recursion depth (internal use)
 * @param  {Number} [options.maxDepth=10] Maximum recursion depth
 * @return {Object} A glyph object with its component references expanded
 */
const expandGlyph = (glyph, fontdata, { depth = 0, maxDepth = 10 } = {}) => {
  const layers = glyph.layers.reduce((layers, layer) => {
    let newLayer = Object.assign({}, layer)

    if (!newLayer.hasOwnProperty('components')) {
      layers.push(newLayer)
      return layers
    }

    const id = newLayer.layerId
    const expandedPaths = newLayer.components.reduce((paths, component) => {
      let src = fontdata.glyphs.find(g => g.glyphname === component.name)
      if (!src) throw new Error('Source component not found')

      if (src.layers.filter(layer => layer.hasOwnProperty('components')).length) {
        if (depth >= maxDepth) throw new Error('Tried expanding components, but stopped after 10 recursions. The font may be corrupt or you can try increasing the maxDepth option.')
        src = expandGlyph(src, fontdata, { depth: depth + 1 })
      }

      const srcLayer = src.layers.find(layer => layer.layerId === id)
      if (!srcLayer) throw new Error('Source layer not found')

      srcLayer.paths.forEach(path => paths.push(transformPath(path, component.transform)))

      return paths
    }, [])

    if (!newLayer.paths) {
      newLayer.paths = expandedPaths
    } else {
      newLayer.paths.push(...expandedPaths)
    }
    delete newLayer.components

    layers.push(newLayer)
    return layers
  }, [])

  let newGlyph = glyph
  newGlyph.layers = layers

  return newGlyph
}

/**
 * Expand components into paths for all glyphs of a font
 * @param  {Object} fontdata An object representing a .glyphs font file
 * @param  {Object} [options]
 * @param  {Array}  [options.glyphs] Glyphs to expand. Defaults to all glyphs
 * @param  {Number} [options.maxDepth=10] Maximum recursion depth
 * @return {Object} An object representing a .glyphs font file
 */
module.exports = (fontdata, { glyphs, maxDepth = 10 } = {}) => {
  let font = CLONE_DEEP(fontdata)

  if (glyphs) glyphs = glyphs.map(UTILS.ensureUnicode)
  glyphs = new Set(glyphs || font.glyphs.map(g => g.unicode))

  font.glyphs = font.glyphs.reduce((expanded, glyph) => {
    if (glyphs.has(glyph.unicode)) {
      expanded.push(expandGlyph(glyph, font, { maxDepth }))
    } else {
      expanded.push(glyph)
    }
    return expanded
  }, [])

  return font
}
