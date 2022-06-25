const prompt = require('prompt-sync')({ sigint: true })

module.exports = {
  getUserInput: () => prompt(`> `).trim()
}
