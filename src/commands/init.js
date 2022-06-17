const { copyDirectory } = require('../util')

module.exports = destinationPath => {
  // TODO add check if envy directory already exists

  copyDirectory('../template', destinationPath, 'envy')

  // TODO add envy:add to package.json scripts
  // TODO add envy:set to package.json scriptss
  // TODO add envy section to .gitignore
}
