const { configurationPath } = require('../util/path')
const { getVariables, getVariableKeysInTemplates } = require('../util/variables')
const { logDivider, logError, logInfo, logList, logWarning, logSuccess } = require('../util/logger')
const { readJSON } = require('../util/files')

module.exports = () => {
  let checkPassed = true

  try {
    const variablesConfig = readJSON(configurationPath('variables.json'))
    const variableKeysInTemplates = getVariableKeysInTemplates()

    logList('Variables in templates', variableKeysInTemplates)
    logDivider()

    const categoryKeys = Object.keys(variablesConfig).filter(key => key !== 'common')

    const getCategoryKeysCombinations = ([head, ...tail]) => {
      const categoryValues = Object.keys(variablesConfig[head])
      const headValues = categoryValues.map(categoryValue => ({ [head]: categoryValue }))
      const mergeWithChildren = value =>
        getCategoryKeysCombinations(tail).map(childValue => ({ ...value, ...childValue }))

      return tail.length > 0 ? headValues.flatMap(mergeWithChildren) : headValues
    }

    const categoryKeysCombinations = getCategoryKeysCombinations(categoryKeys)
    categoryKeysCombinations.forEach(categoriesCombination => {
      logInfo('Checking configuration', JSON.stringify(categoriesCombination))

      let combinationPassed = true

      try {
        const variables = getVariables(categoriesCombination, variablesConfig)
        const variablesKeys = Object.keys(variables)

        for (let i = 0; i < variableKeysInTemplates.length; i++) {
          const variableInTemplate = variableKeysInTemplates[i]
          if (!variablesKeys.includes(variableInTemplate)) {
            logError(`Value for variable "${variableInTemplate}" not found`)
            combinationPassed = false
            checkPassed = false
          }
        }

        for (let j = 0; j < variablesKeys.length; j++) {
          const variableKey = variablesKeys[j]
          if (!variableKeysInTemplates.includes(variableKey)) {
            logWarning(`Variable "${variableKey}" is not used in templates`)
          }
        }
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
