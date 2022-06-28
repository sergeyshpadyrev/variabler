const { checkExists, readJSON, writeJSON } = require('../util/files')
const { configurationPath, repoPath } = require('../util/path')
const { getUserInput } = require('../util/input')
const { logSuccess } = require('../util/logger')
const { removeFileFromGit, updateGitIgnore } = require('../util/git')

const fse = require('fs-extra')
const path = require('path')

const getTemplateName = (filePath, providedTemplateName) => {
  let templateName = providedTemplateName || path.basename(filePath)

  while (!templateName || fse.existsSync(configurationPath(`templates/${templateName}`))) {
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
  const configPath = configurationPath('templates.json')
  const configContent = readJSON(configPath)
  configContent.push({ from: fileName, to: filePath })
  writeJSON(configPath, configContent)
  return configContent
}

module.exports = (filePath, { name: providedTemplateName }) => {
  checkExists(filePath, 'File not found')

  const templateName = getTemplateName(filePath, providedTemplateName)
  const templatePath = configurationPath(`templates/${templateName}`)
  copyFileToTemplates(filePath, templatePath)

  addTemplateToConfig(templateName, filePath)
  updateGitIgnore()
  removeFileFromGit(filePath)

  logSuccess(`File "${filePath}" has been added`)
}
