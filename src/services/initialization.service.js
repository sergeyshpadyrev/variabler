const { configPath, filePath, templatePath, variablerNodeModulePath } = require('../util/path')
const { copyFile, writeFile, writeJSON } = require('../util/files')
const initialData = require('../constants/initialData')
const { isString } = require('../util/common')

const createTemplate = ({ content, name }) => {
  const write = isString(content) ? writeFile : writeJSON
  write(templatePath(name), content)
}

const createFile = ({ from, to }) => {
  const source = variablerNodeModulePath(`assets/${from}`)
  const destination = filePath(to)
  copyFile(source, destination)
}

const init = () => {
  writeJSON(configPath(), initialData.config)

  initialData.templates.forEach(createTemplate)
  initialData.files.forEach(createFile)
}

module.exports = {
  init
}
