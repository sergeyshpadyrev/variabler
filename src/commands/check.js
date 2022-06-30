const checksService = require('../services/checks.service')
const categoriesService = require('../services/categories.service')
const configService = require('../services/config.service')
const filesService = require('../services/files.service')
const loaderService = require('../services/loader.service')
const loggerService = require('../services/logger.service')

module.exports = () => {
  let checkPassed = true

  try {
    const templateVariableKeys = filesService.listTemplateVariableKeys()
    loggerService.logList('Variables in templates', templateVariableKeys)
    loggerService.logDivider()

    const categoryKeysCombinations = categoriesService.getAllCategoryKeysCombinations()
    categoryKeysCombinations.forEach(categoriesCombination => {
      loggerService.logInfo('Checking configuration', JSON.stringify(categoriesCombination))

      let combinationPassed = true
      const onError = () => {
        combinationPassed = false
        checkPassed = false
      }

      const { files, variables } = loaderService.load(categoriesCombination)
      try {
        checksService.checkVariablesConsistency({
          onError,
          templateVariableKeys,
          variables
        })

        const configFiles = configService.listFiles()
        checksService.checkFilesConsistency({
          configFiles,
          files,
          onError
        })
      } catch (error) {
        loggerService.logWarning(`Something went wrong. ${error.message}`)
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
