const json = require('jsonfile')
const fse = require('fs-extra')

const readFile = filePath => fse.readFileSync(filePath, 'utf-8')
const writeFile = (filePath, content) => {
  fse.ensureFileSync(filePath)
  fse.writeFileSync(filePath, content)
}

const readJSON = filePath => json.readFileSync(filePath)
const writeJSON = (filePath, content) => json.writeFileSync(filePath, content, { spaces: 2 })

module.exports = {
  readFile,
  readJSON,
  writeFile,
  writeJSON
}
