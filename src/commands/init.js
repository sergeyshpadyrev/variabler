const { copyDirectory } = require('../util')

module.exports = destinationPath => {
  const template = '../templates/variables-in-one-file'
  copyDirectory(template, destinationPath, 'envy')
}
