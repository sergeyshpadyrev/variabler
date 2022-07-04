const { expectFileExists, expectFileNotExists, runInRepo } = require('../util')

describe('Init command ', () => {
  it('should create working template', () => {
    runInRepo('variabler init')

    expectFileExists('variabler/config.json')
    expectFileNotExists('src/api.js')
    expectFileNotExists('settings.json')

    runInRepo('variabler set env:staging')

    expectFileExists('src/api.js')
    expectFileExists('settings.json')
  })
})
