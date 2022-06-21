#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

program
  .name('variabler')
  .description('CLI for managing React Native environment configs')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize setup in React Native repository')
  .argument('[path]', 'path to repository', '.')
  .action(require('./commands/init'))

program
  .command('add')
  .description('Makes file dependent on environment')
  .argument('{path}', 'path to file')
  .option('-n, --name <name>', 'template file name')
  .action(require('./commands/add'))

program
  .command('set')
  .description('Sets environment')
  .argument('[env]', 'environment name')
  .action(require('./commands/set'))

program.parse()
