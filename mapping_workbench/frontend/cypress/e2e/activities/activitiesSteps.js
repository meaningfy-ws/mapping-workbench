import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, packageFile, homePageLabel} = Cypress.env()

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq',homePageLabel)
    })
})

Given('I go to Mapping Packages', () => {
    cy.get('#nav_mapping_packages').click()
})

Then('I get redirected to Mapping Packages list page', () => {
    cy.intercept('GET', appURLPrefix + 'mapping_packages*',).as('getPackages')
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

Then('I receive Mapping Packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq',200)
})

When('I expand first package details', () => {
    cy.get('#expand_button').click()
})


When('I click on add Mapping Packages button', () => {
    cy.get("#add_package_button").click()
})

Then('I get redirected to Mapping Packages create page', () => {
    cy.title().should('eq','App: Mapping Package Create | Mapping Workbench')
})

When('I click on Mapping Packages import', () => {
    cy.get("#import_package_button").click()
})

Then("I click select file", () => {
    cy.get('.MuiBox-root > input').selectFile(packageFile, { force: true })
})

Then('I click on import button', () => {
    cy.get('#import_button').click()
})

Then('I click on upload button', () => {
    cy.intercept('POST', appURLPrefix + 'package_importer/tasks/import',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})

// process test data

Then('I click on test data suites', () => {
    cy.intercept('GET', appURLPrefix + 'test_data_suites*').as('get')
    cy.get('#nav_test\\ data\\ suites').click()
})

Then('I get redirected to test data suites', () => {
    cy.url().should('include','test-data-suites')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

When('I click on transform test data', () => {
    cy.get("#transform-test-data_button").click()
})

Then('I get redirected to transform test data page', () => {
    cy.url().should('include','tasks/transform-test-data') // => true
})

Then('I click on run button', () => {
    cy.intercept('POST', appURLPrefix + 'test_data_suites/tasks/transform_test_data',).as('run_test_data')
    cy.get('#run_button').click()
})

Then('I get success transform', () => {
    cy.wait('@run_test_data',{responseTimeout: 999999}).its('response.statusCode').should('eq', 201)
})

When('I go to Activities page', () => {
    cy.get('#nav_process_monitor').click()
})



Then('I get redirected to Tasks page', () => {
    cy.intercept('GET', appURLPrefix + 'task_manager*',).as('getTasks')
    cy.title().should('eq','App: Activities List | Mapping Workbench')
})


Then('I receive Tasks', () => {
    cy.wait('@getTasks').its('response.statusCode').should('eq',200)
})


Then('I click on refresh button', () => {
    cy.get('#refresh_button').click()
})

When('I delete Task', () => {
    cy.intercept('DELETE',appURLPrefix + 'task_manager/delete/*').as('delete')
    cy.get('#delete_button').click()
})


Then('I click yes', () => {
    cy.get('#yes_dialog_button').click()
})
Then('I get success delete', () => {
    cy.wait('@delete')
})


When('I delete all Tasks', () => {
    cy.intercept('DELETE',appURLPrefix + 'task_manager/delete_all').as('delete_all')
    cy.get('#delete_all_button').click()
})

Then('I get success delete all', () => {
    cy.wait('@delete_all')
})