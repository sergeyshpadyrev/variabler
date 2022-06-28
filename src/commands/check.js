const { getAllCategoryKeysCombinations } = require('../util/categories')
const { getVariables, getVariableKeysInTemplates } = require('../util/variables')
const loggerService = require('../services/logger.service')

module.exports = () => {
  let checkPassed = true

  try {
    const variableKeysInTemplates = getVariableKeysInTemplates()

    loggerService.logList('Variables in templates', variableKeysInTemplates)
    loggerService.logDivider()

    const categoryKeysCombinations = getAllCategoryKeysCombinations()
    categoryKeysCombinations.forEach(categoriesCombination => {
      loggerService.logInfo('Checking configuration', JSON.stringify(categoriesCombination))

      let combinationPassed = true

      try {
        const variables = getVariables(categoriesCombination)
        const variablesKeys = Object.keys(variables)

        variableKeysInTemplates.forEach(variableInTemplate => {
          if (!variablesKeys.includes(variableInTemplate)) {
            loggerService.logError(`Value for variable "${variableInTemplate}" not found`)
            combinationPassed = false
            checkPassed = false
          }
        })

        variablesKeys.forEach(variableKey => {
          if (!variableKeysInTemplates.includes(variableKey)) {
            loggerService.logWarning(`Variable "${variableKey}" is not used in templates`)
          }
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
