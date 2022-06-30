const config = {
  configurations: {
    default: {
      files: {
        sampleFile: 'sample.txt'
      },
      variables: {
        VERSION: '1.2.3'
      }
    },
    env: {
      local: {
        files: {
          appIcon: 'icon/local.png'
        },
        variables: {
          API_URL: 'http://localhost:8080',
          APP_NAME: 'Local'
        }
      },
      staging: {
        files: {
          appIcon: 'icon/staging.png'
        },
        variables: {
          API_URL: 'https://staging.example.com',
          APP_NAME: 'Staging'
        }
      },
      production: {
        files: {
          appIcon: 'production.png'
        },
        variables: {
          API_URL: 'https://production.example.com',
          APP_NAME: 'Production'
        }
      }
    }
  },
  files: [
    { id: 'appIcon', to: 'assets/icon.png' },
    { id: 'sampleFile', to: 'sample.txt' }
  ],
  templates: [
    { from: 'api.js', to: 'src/api.js' },
    { from: 'settings.json', to: 'settings.json' }
  ]
}

const files = [
  { from: 'sample.txt', to: 'sample.txt' },

  { from: 'local.png', to: 'icon/local.png' },
  { from: 'staging.png', to: 'icon/staging.png' },
  { from: 'production.png', to: 'icon/production.png' }
]
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
