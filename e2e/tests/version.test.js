const { readJSON } = require('../../src/util/files')
const { runInRepo } = require('../util')

const versionFromPackage = readJSON('package.json').version

describe('Version command', () => {
  it('should return version from package.json with -v option passed', () => {
    const version = runInRepo(`variabler -v`).trim()
    expect(version).toBe(versionFromPackage)
  })
  it('should return version from package.json with --version option passed', () => {
    const version = runInRepo(`variabler --version`).trim()
    expect(version).toBe(versionFromPackage)
  })
})
