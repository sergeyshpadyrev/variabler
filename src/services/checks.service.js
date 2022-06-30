const { checkExists } = require('../util/files')
const loggerService = require('./logger.service')

const assert = (check, error) => {
  if (check) return

  loggerService.logError(error)
  process.exit(1)
}

const checkFilesConsistency = ({ configFiles, files, onError }) => {
  configFiles.forEach(configFile => {
    if (!files.find(file => file.to === configFile.to)) {
      loggerService.logError(`Value for file "${configFile.id}" not found`)
      onError()
    }
  })
}

const checkVariablesConsistency = ({ onError, onWarning, templateVariableKeys, variables }) => {
  const variablesKeys = Object.keys(variables)

  templateVariableKeys.forEach(templateVariableKey => {
    if (!variablesKeys.includes(templateVariableKey)) {
      loggerService.logError(`Value for variable "${templateVariableKey}" not found`)
      onError()
    }
  })

  variablesKeys.forEach(variableKey => {
    if (!templateVariableKeys.includes(variableKey)) {
      loggerService.logWarning(`Variable "${variableKey}" is not used in templates`)
      onWarning()
    }
  })
}

module.exports = {
  assertExists: (path, error) => assert(checkExists(path), error),
  assertNotExists: (path, error) => assert(!checkExists(path), error),
  checkFilesConsistency,
  checkVariablesConsistency
}
