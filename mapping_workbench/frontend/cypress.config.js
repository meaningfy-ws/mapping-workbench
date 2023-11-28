const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
  baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: "cypress/e2e/*.feature",
    video: false,
    reporter: 'junit',
    reporterOptions: {
        mochaFile: 'results/test-results-[hash].xml',
    },
    retries: 1,
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
        on('file:preprocessor', cucumber())
    },
  }
});
