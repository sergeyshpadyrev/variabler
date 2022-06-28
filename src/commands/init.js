const { checkNotExists, copyDirectory } = require('../util/files')
const { configPath, scriptPath } = require('../util/path')
const { logSuccess } = require('../util/logger')
const { updateGitIgnore } = require('../util/git')

module.exports = () => {
  checkNotExists(configPath('.'), 'Variabler has been already initialized in the current directory')
  copyDirectory(scriptPath('templates/default'), configPath('.'))
  updateGitIgnore()

  logSuccess('Variabler has been initialized')
}
