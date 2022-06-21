const { logError, readFile, readJSON, repoPath, writeFile } = require('../util')
const prompt = require('prompt-sync')({ sigint: true })

const selectEnvName = envNames => {
  const envNamesList = envNames.map((envName, index) => `${index + 1}. ${envName}`).join('\n')

  let envName = null
  while (!envName) {
    console.log('Available environments:')
    console.log(envNamesList)
    console.log()
    console.log(`What environment do you want to set?`)
    const selectedIndex = prompt(`> `) - 1
    if (selectedIndex >= 0 && selectedIndex < envNames.length) envName = envNames[selectedIndex]
  }
  return envName
}

const getEnvVariables = (environments, envName) => {
  const envNameParts = envName.split('.')

  let vars = {}
  for (let i = 0; i < envNameParts.length; i++) {
    vars = { ...vars, ...environments[envNameParts.slice(0, i + 1).join('.')] }
  }
  return vars
}

module.exports = envName => {
  try {
    const paths = readJSON(repoPath('envy/paths.json'))
    const variablesConfig = readJSON(repoPath('envy/variables.json'))

    envName = envName || selectEnvName(Object.keys(variablesConfig.env))

    // TODO make production.candidate extend production
    const variables = {
      ...variablesConfig.common,
      ...getEnvVariables(variablesConfig.env, envName)
    }

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

    paths.forEach(processFile)
    console.log(`Successfully set environment to ${envName}`)
  } catch (error) {
    logError(`Failed to set environment to ${envName}`)
    logError(error)
  }
}
