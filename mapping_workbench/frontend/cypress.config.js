const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern:[
        "cypress/e2e/login.feature",
        "cypress/e2e/scenarioOne.feature",
        "cypress/e2e/cleanUp.feature",
        "cypress/e2e/projects.feature",
        "cypress/e2e/fieldsRegistry.feature",
        "cypress/e2e/packages.feature",
        "cypress/e2e/transformTestData.feature",
        "cypress/e2e/conceptualMapping.feature",
        "cypress/e2e/cleanUp.feature",
    ],
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
