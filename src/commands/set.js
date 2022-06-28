const { configurationPath, repoPath } = require('../util/path')
const { getUserInput } = require('../util/input')
const { fillVariables, getVariables, getVariableKeysInTemplates } = require('../util/variables')
const { logError, logList, logSuccess } = require('../util/logger')
const { readFile, readJSON, writeFile } = require('../util/files')
const { sortListByKeys } = require('../util/common')

const getCategories = (passedCategories, variablesConfig) => {
  const categories = Object.assign(
    {},
    ...passedCategories.map(category => {
      const splitted = category.split(':')
      const categoryKey = splitted[0]
      const categoryValue = splitted[1]
      return { [categoryKey]: categoryValue }
    })
  )

  Object.keys(categories).forEach(categoryKey => {
    const categoryValue = categories[categoryKey]

    if (!variablesConfig.hasOwnProperty(categoryKey))
      throw new Error(`Key ${categoryKey} not found in variables`)
    if (!variablesConfig[categoryKey].hasOwnProperty(categoryValue))
      throw new Error(`Key ${categoryValue} not found in ${categoryKey} variables`)
  })

  Object.keys(variablesConfig)
    .filter(categoryKey => categoryKey !== 'common')
    .forEach(categoryKey => {
      if (categories.hasOwnProperty(categoryKey)) return

      const categoryValues = Object.keys(variablesConfig[categoryKey])
      const categoryValuesList = categoryValues
        .map((categoryValue, index) => `${index + 1}. ${categoryValue}`)
        .join('\n')

      let selectedCategoryValue = null
      while (!selectedCategoryValue) {
        console.log(`Please select ${categoryKey}:`)
        console.log(categoryValuesList)
        const selectedIndex = parseInt(getUserInput()) - 1
        if (selectedIndex >= 0 && selectedIndex < categoryValues.length)
          selectedCategoryValue = categoryValues[selectedIndex]
      }

      categories[categoryKey] = selectedCategoryValue
    })

  return sortListByKeys(categories)
}

const processFile = ({ from, to }, variables) => {
  const templateFilePath = configurationPath(`templates/${from}`)
  const content = readFile(templateFilePath)
  const contentWithSubstitutions = fillVariables(content, variables)
  writeFile(repoPath(to), contentWithSubstitutions)
}

module.exports = passedCategories => {
  try {
    const templatePaths = readJSON(configurationPath('templates.json'))
    const variablesConfig = readJSON(configurationPath('variables.json'))

    const categories = getCategories(passedCategories, variablesConfig)
    const variables = getVariables(categories, variablesConfig)

    const variableKeysInTemplates = getVariableKeysInTemplates()
    variableKeysInTemplates.forEach(variableInTemplate => {
      if (!variables.hasOwnProperty(variableInTemplate)) {
        logError(`Value for variable "${variableInTemplate}" not found in current configuration`)
        process.exit(1)
      }
    })

    templatePaths.forEach(file => processFile(file, variables))

    logSuccess(`Variables have been set`)
    logList('Params', categories)
    logList('Variables', variables)
  } catch (error) {
    logError(error.message)
  }
}
