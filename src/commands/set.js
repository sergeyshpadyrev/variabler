const { getUserInput } = require('../util/input')
const { loadVariables } = require('../util/loader')
const { logError, logList, logSuccess } = require('../util/logger')
const { readFile, readJSON, writeFile } = require('../util/files')
const { repoPath, variablerPath } = require('../util/path')

const getSettingsMap = (settings, variablesConfig) => {
  const settingsMap = Object.assign(
    {},
    ...settings.map(setting => {
      const splitted = setting.split(':')
      const settingKey = splitted[0]
      const settingValue = splitted[1]
      return { [settingKey]: settingValue }
    })
  )

  Object.keys(settingsMap).forEach(key => {
    const value = settingsMap[key]

    if (!variablesConfig.hasOwnProperty(key)) throw new Error(`Key ${key} not found in variables`)
    if (!variablesConfig[key].hasOwnProperty(value))
      throw new Error(`Key ${value} not found in ${key} variables`)
  })

  Object.keys(variablesConfig)
    .filter(key => key !== 'common')
    .forEach(key => {
      if (settingsMap.hasOwnProperty(key)) return

      const values = Object.keys(variablesConfig[key])
      const valuesList = values.map((valueKey, index) => `${index + 1}. ${valueKey}`).join('\n')

      let value = null
      while (!value) {
        console.log(`Please select ${key}:`)
        console.log(valuesList)
        const selectedIndex = parseInt(getUserInput()) - 1
        if (selectedIndex >= 0 && selectedIndex < values.length) value = values[selectedIndex]
      }

      settingsMap[key] = value
    })

  return settingsMap
}

const getSettingVariables = (settingsMap, variablesConfig) => {
  let variables = {}

  Object.keys(settingsMap).forEach(key => {
    const value = settingsMap[key]
    const valueParts = value.split('.')
    const keyVariables = variablesConfig[key]

    for (let i = 0; i < valueParts.length; i++) {
      const variablesKey = valueParts.slice(0, i + 1).join('.')
      // TODO handle loadVariables as async !!!
      variables = { ...variables, ...loadVariables(keyVariables, variablesKey) }
    }
  })

  return variables
}

const substituteVariables = (content, variables) => {
  const reducer = (currentContent, variableName) => {
    const variablePattern = new RegExp(`@${variableName}@`, 'g')
    const variableValue = variables[variableName]
    return currentContent.replace(variablePattern, variableValue)
  }
  return Object.keys(variables).reduce(reducer, content)
}

const processFile = ({ from, to }, variables) => {
  const templateFilePath = variablerPath(`templates/${from}`)
  const content = readFile(templateFilePath)
  const contentWithSubstitutions = substituteVariables(content, variables)
  writeFile(repoPath(to), contentWithSubstitutions)
}

module.exports = settings => {
  try {
    const templatePaths = readJSON(variablerPath('templates.json'))
    const variablesConfig = readJSON(variablerPath('variables.json'))

    const settingsMap = getSettingsMap(settings, variablesConfig)
    const variables = {
      ...variablesConfig.common,
      ...getSettingVariables(settingsMap, variablesConfig)
    }
    templatePaths.forEach(file => processFile(file, variables))

    logSuccess(`Variables have been set`)
    logList('Params', settingsMap)
    logList('Variables', variables)
  } catch (error) {
    logError(error.message)
  }
}
