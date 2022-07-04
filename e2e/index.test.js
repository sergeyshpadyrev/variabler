const { run, runInRepo, testDirectoryName } = require('./util')

beforeAll(() => {
  run(`npx create-react-native-app ${testDirectoryName} --yes --use-npm`)
  runInRepo('git config user.email "test@test.com"')
  runInRepo('git config user.name "Test user"')
  runInRepo('git add --all')
  runInRepo('git diff-index --quiet HEAD || git commit -m "Initial commit"')
})

beforeEach(() => {
  runInRepo('git reset --hard')
})

afterEach(() => {
  runInRepo('git reset --hard')
  runInRepo('rm -rf variabler')
})

afterAll(() => {
  run(`rm -rf ${testDirectoryName}`)
})

require('./tests/version.test')
require('./tests/init.test')
require('./tests/add.test')
