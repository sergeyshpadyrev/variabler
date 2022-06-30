const config = {
  configurations: {
    default: {
      files: {
        appIcon: 'production.png'
      },
      variables: {
        VERSION: '1.2.3'
      }
    },
    env: {
      local: {
        files: {
          appIcon: 'local.png'
        },
        variables: {
          API_URL: 'http://localhost:8080',
          APP_NAME: 'Local'
        }
      },
      staging: {
        files: {
          appIcon: 'staging.png'
        },
        variables: {
          API_URL: 'https://staging.example.com',
          APP_NAME: 'Staging'
        }
      },
      production: {
        variables: {
          API_URL: 'https://production.example.com',
          APP_NAME: 'Production'
        }
      }
    }
  },
  files: [{ id: 'appIcon', to: './assets/icon.png' }],
  templates: [
    { from: 'api.js', to: './src/api.js' },
    { from: 'settings.json', to: './settings.json' }
  ]
}

const files = ['local.png', 'staging.png', 'production.png']
const templates = [
  { content: `export const BASE_API_URL = '@API_URL@'`, name: 'api.js' },
  {
    content: {
      appName: '@APP_NAME@',
      appVersion: '@VERSION@'
    },
    name: 'settings.json'
  }
]

module.exports = {
  config,
  files,
  templates
}
