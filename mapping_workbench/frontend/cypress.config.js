const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress')
require('dotenv').config()


module.exports = defineConfig({
  env: {
    username: process.env.MW_ADMIN_USERNAME,
    password : process.env.MW_ADMIN_PASSWORD,
    gitUrl : "https://github.com/OP-TED/eForms-SDK",
    branchVersion : "1.9.1",
    projectName : 'TEST_PROJECT',
    appURLPrefix : process.env.MW_BACKEND_SERVER_HOST + '/api/v1/',
    homeURL : process.env.MW_FRONTEND_ADDRESS,
    tripleMapFragment : 'test_triple_map.ttl',
    packageFile : 'package_eforms_16_1.5.zip'
  },
  e2e: {
    baseUrl: process.env.MW_FRONTEND_ADDRESS,
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern:[
        "cypress/e2e/login.feature",
        // "cypress/e2e/scenarioOne.feature",
        // "cypress/e2e/scenarioTwo.feature",
        // "cypress/e2e/cleanUp.feature",
        "cypress/e2e/projects.feature",
        "cypress/e2e/ontologyFiles.feature",
        "cypress/e2e/ontologyNamespaces.feature",
        "cypress/e2e/schemaFiles.feature",
        "cypress/e2e/fieldsList.feature",
        "cypress/e2e/mappingPackages.feature",
        "cypress/e2e/fieldsTree.feature",
        "cypress/e2e/genericTripleMaps.feature",
        "cypress/e2e/resources.feature",
        "cypress/e2e/sparqlTestSuites.feature",
        "cypress/e2e/shaclTestSuites.feature",
        "cypress/e2e/testDataSuites.feature",
        "cypress/e2e/ontologyTerms.feature",
        // "cypress/e2e/cleanUp.feature",
        // "cypress/e2e/removeTripleMap.feature",
        // "cypress/e2e/transformTestData.feature",
        // "cypress/e2e/conceptualMapping.feature",
        "cypress/e2e/specificTripleMaps.feature",
        // "cypress/e2e/termValidator.feature",
        // "cypress/e2e/sparqlQueries.feature",
        "cypress/e2e/tasks.feature"
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
