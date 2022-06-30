const categoriesService = require('../services/categories.service')
const checksService = require('../services/checks.service')
const configService = require('../services/config.service')
const { copyFile, readFile, writeFile } = require('../util/files')
const { filePath, repoPath, templatePath } = require('../util/path')
const filesService = require('../services/files.service')
const loaderService = require('../services/loader.service')
const loggerService = require('../services/logger.service')

module.exports = passedCategories => {
  try {
    const categories = categoriesService.selectCategories(passedCategories)
    const templates = configService.listTemplates()
    const templateVariableKeys = filesService.listTemplateVariableKeys()
    const { files, variables } = loaderService.load(categories)
    const filesToLog = files.map(({ from }) => from).sort()
    const createdFilesToLog = [...templates, ...files].map(({ to }) => to).sort()
    const onError = () => process.exit(1)

    checksService.checkVariablesConsistency({
      onError,
      templateVariableKeys,
      variables
    })
    checksService.checkFilesConsistency({
      configFiles: configService.listFiles(),
      files,
      onError
    })

    const processTemplate = ({ from, to }) => {
      const templateFilePath = templatePath(from)
      const content = readFile(templateFilePath)
      const contentWithSubstitutions = filesService.fillVariables(content, variables)
      writeFile(repoPath(to), contentWithSubstitutions)
    }

    const processFile = ({ from, to }) => {
      const source = filePath(from)
      const destination = repoPath(to)
      copyFile(source, destination)
    }

    templates.forEach(processTemplate)
    files.forEach(processFile)

    loggerService.logSuccess(`Variables have been set`)
    loggerService.logList('Params', categories)
    loggerService.logList('Selected Variables', variables)
    loggerService.logList('Selected Files', filesToLog)
    loggerService.logList('Created Files', createdFilesToLog)
  } catch (error) {
    loggerService.logError(error.message)
  }
}
