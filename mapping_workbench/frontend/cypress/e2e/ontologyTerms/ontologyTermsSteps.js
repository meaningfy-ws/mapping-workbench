import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix} = Cypress.env()
const termName = 'test_term'
let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username,password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq','App: Projects List | Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

When('I click on discover button', () => {
    cy.intercept('POST', appURLPrefix + 'ontology/tasks/discover_terms').as('discover')
    cy.get('#discover_button').click()
})

Then('I successfully discover Ontology Terms', () => {
    cy.wait('@discover').its('response.statusCode').should('eq',201)
})

//add Ontology Namespace

When('I expand Ontology', () => {
    cy.get('#nav_ontology').click()
})
Then('I click on Terms', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/terms*').as('get')
    cy.get('#nav_ontology_terms').click()
})

Then('I get redirected to Ontology Terms', () => {
    cy.url().should('include','ontology-terms')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','ontology-terms/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "ontology/terms").as('create')
    cy.get("input[name=term]").clear().type(termName)
    cy.get("button[type=submit]").click()
})


Then('I successfully create Ontology Terms', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for Ontology Terms', () => {
    cy.get('input[type=text]').clear().type(termName+'{enter}')
})

Then('I receive Ontology Terms', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'ontology/terms/*').as('update')
    cy.get("input[name=term]").clear().type(termName + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated Ontology Terms', () => {
    cy.get('input[type=text]').clear().type(termName+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'ontology/terms/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
