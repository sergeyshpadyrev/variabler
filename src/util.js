const fs = require('fs')
const path = require('path')

const getRepositoryRelativePath = filePath => path.resolve(process.cwd(), filePath)

const logError = (...args) => console.log('\x1b[31m%s\x1b[0m', ...args)
const readFile = filePath => fs.readFileSync(getRepositoryRelativePath(filePath), 'utf-8')
const readJSON = filePath => JSON.parse(readFile(filePath))
const writeFile = (filePath, content) =>
  fs.writeFileSync(getRepositoryRelativePath(filePath), content)

module.exports = {
  logError,
  readFile,
  readJSON,
  writeFile
}
