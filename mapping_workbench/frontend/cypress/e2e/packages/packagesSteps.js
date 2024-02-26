import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'
Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Given('Session Login', () => {
    // Caching session when logging in via page visit
    const username = 'admin@mw.com'
    const password = 'p4$$'
    cy.session([username,password], () => {
        cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
})

Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Given('I expand packages', () => {
    cy.get('#nav_packages').click()
})

When('I click on packages list', () => {
    cy.get("#nav_packages_list").click()
})

Then('I get redirected to mapping_packages list page', () => {
    cy.intercept('GET', 'http://localhost:8000/api/v1/mapping_packages*',).as('getPackages')
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
})

Then('I receive packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq',200)
})

When('I expand first package details', () => {
    cy.get('#expand_button').click()
})


When('I click on packages create', () => {
    cy.get("#nav_packages_create").click()
})

Then('I get redirected to mapping_packages create page', () => {
    cy.title().should('eq','App: Mapping Package Create | Mapping Workbench')
})

When('I click on packages import', () => {
    cy.get("#nav_packages_import").click()
})

Then('I get redirected to mapping_packages import page', () => {
    cy.title().should('eq','App: Mapping Package Import | Mapping Workbench')
})

Then('I click on import button', () => {
    cy.get('#import_button').click()
})

Then('I click on package importer', () => {
    cy.get('.MuiBox-root > input').selectFile('package_eforms_16_1.5.zip', { force: true })
})

Then('I click on upload button', () => {
    cy.intercept('POST', 'http://localhost:8000/api/v1/package_importer/import/v3',).as('upload')
    cy.get('#upload_button').click()
})

Then('I get success upload', () => {
    cy.wait('@upload').its('response.statusCode').should('eq',201)
})



