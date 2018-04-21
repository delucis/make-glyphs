const JOI = require('joi')

// Regular expression schema
const CODE = JOI.string().regex(
  /^[\w. -]+$/,
  'space-delimited glyph names'
)
const DATE = JOI.string().regex(
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}$/,
  '"YYYY-MM-DD HH:mm:ss +00:00" date'
)
const COORDS = JOI.string().regex(
  /^{-?\d+, -?\d+}$/,
  '{X, Y} co-ordinates'
)
const POSORDS = JOI.string().regex(
  /^{\d+, \d+}$/,
  '{X, Y} always positive, i.e. co-ordinates, scaling pairs etc.'
)
const MATRIX = JOI.string().regex(
  /^{(-?\d+, ){5}-?\d+}$/,
  '{m11, m12, m21, m22, tX, tY} affine transformation matrix'
)
const NODE = JOI.string().regex(
  /^([-+]?[0-9]*\.?[0-9]+ ){2}(LINE|CURVE|OFFCURVE)( SMOOTH)?$/,
  'node definition'
)

// Common schema
const ONLY_IF_ON = [
  JOI.number().only(1).strict(false),
  JOI.number().only(0).strict(false).strip()
]
const ONLY_IF_NONZERO = [
  JOI.number().not(0).integer().strict(false),
  JOI.number().equal(0).strict(false).strip()
]
const ONLY_IF_NOT_100 = [
  JOI.number().not(100).integer().strict(false),
  JOI.number().equal(100).strict(false).strip()
]
const INT = JOI.number().integer().strict(false)

const SCHEMA = JOI.object().keys({
  '.appVersion': INT,
  DisplayStrings: JOI.array().items(JOI.string()),
  classes: JOI.array().items(JOI.object().keys({
    automatic: ONLY_IF_ON,
    code: CODE,
    name: JOI.string()
  })),
  copyright: JOI.string(),
  customParameters: JOI.array().items(JOI.object().keys({
    name: JOI.string(),
    value: [JOI.string(), JOI.array()]
  })),
  date: DATE,
  designer: JOI.string(),
  designerURL: JOI.string().uri(),
  disablesNiceNames: ONLY_IF_ON,
  familyName: JOI.string().required(),
  featurePrefixes: JOI.array().items(JOI.object().keys({
    automatic: ONLY_IF_ON,
    code: JOI.string(),
    name: JOI.string()
  })),
  features: JOI.array().items(JOI.object().keys({
    automatic: ONLY_IF_ON,
    code: JOI.string(),
    name: JOI.string()
  })),
  fontMaster: JOI.array().required().min(1).items(JOI.object().keys({
    alignmentZones: JOI.array(),
    ascender: INT,
    capHeight: INT,
    custom: JOI.string(),
    customParameters: JOI.array().items(JOI.object().keys({
      name: JOI.string(),
      value: JOI.string()
    })),
    customValue: ONLY_IF_NONZERO,
    customValue1: ONLY_IF_NONZERO,
    customValue2: ONLY_IF_NONZERO,
    customValue3: ONLY_IF_NONZERO,
    descender: JOI.number().integer().less(0).strict(false),
    horizontalStems: JOI.array().items(INT),
    iconName: JOI.string(),
    id: JOI.string().required(),
    userData: JOI.object(),
    weight: JOI.string(),
    weightValue: ONLY_IF_NOT_100,
    width: JOI.string(),
    widthValue: ONLY_IF_NOT_100,
    verticalStems: JOI.array().items(INT),
    xHeight: INT
  })),
  glyphs: JOI.array().items(JOI.object().keys({
    glyphname: JOI.string(),
    production: JOI.string(),
    script: JOI.string(),
    category: JOI.string(),
    color: [
      INT,
      JOI.array().length(4).items(JOI.number().min(0).max(255).strict(false))
    ],
    subcategory: JOI.string(),
    lastChange: DATE,
    layers: JOI.array().items(JOI.object().keys({
      anchors: JOI.array().items(JOI.object().keys({
        name: JOI.string(),
        position: COORDS
      })),
      associatedMasterId: JOI.string(),
      background: JOI.object(),
      components: JOI.array().items(JOI.object().keys({
        anchor: JOI.string(),
        name: JOI.string(),
        transform: MATRIX,
        alignment: JOI.number().valid(-1, 0, 1).strict(false),
        disableAlignment: ONLY_IF_ON
      })),
      guideLines: JOI.array().items(JOI.object().keys({
        alignment: JOI.string().valid('left', 'center', 'right'),
        angle: JOI.number().strict(false),
        locked: ONLY_IF_ON,
        showMeasurement: ONLY_IF_ON,
        position: COORDS
      })),
      hints: JOI.array().items(JOI.object().keys({
        horizontal: INT,
        type: JOI.string().valid('TTStem', 'TopGhost', 'BottomGhost', 'Anchor', 'Align', 'Interpolate', 'Diagonal', 'Tag', 'Corner', 'Cap', 'Stem', 'Ghost'),
        origin: POSORDS,
        target: [POSORDS, JOI.string().valid('up', 'down')],
        other1: POSORDS,
        other2: POSORDS,
        scale: POSORDS,
        stem: INT,
        options: INT
      })),
      layerId: JOI.string(),
      leftMetricsKey: JOI.string(),
      rightMetricsKey: JOI.string(),
      widthMetricsKey: JOI.string(),
      name: JOI.string(),
      paths: JOI.array().items(JOI.object().keys({
        closed: ONLY_IF_ON,
        nodes: JOI.array().items(NODE)
      })),
      userDate: JOI.object(),
      vertWidth: JOI.number().strict(false),
      width: JOI.number().strict(false),
      visible: ONLY_IF_ON
    })),
    leftKerningGroup: JOI.string(),
    leftMetricsKey: JOI.string(),
    rightKerningGroup: JOI.string(),
    rightMetricsKey: JOI.string(),
    note: JOI.string(),
    unicode: JOI.string().hex()
  })),
  instances: JOI.array().items(JOI.object()),
  kerning: JOI.object().pattern(
    /.+/, JOI.object().pattern(
      /.+/, JOI.object().pattern(
        /.+/, JOI.string()
      )
    )
  ),
  manufacturer: JOI.string(),
  manufacturerURL: JOI.string().uri(),
  unitsPerEm: INT,
  userData: JOI.object(),
  versionMajor: INT.required(),
  versionMinor: JOI.number().min(0).max(999).integer().strict(false)
})

module.exports = obj => JOI.validate(obj, SCHEMA)
