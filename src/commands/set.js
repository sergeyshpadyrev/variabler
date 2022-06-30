const categoriesService = require('../services/categories.service')
const configService = require('../services/config.service')
const { copyFile, readFile, writeFile } = require('../util/files')
const { filePath, repoPath, templatePath } = require('../util/path')
const loggerService = require('../services/logger.service')
const variablesService = require('../services/variables.service')

// TODO add files support
module.exports = passedCategories => {
  try {
    const categories = categoriesService.selectCategories(passedCategories)
    const templates = configService.listTemplates()
    const templateVariableKeys = variablesService.listTemplateVariableKeys()
    const { files, variables } = variablesService.loadVariables(categories)
    const filesToLog = files.map(({ from }) => from).sort()
    const createdFilesToLog = [...templates, ...files].map(({ to }) => to).sort()

    variablesService.checkConsistency({
      onError: templateVariableKey => {
        loggerService.logError(
          `Value for variable "${templateVariableKey}" not found in current configuration`
        )
        process.exit(1)
      },
      onWarning: variableKey =>
        loggerService.logWarning(`Variable "${variableKey}" is not used in templates`),
      templateVariableKeys,
      variables
    })

    const processTemplate = ({ from, to }) => {
      const templateFilePath = templatePath(from)
      const content = readFile(templateFilePath)
      const contentWithSubstitutions = variablesService.fillVariables(content, variables)
      writeFile(repoPath(to), contentWithSubstitutions)
    }

    const processFile = ({ from, to }) => {
      const source = filePath(from)
      const destination = repoPath(to)
      copyFile(source, destination)
    }

    templates.forEach(processTemplate)
    files.forEach(processFile)

    loggerService.logSuccess(`Variables have been set`)
    loggerService.logList('Params', categories)
    loggerService.logList('Files', filesToLog)
    loggerService.logList('Variables', variables)
    loggerService.logList('Created Files', createdFilesToLog)
  } catch (error) {
    loggerService.logError(error.message)
  }
}
