const { readJSON } = require('../../src/util/files')
const { runInRepo } = require('../common')

describe('Version', () => {
  it('should be right', () => {
    const version = runInRepo(`variabler -V`).trim()
    const versionFromPackage = readJSON('package.json').version
    expect(version).toBe(versionFromPackage)
  })
})
