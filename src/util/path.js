const path = require('path')

const configPath = filePath => repoPath(`variabler/${filePath}`)
const gitignoreFormatPath = filePath => `/${path.relative(repoPath('.'), repoPath(filePath))}`
const repoPath = filePath => path.resolve(process.cwd(), filePath)
const scriptPath = filePath => path.resolve(__dirname, '../..', filePath)
const templatePath = filePath => configPath(`templates/${filePath}`)
const templatesConfigPath = () => configPath('templates.json')

module.exports = {
  configPath,
  gitignoreFormatPath,
  repoPath,
  scriptPath,
  templatePath,
  templatesConfigPath
}
