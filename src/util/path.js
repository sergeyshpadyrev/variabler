const path = require('path')

const basename = filePath => path.basename(filePath)
const gitignoreFormatPath = filePath => `/${path.relative(repoPath('.'), repoPath(filePath))}`

// TODO make repo path the one where variabler folder is found
const repoPath = (filePath = '.') => path.resolve(process.cwd(), filePath)
const variablerNodeModulePath = (filePath = '.') => path.resolve(__dirname, '../..', filePath)
const variablerDirectoryPath = (filePath = '.') => repoPath(`variabler/${filePath}`)

const configPath = () => variablerDirectoryPath('config.json')
const filePath = (filePath = '.') => variablerDirectoryPath(`files/${filePath}`)
const templatePath = (filePath = '.') => variablerDirectoryPath(`templates/${filePath}`)

module.exports = {
  basename,
  gitignoreFormatPath,

  repoPath,
  variablerNodeModulePath,
  variablerDirectoryPath,

  configPath,
  filePath,
  templatePath
}
