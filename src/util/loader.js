const { logError } = require('./logger')

const isString = value => typeof value === 'string' || value instanceof String

const loadVariables = (config, key) => {
  const value = config[key]
  if (!isString(value)) return value

  const provider = value.split('://')[0]

  switch (provider) {
    case 'vault':
      // TODO add vault loading here
      return {}

    default:
      logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }
}

module.exports = {
  loadVariables
}
