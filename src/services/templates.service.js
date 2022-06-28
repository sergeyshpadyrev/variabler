const { basename, repoPath, templatePath } = require('../util/path')
const { checkExists, copyFile, ensureDirectory, writeFile, writeJSON } = require('../util/files')
const { getUserInput } = require('../util/input')
const initialData = require('../constants/initialData')
const { isString } = require('../util/common')

const addTemplate = (name, path) => {
  copyFile(repoPath(path), templatePath(name))
}

const init = () => {
  ensureDirectory(templatePath('.'))

  initialData.templateFiles.forEach(({ content, name }) => {
    const write = isString(content) ? writeFile : writeJSON
    write(templatePath(name), content)
  })
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
  init,
  selectFreeName
}
