const { executeCommand } = require('./executor')
const { logError } = require('./logger')

const isString = value => typeof value === 'string' || value instanceof String

const loadVariables = (config, key) => {
  const value = config[key]
  if (!isString(value)) return value

  const valueParts = value.split('://')
  const provider = valueParts[0]
  const path = valueParts[1]

  switch (provider) {
    case 'vault':
      const vaultCommandResponse = executeCommand(`vault kv get -format=json ${path}`)
      const vaultData = JSON.parse(vaultCommandResponse).data.data

      return vaultData

    default:
      logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }
}

module.exports = {
  loadVariables
}
