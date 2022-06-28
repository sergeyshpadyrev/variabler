const { fillVariables, getVariables, getVariableKeysInTemplates } = require('../util/variables')
const { readFile, writeFile } = require('../util/files')
const { logError, logList, logSuccess } = require('../util/logger')
const { repoPath, templatePath } = require('../util/path')
const { selectCategories } = require('../util/categories')
const templatesConfigService = require('../services/templatesConfig.service')

module.exports = passedCategories => {
  try {
    const categories = selectCategories(passedCategories)
    const variables = getVariables(categories)

    const variableKeysInTemplates = getVariableKeysInTemplates()
    variableKeysInTemplates.forEach(variableInTemplate => {
      if (!variables.hasOwnProperty(variableInTemplate)) {
        logError(`Value for variable "${variableInTemplate}" not found in current configuration`)
        process.exit(1)
      }
    })

    const processTemplate = ({ from, to }) => {
      const templateFilePath = templatePath(from)
      const content = readFile(templateFilePath)
      const contentWithSubstitutions = fillVariables(content, variables)
      writeFile(repoPath(to), contentWithSubstitutions)
    }

    const templatePaths = templatesConfigService.listTemplates()
    templatePaths.forEach(file => processTemplate(file, variables))

    logSuccess(`Variables have been set`)
    logList('Params', categories)
    logList('Variables', variables)
  } catch (error) {
    logError(error.message)
  }
}
