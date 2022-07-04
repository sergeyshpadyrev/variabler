const { expectFileExists, expectFileNotExists, runInRepo } = require('../common')

describe('Add command', () => {
  it('should add file', () => {
    expectFileExists('android/app/build.gradle')
    expectFileNotExists('variabler/templates/build.gradle')

    runInRepo('variabler init')
    runInRepo('variabler add android/app/build.gradle')

    expectFileNotExists('android/app/build.gradle')
    expectFileExists('variabler/templates/build.gradle')
  })

  it('should add same named files', () => {
    expectFileExists('android/build.gradle')
    expectFileExists('android/app/build.gradle')

    expectFileNotExists('variabler/templates/build.gradle')
    expectFileNotExists('variabler/templates/build2.gradle')

    runInRepo('variabler init')
    runInRepo('variabler add android/app/build.gradle')
    runInRepo('variabler add android/build.gradle --name build2.gradle')

    expectFileNotExists('android/app/build.gradle')
    expectFileNotExists('android/build.gradle')

    expectFileExists('variabler/templates/build.gradle')
    expectFileExists('variabler/templates/build2.gradle')
  })

  it('should set an added file', () => {
    expectFileExists('android/app/build.gradle')
    expectFileNotExists('variabler/templates/build.gradle')

    runInRepo('variabler init')
    runInRepo('variabler add android/app/build.gradle')

    expectFileNotExists('android/app/build.gradle')
    expectFileExists('variabler/templates/build.gradle')

    runInRepo('variabler set env:staging')
    expectFileExists('android/app/build.gradle')
  })
})
