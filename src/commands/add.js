const { logError, readFile, readJSON, repoPath, writeFile, writeJSON } = require('../util')

const { execSync } = require('child_process')
const fse = require('fs-extra')
const path = require('path')

const checkFileExists = filePath => {
  if (!fse.existsSync(filePath)) {
    logError('Failed to add file. File not found')
    process.exit(1)
  }
}

const copyFileToTemplates = (filePath, templateFilePath) => {
  fse.copyFileSync(repoPath(filePath), repoPath(templateFilePath))
}

const addTemplateToConfig = (fileName, filePath) => {
  const configPath = repoPath('./envy/config.json')
  const configContent = readJSON(configPath)
  configContent.push({ from: fileName, to: filePath })
  writeJSON(configPath, configContent)
  return configContent
}

const addFileToGitIgnore = configContent => {
  const gitignorePath = repoPath('./.gitignore')
  const content = readFile(gitignorePath)

  const getIgnorePath = ({ to }) => {
    const relativePath = path.relative(repoPath('.'), repoPath(to))
    return `/${relativePath}`
  }

  const originalIgnoreLines = new RegExp('# Envy files start[^]*# Envy files end', 'g')
  const updatedIgnoreLines =
    '# Envy files start\n' + configContent.map(getIgnorePath).join('\n') + '\n# Envy files end'
  const updatedContent = content.replace(originalIgnoreLines, updatedIgnoreLines)
  writeFile(gitignorePath, updatedContent)
}

module.exports = filePath => {
  const fileName = path.basename(filePath)
  const templateFilePath = `./envy/templates/${fileName}`

  // TODO handle case when you have two files with the same name in different places (e.g. build gradle in android and android/app)

  checkFileExists(filePath)
  copyFileToTemplates(filePath, templateFilePath)

  const configContent = addTemplateToConfig(fileName, filePath)
  addFileToGitIgnore(configContent)
  execSync(`git rm ${filePath}`, { encoding: 'utf-8' })

  console.log(`File ${fileName} successfully added to envy`)
}
