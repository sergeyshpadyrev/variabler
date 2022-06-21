const { logError, readFile, repoPath, scriptPath, writeFile } = require('../util')

const fse = require('fs-extra')
const path = require('path')

const checkAlreadyExists = directoryPath => {
  if (fse.existsSync(directoryPath)) {
    logError(
      'Variabler failed to initialize. It has been already initialized in the current directory'
    )
    process.exit(1)
  }
}

const copyTemplate = variablerPath => {
  fse.ensureDirSync(variablerPath)
  fse.copySync(scriptPath('../template'), variablerPath)
}

const addGitIgnoreSection = () => {
  const gitignoreTemplate = `\n
# <variabler>
/src/api.js
/settings.json
# </variabler>
`
  const gitignorePath = repoPath('./.gitignore')
  const content = readFile(gitignorePath)
  const updatedContent = content + gitignoreTemplate

  writeFile(gitignorePath, updatedContent)
}

module.exports = destinationPath => {
  const variablerPath = path.resolve(repoPath(destinationPath), 'variabler')

  checkAlreadyExists(variablerPath)
  copyTemplate(variablerPath)
  addGitIgnoreSection()

  console.log('Variabler has been successfully initialized')
}
