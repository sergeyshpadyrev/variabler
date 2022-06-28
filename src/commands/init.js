const { assertNotExists, copyDirectory } = require('../util/files')
const { configPath, scriptPath } = require('../util/path')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const { logSuccess } = require('../util/logger')
const messages = require('../constants/messages')

module.exports = () => {
  assertNotExists(configPath('.'), errors.alreadyInitialized)
  copyDirectory(scriptPath('templates/default'), configPath('.'))
  gitService.updateGitIgnore()
  logSuccess(messages.initialized)
}
