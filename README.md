# React Native Envy

[![npm version](https://img.shields.io/npm/v/react-native-envy)](https://badge.fury.io/js/react-native-envy)
[![License: MIT](https://img.shields.io/npm/l/una-language)](https://opensource.org/licenses/MIT)
![test github](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/test.github.yml/badge.svg?branch=main&event=push)
![test npm](https://github.com/sergeyshpadyrev/react-native-envy/actions/workflows/test.npm.yml/badge.svg?branch=main&event=push)

**If you like this project, please support it with a star** 🌟

## What is it for?

- For developers who need to build, test and deploy apps in a few different environments <br/>
- For developers who need to build, test and deploy a few different branded apps that are based on the single white labeled codebase<br/>

All of these environments and branded apps:

- Have different bundle ids
- Have different settings files: e.g `sentry.settings` for Sentry or `branch.json` for Branch.io
- Have different constants in the app: color themes, titles, etc...
- Can have different version numbers and code version numbers

With classic approach you need to create its own Android flavour and iOS target for each environment and somehow manage all the differences between environemnts and branded apps. With `react-native-envy` it's way much easier. Let's say we want to create `staging` and `production` apps.

First, we create variables config:

```json
{
  "common": {
    "VERSION": "1.2.3"
  },
  "env": {
    "staging": {
      "API_URL": "https://staging.example.com",
      "BUNDLE_ID": "com.example.app.staging"
    },
    "production": {
      "API_URL": "https://production.example.com",
      "BUNDLE_ID": "com.example.app"
    }
  }
}
```

After it we create file templates:

`api.js`:

```js
const baseURL = '@API_URL@'

export const get = url => fetch('GET', `${baseUrl}/${url}`)
```

`build.gradle`:

```
...
applicationId "@BUNDLE_ID@"
versionName "@VERSION@"
...
```

Then we add paths config:

```json
[
  { "from": "api.js", "to": "./src/api.js" },
  { "from": "build.gradle", "to": "./android/app/build.gradle" }
]
```

Finally, we add file destination paths to `.gitignore`:

```
/android/app/build.gradle
/src/api.js
```

**That's it!** <br/>
Now we can easily set environment using the command:

```sh
# staging
npm run envy:set staging
```

It will create two files.

`android/app/build.gradle`:

```
...
applicationId "com.example.app.staging"
versionName "1.2.3"
...
```

`src/api.js`:

```js
const baseURL = 'https://staging.example.com'

export const get = url => fetch('GET', `${baseUrl}/${url}`)
```

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

```sh
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
npm run envy:set local
# yarn
yarn envy:set local
```

## Extending environment

It's possible to inherit environment configurations <br/>
Les's say we need to have production candidate environment that is the same as production one but with different bundle id. <br/>
To do that we need to write the following code in `variables.json`:

```json
{
  "common": {
    "VERSION": "1.2.3"
  },
  "env": {
    "staging": {
      "API_URL": "https://staging.example.com",
      "BUNDLE_ID": "com.example.app.staging"
    },
    "production": {
      "API_URL": "https://production.example.com",
      "BUNDLE_ID": "com.example.app"
    },
    "production.candidate": {
      "BUNDLE_ID": "com.example.app.candidate"
    }
  }
}
```

When you set environment to `production.candidate` it will take all the variables from `common` section, take all the variables from `production` section and override/extend them with variables from `production.candidate` section. In this case the full list of environment variables filled into template will be:

```
API_URL=https://production.example.com
BUNDLE_ID=com.example.app.candidate
VERSION=1.2.3
```
