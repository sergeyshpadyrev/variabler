const categoriesService = require('../services/categories.service')
const { readFile, writeFile } = require('../util/files')
const loggerService = require('../services/logger.service')
const { repoPath, templatePath } = require('../util/path')
const templatesConfigService = require('../services/templatesConfig.service')
const variablesService = require('../services/variables.service')

module.exports = passedCategories => {
  try {
    const categories = categoriesService.selectCategories(passedCategories)
    const templateVariableKeys = variablesService.listTemplateVariableKeys()
    const variables = variablesService.loadVariables(categories)

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

    const templatePaths = templatesConfigService.listTemplates()
    templatePaths.forEach(file => processTemplate(file, variables))

    loggerService.logSuccess(`Variables have been set`)
    loggerService.logList('Params', categories)
    loggerService.logList('Variables', variables)
  } catch (error) {
    loggerService.logError(error.message)
  }
}
