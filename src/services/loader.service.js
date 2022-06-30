const configService = require('./config.service')
const { executeCommand } = require('../util/executor')
const { isString, sortListByKeys } = require('../util/common')
const loggerService = require('./logger.service')

const loadVariables = (category, loadingValue) => {
  const variablesList = category[loadingValue].variables
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

const loadFiles = (category, loadingValue) => {
  const filesList = category[loadingValue].files || {}
  return filesList || {}
  // if (!isString(variablesList)) return variablesList

  // const valueParts = variablesList.split('://')
  // const provider = valueParts[0]
  // const path = valueParts[1]

  // switch (provider) {
  //   case 'vault':
  //     const vaultCommandResponse = executeCommand(`vault kv get -format=json ${path}`)
  //     const vaultData = JSON.parse(vaultCommandResponse).data.data

  //     return vaultData

  //   default:
  //     loggerService.logError(`Invalid provider "${provider}"`)
  //     process.exit(1)
  // }
}

const load = categories => {
  const configurations = configService.listConfigurations()
  const fileDestinations = configService.listFiles()

  let variables = {}
  let files = {}

  Object.keys(categories).forEach(categoryKey => {
    const categoryValue = categories[categoryKey]
    const categoryValueParts = categoryValue.split('.')
    const category = configurations[categoryKey]

    for (let i = 0; i < categoryValueParts.length; i++) {
      const loadingCategoryValue = categoryValueParts.slice(0, i + 1).join('.')
      variables = {
        ...variables,
        ...loadVariables(category, loadingCategoryValue)
      }
      files = {
        ...files,
        ...loadFiles(category, loadingCategoryValue)
      }
    }
  })

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
