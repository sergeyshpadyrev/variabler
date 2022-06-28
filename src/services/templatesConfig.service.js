const { ensureDirectory, readJSON, writeJSON } = require('../util/files')
const initialData = require('../constants/initialData')
const { templatesConfigPath, configPath } = require('../util/path')

const addTemplate = (name, path) => {
  const template = { from: name, to: path }
  const templates = listTemplates()
  templates.push(template)
  writeJSON(templatesConfigPath(), templates)
}
const init = () => {
  ensureDirectory(configPath())
  writeJSON(templatesConfigPath(), initialData.templateConfig)
}
const listTemplates = () => readJSON(templatesConfigPath())

module.exports = {
  addTemplate,
  init,
  listTemplates
}
