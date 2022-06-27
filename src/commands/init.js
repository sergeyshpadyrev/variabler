const { checkNotExists, copyDirectory, readFile, writeFile } = require('../util/files')
const { configurationPath, repoPath, scriptPath } = require('../util/path')
const { logSuccess } = require('../util/logger')

const addGitIgnoreSection = () => {
  const gitignoreTemplate = `\n
# <variabler>
/src/api.js
/settings.json
# </variabler>
`
  const gitignorePath = repoPath('.gitignore')
  const content = readFile(gitignorePath)
  const updatedContent = content + gitignoreTemplate

  writeFile(gitignorePath, updatedContent)
}

module.exports = () => {
  checkNotExists(
    configurationPath('.'),
    'Variabler has been already initialized in the current directory'
  )
  copyDirectory(scriptPath('templates/default'), configurationPath('.'))
  addGitIgnoreSection()

  logSuccess('Variabler has been initialized')
}
