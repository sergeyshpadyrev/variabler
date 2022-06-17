const fse = require('fs-extra')
const path = require('path')

const getModuleRelativePath = filePath => path.resolve(__dirname, filePath)
const getRepositoryRelativePath = filePath => path.resolve(process.cwd(), filePath)

const copyDirectory = (sourcePath, destinationPath, destinationFolderName) => {
  const destinationDirectoryPath = path.resolve(
    getRepositoryRelativePath(destinationPath),
    destinationFolderName
  )
  fse.ensureDirSync(destinationDirectoryPath)
  fse.copySync(getModuleRelativePath(sourcePath), destinationDirectoryPath)
}
// const createDirectory = (parentDirectory, name) =>
//   fs.mkdir(path.resolve(getRepositoryRelativePath(parentDirectory), name))
const logError = (...args) => console.log('\x1b[31m%s\x1b[0m', ...args)
const readFile = filePath => fse.readFileSync(getRepositoryRelativePath(filePath), 'utf-8')
const readJSON = filePath => JSON.parse(readFile(filePath))
const writeFile = (filePath, content) => {
  const fullPath = getRepositoryRelativePath(filePath)
  fse.ensureFileSync(fullPath)
  fse.writeFileSync(fullPath, content)
}

module.exports = {
  copyDirectory,
  logError,
  readFile,
  readJSON,
  writeFile
}
