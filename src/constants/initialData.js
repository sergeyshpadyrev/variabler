const templateConfig = [
  { from: 'api.js', to: './src/api.js' },
  { from: 'settings.json', to: './settings.json' }
]

const templateFiles = [
  { content: `export const BASE_API_URL = '@API_URL@'`, name: 'api.js' },
  {
    content: {
      appName: '@APP_NAME@',
      appVersion: '@VERSION@'
    },
    name: 'settings.json'
  }
]

const variables = {
  common: {
    VERSION: '1.2.3'
  },
  env: {
    local: {
      API_URL: 'http://localhost:8080',
      APP_NAME: 'Local'
    },
    staging: {
      API_URL: 'https://staging.example.com',
      APP_NAME: 'Staging'
    },
    production: {
      API_URL: 'https://production.example.com',
      APP_NAME: 'Production'
    }
  }
}

module.exports = {
  templateConfig,
  templateFiles,
  variables
}
