const path = require('path')

const repoPath = filePath => path.resolve(process.cwd(), filePath)
const scriptPath = filePath => path.resolve(__dirname, '../..', filePath)
const variablerPath = filePath => repoPath(`variabler/${filePath}`)

module.exports = {
  repoPath,
  scriptPath,
  variablerPath
}
