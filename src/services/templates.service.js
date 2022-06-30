const { basename, filePath, repoPath, templatePath } = require('../util/path')
const { checkExists, copyFile, readFile } = require('../util/files')
const configService = require('./config.service')
const { getUserInput } = require('../util/input')
const { sortListByKeys } = require('../util/common')
const { variablerDirectoryPath } = require('../util/path')

const addFile = (name, path) => copyFile(repoPath(path), filePath(name))
const addTemplate = (name, path) => copyFile(repoPath(path), templatePath(name))

const fillVariables = (content, variables) => {
  const reducer = (currentContent, variableName) => {
    const variablePattern = new RegExp(`@${variableName}@`, 'g')
    const variableValue = variables[variableName]
    return currentContent.replace(variablePattern, variableValue)
  }
  return Object.keys(variables).reduce(reducer, content)
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

const selectFreeName = (path, defaultName) => {
  let name = defaultName || basename(path)
  while (!name || checkExists(templatePath(name))) {
    console.log(`Template named '${name}' already exists in templates directory`)
    console.log(`Please choose another name`)
    name = getUserInput()
  }
  return name
}

module.exports = {
  addFile,
  addTemplate,
  fillVariables,
  listTemplateVariableKeys,
  selectFreeName
}
