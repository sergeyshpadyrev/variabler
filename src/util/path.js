const path = require('path')

module.exports = {
  repoPath: filePath => path.resolve(process.cwd(), filePath),
  scriptPath: filePath => path.resolve(__dirname, '../..', filePath)
}
