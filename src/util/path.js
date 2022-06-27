const path = require('path')

const configurationPath = filePath => repoPath(`variabler/${filePath}`)
const repoPath = filePath => path.resolve(process.cwd(), filePath)
const scriptPath = filePath => path.resolve(__dirname, '../..', filePath)

module.exports = {
  configurationPath,
  repoPath,
  scriptPath
}
