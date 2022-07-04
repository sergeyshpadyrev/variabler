const { checkExists, readJSON } = require('../src/util/files')
const { execSync } = require('child_process')

const testDirectoryName = 'e2e-test-directory'

const run = command => execSync(command, { encoding: 'utf-8' })
const runInRepo = command => run(`cd ${testDirectoryName} && ${command}`)

const expectFileExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(true)
const expectFileNotExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(false)
const expectVersionToBeFromPackage = () => {
  const version = runInRepo(`variabler -V`).trim()
  const versionFromPackage = readJSON('package.json').version
  expect(version).toBe(versionFromPackage)
}

beforeAll(() => {
  run('git config --global user.email "sergeyshpadyrev@gmail.com"')
  run('git config --global user.name "Sergey Shpadyrev"')

  run(`npx create-react-native-app ${testDirectoryName} --yes --use-npm`)
})

afterAll(() => {
  run(`rm -rf ${testDirectoryName}`)
})

beforeEach(() => {
  runInRepo('git reset --hard')
})

afterEach(() => {
  runInRepo('git reset --hard')
  runInRepo('rm -r variabler')
})

describe('Basic template ', () => {
  it('should work', () => {
    expectVersionToBeFromPackage()

    runInRepo('variabler init')

    expectFileExists('variabler/config.json')
    expectFileNotExists('src/api.js')
    expectFileNotExists('settings.json')

    runInRepo('variabler set env:staging')

    expectFileExists('src/api.js')
    expectFileExists('settings.json')
  })
})

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
