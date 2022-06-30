const checksService = require('../services/checks.service')
const configService = require('../services/config.service')
const errors = require('../constants/errors')
const filesService = require('../services/files.service')
const gitService = require('../services/git.service')
const loggerService = require('../services/logger.service')
const messages = require('../constants/messages')
const { repoPath, relativeToRepoPath } = require('../util/path')

module.exports = (path, { file: isFile, name: defaultName }) => {
  const fullPath = repoPath(path)
  checksService.assertExists(fullPath, errors.fileNotFound)

  const name = templatesService.selectFreeName(path, defaultName, isFile)
  const relativePath = relativeToRepoPath(fullPath)

  if (isFile) {
    filesService.addFile(name, path)
    configService.addFile(name, relativePath)
  } else {
    filesService.addTemplate(name, path)
    configService.addTemplate(name, relativePath)
  }

  gitService.removeFileFromGit(fullPath)
  gitService.updateGitIgnore()

  loggerService.logSuccess(messages.fileAdded(path))
}
