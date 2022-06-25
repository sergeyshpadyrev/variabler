const fse = require('fs-extra')
const json = require('jsonfile')
const { logError } = require('./logger')

const assert = (check, error) => {
  if (check) return

  logError(error)
  process.exit(1)
}
const checkExists = (path, error) => assert(fse.existsSync(path), error)
const checkNotExists = (path, error) => assert(!fse.existsSync(path), error)

const copyDirectory = (source, destination) => {
  fse.ensureDirSync(destination)
  fse.copySync(source, destination)
}

const readFile = path => fse.readFileSync(path, 'utf-8')
const writeFile = (path, content) => {
  fse.ensureFileSync(path)
  fse.writeFileSync(path, content)
}

const readJSON = path => json.readFileSync(path)
const writeJSON = (path, content) => json.writeFileSync(path, content, { spaces: 2 })

module.exports = {
  checkExists,
  checkNotExists,
  copyDirectory,
  readFile,
  readJSON,
  writeFile,
  writeJSON
}
