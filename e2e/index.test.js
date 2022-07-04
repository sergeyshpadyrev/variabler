const { run, runInRepo, testDirectoryName } = require('./util')

beforeAll(() => {
  run(`npx create-react-native-app ${testDirectoryName} --yes --use-npm  --no-install`)
  runInRepo('git config user.email "test@test.com"')
  runInRepo('git config user.name "Test user"')
  runInRepo('git add --all')
  runInRepo('git diff-index --quiet HEAD || git commit -m "Initial commit"')
})

beforeEach(() => {
  runInRepo('git reset --hard && git clean -f -d -x')
  runInRepo('rm -rf variabler')
})

afterAll(() => {
  run(`rm -rf ${testDirectoryName}`)
})

require('./tests/add.test')
require('./tests/check.test')
require('./tests/files.test')
require('./tests/init.test')
require('./tests/set.test')
require('./tests/vault.test')
require('./tests/version.test')
