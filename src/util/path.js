const path = require('path')

const basename = filePath => path.basename(filePath)

// TODO make repo path the one where variabler folder is found
const repoPath = (filePath = '.') => path.resolve(process.cwd(), filePath)
const relativeToRepoPath = filePath => path.relative(repoPath('.'), repoPath(filePath))
const gitignoreFormatPath = filePath => `/${relativeToRepoPath(filePath)}`
const variablerNodeModulePath = (filePath = '.') => path.resolve(__dirname, '../..', filePath)
const variablerDirectoryPath = (filePath = '.') => repoPath(`variabler/${filePath}`)

const configPath = () => variablerDirectoryPath('config.json')
const filePath = (filePath = '.') => variablerDirectoryPath(`files/${filePath}`)
const templatePath = (filePath = '.') => variablerDirectoryPath(`templates/${filePath}`)

module.exports = {
  basename,

  repoPath,
  relativeToRepoPath,
  gitignoreFormatPath,
  variablerNodeModulePath,
  variablerDirectoryPath,

  configPath,
  filePath,
  templatePath
}
