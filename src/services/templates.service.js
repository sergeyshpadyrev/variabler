const { basename, repoPath, templatePath } = require('../util/path')
const { checkExists, copyFile } = require('../util/files')
const { getUserInput } = require('../util/input')

const addTemplate = (name, path) => {
  copyFile(repoPath(path), templatePath(name))
}

const selectFreeName = (path, defaultName) => {
  let name = defaultName || basename(path)

  while (!name || checkExists(templatePath(name))) {
    console.log(`Template named '${name}' already exists in templates directory`)
    console.log(`Please choose another name`)
    name = getUserInput()
  }

  return name
}

module.exports = {
  addTemplate,
  selectFreeName
}
