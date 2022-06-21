#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

program.name('variabler').description('CLI for managing environment configs').version('1.0.0')

program
  .command('init')
  .description('Initialize variabler in repository')
  .argument('[path]', 'path to repository', '.')
  .action(require('./commands/init'))

program
  .command('add')
  .description('Add file to variabler')
  .argument('{path}', 'path to file')
  .option('-n, --name <name>', 'template file name')
  .action(require('./commands/add'))

program
  .command('set')
  .description('Set variables')
  .argument('[settings...]', 'settings as param:value, e.g. env:staging')
  .action(require('./commands/set'))

program.parse()
