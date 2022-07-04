const { checkExists } = require('../src/util/files')
const { execSync } = require('child_process')

const testDirectoryName = 'e2e-test-directory'

const run = command => execSync(command, { encoding: 'utf-8' })
const runInRepo = command => run(`cd ${testDirectoryName} && ${command}`)

const expectFileExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(true)
const expectFileNotExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(false)

module.exports = {
  expectFileExists,
  expectFileNotExists,
  run,
  runInRepo,
  testDirectoryName
}
