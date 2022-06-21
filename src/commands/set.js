const { logError, readFile, readJSON, repoPath, writeFile } = require('../util')
const prompt = require('prompt-sync')({ sigint: true })

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
        const selectedIndex = parseInt(prompt(`> `)) - 1
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
      variables = { ...variables, ...keyVariables[valueParts.slice(0, i + 1).join('.')] }
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
  const templateFilePath = repoPath(`./variabler/templates/${from}`)
  const content = readFile(templateFilePath)
  const contentWithSubstitutions = substituteVariables(content, variables)
  writeFile(repoPath(to), contentWithSubstitutions)
}

const printMapList = (name, mapList) => {
  console.log()
  console.log(`---- ${name} ----`)
  console.log()
  Object.keys(mapList)
    .sort()
    .forEach(key => console.log(`${key}: ${mapList[key]}`))
}

module.exports = settings => {
  try {
    const paths = readJSON(repoPath('variabler/paths.json'))
    const variablesConfig = readJSON(repoPath('variabler/variables.json'))

    const settingsMap = getSettingsMap(settings, variablesConfig)
    const variables = {
      ...variablesConfig.common,
      ...getSettingVariables(settingsMap, variablesConfig)
    }
    paths.forEach(file => processFile(file, variables))

    console.log()
    console.log(`Successfully set variables`)
    printMapList('Params', settingsMap)
    printMapList('Variables', variables)
    console.log()
  } catch (error) {
    logError(`Failed to set variables`)
    logError(error.message)
  }
}
