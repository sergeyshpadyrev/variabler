const { checkExists } = require('../util/files')
const { configPath, repoPath } = require('../util/path')
const { getUserInput } = require('../util/input')
const gitService = require('../services/git.service')
const { logSuccess } = require('../util/logger')
const templatesConfigService = require('../services/templatesConfig.service')

const fse = require('fs-extra')
const path = require('path')

const getTemplateName = (filePath, providedTemplateName) => {
  let templateName = providedTemplateName || path.basename(filePath)

  while (!templateName || fse.existsSync(configPath(`templates/${templateName}`))) {
    console.log(`Template named '${templateName}' already exists in templates directory`)
    console.log(`Please choose another name`)
    templateName = getUserInput()
  }

  return templateName
}

const copyFileToTemplates = (filePath, templateFilePath) => {
  fse.copyFileSync(repoPath(filePath), repoPath(templateFilePath))
}

module.exports = (filePath, { name: providedTemplateName }) => {
  checkExists(filePath, 'File not found')

  const templateName = getTemplateName(filePath, providedTemplateName)
  const templatePath = configPath(`templates/${templateName}`)
  copyFileToTemplates(filePath, templatePath)

  templatesConfigService.addTemplate(templateName, filePath)
  gitService.updateGitIgnore()
  gitService.removeFileFromGit(filePath)

  logSuccess(`File "${filePath}" has been added`)
}
