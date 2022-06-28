const { checkExists } = require('../util/files')
const loggerService = require('./logger.service')

const assert = (check, error) => {
  if (check) return

  loggerService.logError(error)
  process.exit(1)
}

module.exports = {
  assertExists: (path, error) => assert(checkExists(path), error),
  assertNotExists: (path, error) => assert(!checkExists(path), error)
}
