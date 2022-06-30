const checksService = require('../services/checks.service')
const configService = require('../services/config.service')
const errors = require('../constants/errors')
const gitService = require('../services/git.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const templatesService = require('../services/templates.service')
const { repoPath, relativeToRepoPath } = require('../util/path')

module.exports = (path, { file: isFile, name: defaultName }) => {
  const fullPath = repoPath(path)
  checksService.assertExists(fullPath, errors.fileNotFound)

  const name = templatesService.selectFreeName(path, defaultName)
  const relativePath = relativeToRepoPath(fullPath)

  if (isFile) {
    templatesService.addFile(name, path)
    configService.addFile(name, relativePath)
  } else {
    templatesService.addTemplate(name, path)
    configService.addTemplate(name, relativePath)
  }

  gitService.removeFileFromGit(fullPath)
  gitService.updateGitIgnore()

  loggerService.logSuccess(messages.fileAdded(path))
}
