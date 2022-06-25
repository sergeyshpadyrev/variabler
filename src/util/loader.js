const { logError } = require('./logger')

const isString = value => typeof value === 'string' || value instanceof String

const loadVariables = async (config, key) => {
  const value = config[key]
  if (!isString(value)) return value

  const provider = value.split('://')[0]

  switch (provider) {
    case 'vault':
      return

    default:
      logError(`Invalid provider "${provider}"`)
      process.exit(1)
  }

  return {}

  // add vault loading here
}

module.exports = {
  loadVariables
}
