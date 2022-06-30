const assertionService = require('../services/assertion.service')
const configService = require('../services/config.service')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const { repoPath, relativeToRepoPath } = require('../util/path')

// TODO add --file option
module.exports = (path, { name: defaultName }) => {
  const fullPath = repoPath(path)
  assertionService.assertExists(fullPath, errors.fileNotFound)

  const name = templatesService.selectFreeName(path, defaultName)
  templatesService.addTemplate(name, path)
  gitService.removeFileFromGit(fullPath)
  configService.addTemplate(name, relativeToRepoPath(fullPath))
  gitService.updateGitIgnore()

  loggerService.logSuccess(messages.fileAdded(path))
}
