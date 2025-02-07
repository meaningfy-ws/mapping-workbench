import {Given, Then, When} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, projectName, appURLPrefix, homePageLabel} = Cypress.env()

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username, password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', homePageLabel)
    })
})

Then('Check home title', () => {
    cy.title().should('eq', homePageLabel)
})

Then('Visit Projects', () => {
    cy.visit(homeURL + '/app/projects')
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq', 'App: Projects List | Mapping Workbench')
})

Then('I type project name', () => {
    cy.get('input[type=text]').clear().type(projectName + '{enter}')
})

When('I click on delete button', () => {
    cy.get('#delete_button').click()
})

Then('I click yes button', () => {
    cy.intercept('DELETE', appURLPrefix + 'projects/*',).as('delete')
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})

