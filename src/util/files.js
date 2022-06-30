const fse = require('fs-extra')
const json = require('jsonfile')

const checkExists = path => fse.existsSync(path)
const copyFile = (source, destination) => {
  fse.ensureFileSync(destination)
  fse.copyFileSync(source, destination)
}

const readFile = path => fse.readFileSync(path, 'utf-8')
const writeFile = (path, content) => {
  fse.ensureFileSync(path)
  fse.writeFileSync(path, content)
}

const readJSON = path => json.readFileSync(path)
const writeJSON = (path, content) => {
  fse.ensureFileSync(path)
  json.writeFileSync(path, content, { spaces: 2 })
}

module.exports = {
  checkExists,
  copyFile,
  readFile,
  readJSON,
  writeFile,
  writeJSON
}
