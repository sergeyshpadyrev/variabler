const { configPath } = require('../util/path')
const { ensureDirectory, writeJSON } = require('../util/files')
const initialData = require('../constants/initialData')

const init = () => {
  ensureDirectory(configPath())
  writeJSON(configPath('variables.json'), initialData.variables)
}

module.exports = {
  init
}
