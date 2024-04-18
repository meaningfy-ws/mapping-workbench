import { Given, Then, And} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix} = Cypress.env()

const fragmentName ='some.ttl'

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


Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('Go Triple Maps', () => {
    cy.visit('localhost:3000/app/generic-triple-map-fragments')
})

Then('Check Triple Map url', () => {
    cy.intercept('GET', appURLPrefix + 'generic_triple_map_fragments*',).as('getFragments')
    cy.url().should('eq','http://localhost:3000/app/generic-triple-map-fragments')
})


And('I delete fragment', () => {

    cy.get('input[type=text]').clear().type(fragmentName + '{enter}')
    cy.wait('@getFragments').then(interception => {
        if (interception.response.statusCode === 200 && interception.response.body.count > 0) {
            cy.get("#delete_button").click()
            cy.intercept('DELETE', appURLPrefix + 'generic-triple-map-fragments*',).as('deleteFragments')
            cy.get('#yes_dialog_button').click();

        }
        else cy.log('No test projects found')
    })
})

Then('I receive delete projects success', () => {
    cy.wait('@deleteFragments').its('response.statusCode').should('eq',200)
})




