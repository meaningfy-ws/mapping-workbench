import {Given, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, mappingPacakgeName} = Cypress.env()


Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username, password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', 'Mapping Workbench')
    })
})

Given('I go to Mapping Packages', () => {
    cy.get('#nav_mapping_packages').click()
})

Then('I get redirected to Mapping Packages list page', () => {
    cy.intercept('GET', appURLPrefix + 'mapping_packages*',).as('getPackages')
    cy.title().should('eq', 'App: Mapping Packages List | Mapping Workbench')
})

Then('I receive Mapping Packages', () => {
    cy.wait('@getPackages').its('response.statusCode').should('eq', 200)
})

Then('I search for Mapping Package', () => {
    cy.get('input[type=text]').clear().type(mappingPacakgeName + '{enter}')
    cy.wait(1000)
})

Then('I click on View Last State', () => {
    cy.intercept('GET', appURLPrefix + 'mapping_packages/state/*',).as('getState')
    cy.intercept('GET', appURLPrefix + 'package_validator/xpath/state/*',).as('getXpath')
    cy.intercept('GET', appURLPrefix + 'package_validator/sparql/state/*',).as('getSparql')
    cy.intercept('GET', appURLPrefix + 'package_validator/shacl/state/*',).as('getShacl')
    cy.get('#view_last_state_button').click()
})

Then('I receive Mapping Packages State', () => {
    cy.wait('@getState').its('response.statusCode').should('eq', 200)
    cy.wait('@getXpath').its('response.statusCode').should('eq', 200)
    cy.wait('@getSparql').its('response.statusCode').should('eq', 200)
    cy.wait('@getShacl').its('response.statusCode').should('eq', 200)
})

Then('I click on {string} Reports Tab', (tabName) => {
    const lowerName = tabName.toLowerCase()
    cy.get(`#${lowerName}_reports_tab`).click()
    cy.intercept('GET', `${appURLPrefix}package_validator/${lowerName}/state/*`).as('get' + tabName)
    cy.intercept('GET', `${appURLPrefix}package_validator/${lowerName}/state/*/suite/*`).as('getSuite')
    cy.intercept('GET', `${appURLPrefix}package_validator/${lowerName}/state/*/suite/*/test/*`).as('getTest')

})

Then('I click on {string} Data', () => {
    cy.get('.MuiListItem-root > .MuiButtonBase-root').click()
})

Then('I receive Mapping Packages State {string}', (tabName) => {
    cy.wait('@get' + tabName).its('response.statusCode').should('eq', 200)
})

Then('I receive Mapping Packages Suite {string}', () => {
    cy.wait('@getSuite').its('response.statusCode').should('eq', 200)
})

Then('I receive Mapping Packages Test {string}', () => {
    cy.wait('@getTest').its('response.statusCode').should('eq', 200)
})