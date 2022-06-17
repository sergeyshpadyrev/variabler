const json = require('jsonfile')
const fse = require('fs-extra')
const path = require('path')

const logError = (...args) => console.log('\x1b[31m%s\x1b[0m', ...args)

const repoPath = filePath => path.resolve(process.cwd(), filePath)
const scriptPath = filePath => path.resolve(__dirname, filePath)

const readFile = filePath => fse.readFileSync(filePath, 'utf-8')
const writeFile = (filePath, content) => {
  fse.ensureFileSync(filePath)
  fse.writeFileSync(filePath, content)
}

const readJSON = filePath => json.readFileSync(filePath)
const writeJSON = (filePath, content) => json.writeFileSync(filePath, content, { spaces: 2 })

module.exports = {
  logError,
  readFile,
  readJSON,
  repoPath,
  scriptPath,
  writeFile,
  writeJSON
}
