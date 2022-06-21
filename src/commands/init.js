const { logError, readFile, repoPath, scriptPath, writeFile } = require('../util')

const fse = require('fs-extra')
const path = require('path')

const checkAlreadyExists = directoryPath => {
  if (fse.existsSync(directoryPath)) {
    logError('Failed to initialize. Envy has been already initialized')
    process.exit(1)
  }
}

const copyTemplate = envyPath => {
  fse.ensureDirSync(envyPath)
  fse.copySync(scriptPath('../template'), envyPath)
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
  addGitIgnoreSection()

  console.log('Envy has been successfully initialized')
}
