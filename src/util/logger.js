const colors = require('colors/safe')

module.exports = {
  logError: error => console.log(colors.red(`FAILED: ${error}`)),
  logList: (name, list) => {
    console.log(colors.green(`---- ${name} ----`))
    Object.keys(list)
      .sort()
      .forEach(key => console.log(colors.green(`${key}: ${list[key]}`)))
  },
  logSuccess: message => console.log(colors.green(`SUCCESS: ${message}`))
}
