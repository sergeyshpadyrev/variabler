const assertionService = require('../services/assertion.service')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const templatesConfigService = require('../services/templatesConfig.service')
const { repoPath } = require('../util/path')

module.exports = (path, { name: defaultName }) => {
  const fullPath = repoPath(path)
  assertionService.assertExists(fullPath, errors.fileNotFound)

  const name = templatesService.selectFreeName(fullPath, defaultName)
  templatesService.addTemplate(name, fullPath)
  templatesConfigService.addTemplate(name, fullPath)

  gitService.updateGitIgnore()
  gitService.removeFileFromGit(fullPath)

  loggerService.logSuccess(messages.fileAdded(path))
}
