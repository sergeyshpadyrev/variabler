const assertionService = require('../services/assertion.service')
const { configPath } = require('../util/path')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const templatesConfigService = require('../services/templatesConfig.service')
const variablesService = require('../services/variables.service')

module.exports = () => {
  assertionService.assertNotExists(configPath('.'), errors.alreadyInitialized)

  templatesService.init()
  templatesConfigService.init()
  variablesService.init()

  gitService.updateGitIgnore()
  loggerService.logSuccess(messages.initialized)
}
