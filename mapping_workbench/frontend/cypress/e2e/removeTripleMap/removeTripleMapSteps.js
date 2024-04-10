import { Given, Then, And} from 'cypress-cucumber-preprocessor/steps'

const project_name ='some.ttl'

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

Given('Go Home', () => {
    cy.visit('localhost:3000')
})

Then('Check home title', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('Go Triple Maps', () => {
    cy.visit('localhost:3000/app/generic-triple-map-fragments')
})

Then('Check Triple Map url', () => {
    cy.intercept('GET', 'http://localhost:8000/api/v1/generic_triple_map_fragments*',).as('getFragments')
    cy.url().should('eq','http://localhost:3000/app/generic-triple-map-fragments')
})


And('I delete fragment', () => {

    cy.get('input[type=text]').clear().type(project_name + '{enter}')
    cy.wait('@getFragments').then(interception => {
        if (interception.response.statusCode === 200 && interception.response.body.count > 0) {
            cy.get("#delete_button").click()
            cy.intercept('DELETE', 'http://localhost:8000/api/v1/generic-triple-map-fragments*',).as('deleteFragments')
            cy.get('#yes_dialog_button').click();

        }
        else cy.log('No test projects found')
    })
})

Then('I receive delete projects success', () => {
    cy.wait('@deleteFragments').its('response.statusCode').should('eq',200)
})




