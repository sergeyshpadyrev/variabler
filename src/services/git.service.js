const configService = require('./config.service')
const { executeCommand } = require('../util/executor')
const { gitignoreFormatPath, repoPath } = require('../util/path')
const { readFile, writeFile } = require('../util/files')

const removeFileFromGit = filePath => executeCommand(`git rm ${repoPath(filePath)}`)

const updateGitIgnore = () => {
  const files = configService.listFiles()
  const templates = configService.listTemplates()
  const pathLines = [...files, ...templates].map(({ to }) => gitignoreFormatPath(to)).join('\n')

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
