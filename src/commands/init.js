const assertionService = require('../services/assertion.service')
const { configPath, scriptPath } = require('../util/path')
const { copyDirectory } = require('../util/files')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const initialData = require('../constants/initialData')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const templatesConfigService = require('../services/templatesConfig.service')
const variablesConfigService = require('../services/variablesConfig.service')

module.exports = () => {
  const path = configPath('.')
  assertionService.assertNotExists(path, errors.alreadyInitialized)

  templatesService.init()
  templatesConfigService.init()
  variablesConfigService.init()

  gitService.updateGitIgnore()
  loggerService.logSuccess(messages.initialized)
}
