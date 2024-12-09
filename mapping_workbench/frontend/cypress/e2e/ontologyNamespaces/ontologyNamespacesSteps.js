import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()
const namespaceName = 'http://test.org/'
let sessionProject = ''

Given('Session Login', () => {
    // Caching session when logging in via page visit
    cy.session([username, password], () => {
        cy.visit(homeURL)
        cy.get('[name=username]').clear().type(username)
        cy.get('[name=password]').clear().type(password)
        cy.get('button[type="submit"]').click()
        cy.title().should('eq', 'Mapping Workbench')
    })
    if (sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject', sessionProject))
})


//add Namespace

When('I go to Namespaces page', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/namespaces*').as('get')
    cy.get('#source_and_target').click()
    cy.get('#ontology_namespaces_tab').click()
})

Then('I get redirected to Namespaces', () => {
    cy.url().should('include', 'ontology-namespaces')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add Namespace button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to Namespace create page', () => {
    cy.url().should('include', 'ontology-namespaces/create') // => true
})

Then('I enter Namespace name', () => {
    cy.intercept('POST', appURLPrefix + "ontology/namespaces*").as('create')
    cy.get("input[name=prefix]").clear().type('prefix')
    cy.get("input[name=uri]").clear().type(namespaceName)
    cy.get("button[type=submit]").click()
})

Then('I successfully create Namespace', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})


// Add Custom Namespace
Then('I click on add Custom Namespace button', () => {
    cy.get('#add_namespace_button').click()
})

Then('I get redirected to Custom Namespace create page', () => {
    cy.url().should('include', 'ontology-namespaces-custom/create') // => true
})

Then('I enter Custom Namespace name', () => {
    cy.intercept('POST', appURLPrefix + "ontology/namespaces_custom*").as('create')
    cy.get("input[name=prefix]").clear().type('prefix')
    cy.get("input[name=uri]").clear().type(namespaceName)
    cy.get("button[type=submit]").click()
})



// update Namespace

Then('I search for Namespaces', () => {
    cy.get('input[type=text]').eq(0).clear().type('prefix' + '{enter}')
})


Then('I click edit Namespace button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include', '/edit') // => true
})

Then('I enter updated Namespace name', () => {
    cy.intercept('PATCH', appURLPrefix + 'ontology/namespaces/*').as('update')
    cy.get("input[name=prefix]").clear().type('prefix' + 1 + '{enter}')
})


Then('I get success Namespace update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated Namespace', () => {
    cy.get('input[type=text]').eq(0).clear().type('prefix'+ '{enter}')
})

//delete Namespace

Then('I click delete Namespace button', () => {
    cy.intercept('DELETE', appURLPrefix + 'ontology/namespaces/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

//delete Custom Namespace
Then('I search for Custom Namespaces', () => {
    cy.get('input[type=text]').eq(1).clear().type('prefix' + '{enter}')
})

Then('I click delete Custom Namespace button', () => {
    cy.intercept('DELETE', appURLPrefix + 'ontology/namespaces_custom/*').as('delete')
    cy.get('#ontology_namespaces_custom #delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
