const TASKS = new Set(['map', 'set', 'subset', 'validate', 'version'])
const FUNCTIONS = new Set([...TASKS, 'load', 'write'])
const G = [...FUNCTIONS].reduce((obj, fn) => {
  obj[fn] = require(`./${fn}`)
  return obj
}, {})

const run = (data, tasks) => {
  return tasks.reduce((fontdata, [task, ...args]) => {
    if (TASKS.has(task)) return G[task](fontdata, ...args)
    console.warn(`Task type “${task}” is unknown, should be one of “map”, “set”, “subset”, “validate”, or “version”.`)
    return fontdata
  }, data)
}

module.exports = async builds => {
  await Promise.all(Object.entries(builds).map(async ([name, build]) => {
    console.log(`Running build “${name}”...`)
    if (!build.hasOwnProperty('load')) {
      throw new TypeError(`Build “${name}” must have a load property!`)
    }
    if (!build.hasOwnProperty('write')) {
      throw new TypeError(`Build “${name}” must have a write property!`)
    }

    let sources = []
    if (typeof build.load === 'string') {
      sources.push(G.load(build.load))
    } else if (Array.isArray(build.load)) {
      sources = build.load.map(G.load)
    } else {
      sources = Object.entries(build.load).map(async ([file, tasks]) => {
        return G.load(file).then(fontdata => run(fontdata, tasks))
      })
    }
    sources = await Promise.all(sources)

    let merged
    if (sources.length > 1) {
      // TODO: more than one file loaded so merging required
    } else {
      merged = sources[0]
    }

    let processed = merged
    if (build.process) {
      processed = run(processed, build.process)
    }

    console.log(`Writing to ${build.write}...`)
    return G.write(build.write, processed)
      .then(() => console.log(`Finished build “${name}”!`))
  }))
}
