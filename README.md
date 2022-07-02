[![npm version](https://img.shields.io/npm/v/variabler)](https://badge.fury.io/js/variabler)
[![License: MIT](https://img.shields.io/npm/l/una-language)](https://opensource.org/licenses/MIT)
![test github](https://github.com/sergeyshpadyrev/variabler/actions/workflows/test.github.yml/badge.svg?branch=main&event=push)
![test npm](https://github.com/sergeyshpadyrev/variabler/actions/workflows/test.npm.yml/badge.svg?branch=main&event=push)

**If you like this project, please support it with a star** 🌟

# Variabler

Variabler is a simple tool for managing environment-dependent variables in JavaScript projects.<br/>

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

To init Variabler in your repository run the following command in your project directory:

```sh
variabler init
```

## Description

Originally Variabler was created to manage environments and brands in React Native apps but indeed you can use it for React, Node.js or any other JavaScript framework as well. It's platform independent.

Variabler is very convinient in the following cases:

- To manage environments of the app. E.g., `local`, `staging` and `production`
- To manage branded apps that are based on the single white labeled codebase

Usually environments and branded apps have different bundle ids, have different setting files (like `sentry.settings` for Sentry or `branch.json` for Branch.io), have different constants (color themes, titles, etc...) and can even have different version numbers.

To manage it all in React Native you need to create its own Android flavour and iOS target for each environment and somehow manage all the differences between environemnts and branded apps. Variabler make it way much easier. Let's say we want to create `staging` and `production` apps.

First, we create config:

```json
{
  "configurations": {
    "default": {
      "variables": {
        "VERSION": "1.2.3"
      }
    },
    "env": {
      "local": {
        "variables": {
          "API_URL": "http://localhost:8080",
          "APP_NAME": "Local"
        }
      },
      "staging": {
        "variables": {
          "API_URL": "https://staging.example.com",
          "APP_NAME": "Staging"
        }
      },
      "production": {
        "variables": {
          "API_URL": "https://production.example.com",
          "APP_NAME": "Production"
        }
      }
    }
  },
  "templates": [
    { "from": "api.js", "to": "src/api.js" },
    { "from": "build.gradle", "to": "android/app/build.gradle" }
  ]
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

## Commands

### add

Makes file managed by Variabler:

- Moves the file from original path to `variabler/templates`
- Removes the original file from git (you need to commit this change)
- Adds path to the original file to `.gitignore`
- Adds original path and template path to `variabler/templates.json`

After running this command you can open the template file and put into it variable keys from `variabler/variables.json`

Example

```sh
variabler add ./path/to/file
```

If there already exists a template with the same name you will be asked to choose a new name.
Other way you need to provide name option to the command:

Example:

```sh
# long way
variabler add ./path/to/file.txt --name myfile.txt
# short way
variabler add ./path/to/file.txt -n myfile.txt
```

### check

Checks the consistency between variable keys used in templates and variables defined in config:

- Shows warning if variable is defined in config but not used in templates
- Shows error if variable is used in templates but not defined in config

Example:

```
variabler check
```

### init

Initializes Variabler in your repository:

- Adds `variabler` directory that contains templates, configs and variables
- Adds variabler files section into `.gitignore`

By default it creates two dummy templates: `api.js` and `settings.json` <br/>
They are needed just to help you understand how to use Variabler

Example:

```sh
variabler init
```

### set

Sets variables:

- Takes the files from `variabler/templates` directory
- Fills the values from `variabler/variables.json` to these files
- Copies the files to the project structure according to the paths defined in `variabler/templates.json`

Example:

```
variabler set
variabler set env:staging
variabler set env:production brand:pepsi
```

If you don't pass any values to this command or don't pass enough of them, it will ask you to select one of the available options.

## Advanced configuration

### Multiple variable lists

It's possible to use a few lists of variables.

Let's say, we have a white labeled app that can:

- Be branded as `cola` or `pepsi`
- Be built for `staging` and `production` environments.

First, we create variables config:

```json
{
  "configurations": {
    "default": {
      "variables": {
        "VERSION": "1.2.3"
      }
    },
    "brand": {
      "cola": {
        "variables": {
          "BUNDLE_ID": "com.example.cola"
        }
      },
      "pepsi": {
        "variables": {
          "BUNDLE_ID": "com.example.pepsi"
        }
      }
    },
    "env": {
      "staging": {
        "variables": {
          "BUNDLE_EXTENSION": ".staging"
        }
      },
      "production": {
        "variables": {
          "BUNDLE_EXTENSION": ""
        }
      }
    }
  },
  "templates": [{ "from": "build.gradle", "to": "./android/app/build.gradle" }]
}
```

After, we create `build.gradle` file template:

```
...
applicationId "@BUNDLE_ID@@BUNDLE_EXTENSION@"
versionName "@VERSION@"
...
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

### Extending variable lists

Let's say we need to have production candidate environment that is the same as production one but with a different bundle id. <br/>
To do that we can inherit configurations in `variables.json` with `extends` claim:

```json
{
  "configurations": {
    "default": {
      "variables": {
        "VERSION": "1.2.3"
      }
    },
    "env": {
      "staging": {
        "variables": {
          "API_URL": "https://staging.example.com",
          "BUNDLE_ID": "com.example.app.staging"
        }
      },
      "production": {
        "variables": {
          "API_URL": "https://production.example.com",
          "BUNDLE_ID": "com.example.app"
        }
      },
      "production.candidate": {
        "extends": "production",
        "variables": {
          "BUNDLE_ID": "com.example.app.candidate"
        }
      }
    }
  },
  "templates": [
    { "from": "api.js", "to": "src/api.js" },
    { "from": "build.gradle", "to": "android/app/build.gradle" }
  ]
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

```json
{
  "configurations": {
    "default": {
      "variables": {
        "VERSION": "1.2.3"
      }
    },
    "env": {
      "staging": {
        "variables": {
          "API_URL": "https://staging.example.com",
          "APP_NAME": "Staging"
        }
      },
      "production": {
        "variables": "vault://secret/production"
      }
    }
  },
  "templates": [
    { "from": "api.js", "to": "src/api.js" },
    { "from": "build.gradle", "to": "android/app/build.gradle" }
  ]
}
```

Variabler doesn't handle connection to Vault by itself. <br/>
To use Vault integration you need Vault CLI to be installed on your machine and you should be logged into Vault. <br/>
So you need to check that the following command works in your terminal:

```
vault kv get secret/production
```

If it works, it shows you something like this:

```
===== Secret Path =====
secret/data/production

====== Data ======
Key         Value
---         -----
API_URL     https://production.example.com
APP_NAME    Production
```
