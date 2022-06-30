const checksService = require('../services/checks.service')
const { variablerDirectoryPath } = require('../util/path')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const initializationService = require('../services/initialization.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')

module.exports = () => {
  checksService.assertNotExists(variablerDirectoryPath('.'), errors.alreadyInitialized)
  initializationService.init()
  gitService.updateGitIgnore()
  loggerService.logSuccess(messages.initialized)
}
