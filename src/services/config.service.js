const { configPath } = require('../util/path')
const { readJSON, writeJSON } = require('../util/files')

const readConfig = () => readJSON(configPath())
const updateConfig = update => writeJSON(configPath(), update(readConfig()))

const addTemplate = (name, path) =>
  updateConfig(config => {
    const newTemplate = { from: name, to: path }
    return { ...config, templates: [...config.templates, newTemplate] }
  })

const listConfigurations = () => readConfig().configurations
const listFiles = () => readConfig().files
const listTemplates = () => readConfig().templates

module.exports = {
  addTemplate,
  listConfigurations,
  listFiles,
  listTemplates
}
