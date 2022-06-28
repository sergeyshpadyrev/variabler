const categoriesService = require('../services/categories.service')
const loggerService = require('../services/logger.service')
const variablesService = require('../services/variables.service')

module.exports = () => {
  let checkPassed = true

  try {
    const templateVariableKeys = variablesService.listTemplateVariableKeys()
    loggerService.logList('Variables in templates', templateVariableKeys)
    loggerService.logDivider()

    const categoryKeysCombinations = categoriesService.getAllCategoryKeysCombinations()
    categoryKeysCombinations.forEach(categoriesCombination => {
      loggerService.logInfo('Checking configuration', JSON.stringify(categoriesCombination))

      let combinationPassed = true

      try {
        variablesService.checkConsistency({
          onError: templateVariableKey => {
            loggerService.logError(`Value for variable "${templateVariableKey}" not found`)
            combinationPassed = false
            checkPassed = false
          },
          onWarning: variableKey =>
            loggerService.logWarning(`Variable "${variableKey}" is not used in templates`),
          templateVariableKeys,
          variables: variablesService.loadVariables(categoriesCombination)
        })
      } catch (error) {
        loggerService.logWarning(`Cannot check. ${error}`)
      } finally {
        if (combinationPassed) console.info('Check passed')
        loggerService.logDivider()
      }
    })
  } catch (error) {
    loggerService.logError(`Something went wrong. ${error.message}`)
    process.exit(1)
  } finally {
    if (checkPassed) {
      loggerService.logSuccess('All checks passed')
      return
    }

    loggerService.logError('Some of checks failed')
    process.exit(1)
  }
}
