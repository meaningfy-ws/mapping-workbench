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
        cy.title().should('eq','Mapping Workbench')
    })
    if(sessionProject) cy.window().then(win => win.sessionStorage.setItem('sessionProject',sessionProject))
})


Then('I get success select', () => {
    cy.wait('@select').its('response.statusCode').should('eq',200)
    cy.window().then(win => sessionProject = win.sessionStorage.getItem('sessionProject'))
})

//DISCOVER
Then('I get redirected to Ontology Terms', () => {
    cy.url().should('include','ontology-terms')
    cy.wait('@get').its('response.statusCode').should('eq', 200)
})

Then('I go to Ontology Terms page', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/terms*').as('get')
    cy.get('#source_and_target').click()
    cy.get('#ontology_terms_tab').click()
})

When('I click on discover button', () => {
    cy.intercept('POST', appURLPrefix + 'ontology/tasks/discover_terms').as('discover')
    cy.get('#discover_button').click()
})

Then('I successfully add task for discover Ontology Terms', () => {
    cy.wait('@discover').its('response.statusCode').should('eq',201)
})
//ADD

Then('I click on add term button', () => {
    cy.get('#add_term_button').click()
})

Then('I get redirected to create page', () => {
    cy.url().should('include','ontology-terms/create') // => true
})


Then('I enter name of Ontology Term', () => {
    cy.intercept('POST', appURLPrefix + "ontology/terms").as('create')
    cy.get("input[name=term]").clear().type(termName)
    cy.get("input[name=type]").parent().click()
    .get('ul.MuiList-root').click()
    cy.get("button[type=submit]").click()
})


Then('I successfully create Ontology Terms', () => {
    cy.wait('@create').its('response.statusCode').should('eq', 201)
})

// UPDATE

Then('I search for Ontology Terms', () => {
    cy.get('input[type=text]').first().clear().type(termName+'{enter}')
})

Then('I receive Ontology Terms', () => {
    cy.wait('@get').its('response.statusCode').should('eq', 200).wait(500)
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

//VIEW

Then('I click on view button', () => {
    cy.intercept('GET', appURLPrefix + 'ontology/terms/*').as('get_data')
    cy.get('#view_button').click()
})

Then('I get redirected to view page', () => {
    cy.url().should('include','/view')
})

Then('I receive Ontology Term data', () => {
    cy.wait('@get_data').its('response.statusCode').should('eq', 200)
})

//DELETE
Then('I search for updated Ontology Terms', () => {
    cy.get('input[type=text]').first().clear().type(termName+1+'{enter}')
})

Then('I click delete button', () => {
    cy.intercept('DELETE',appURLPrefix + 'ontology/terms/*').as('delete')
    cy.get('#delete_button').click()
    cy.get('#yes_dialog_button').click()
})

Then('I get success delete', () => {
    cy.wait('@delete').its('response.statusCode').should('eq', 200)
})
