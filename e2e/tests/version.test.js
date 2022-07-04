const { readJSON } = require('../../src/util/files')
const { runInRepo } = require('../util')

describe('Version command', () => {
  it('should return version from package.json', () => {
    const version = runInRepo(`variabler -V`).trim()
    const versionFromPackage = readJSON('package.json').version
    expect(version).toBe(versionFromPackage)
  })
})
