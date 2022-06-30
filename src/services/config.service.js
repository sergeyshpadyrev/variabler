const { configPath } = require('../util/path')
const { readJSON, writeJSON } = require('../util/files')

const readConfig = () => readJSON(configPath())
const updateConfig = update => writeJSON(configPath(), update(readConfig()))

const addTemplate = (name, path) =>
  updateConfig(config => ({
    ...config,
    templates: [...config.templates, { from: name, to: path }]
  }))

const listTemplates = () => readConfig().templates

module.exports = {
  addTemplate,
  listTemplates
}
