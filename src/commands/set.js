const { logError, readFile, readJSON, repoPath, writeFile } = require('../util')
const prompt = require('prompt-sync')()

const selectEnvName = envNames => {
  const envNamesList = envNames.map((envName, index) => `${index + 1}. ${envName}`).join('\n')

  let envName = null
  while (!envName) {
    console.log('Available environments:')
    console.log(envNamesList)
    console.log()
    console.log(`What environment do you want to set?`)
    const selectedIndex = prompt(`> `, { sigint: true }) - 1
    if (selectedIndex >= 0 && selectedIndex < envNames.length) envName = envNames[selectedIndex]
  }
  return envName
}

module.exports = envName => {
  try {
    const config = readJSON(repoPath('envy/config.json'))
    const variablesConfig = readJSON(repoPath('envy/variables.json'))

    envName = envName || selectEnvName(Object.keys(variablesConfig.env))

    const variables = { ...variablesConfig.common, ...variablesConfig.env[envName] }

    const substituteVariables = content => {
      const reducer = (currentContent, variableName) => {
        const variablePattern = new RegExp(`@${variableName}@`, 'g')
        const variableValue = variables[variableName]
        return currentContent.replace(variablePattern, variableValue)
      }
      return Object.keys(variables).reduce(reducer, content)
    }

    const processFile = ({ from, to }) => {
      const templateFilePath = repoPath(`./envy/templates/${from}`)
      const content = readFile(templateFilePath)
      const contentWithSubstitutions = substituteVariables(content)
      writeFile(repoPath(to), contentWithSubstitutions)
    }

    config.forEach(processFile)
    console.log(`Successfully set environment to ${envName}`)
  } catch (error) {
    logError(`Failed to set environment to ${envName}`)
    logError(error)
  }
}
