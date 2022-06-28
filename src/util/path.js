const path = require('path')

const basename = filePath => path.basename(filePath)
const configPath = (filePath = '.') => repoPath(`variabler/${filePath}`)
const gitignoreFormatPath = filePath => `/${path.relative(repoPath('.'), repoPath(filePath))}`
const repoPath = (filePath = '.') => path.resolve(process.cwd(), filePath)
const scriptPath = (filePath = '.') => path.resolve(__dirname, '../..', filePath)
const templatePath = filePath => configPath(`templates/${filePath}`)
const templatesConfigPath = () => configPath('templates.json')
const variablesConfigPath = () => configPath('variables.json')

module.exports = {
  basename,
  configPath,
  gitignoreFormatPath,
  repoPath,
  scriptPath,
  templatePath,
  templatesConfigPath,
  variablesConfigPath
}
