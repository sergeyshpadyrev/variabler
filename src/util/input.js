const prompt = require('prompt-sync')({ sigint: true })

module.exports = {
  askUser: () => prompt(`> `).trim()
}
