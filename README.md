# React Native Envy

[![npm version](https://img.shields.io/npm/v/react-native-envy)](https://badge.fury.io/js/react-native-envy)
[![License: MIT](https://img.shields.io/npm/l/una-language)](https://opensource.org/licenses/MIT)
![e2e github](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/e2e.github.yml/badge.svg?branch=main&event=push)
![e2e npm](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/e2e.npm.yml/badge.svg?branch=main&event=push)

**If you like this project, please support it with a star** 🌟

## What is it for?

TODO: add description

## Installation

```sh
# npm
npm install --save-dev react-native-envy
# yarn
yarn add --dev react-native-envy
```

## Initialization

To add `react-native-envy` into your React Native project run the following command in your project directory:

```sh
npx react-native-envy init
```

It does the following things:

- Adds `envy` directory that contains templates, configs and variables
- Adds `envy:add` and `envy:set` scripts into `package.json`
- Adds envy files section into `.gitignore`

## Add file

## Set environment

Setting the environment does the following things:

- Takes the files from `envy/templates` directory
- Fills these files with values from `envy/variables.json`
- Copies them to the project according to paths defined in `envy/config.json`

### Select environment

To select environment from the list of all available in `variables.json` environments run:

```sh
npm run envy:set
# or
yarn envy:set
```

### Set specific environment

To set the specific environment run:

```sh
npm run envy:set <environment_name>
#
yarn envy:set <environment_name>
```

E.g.:

```sh
npm run envy:set dev
# or
yarn envy:set dev
```
