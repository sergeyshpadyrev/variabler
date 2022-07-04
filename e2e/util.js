const { checkExists } = require('../src/util/files')
const { execSync } = require('child_process')

const testDirectoryName = 'e2e-test-directory'

const run = (command, options = {}) => execSync(command, { encoding: 'utf-8', ...options })
const runInRepo = (command, options = {}) => run(`cd ${testDirectoryName} && ${command}`, options)

const expectFileExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(true)
const expectFileNotExists = path => expect(checkExists(`${testDirectoryName}/${path}`)).toBe(false)

module.exports = {
  expectFileExists,
  expectFileNotExists,
  run,
  runInRepo,
  testDirectoryName
}
