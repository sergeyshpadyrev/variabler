const { getAllCategoryKeysCombinations } = require('../util/categories')
const { getVariables, getVariableKeysInTemplates } = require('../util/variables')
const { logDivider, logError, logInfo, logList, logWarning, logSuccess } = require('../util/logger')

module.exports = () => {
  let checkPassed = true

  try {
    const variableKeysInTemplates = getVariableKeysInTemplates()

    logList('Variables in templates', variableKeysInTemplates)
    logDivider()

    const categoryKeysCombinations = getAllCategoryKeysCombinations()
    categoryKeysCombinations.forEach(categoriesCombination => {
      logInfo('Checking configuration', JSON.stringify(categoriesCombination))

      let combinationPassed = true

      try {
        const variables = getVariables(categoriesCombination)
        const variablesKeys = Object.keys(variables)

        variableKeysInTemplates.forEach(variableInTemplate => {
          if (!variablesKeys.includes(variableInTemplate)) {
            logError(`Value for variable "${variableInTemplate}" not found`)
            combinationPassed = false
            checkPassed = false
          }
        })

        variablesKeys.forEach(variableKey => {
          if (!variableKeysInTemplates.includes(variableKey)) {
            logWarning(`Variable "${variableKey}" is not used in templates`)
          }
        })
      } catch (error) {
        logWarning(`Cannot check. ${error}`)
      } finally {
        if (combinationPassed) console.info('Check passed')
        logDivider()
      }
    })
  } catch (error) {
    logError(`Something went wrong. ${error.message}`)
    process.exit(1)
  } finally {
    if (checkPassed) {
      logSuccess('All checks passed')
      return
    }

    logError('Some of checks failed')
    process.exit(1)
  }
}
