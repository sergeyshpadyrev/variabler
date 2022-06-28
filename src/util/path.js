const path = require('path')

const configPath = filePath => repoPath(`variabler/${filePath}`)
const gitignorePath = filePath => `/${path.relative(repoPath('.'), repoPath(filePath))}`
const repoPath = filePath => path.resolve(process.cwd(), filePath)
const scriptPath = filePath => path.resolve(__dirname, '../..', filePath)

module.exports = {
  configPath,
  gitignorePath,
  repoPath,
  scriptPath
}
