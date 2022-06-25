const { checkExists, readFile, readJSON, writeFile, writeJSON } = require('../util/files')
const { executeCommand } = require('../util/execute')
const { getUserInput } = require('./util/input')
const { repoPath, variablerPath } = require('../util/path')

const fse = require('fs-extra')
const path = require('path')

const getTemplateName = (filePath, providedTemplateName) => {
  let templateName = providedTemplateName || path.basename(filePath)

  while (!templateName || fse.existsSync(variablerPath(`templates/${templateName}`))) {
    console.log(`Template named '${templateName}' already exists in templates directory`)
    console.log(`Please choose another name`)
    templateName = getUserInput()
  }

  return templateName
}

const copyFileToTemplates = (filePath, templateFilePath) => {
  fse.copyFileSync(repoPath(filePath), repoPath(templateFilePath))
}

const addTemplateToConfig = (fileName, filePath) => {
  const configPath = variablerPath('templates.json')
  const configContent = readJSON(configPath)
  configContent.push({ from: fileName, to: filePath })
  writeJSON(configPath, configContent)
  return configContent
}

const addFileToGitIgnore = configContent => {
  const gitignorePath = repoPath('.gitignore')
  const content = readFile(gitignorePath)

  const getIgnorePath = ({ to }) => {
    const relativePath = path.relative(repoPath('.'), repoPath(to))
    return `/${relativePath}`
  }

  const originalIgnoreLines = new RegExp('# variabler files start[^]*# variabler files end', 'g')
  const updatedIgnoreLines =
    '# <variabler>\n' + configContent.map(getIgnorePath).join('\n') + '\n# </variabler>'
  const updatedContent = content.replace(originalIgnoreLines, updatedIgnoreLines)
  writeFile(gitignorePath, updatedContent)
}

const removeFileFromGit = filePath => executeCommand(`git rm ${filePath}`)

module.exports = (filePath, { name: providedTemplateName }) => {
  checkExists(filePath, 'Failed to add file. File not found')

  const templateName = getTemplateName(filePath, providedTemplateName)
  const templatePath = variablerPath(`templates/${templateName}`)
  copyFileToTemplates(filePath, templatePath)

  const configContent = addTemplateToConfig(templateName, filePath)
  addFileToGitIgnore(configContent)
  removeFileFromGit(filePath)

  console.log(`File '${filePath}' successfully added to Variabler`)
}
