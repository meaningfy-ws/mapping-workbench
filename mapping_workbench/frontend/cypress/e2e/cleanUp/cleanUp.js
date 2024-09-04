import {Given, Then, When} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, projectName, appURLPrefix , homePageLabel} = Cypress.env()

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', homePageLabel)
    })
})

Then('Check home title', () => {
    cy.title().should('eq',homePageLabel)
})

Then('I click on account button', () => {
    cy.get('#account_button').click()
})

Then('I select project setup', () => {
    cy.get('#project_setup_button').click()
})

Then('I search for project', () => {
    // cy.intercept('GET', appURLPrefix + '/projects*',).as('get')
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
    cy.wait('@delete').its('response.statusCode').should('eq',200)
})

