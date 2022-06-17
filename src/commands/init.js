const { readJSON, repoPath, scriptPath, logError, writeJSON } = require('../util')

const fse = require('fs-extra')
const path = require('path')

const checkAlreadyExists = path => {
  if (fse.existsSync(path)) {
    logError('Failed to initialize. Envy has already been initialized in the repository')
    process.exit(1)
  }
}

const copyTemplate = envyPath => {
  fse.ensureDirSync(envyPath)
  fse.copySync(scriptPath('../template'), envyPath)
}

const addScripts = () => {
  const packagePath = repoPath('./package.json')
  const packageContent = readJSON(packagePath)
  packageContent.scripts = {
    ...packageContent.scripts,
    'envy:add': 'react-native-envy add',
    'envy:set': 'react-native-envy set'
  }
  writeJSON(packagePath, packageContent)
}

module.exports = destinationPath => {
  const envyPath = path.resolve(repoPath(destinationPath), 'envy')

  checkAlreadyExists(envyPath)
  copyTemplate(envyPath)
  addScripts()

  // TODO add success message
  // TODO add envy section to .gitignore
}
