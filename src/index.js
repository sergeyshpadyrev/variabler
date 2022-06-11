const { Command } = require('commander')
const program = new Command()

program
  .name('react-native-env-files')
  .description('CLI for managing React Native environment files')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize setup in React Native repository')
  .argument('[path]', 'path to repository', '.')
  .action(require('./commands/init'))

program
  .command('set')
  .description('Sets environment')
  .argument('{env}', 'environment name')
  .action(require('./commands/set'))

program.parse()
