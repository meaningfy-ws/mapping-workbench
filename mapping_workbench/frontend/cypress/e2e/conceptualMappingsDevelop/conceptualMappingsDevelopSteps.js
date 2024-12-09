import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName, gitUrl, branchVersion, homePageLabel} = Cypress.env()

let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username, password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', homePageLabel)
    })
    if (sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject', sessionProject))
})


When('I click on CM Develop', () => {
    cy.intercept('GET', appURLPrefix + 'conceptual_mapping_rules*',).as('get')
    cy.get('#conceptual_mappings').click();
    cy.get('#conceptual_mappings_develop_tab').click();
})


Then('I get Redirected to CM Develop', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
    cy.url().should('include', 'conceptual-mapping-rules/develop')
})