# React Native Envy

[![npm version](https://img.shields.io/npm/v/react-native-envy)](https://badge.fury.io/js/react-native-envy)
[![License: MIT](https://img.shields.io/npm/l/una-language)](https://opensource.org/licenses/MIT)
![test github](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/test.github.yml/badge.svg?branch=main&event=push)
![test npm](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/test.npm.yml/badge.svg?branch=main&event=push)

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

By default it creates two dummy templates: `api.js` and `settings.json` <br/>
They are needed just to help you understand how to use `react-native-envy`

## Adding file

To make a file depend on environment run the following command:

```
# npm
npm run envy:add ./path/to/file
# yarn
yarn envy:add ./path/to/file
```

It does the following things:

- Moves the file from original path to `envy/templates`
- Removes the original file from git (you need to commit this change)
- Adds path to the original file to `.gitignore`
- Adds original path and template path to `envy/paths.json`

Now you can open the template file and put into it variable keys from `envy/variables.json`

## Setting environment

Setting the environment does the following things:

- Takes the files from `envy/templates` directory
- Fills these files with values from `envy/variables.json`
- Copies them to the project according to paths defined in `envy/paths.json`

#### Select environment

To select environment from the list of all the available in `variables.json` environments run:

```sh
# npm
npm run envy:set
# yarn
yarn envy:set
```

#### Set specific environment

To set the specific environment run:

```sh
# npm
npm run envy:set <environment_name>
# yarn
yarn envy:set <environment_name>
```

Example:

```sh
# npm
npm run envy:set dev
# yarn
yarn envy:set dev
```
