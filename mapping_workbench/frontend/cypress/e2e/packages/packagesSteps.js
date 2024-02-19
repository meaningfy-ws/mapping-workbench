import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'


Given('Cypress open session', () => {
    // Caching session when logging in via page visit
    cy.visit('localhost:3000')
        cy.get('[name=username]').clear().type('admin@mw.com')
        cy.get('[name=password]').clear().type('p4$$')
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Given('I expand packages', () => {
    cy.get('#nav_packages').click()
})

When('I click on packages list', () => {
    cy.get("#nav_packages_list").click()
})

Then('I get redirected to mapping_packages list page', () => {
    cy.title().should('eq','App: Mapping Packages List | Mapping Workbench')
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


When('I expand first package details', () => {
    cy.get('#expand').click()
})


When('I expand first package details', () => {
    cy.get('#expand').click()
})


