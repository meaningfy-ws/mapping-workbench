import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

Given('I open login page', () => {
    console.log(Cypress.spec)
    cy.visit('localhost:3000')
})

When('I submit login', () => {
    cy.get('[name=username]').clear().type('admin@mw.com')
     cy.get('[name=password]').clear().type('p4$$')
      cy.get('button[type="submit"]').click()
})

Then('I should see homepage', () => {
cy.title().should('eq','App: Projects List | Mapping Workbench')
})