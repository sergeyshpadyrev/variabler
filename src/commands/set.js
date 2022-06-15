const { logError, readFile, readJSON, writeFile } = require('../util')

module.exports = envName => {
  try {
    const paths = readJSON('envy/paths.json')
    const variables = readJSON('envy/variables.json')[envName]

    const substituteVariables = content => {
      const reducer = (currentContent, variableName) => {
        const variablePattern = new RegExp(`@${variableName}@`, 'g')
        const variableValue = variables[variableName]
        return currentContent.replace(variablePattern, variableValue)
      }
      return Object.keys(variables).reduce(reducer, content)
    }

    const processFile = (fileName, filePathValue) => {
      const templateFilePath = `./envy/templates/${fileName}`
      const destinationFilePath = `./${filePathValue}/${fileName}`

      const content = readFile(templateFilePath)
      const contentWithSubstitutions = substituteVariables(content)
      writeFile(destinationFilePath, contentWithSubstitutions)
    }

    Object.keys(paths).forEach(fileName => processFile(fileName, paths[fileName]))
    console.log(`Successfully set environment to ${envName}`)
  } catch (error) {
    logError(`Failed to set environment to ${envName}`)
    logError(error)
  }
}
