import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()
const namespaceName = 'test_namespace'
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

When('I expand Ontology', () => {
    cy.get('#nav_ontology').click()
})
Then('I click on Namespaces', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/namespaces*').as('get')
    cy.get('#nav_ontology_namespaces').click()
})

Then('I get redirected to Ontology Namespaces', () => {
    cy.url().should('include','ontology-namespaces')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','ontology-namespaces/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "ontology/namespaces").as('create')
    cy.get("input[name=prefix]").clear().type(namespaceName)
    cy.get("button[type=submit]").click()
})


Then('I successfully create Ontology Namespace', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for Ontology Namespaces', () => {
    cy.get('input[type=text]').clear().type(namespaceName+'{enter}')
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
    cy.intercept('PATCH', appURLPrefix + 'ontology/namespaces/*').as('update')
    cy.get("input[name=prefix]").clear().type(namespaceName + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated Ontology Namespaces', () => {
    cy.get('input[type=text]').clear().type(namespaceName+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'ontology/namespaces/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
