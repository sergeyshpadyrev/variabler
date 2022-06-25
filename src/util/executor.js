const { execSync } = require('child_process')

module.exports = {
  executeCommand: command => execSync(command, { encoding: 'utf-8' })
}
