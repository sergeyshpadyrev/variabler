const { executeCommand } = require('./executor')
const { logError } = require('./logger')
const { sortListByKeys } = require('./common')

const isString = value => typeof value === 'string' || value instanceof String

const loadVariables = (category, loadingValue) => {
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
      logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }
}

const fillVariables = (content, variables) => {
  const reducer = (currentContent, variableName) => {
    const variablePattern = new RegExp(`@${variableName}@`, 'g')
    const variableValue = variables[variableName]
    return currentContent.replace(variablePattern, variableValue)
  }
  return Object.keys(variables).reduce(reducer, content)
}

const getVariables = (categories, variablesConfig) => {
  let variables = {}

  Object.keys(categories).forEach(categoryKey => {
    const categoryValue = categories[categoryKey]
    const categoryValueParts = categoryValue.split('.')
    const category = variablesConfig[categoryKey]

    for (let i = 0; i < categoryValueParts.length; i++) {
      const loadingCategoryValue = categoryValueParts.slice(0, i + 1).join('.')
      variables = { ...variables, ...loadVariables(category, loadingCategoryValue) }
    }
  })

  const allVariables = { ...variablesConfig.common, ...variables }
  return sortListByKeys(allVariables)
}

module.exports = { fillVariables, getVariables }
