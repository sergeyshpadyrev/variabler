const configService = require('./config.service')
const { executeCommand } = require('../util/executor')
const { isString, sortListByKeys } = require('../util/common')
const loggerService = require('./logger.service')
const { readFile } = require('../util/files')
const { variablerDirectoryPath } = require('../util/path')

const checkConsistency = ({ onError, onWarning, templateVariableKeys, variables }) => {
  const variablesKeys = Object.keys(variables)

  templateVariableKeys.forEach(templateVariableKey => {
    if (!variablesKeys.includes(templateVariableKey)) onError(templateVariableKey)
  })

  variablesKeys.forEach(variableKey => {
    if (!templateVariableKeys.includes(variableKey)) onWarning(variableKey)
  })
}

const fillVariables = (content, variables) => {
  const reducer = (currentContent, variableName) => {
    const variablePattern = new RegExp(`@${variableName}@`, 'g')
    const variableValue = variables[variableName]
    return currentContent.replace(variablePattern, variableValue)
  }
  return Object.keys(variables).reduce(reducer, content)
}

const loadVariablesForCategoryValue = (category, loadingValue) => {
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

const loadFilesForCategoryValue = (category, loadingValue) => {
  const variablesList = category[loadingValue].files
  return variablesList
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

const loadVariables = categories => {
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
        ...loadVariablesForCategoryValue(category, loadingCategoryValue)
      }
      files = {
        ...files,
        ...loadFilesForCategoryValue(category, loadingCategoryValue)
      }
    }
  })

  const allVariables = sortListByKeys({ ...configurations.default.variables, ...variables })
  const allFiles = { ...configurations.default.files, ...files }

  const allFilesDestinations = Object.keys(allFiles).map(fileId => {
    const from = allFiles[fileId]
    const to = fileDestinations.find(({ id }) => id === fileId).to
    return { from, to }
  })

  return { files: allFilesDestinations, variables: allVariables }
}

const listTemplateVariableKeys = () => {
  const templatePaths = configService.listTemplates()
  return sortListByKeys(
    templatePaths.flatMap(({ from }) => {
      const templateFilePath = variablerDirectoryPath(`templates/${from}`)
      const content = readFile(templateFilePath)
      const variablePattern = new RegExp(`@[^\s]*@`, 'g')
      const variableKeys = content.match(variablePattern)
      return variableKeys ? variableKeys.map(key => key.substring(1, key.length - 1)) : []
    })
  )
}

module.exports = {
  checkConsistency,
  fillVariables,
  listTemplateVariableKeys,
  loadVariables
}
