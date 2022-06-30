const {
  configPath,
  filePath,
  templatePath,
  variablerDirectoryPath,
  variablerNodeModulePath
} = require('../util/path')
const { copyFile, ensureDirectory, writeFile, writeJSON } = require('../util/files')
const initialData = require('../constants/initialData')
const { isString } = require('../util/common')

const init = () => {
  ensureDirectory(variablerDirectoryPath())
  writeJSON(configPath(), initialData.config)

  ensureDirectory(templatePath())
  initialData.templates.forEach(({ content, name }) =>
    (isString(content) ? writeFile : writeJSON)(templatePath(name), content)
  )

  ensureDirectory(filePath())
  initialData.files.forEach(fileName =>
    copyFile(variablerNodeModulePath(`assets/${fileName}`), filePath(fileName))
  )
}

module.exports = {
  init
}
