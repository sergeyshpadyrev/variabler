[![npm version](https://img.shields.io/npm/v/variabler)](https://badge.fury.io/js/variabler)
[![License: MIT](https://img.shields.io/npm/l/una-language)](https://opensource.org/licenses/MIT)
![test github](https://github.com/sergeyshpadyrev/variabler/actions/workflows/test.github.yml/badge.svg?branch=main&event=push)
![test npm](https://github.com/sergeyshpadyrev/variabler/actions/workflows/test.npm.yml/badge.svg?branch=main&event=push)

**If you like this project, please support it with a star** 🌟

# Variabler

Variabler is a simple tool for managing environment-dependent variables in JavaScript projects.<br/>
Originally it was created to manage environments and branded in React Native apps but indeed you can use it for React, Node.js or any other JavaScript framework as well. It's platform independent.

## Installation

#### Globally

```sh
# npm
npm install -g variabler
# yarn
yarn global add variabler
```

If you install Variabler globally you can call it:

- As `variabler` from `package.json` scripts
- As `variabler` from CLI

#### As dev dependency

```sh
# npm
npm install --save-dev variabler
# yarn
yarn add -D variabler
```

If you install Variabler as a dev dependency you can call it:

- As `variabler` from `package.json` scripts
- As `./node_modules/.bin/variabler` from command line

## Initialization

To add Variabler into your project run the following command in your project directory:

```sh
variabler init
```

It does the following things:

- Adds `variabler` directory that contains templates, configs and variables
- Adds variabler files section into `.gitignore`

By default it creates two dummy templates: `api.js` and `settings.json` <br/>
They are needed just to help you understand how to use Variabler

## Description

Variabler is very convinient in the following cases:

- To manage environments of the app. E.g., `local`, `staging` and `production`
- To manage branded apps that are based on the single white labeled codebase

Usually environments and branded apps have different bundle ids, have different setting files (like `sentry.settings` for Sentry or `branch.json` for Branch.io), have different constants (color themes, titles, etc...) and can even have different version numbers.

To manage it all in React Native you need to create its own Android flavour and iOS target for each environment and somehow manage all the differences between environemnts and branded apps. Variabler make it way much easier. Let's say we want to create `staging` and `production` apps.

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

After, we create template files:

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

Then we add template paths config:

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

That's it! <br/>
Now we can easily set environment using the command:

```sh
variabler set env:staging
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

## Adding file

To make file managed by Variabler run the following command:

```sh
variabler add ./path/to/file
```

It does the following things:

- Moves the file from original path to `variabler/templates`
- Removes the original file from git (you need to commit this change)
- Adds path to the original file to `.gitignore`
- Adds original path and template path to `variabler/templates.json`

Now you can open the template file and put into it variable keys from `variabler/variables.json`

If there already exists a template with the same name you will be asked to choose a new name.
Other way you need to provide name option to the command:

```sh
# long way
variabler add ./path/to/file.txt --name myfile.txt
# short way
variabler add ./path/to/file.txt -n myfile.txt
```

## Setting variables

Setting variables command does the following things:

- Takes the files from `variabler/templates` directory
- Fills the values from `variabler/variables.json` to these files
- Copies the files to the project structure according to the paths defined in `variabler/templates.json`

To set variables run the following command with the list of key/value pairs:

```sh
#
variabler set [key:value]

# Examples
variabler set
variabler set env:staging
variabler set env:production brand:pepsi
```

If you don't pass any values to this command or don't pass enough of them, it will ask you to select one of the available options.

## Multiple variable lists

It's possible to use a few lists of variables.

Let's say, we have a white labeled app that can:

- Be branded as `cola` or `pepsi`
- Be built for `staging` and `production` environments.

First, we create variables config:

```json
{
  "brand": {
    "cola": {
      "BUNDLE_ID": "com.example.cola"
    },
    "pepsi": {
      "BUNDLE_ID": "com.example.pepsi"
    }
  },
  "common": {
    "VERSION": "1.2.3"
  },
  "env": {
    "staging": {
      "BUNDLE_EXTENSION": ".staging"
    },
    "production": {
      "BUNDLE_EXTENSION": ""
    }
  }
}
```

After, we create `build.gradle` file template:

```
...
applicationId "@BUNDLE_ID@@BUNDLE_EXTENSION@"
versionName "@VERSION@"
...
```

Then we add template paths config:

```json
[{ "from": "build.gradle", "to": "./android/app/build.gradle" }]
```

Finally, we add file destination paths to `.gitignore`:

```
/android/app/build.gradle
```

Now we can set variables:

```sh
variabler set brand:pepsi env:staging
```

After we set variables, we gonna see the following code in `android/app/build.gradle`:

```
...
applicationId "com.example.pepsi.staging"
versionName "1.2.3"
...
```

## Extending variable lists

Let's say we need to have production candidate environment that is the same as production one but with a different bundle id. <br/>
To do that we can inherit configurations in `variables.json`:

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

When you set env to `production.candidate`, it takes all the variables defined in the `common` section, takes all the variables defined in the `production` section and overrides/extends them with the variables defined in the `production.candidate` section. So the full list of variables filled into template is:

```
API_URL: https://production.example.com
BUNDLE_ID: com.example.app.candidate
VERSION: 1.2.3
```

## Integrations

### Vault

Variabler can take variables from Vault secret manager.

Let's say, you want to put production environment variables into Vault. <br/>
You need to create a secret in a key-value storage and put the path to this secret to `variables.json`:

```
{
  "common": {
    "VERSION": "1.2.3"
  },
  "env": {
    "local": {
      "API_URL": "http://localhost:8080",
      "APP_NAME": "Local"
    },
    "staging": {
      "API_URL": "https://staging.example.com",
      "APP_NAME": "Staging"
    },
    "production": "vault://secret/production"
  }
}

```

Variabler doesn't handle connection to Vault by itself. <br/>
To use Vault integration you need Vault CLI to be installed on your machine and you should be logged into Vault. <br/>
So you need to check that the following command works in your terminal:

```
vault kv get -format=json secret/production
```

It shoud show you something like this:

```
{
  "request_id": "abc4dcff-9870-ecc3-2953-2a420506753f",
  "lease_id": "",
  "lease_duration": 0,
  "renewable": false,
  "data": {
    "data": {
      "API_URL": "https://production.example.com",
      "APP_NAME": "Production"
    },
    "metadata": {
      "created_time": "2022-06-25T16:46:57.208165Z",
      "custom_metadata": null,
      "deletion_time": "",
      "destroyed": false,
      "version": 1
    }
  },
  "warnings": null
}
```
