const { configPath } = require('./path')
const fse = require('fs-extra')
const json = require('jsonfile')

const checkExists = path => fse.existsSync(path)
const copyFile = (source, destination) => fse.copyFileSync(source, destination)
const ensureDirectory = path => fse.ensureDirSync(path)

const loadTemplatePaths = () => readJSON(configPath('templates.json'))
const loadVariablesConfig = () => readJSON(configPath('variables.json'))

const readFile = path => fse.readFileSync(path, 'utf-8')
const writeFile = (path, content) => {
  fse.ensureFileSync(path)
  fse.writeFileSync(path, content)
}

const readJSON = path => json.readFileSync(path)
const writeJSON = (path, content) => json.writeFileSync(path, content, { spaces: 2 })

module.exports = {
  checkExists,
  copyFile,
  ensureDirectory,
  loadTemplatePaths,
  loadVariablesConfig,
  readFile,
  readJSON,
  writeFile,
  writeJSON
}
