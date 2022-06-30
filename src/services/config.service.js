const { configPath } = require('../util/path')
const { readJSON, writeJSON } = require('../util/files')

const readConfig = () => readJSON(configPath())
const updateConfig = update => writeJSON(configPath(), update(readConfig()))

const addFile = (name, path) =>
  updateConfig(config => {
    const newFile = { id: name, to: path }
    return {
      ...config,
      configurations: {
        ...config.configurations,
        default: {
          ...config.configurations.default,
          files: {
            ...(config.configurations.default.files || {}),
            [name]: name
          }
        }
      },
      files: [...config.files, newFile]
    }
  })

const addTemplate = (name, path) =>
  updateConfig(config => {
    const newTemplate = { from: name, to: path }
    return { ...config, templates: [...config.templates, newTemplate] }
  })

const listConfigurations = () => readConfig().configurations
const listFiles = () => readConfig().files
const listTemplates = () => readConfig().templates

module.exports = {
  addFile,
  addTemplate,
  listConfigurations,
  listFiles,
  listTemplates
}
