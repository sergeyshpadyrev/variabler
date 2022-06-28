const colors = require('colors/safe')

module.exports = {
  logDivider: () => console.log('----'),
  logError: error => console.log(colors.red(`ERROR: ${error}`)),
  logInfo: (...info) => console.log(...info),
  logList: (name, list) => {
    console.log(`---- ${name} ----`)
    Array.isArray(list)
      ? list.forEach(element => console.log(element))
      : Object.keys(list).forEach(key => console.log(`${key}: ${list[key]}`))
  },
  logSuccess: message => console.log(colors.green(`SUCCESS: ${message}`)),
  logWarning: message => console.log(colors.yellow(`WARNING: ${message}`))
}
