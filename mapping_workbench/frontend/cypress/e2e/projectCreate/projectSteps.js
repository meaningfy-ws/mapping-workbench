import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

When('I click on add project button', () => {
    cy.get('#add_button').click()
})


Then('I get redirected to projects create page', () => {
    cy.title().should('eq','App: Project Create | Mapping Workbench')
})


Then('I type project name', () => {
    cy.get('input[name=title]').clear().type(projectName)
})

Then('I uncheck checkboxes', () => {
    cy.get('input[name=automatically_discover_namespaces]').uncheck()
    cy.get('input[name=add_specific_namespaces]').uncheck()
    cy.get('input[name="import_eform.checked"]').uncheck()

})

When('I click create button', () => {
    cy.intercept('POST', appURLPrefix + 'projects').as('create')
    cy.get('#create_button').click()
})

Then('I get success created', () => {
    cy.wait('@create').its('response.statusCode').should('eq',201)
})
