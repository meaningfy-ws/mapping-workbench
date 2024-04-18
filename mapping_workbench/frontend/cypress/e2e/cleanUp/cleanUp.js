import { Given, Then, And} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, projectName, appURLPrefix} = Cypress.env()

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

Given('Go Home', () => {
    cy.visit(homeURL)
})

Then('Check home title', () => {
    cy.intercept('GET',  appURLPrefix, 'projects*',).as('getProjects')
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('I receive projects', () => {
    cy.wait('@getProjects').its('response.statusCode').should('eq',200)
})

And('I delete test project', () => {

    cy.get('input[type=text]').clear().type(projectName + '{enter}')
    cy.wait('@getProjects').then(interception => {
        if (interception.response.statusCode === 200 && interception.response.body.count > 0) {
            cy.get("#delete_button").click()
            cy.intercept('DELETE', appURLPrefix + 'projects*',).as('deleteProjects')
            cy.get('#yes_dialog_button').click();

        }
        else cy.log('No test projects found')
    })
})

Then('I receive delete projects success', () => {
    cy.wait('@deleteProjects').its('response.statusCode').should('eq',200)
})




