const { checkNotExists, copyDirectory, readFile, writeFile } = require('../util/files')
const { repoPath, scriptPath, variablerPath } = require('../util/path')

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
    variablerPath('.'),
    'FAILED: Variabler has been already initialized in the current directory'
  )
  copyDirectory(scriptPath('templates/default'), variablerPath('.'))
  addGitIgnoreSection()

  console.log('Variabler has been successfully initialized')
}
