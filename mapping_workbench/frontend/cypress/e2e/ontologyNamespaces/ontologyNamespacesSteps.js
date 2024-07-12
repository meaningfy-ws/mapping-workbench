import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()
const namespaceName = 'http://test.org/'
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

//add Ontology Namespace

When('I click on Ontology Terms', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/namespaces*').as('get')
    cy.get('#nav_ontology_terms').click()
})

Then('I get redirected to Ontology Terms', () => {
    cy.url().should('include','ontology')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add namespace button', () => {
    cy.get('#add_namespace_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','ontology-namespaces-custom/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "ontology/namespaces_custom*").as('create')
    cy.get("input[name=prefix]").clear().type('prefix')
    cy.get("input[name=uri]").clear().type(namespaceName)
    cy.get("button[type=submit]").click()
})


Then('I successfully create Ontology Namespace', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for Ontology Namespaces', () => {
    cy.get('input[type=text]').eq(1).clear().type('prefix'+'{enter}')
})

Then('I receive Ontology Namespaces', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'ontology/namespaces_custom/*').as('update')
    cy.get("input[name=prefix]").clear().type('prefix' + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated Ontology Namespaces', () => {
    cy.get('input[type=text]').eq(1).clear().type('prefix'+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'ontology/namespaces_custom/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
