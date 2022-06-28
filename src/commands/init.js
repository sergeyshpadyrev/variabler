const { checkNotExists, copyDirectory } = require('../util/files')
const { configPath, scriptPath } = require('../util/path')
const gitService = require('../services/git.service')
const { logSuccess } = require('../util/logger')

module.exports = () => {
  checkNotExists(configPath('.'), 'Variabler has been already initialized in the current directory')
  copyDirectory(scriptPath('templates/default'), configPath('.'))
  gitService.updateGitIgnore()
  logSuccess('Variabler has been initialized')
}
