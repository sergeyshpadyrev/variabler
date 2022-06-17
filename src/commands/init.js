const { repoPath, scriptPath, logError } = require('../util')

const fse = require('fs-extra')
const path = require('path')

const checkAlreadyExists = path => {
  if (fse.existsSync(path)) {
    logError('Failed to initialize. Envy has already been initialized in the repository')
    process.exit(1)
  }
}

const copyDirectory = (sourcePath, destinationPath) => {
  fse.ensureDirSync(destinationPath)
  fse.copySync(sourcePath, destinationPath)
}

module.exports = destinationPath => {
  const envyPath = path.resolve(repoPath(destinationPath), 'envy')

  checkAlreadyExists(envyPath)
  copyDirectory(scriptPath('../template'), envyPath)

  // TODO add envy:add to package.json scripts
  // TODO add envy:set to package.json scriptss
  // TODO add envy section to .gitignore
}
