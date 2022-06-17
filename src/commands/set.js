const { logError, readFile, readJSON, writeFile } = require('../util')

module.exports = envName => {
  try {
    const config = readJSON('envy/config.json')
    const variablesConfig = readJSON('envy/variables.json')
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
      const templateFilePath = `./envy/templates/${from}`
      const content = readFile(templateFilePath)
      const contentWithSubstitutions = substituteVariables(content)
      writeFile(to, contentWithSubstitutions)
    }

    config.forEach(processFile)
    console.log(`Successfully set environment to ${envName}`)
  } catch (error) {
    logError(`Failed to set environment to ${envName}`)
    logError(error)
  }
}
