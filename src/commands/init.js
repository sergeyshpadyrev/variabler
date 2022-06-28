const { checkNotExists, copyDirectory } = require('../util/files')
const { configurationPath, scriptPath } = require('../util/path')
const { logSuccess } = require('../util/logger')
const { updateGitIgnore } = require('../util/git')

module.exports = () => {
  checkNotExists(
    configurationPath('.'),
    'Variabler has been already initialized in the current directory'
  )
  copyDirectory(scriptPath('templates/default'), configurationPath('.'))
  updateGitIgnore()

  logSuccess('Variabler has been initialized')
}
