const { configPath, variablesConfigPath } = require('../util/path')
const { ensureDirectory, readFile, readJSON, writeJSON } = require('../util/files')
const { executeCommand } = require('../util/executor')
const initialData = require('../constants/initialData')
const { isString, sortListByKeys } = require('../util/common')
const templatesConfigService = require('./templatesConfig.service')

const fillVariables = (content, variables) => {
  const reducer = (currentContent, variableName) => {
    const variablePattern = new RegExp(`@${variableName}@`, 'g')
    const variableValue = variables[variableName]
    return currentContent.replace(variablePattern, variableValue)
  }
  return Object.keys(variables).reduce(reducer, content)
}

const init = () => {
  ensureDirectory(configPath())
  writeJSON(configPath('variables.json'), initialData.variables)
}

const loadVariablesForCategoryValue = (category, loadingValue) => {
  const variablesList = category[loadingValue]
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
      // logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }
}

const getConfig = () => readJSON(variablesConfigPath())
const loadVariables = categories => {
  const variablesConfig = getConfig()
  let variables = {}

  Object.keys(categories).forEach(categoryKey => {
    const categoryValue = categories[categoryKey]
    const categoryValueParts = categoryValue.split('.')
    const category = variablesConfig[categoryKey]

    for (let i = 0; i < categoryValueParts.length; i++) {
      const loadingCategoryValue = categoryValueParts.slice(0, i + 1).join('.')
      variables = { ...variables, ...loadVariablesForCategoryValue(category, loadingCategoryValue) }
    }
  })

  const allVariables = { ...variablesConfig.common, ...variables }
  return sortListByKeys(allVariables)
}

const listVariableKeysInTemplates = () => {
  const templatePaths = templatesConfigService.listTemplates()
  return sortListByKeys(
    templatePaths.flatMap(({ from }) => {
      const templateFilePath = configPath(`templates/${from}`)
      const content = readFile(templateFilePath)
      const variablePattern = new RegExp(`@[^\s]*@`, 'g')
      const variableKeys = content.match(variablePattern)
      return variableKeys ? variableKeys.map(key => key.substring(1, key.length - 1)) : []
    })
  )
}

module.exports = {
  fillVariables,
  init,
  getConfig,
  listVariableKeysInTemplates,
  loadVariables
}
