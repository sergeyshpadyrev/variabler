const { checkExists } = require('../src/util/files')
const { execSync } = require('child_process')

const testDirectoryName = 'e2e-test-directory'

const run = command => execSync(command, { encoding: 'utf-8' })
const runInRepo = command => run(`cd ${testDirectoryName} && ${command}`)

const expectFileExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(true)
const expectFileNotExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(false)

beforeAll(() => {
  run(`npx create-react-native-app ${testDirectoryName} --yes --use-npm`)
  runInRepo('git config user.email "test@test.com"')
  runInRepo('git config user.name "Test user"')
})

afterAll(() => {
  run(`rm -rf ${testDirectoryName}`)
})

beforeEach(() => {
  runInRepo('git reset --hard')
})

afterEach(() => {
  runInRepo('git reset --hard')
  runInRepo('rm -rf variabler')
})

module.exports = {
  expectFileExists,
  expectFileNotExists,
  run,
  runInRepo
}
