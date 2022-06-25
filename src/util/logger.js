const colors = require('colors/safe')

module.exports = {
  logError: error => console.log(colors.red(error)),
  logList: (name, list) => {
    console.log()
    console.log(`---- ${name} ----`)
    console.log()
    Object.keys(list)
      .sort()
      .forEach(key => console.log(`${key}: ${list[key]}`))
  }
}
