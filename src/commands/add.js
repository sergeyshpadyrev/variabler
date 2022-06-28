const { assertExists } = require('../util/files')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const { logSuccess } = require('../util/logger')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const templatesConfigService = require('../services/templatesConfig.service')

module.exports = (path, { name: defaultName }) => {
  assertExists(path, errors.fileNotFound)

  const name = templatesService.selectFreeName(path, defaultName)
  templatesService.addTemplate(name, path)
  templatesConfigService.addTemplate(name, path)

  gitService.updateGitIgnore()
  gitService.removeFileFromGit(path)

  logSuccess(messages.fileAdded(path))
}
