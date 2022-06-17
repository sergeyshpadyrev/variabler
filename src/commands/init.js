const { getRepositoryRelativePath, getScriptRelativePath } = require('../util')

const fse = require('fs-extra')
const path = require('path')

const copyDirectory = (sourcePath, destinationPath, directoryName) => {
  const destinationDirectoryPath = path.resolve(destinationPath, directoryName)
  fse.ensureDirSync(destinationDirectoryPath)
  fse.copySync(sourcePath, destinationDirectoryPath)
}

module.exports = destinationPath => {
  // TODO add check if envy directory already exists

  copyDirectory(
    getScriptRelativePath('../template'),
    getRepositoryRelativePath(destinationPath),
    'envy'
  )

  // TODO add envy:add to package.json scripts
  // TODO add envy:set to package.json scriptss
  // TODO add envy section to .gitignore
}
