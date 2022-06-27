const { checkExists, readFile, readJSON, writeFile, writeJSON } = require('../util/files')
const { configurationPath, repoPath } = require('../util/path')
const { executeCommand } = require('../util/executor')
const { getUserInput } = require('../util/input')
const { logSuccess } = require('../util/logger')

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
  checkExists(filePath, 'File not found')

  const templateName = getTemplateName(filePath, providedTemplateName)
  const templatePath = configurationPath(`templates/${templateName}`)
  copyFileToTemplates(filePath, templatePath)

  const configContent = addTemplateToConfig(templateName, filePath)
  addFileToGitIgnore(configContent)
  removeFileFromGit(filePath)

  logSuccess(`File "${filePath}" has been added`)
}
