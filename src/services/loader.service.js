const configService = require('./config.service')
const { executeCommand } = require('../util/executor')
const { isString, sortListByKeys } = require('../util/common')
const loggerService = require('./logger.service')

const loadVariables = (category, categoryValue) => {
  const variablesList = category[categoryValue].variables || {}
  if (!isString(variablesList)) return variablesList

  const valueParts = variablesList.split('://')
  const provider = valueParts[0]
  const path = valueParts[1]

  switch (provider) {
    case 'vault':
      const vaultCommandResponse = executeCommand(`vault kv get -format=json ${path}`)
      const vaultData = JSON.parse(vaultCommandResponse).data.data

      return vaultData

    default:
      loggerService.logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }
}

const load = categories => {
  const configurations = configService.listConfigurations()
  const fileDestinations = configService.listFiles()

  let variables = {}
  let files = {}

  const loadCategory = (categoryKey, categoryValue) => {
    const category = configurations[categoryKey]
    categoryValue = categoryValue || categories[categoryKey]

    const parent = category[categoryValue].extends
    if (parent && !category.hasOwnProperty(parent)) {
      loggerService.logError(`"${categoryValue}" extends "${parent}" that doesn't exist`)
      process.exit(1)
    }

    if (parent) loadCategory(categoryKey, parent)

    files = {
      ...files,
      ...(category[categoryValue].files || {})
    }
    variables = {
      ...variables,
      ...loadVariables(category, categoryValue)
    }
  }

  Object.keys(categories).forEach(categoryKey => loadCategory(categoryKey))

  const allVariables = sortListByKeys({ ...configurations.default.variables, ...variables })
  const allFiles = { ...configurations.default.files, ...files }

  const allFilesDestinations = Object.keys(allFiles).map(fileId => {
    const from = allFiles[fileId]
    const configFile = fileDestinations.find(({ id }) => id === fileId)
    const to = configFile ? configFile.to : null
    return { from, to }
  })

  return { files: allFilesDestinations, variables: allVariables }
}

module.exports = {
  load
}
