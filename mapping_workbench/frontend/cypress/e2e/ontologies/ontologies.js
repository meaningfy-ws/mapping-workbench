import { Given, When, Then} from 'cypress-cucumber-preprocessor/steps'

const {username, password, homeURL, appURLPrefix, projectName} = Cypress.env()
const ontology_name = 'test_ontology'
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

Given('Go Home', () => {
    cy.visit(homeURL)
})

Then('I get redirected to projects list page', () => {
    cy.title().should('eq','App: Projects List | Mapping Workbench')
})

Then('I search for project', () => {
    cy.get('input[type=text]').clear().type(projectName+'{enter}')
})

When('I select project', () => {
    cy.intercept('POST', appURLPrefix + 'users/set_project_for_current_user_session',).as('select')
    cy.get('#select_button').click()
})

Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

//add ontology

Then('I click on Ontology', () => {
    cy.intercept('GET', appURLPrefix + 'ontology*').as('get')
    cy.get('#nav_ontologies').click()
})

Then('I get redirected to Ontologies', () => {
    cy.url().should('include','ontology-file-collections')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click on add button', () => {
    cy.get('#add_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','ontology-file-collections/create') // => true
})


Then('I enter name', () => {
    cy.intercept('POST', appURLPrefix + "ontology_file_collections").as('create')
    cy.get("input[name=title]").clear().type(ontology_name)
    cy.get("button[type=submit]").click()
})


Then('I successfully create ontology', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// update

Then('I search for ontology', () => {
    cy.get('input[type=text]').clear().type(ontology_name+'{enter}')
})

Then('I receive ontology', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I click edit button', () => {
    cy.get('#edit_button').click()
})

Then('I get redirected to edit page', () => {
    cy.url().should('include','/edit') // => true
})

Then('I enter updated name', () => {
    cy.intercept('PATCH', appURLPrefix + 'ontology_file_collections/*').as('update')
    cy.get("input[name=title]").clear().type(ontology_name + 1 +'{enter}')
})

Then('I get success update', () => {
    cy.wait('@update').its('response.statusCode').should('eq', 200)
})

Then('I search for updated ontology', () => {
    cy.get('input[type=text]').clear().type(ontology_name+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'ontology_file_collections/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
