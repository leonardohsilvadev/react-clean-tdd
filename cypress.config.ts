import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/main/test/cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8080',
    supportFile: 'src/main/test/cypress/support/e2e.js',
    specPattern: 'src/main/test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})
