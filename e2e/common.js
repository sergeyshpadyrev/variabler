const { checkExists } = require('../src/util/files')
const { execSync } = require('child_process')

const testDirectoryName = 'e2e-test-directory'

const run = command => execSync(command, { encoding: 'utf-8' })
const runInRepo = command => run(`cd ${testDirectoryName} && ${command}`)

const expectFileExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(true)
const expectFileNotExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(false)

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
  runInRepo('rm -rf variabler')
})

module.exports = {
  expectFileExists,
  expectFileNotExists,
  run,
  runInRepo
}
