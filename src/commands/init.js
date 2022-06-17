const {
  readFile,
  readJSON,
  repoPath,
  scriptPath,
  logError,
  writeFile,
  writeJSON
} = require('../util')

const fse = require('fs-extra')
const path = require('path')

const checkAlreadyExists = path => {
  if (fse.existsSync(path)) {
    logError('Failed to initialize. Envy has been already initialized')
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

const addGitIgnoreSection = () => {
  const gitignoreTemplate = `\n
# Envy files start
/src/api.js
/settings.json
# Envy files end
`
  const gitignorePath = repoPath('./.gitignore')
  const content = readFile(gitignorePath)
  const updatedContent = content + gitignoreTemplate

  writeFile(gitignorePath, updatedContent)
}

module.exports = destinationPath => {
  const envyPath = path.resolve(repoPath(destinationPath), 'envy')

  checkAlreadyExists(envyPath)
  copyTemplate(envyPath)
  addScripts()
  addGitIgnoreSection()

  console.log('Envy has been successfully initialized')
}
