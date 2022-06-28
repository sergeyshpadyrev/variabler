const { executeCommand } = require('../util/executor')
const { gitignoreFormatPath, repoPath } = require('../util/path')
const { readFile, writeFile } = require('../util/files')
const templatesConfigService = require('./templatesConfig.service')

const removeFileFromGit = filePath => executeCommand(`git rm ${repoPath(filePath)}`)

const updateGitIgnore = () => {
  const templatePaths = templatesConfigService.listTemplates()
  const pathLines = templatePaths.map(({ to }) => gitignoreFormatPath(to)).join('\n')

  const variablerSection = `# <variabler>\n${pathLines}\n# </variabler>`
  const variablerSectionPattern = new RegExp('# <variabler>[^]*# </variabler>')

  const gitignoreFilePath = repoPath('.gitignore')
  const content = readFile(gitignoreFilePath)
  const updatedContent = content.match(variablerSectionPattern)
    ? content.replace(variablerSectionPattern, variablerSection)
    : content + '\n' + variablerSection

  writeFile(gitignoreFilePath, updatedContent)
}

module.exports = {
  removeFileFromGit,
  updateGitIgnore
}
