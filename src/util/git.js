const { executeCommand } = require('./executor')
const { gitignorePath, repoPath } = require('./path')
const { loadTemplatePaths, readFile, writeFile } = require('./files')

module.exports.removeFileFromGit = filePath => executeCommand(`git rm ${filePath}`)

module.exports.updateGitIgnore = () => {
  const templatePaths = loadTemplatePaths()
  const pathLines = templatePaths.map(({ to }) => gitignorePath(to)).join('\n')

  const variablerSection = `# <variabler>\n${pathLines}\n# </variabler>`
  const variablerSectionPattern = new RegExp('# <variabler>[^]*# </variabler>')

  const gitignoreFilePath = repoPath('.gitignore')
  const content = readFile(gitignoreFilePath)
  const updatedContent = content.match(variablerSectionPattern)
    ? content.replace(variablerSectionPattern, variablerSection)
    : content + '\n' + variablerSection

  writeFile(gitignoreFilePath, updatedContent)
}
