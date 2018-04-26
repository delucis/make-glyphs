#! /usr/bin/env node
const FS = require('fs')
const PATH = require('path')
const BUILD = require('../').build
const V = require('../package.json').version
const ARGS = require('minimist')(process.argv.slice(2), {
  alias: {
    b: 'build',
    c: 'config',
    h: 'help',
    v: 'version'
  },
  boolean: ['h', 'v'],
  default: {
    c: 'glyphs.config.js'
  }
})

if (ARGS.help) {
  console.log(`
    Description
      Processes .glyphs files according to your config file
    Usage
      $ make-glyphs [options]
    Options
      --build, -b <name>    Only run the named build in your config file
      --config, -c <file>   The path to your config file, default: glyphs.config.js
      --help, -h            Displays this message
      --version, -v         Display the version of make-glyphs you are using
  `)
  process.exit(0)
}

if (ARGS.version) {
  console.log(V)
  process.exit(0)
}

const ROOT = PATH.resolve(ARGS._[0] || '.')
const CONFIGFILE = PATH.resolve(ROOT, ARGS.config)

let config = {}
if (FS.existsSync(CONFIGFILE)) {
  config = require(CONFIGFILE)
} else {
  console.error(`Could not find config file ${ARGS.config}`)
  process.exit(1)
}

if (!config.builds) {
  console.error(`Config file does not contain a “builds” object`)
  process.exit(1)
}
BUILD(config.builds)

