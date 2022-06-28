const { readJSON, writeJSON } = require('../util/files')
const { templatesConfigPath } = require('../util/path')

const addTemplate = (name, path) => {
  const template = { from: name, to: path }
  const templates = listTemplates()
  templates.push(template)
  writeJSON(templatesConfigPath(), templates)
}

const listTemplates = () => readJSON(templatesConfigPath())

module.exports = {
  addTemplate,
  listTemplates
}
