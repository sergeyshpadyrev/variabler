const { Command } = require('commander')
const program = new Command()

program
  .name('react-native-env-files')
  .description('CLI for managing React Native environment files')
  .version('1.0.0')

program
  .command('init [path]')
  .description('Initialize setup in React Native repository')
  .action(require('./commands/init'))

program.parse()
