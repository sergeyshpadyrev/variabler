const fse = require('fs-extra')
const path = require('path')

const getScriptRelativePath = filePath => path.resolve(__dirname, filePath)
const getRepositoryRelativePath = filePath => path.resolve(process.cwd(), filePath)

const logError = (...args) => console.log('\x1b[31m%s\x1b[0m', ...args)

const readFile = filePath => fse.readFileSync(filePath, 'utf-8')
const readJSON = filePath => JSON.parse(readFile(filePath))
const writeFile = (filePath, content) => {
  fse.ensureFileSync(filePath)
  fse.writeFileSync(filePath, content)
}

module.exports = {
  getScriptRelativePath,
  getRepositoryRelativePath,
  logError,
  readFile,
  readJSON,
  writeFile
}
