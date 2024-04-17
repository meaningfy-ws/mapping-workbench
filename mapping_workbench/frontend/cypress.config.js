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
        "cypress/e2e/scenarioTwo.feature",
        "cypress/e2e/cleanUp.feature",
        "cypress/e2e/projects.feature",
        "cypress/e2e/fieldsRegistry.feature",
        "cypress/e2e/packages.feature",
        "cypress/e2e/transformTestData.feature",
        "cypress/e2e/conceptualMapping.feature",
        "cypress/e2e/genericTripleMaps.feature",
        "cypress/e2e/cleanUp.feature",
        "cypress/e2e/removeTripleMap.feature",
        "cypress/e2e/testDataSuites.feature",
        "cypress/e2e/sparqlTestSuites.feature",
        "cypress/e2e/shaclTestSuites.feature",
        "cypress/e2e/ontologies.feature",
        "cypress/e2e/resources.feature"
    ],
    video: false,
    // reporter: 'junit',
    reporterOptions: {
        // mochaFile: 'cypress/results/test-results-[hash].xml',
        // toConsole: true,
        // outputs: true,
        // charts: true,
        // reportPageTitle: 'Cypress Inline Reporter',
        // embeddedScreenshots: true,
        // inlineAssets: true, //Adds the asserts inline
    },
    retries: 1,
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
        on('file:preprocessor', cucumber())
    },
  }
});
